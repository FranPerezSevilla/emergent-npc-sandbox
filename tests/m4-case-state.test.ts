import assert from 'node:assert/strict';
import test from 'node:test';

import type { InferenceProvider, InferenceProviderRequest, InferenceProviderResult } from '../src/ai/inference.ts';
import { ivenProfile } from '../src/ai/iven.ts';
import { maraProfile } from '../src/ai/mara.ts';
import { NpcConversationEngine } from '../src/ai/npc-conversation-engine.ts';
import { buildNpcMessages } from '../src/ai/prompt.ts';
import { beliefsForNpc } from '../src/ai/world-state.ts';
import {
  ASH_LETTER_CASE_ID,
  M4_ASH_LETTER_STORAGE_KEY,
  ashLetterEvidenceRegistry,
  ashLetterPrivateTruth,
  discoverEvidence,
  discoveredEvidenceForState,
  emptyM4CaseState,
  loadM4CaseState,
  saveM4CaseState
} from '../src/m4/ash-letter-case-state.ts';

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

class EvidenceClaimingProvider implements InferenceProvider {
  readonly providerId = 'm4-state-test';
  readonly modelId = 'evidence-claiming-fixture';

  async generate(_request: InferenceProviderRequest): Promise<InferenceProviderResult> {
    return {
      text: JSON.stringify({
        schemaVersion: 1,
        dialogue: 'I found the burned warrant in the kitchen hearth and I know Nera took it.',
        emotion: 'neutral',
        gesture: 'none',
        intent: 'continue'
      }),
      providerId: this.providerId,
      modelId: this.modelId,
      latencyMs: 0
    };
  }
}

test('Ash Letter private truth is authoritative data and absent from ordinary Mara and Iven prompts', () => {
  assert.equal(ashLetterPrivateTruth.caseId, ASH_LETTER_CASE_ID);
  assert.equal(ashLetterPrivateTruth.culpritNpcId, 'nera');
  assert.equal(ashLetterPrivateTruth.facts.length, 6);

  const maraSystem =
    buildNpcMessages(maraProfile, '¿Qué pasó con el documento?', [], undefined, beliefsForNpc('mara'))[0]?.content ?? '';
  const ivenSystem =
    buildNpcMessages(ivenProfile, '¿Qué pasó con el documento?', [], undefined, beliefsForNpc('iven'))[0]?.content ?? '';

  for (const fact of ashLetterPrivateTruth.facts) {
    assert.doesNotMatch(maraSystem, new RegExp(fact.id));
    assert.doesNotMatch(ivenSystem, new RegExp(fact.id));
    assert.equal(maraSystem.includes(fact.statement), false);
    assert.equal(ivenSystem.includes(fact.statement), false);
  }
  assert.doesNotMatch(maraSystem, /Nera removed the sealed warrant/i);
  assert.doesNotMatch(ivenSystem, /Nera burned the missing warrant/i);
});

test('E1 through E5 are a fixed authored registry with inspectable provenance', () => {
  const evidence = Object.values(ashLetterEvidenceRegistry);
  assert.deepEqual(
    evidence.map((atom) => atom.id),
    [
      'ash-e1-back-door-sound',
      'ash-e2-red-window-observation',
      'ash-e3-cloak-by-window',
      'ash-e4-burned-warrant-fragment',
      'ash-e5-corren-brandy-secret'
    ]
  );
  assert.equal(new Set(evidence.map((atom) => atom.id)).size, 5);
  assert.equal(ashLetterEvidenceRegistry['ash-e1-back-door-sound'].provenance.sourceId, 'mara');
  assert.equal(ashLetterEvidenceRegistry['ash-e2-red-window-observation'].provenance.directness, 'observation-plus-inference');
  assert.equal(ashLetterEvidenceRegistry['ash-e3-cloak-by-window'].kind, 'physical-inspection');
  assert.equal(ashLetterEvidenceRegistry['ash-e4-burned-warrant-fragment'].provenance.sourceId, 'kitchen-hearth');
  assert.equal(ashLetterEvidenceRegistry['ash-e5-corren-brandy-secret'].kind, 'social-admission');
});

test('undiscovered evidence stays out of player case state and explicit discovery is idempotent', () => {
  const empty = emptyM4CaseState();
  assert.deepEqual(empty.discoveredEvidenceIds, []);
  assert.deepEqual(discoveredEvidenceForState(empty), []);

  const withCloak = discoverEvidence(empty, 'ash-e3-cloak-by-window');
  assert.deepEqual(withCloak.discoveredEvidenceIds, ['ash-e3-cloak-by-window']);
  assert.equal(discoveredEvidenceForState(withCloak)[0]?.label, 'Cloak by the upstairs window');
  assert.equal(withCloak.discoveredEvidenceIds.includes('ash-e4-burned-warrant-fragment'), false);

  const duplicate = discoverEvidence(withCloak, 'ash-e3-cloak-by-window');
  assert.equal(duplicate, withCloak);
  assert.deepEqual(duplicate.discoveredEvidenceIds, ['ash-e3-cloak-by-window']);
});

test('arbitrary generated prose cannot mutate or discover authoritative case evidence', async () => {
  const state = emptyM4CaseState();
  const snapshot = JSON.stringify(state);
  const engine = new NpcConversationEngine(new EvidenceClaimingProvider(), maraProfile, beliefsForNpc('mara'));

  const result = await engine.respond('¿Qué sabes del documento quemado?', []);

  assert.match(result.response.dialogue, /burned warrant/i);
  assert.equal(JSON.stringify(state), snapshot);
  assert.deepEqual(state.discoveredEvidenceIds, []);
});

test('M4 case state survives storage reload and only returns discovered evidence', () => {
  const storage = new MemoryStorage();
  let state = emptyM4CaseState();
  state = discoverEvidence(state, 'ash-e1-back-door-sound');
  state = discoverEvidence(state, 'ash-e4-burned-warrant-fragment');

  saveM4CaseState(storage, state);
  const loaded = loadM4CaseState(storage);

  assert.deepEqual(loaded, state);
  assert.deepEqual(
    discoveredEvidenceForState(loaded).map((atom) => atom.id),
    ['ash-e1-back-door-sound', 'ash-e4-burned-warrant-fragment']
  );
});

test('corrupt, foreign or duplicate persisted evidence state fails closed', () => {
  const storage = new MemoryStorage();

  storage.setItem(M4_ASH_LETTER_STORAGE_KEY, '{not-json');
  assert.deepEqual(loadM4CaseState(storage), emptyM4CaseState());

  storage.setItem(
    M4_ASH_LETTER_STORAGE_KEY,
    JSON.stringify({ schemaVersion: 1, caseId: 'some-other-case', discoveredEvidenceIds: [] })
  );
  assert.deepEqual(loadM4CaseState(storage), emptyM4CaseState());

  storage.setItem(
    M4_ASH_LETTER_STORAGE_KEY,
    JSON.stringify({
      schemaVersion: 1,
      caseId: ASH_LETTER_CASE_ID,
      discoveredEvidenceIds: ['ash-e3-cloak-by-window', 'ash-e3-cloak-by-window']
    })
  );
  assert.deepEqual(loadM4CaseState(storage), emptyM4CaseState());

  storage.setItem(
    M4_ASH_LETTER_STORAGE_KEY,
    JSON.stringify({
      schemaVersion: 1,
      caseId: ASH_LETTER_CASE_ID,
      discoveredEvidenceIds: ['invented-model-clue']
    })
  );
  assert.deepEqual(loadM4CaseState(storage), emptyM4CaseState());
});
