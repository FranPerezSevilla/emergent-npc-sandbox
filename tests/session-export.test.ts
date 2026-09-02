import assert from 'node:assert/strict';
import test from 'node:test';

import { emptyM2State } from '../src/ai/memory-state.ts';
import { emptyM3State } from '../src/ai/propagation-state.ts';
import { m1Beliefs, redTravelerExitFact } from '../src/ai/world-state.ts';
import { emptyM4CaseState } from '../src/m4/ash-letter-case-state.ts';
import { initialAshLetterTestimonyPolicyState } from '../src/m4/ash-letter-testimony.ts';
import { buildSessionExport } from '../src/session-export.ts';

test('session export contains conversations traces contexts and milestone state without auth credentials', () => {
  const exported = buildSessionExport({
    exportedAt: '2026-09-02T06:50:00.000Z',
    provider: { providerId: 'openrouter', modelId: 'minimax/minimax-m3:free' },
    conversations: [
      {
        npcId: 'mara',
        npcName: 'Mara Vey',
        role: 'innkeeper',
        turns: [
          { speaker: 'player', text: 'Hola' },
          { speaker: 'npc', text: 'Buenas.' }
        ]
      }
    ],
    traces: [],
    npcContextSnapshots: [
      {
        npcId: 'mara',
        beliefs: m1Beliefs.filter((belief) => belief.ownerNpcId === 'mara'),
        memories: [],
        relationship: { npcId: 'mara', trust: 0 }
      }
    ],
    state: {
      m1: { objectiveTruth: redTravelerExitFact, authoredBeliefs: m1Beliefs },
      m2: emptyM2State(),
      m3: emptyM3State(),
      m4: {
        caseState: emptyM4CaseState(),
        testimonyPolicyState: initialAshLetterTestimonyPolicyState()
      }
    }
  });

  assert.equal(exported.schemaVersion, 1);
  assert.equal(exported.conversations[0]?.turns.length, 2);
  assert.equal(exported.npcContextSnapshots[0]?.npcId, 'mara');
  assert.equal(exported.state.m1.objectiveTruth.id, redTravelerExitFact.id);
  assert.deepEqual(exported.state.m4.caseState.discoveredEvidenceIds, []);
  assert.equal(
    exported.state.m4.testimonyPolicyState.activePolicyIds.corren,
    'ash-corren-cover-stayed-upstairs'
  );
  assert.equal(
    exported.state.m4.testimonyPolicyState.activePolicyIds.nera,
    'ash-nera-cover-no-room-entry'
  );
  assert.equal(exported.privacy.credentialsIncluded, false);

  const serialized = JSON.stringify(exported);
  assert.doesNotMatch(serialized, /access[_-]?token/i);
  assert.doesNotMatch(serialized, /authorization/i);
  assert.doesNotMatch(serialized, /pkce/i);
});
