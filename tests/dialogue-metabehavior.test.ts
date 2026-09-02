import assert from 'node:assert/strict';
import test from 'node:test';

import {
  deriveSocialDialogueDecision,
  type DialogueIntentRequest
} from '../src/ai/dialogue-metabehavior.ts';
import { ivenProfile } from '../src/ai/iven.ts';
import { M3FakeInferenceProvider } from '../src/ai/m3-fake-inference-provider.ts';
import { NpcConversationEngine } from '../src/ai/npc-conversation-engine.ts';
import {
  IVEN_PROPAGATED_CLAIM_BELIEF_ID,
  emptyM3State,
  propagatedBeliefsForNpc,
  recordPlayerRedTravelerClaimToMara,
  transferPlayerClaimFromMaraToIven
} from '../src/ai/propagation-state.ts';
import { buildNpcMessages } from '../src/ai/prompt.ts';
import { beliefsForNpc, redTravelerExitFact } from '../src/ai/world-state.ts';

const transferredIvenBeliefs = () => {
  let state = recordPlayerRedTravelerClaimToMara(emptyM3State(), '2026-09-02T08:00:00.000Z');
  state = transferPlayerClaimFromMaraToIven(state, '2026-09-02T08:01:00.000Z');
  return [...beliefsForNpc('iven'), ...propagatedBeliefsForNpc(state, 'iven')];
};

const intent = (value: DialogueIntentRequest['intent']): DialogueIntentRequest => ({
  intent: value,
  topicFactId: redTravelerExitFact.id
});

test('free text leaves belief surfacing optional even when hearsay is available', () => {
  const decision = deriveSocialDialogueDecision(ivenProfile, transferredIvenBeliefs(), intent('free_text'), 0);

  assert.equal(decision.focus, 'free');
  assert.equal(decision.stance, 'neutral');
  assert.deepEqual(decision.relevantBeliefIds, []);
});

test('ask rumor focuses hearsay and applies Iven skeptical stance without changing beliefs', () => {
  const beliefs = transferredIvenBeliefs();
  const decision = deriveSocialDialogueDecision(ivenProfile, beliefs, intent('ask_rumor'), 0);

  assert.equal(decision.focus, 'hearsay');
  assert.equal(decision.stance, 'discount');
  assert.deepEqual(decision.relevantBeliefIds, [IVEN_PROPAGATED_CLAIM_BELIEF_ID]);
  assert.deepEqual(decision.immediateSourceIds, ['mara']);
  assert.equal(beliefs[0]?.id, 'belief-iven-red-traveler-stayed');
});

test('ask source exposes the immediate source without flattening the provenance chain', () => {
  const decision = deriveSocialDialogueDecision(ivenProfile, transferredIvenBeliefs(), intent('ask_source'), 0);

  assert.equal(decision.focus, 'source');
  assert.equal(decision.stance, 'neutral');
  assert.deepEqual(decision.immediateSourceIds, ['mara']);
});

test('challenge lets Iven defend his own view instead of forcing reconciliation', () => {
  const decision = deriveSocialDialogueDecision(ivenProfile, transferredIvenBeliefs(), intent('challenge'), 0);

  assert.equal(decision.focus, 'belief_conflict');
  assert.equal(decision.stance, 'defend_own_view');
  assert.deepEqual(decision.relevantBeliefIds, [
    'belief-iven-red-traveler-stayed',
    IVEN_PROPAGATED_CLAIM_BELIEF_ID
  ]);
});

test('prompt describes social decision as performance direction rather than truth rewrite', () => {
  const beliefs = transferredIvenBeliefs();
  const decision = deriveSocialDialogueDecision(ivenProfile, beliefs, intent('ask_rumor'), 0);
  const messages = buildNpcMessages(
    ivenProfile,
    '¿Qué se rumorea?',
    [],
    undefined,
    beliefs,
    [],
    { npcId: 'iven', trust: 0 },
    decision
  );
  const system = messages[0]?.content ?? '';

  assert.match(system, /SOCIAL DIALOGUE DECISION/);
  assert.match(system, /focus: hearsay/);
  assert.match(system, /stance: discount/);
  assert.match(system, /No supplied belief is mandatory to mention/i);
  assert.match(system, /Never compress a multi-hop provenance chain/i);
});

test('conversation trace records the explicit intent and deterministic social decision', async () => {
  const beliefs = transferredIvenBeliefs();
  const engine = new NpcConversationEngine(new M3FakeInferenceProvider(), ivenProfile, beliefs);
  const result = await engine.respond(
    '¿Qué se rumorea?',
    [],
    { memories: [], relationship: { npcId: 'iven', trust: 0 } },
    intent('ask_rumor')
  );

  assert.equal(result.trace.socialDialogueDecision.intent, 'ask_rumor');
  assert.equal(result.trace.socialDialogueDecision.focus, 'hearsay');
  assert.equal(result.trace.socialDialogueDecision.stance, 'discount');
  assert.deepEqual(result.trace.socialDialogueDecision.immediateSourceIds, ['mara']);
});
