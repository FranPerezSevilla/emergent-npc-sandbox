import assert from 'node:assert/strict';
import test from 'node:test';

import { ivenProfile } from '../src/ai/iven.ts';
import { M1FakeInferenceProvider } from '../src/ai/m1-fake-inference-provider.ts';
import { maraProfile } from '../src/ai/mara.ts';
import { NpcConversationEngine } from '../src/ai/npc-conversation-engine.ts';
import { buildNpcMessages } from '../src/ai/prompt.ts';
import { beliefsForNpc, m1Beliefs, redTravelerExitFact } from '../src/ai/world-state.ts';

const question = '¿Salió el viajero de la capa roja después de medianoche?';

const trustedSystem = (npcId: 'mara' | 'iven'): string => {
  const profile = npcId === 'mara' ? maraProfile : ivenProfile;
  const messages = buildNpcMessages(profile, question, [], undefined, beliefsForNpc(npcId));
  return messages.find((message) => message.role === 'system')?.content ?? '';
};

test('objective world truth is never supplied to either NPC prompt', () => {
  assert.equal(trustedSystem('mara').includes(redTravelerExitFact.statement), false);
  assert.equal(trustedSystem('iven').includes(redTravelerExitFact.statement), false);
});

test('each NPC receives only its own contradictory belief', () => {
  const maraSystem = trustedSystem('mara');
  const ivenSystem = trustedSystem('iven');

  assert.match(maraSystem, /belief-mara-red-traveler-left/);
  assert.doesNotMatch(maraSystem, /belief-iven-red-traveler-stayed/);
  assert.match(ivenSystem, /belief-iven-red-traveler-stayed/);
  assert.doesNotMatch(ivenSystem, /belief-mara-red-traveler-left/);
});

test('contradictory beliefs coexist without changing the authoritative fact', () => {
  const aboutExit = m1Beliefs.filter((belief) => belief.aboutFactId === redTravelerExitFact.id);

  assert.equal(aboutExit.length, 2);
  assert.notEqual(aboutExit[0]?.statement, aboutExit[1]?.statement);
  assert.match(redTravelerExitFact.statement, /left the tavern through the back door/);
});

test('conversation engine rejects belief context owned by another NPC', () => {
  assert.throws(
    () => new NpcConversationEngine(new M1FakeInferenceProvider(), maraProfile, beliefsForNpc('iven')),
    /belongs to iven, not mara/
  );
});

test('generated testimony cannot mutate truth or create beliefs implicitly', async () => {
  const maraBeliefs = beliefsForNpc('mara');
  const originalTruth = redTravelerExitFact.statement;
  const originalBeliefIds = maraBeliefs.map((belief) => belief.id);
  const engine = new NpcConversationEngine(new M1FakeInferenceProvider(), maraProfile, maraBeliefs);

  const result = await engine.respond(question, []);

  assert.match(result.response.dialogue, /think the red-cloaked traveler slipped out/i);
  assert.equal(redTravelerExitFact.statement, originalTruth);
  assert.deepEqual(engine.beliefs.map((belief) => belief.id), originalBeliefIds);
  assert.deepEqual(result.trace.selectedBeliefIds, originalBeliefIds);
});

test('deterministic M1 provider replays conflicting testimony for both NPCs', async () => {
  const provider = new M1FakeInferenceProvider();
  const maraEngine = new NpcConversationEngine(provider, maraProfile, beliefsForNpc('mara'));
  const ivenEngine = new NpcConversationEngine(provider, ivenProfile, beliefsForNpc('iven'));

  const mara = await maraEngine.respond(question, []);
  const iven = await ivenEngine.respond(question, []);

  assert.match(mara.response.dialogue, /slipped out/i);
  assert.match(iven.response.dialogue, /stayed in that room/i);
  assert.notEqual(mara.response.dialogue, iven.response.dialogue);
});
