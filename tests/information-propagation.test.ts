import assert from 'node:assert/strict';
import test from 'node:test';

import { ivenProfile } from '../src/ai/iven.ts';
import { M3FakeInferenceProvider } from '../src/ai/m3-fake-inference-provider.ts';
import { NpcConversationEngine } from '../src/ai/npc-conversation-engine.ts';
import {
  IVEN_PROPAGATED_CLAIM_BELIEF_ID,
  MARA_TO_IVEN_TRANSFER_ID,
  PLAYER_RED_TRAVELER_EXIT_CLAIM_ID,
  emptyM3State,
  loadM3State,
  propagatedBeliefsForNpc,
  recordPlayerRedTravelerClaimToMara,
  saveM3State,
  transferPlayerClaimFromMaraToIven
} from '../src/ai/propagation-state.ts';
import { beliefsForNpc, redTravelerExitFact } from '../src/ai/world-state.ts';

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

const question = '¿Qué piensas ahora sobre si el viajero de la capa roja salió después de medianoche?';

test('explicit player claim records source recipient and provenance without mutating truth', () => {
  const originalTruth = redTravelerExitFact.statement;
  const state = recordPlayerRedTravelerClaimToMara(emptyM3State(), '2026-09-02T06:30:00.000Z');

  assert.equal(state.claims.length, 1);
  assert.equal(state.claims[0]?.id, PLAYER_RED_TRAVELER_EXIT_CLAIM_ID);
  assert.equal(state.claims[0]?.originalSpeakerId, 'player');
  assert.equal(state.claims[0]?.recipientNpcId, 'mara');
  assert.deepEqual(state.claims[0]?.provenanceChain, ['player -> Mara']);
  assert.equal(redTravelerExitFact.statement, originalTruth);
});

test('Mara to Iven transfer is deterministic idempotent hearsay with preserved provenance', () => {
  const claimed = recordPlayerRedTravelerClaimToMara(emptyM3State(), '2026-09-02T06:30:00.000Z');
  const transferred = transferPlayerClaimFromMaraToIven(claimed, '2026-09-02T06:31:00.000Z');
  const repeated = transferPlayerClaimFromMaraToIven(transferred, '2026-09-02T06:32:00.000Z');

  assert.equal(transferred.transfers.length, 1);
  assert.equal(transferred.transfers[0]?.id, MARA_TO_IVEN_TRANSFER_ID);
  assert.deepEqual(transferred.transfers[0]?.provenanceChain, ['player -> Mara', 'Mara -> Iven']);
  assert.equal(repeated.transfers.length, 1);

  const ivenBeliefs = propagatedBeliefsForNpc(transferred, 'iven');
  assert.equal(ivenBeliefs.length, 1);
  assert.equal(ivenBeliefs[0]?.id, IVEN_PROPAGATED_CLAIM_BELIEF_ID);
  assert.equal(ivenBeliefs[0]?.ownerNpcId, 'iven');
  assert.equal(ivenBeliefs[0]?.provenance.kind, 'hearsay');
  assert.match(ivenBeliefs[0]?.provenance.description ?? '', /Mara relayed the player's claim/i);
});

test('Iven does not receive propagated belief before the social transfer event', () => {
  const claimed = recordPlayerRedTravelerClaimToMara(emptyM3State(), '2026-09-02T06:30:00.000Z');
  assert.deepEqual(propagatedBeliefsForNpc(claimed, 'iven'), []);
  assert.equal(propagatedBeliefsForNpc(claimed, 'mara').length, 1);
});

test('Iven later changes testimony because the transferred belief is supplied', async () => {
  const provider = new M3FakeInferenceProvider();
  const before = new NpcConversationEngine(provider, ivenProfile, beliefsForNpc('iven'));
  const beforeResult = await before.respond(question, []);

  let state = recordPlayerRedTravelerClaimToMara(emptyM3State(), '2026-09-02T06:30:00.000Z');
  state = transferPlayerClaimFromMaraToIven(state, '2026-09-02T06:31:00.000Z');
  const afterBeliefs = [...beliefsForNpc('iven'), ...propagatedBeliefsForNpc(state, 'iven')];
  const after = new NpcConversationEngine(provider, ivenProfile, afterBeliefs);
  const afterResult = await after.respond(question, []);

  assert.match(beforeResult.response.dialogue, /sure the traveler stayed/i);
  assert.match(afterResult.response.dialogue, /Mara told me you claim/i);
  assert.notEqual(beforeResult.response.dialogue, afterResult.response.dialogue);
  assert.deepEqual(afterResult.trace.selectedBeliefIds, [
    'belief-iven-red-traveler-stayed',
    IVEN_PROPAGATED_CLAIM_BELIEF_ID
  ]);
});

test('M3 claim and transfer state survives storage round-trip', () => {
  const storage = new MemoryStorage();
  let state = recordPlayerRedTravelerClaimToMara(emptyM3State(), '2026-09-02T06:30:00.000Z');
  state = transferPlayerClaimFromMaraToIven(state, '2026-09-02T06:31:00.000Z');

  saveM3State(storage, state);
  const loaded = loadM3State(storage);

  assert.deepEqual(loaded, state);
  assert.equal(propagatedBeliefsForNpc(loaded, 'iven')[0]?.id, IVEN_PROPAGATED_CLAIM_BELIEF_ID);
});
