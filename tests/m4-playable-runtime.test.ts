import assert from 'node:assert/strict';
import test from 'node:test';

import { correnProfile } from '../src/ai/corren.ts';
import { ivenProfile } from '../src/ai/iven.ts';
import { M4FakeInferenceProvider } from '../src/ai/m4-fake-inference-provider.ts';
import { maraProfile } from '../src/ai/mara.ts';
import { neraProfile } from '../src/ai/nera.ts';
import { beliefsForNpc } from '../src/ai/world-state.ts';
import {
  ashLetterRuntimeProfiles,
  createAshLetterRuntimeEngine
} from '../src/m4/ash-letter-runtime.ts';
import {
  CORREN_COVER_POLICY_ID,
  NERA_COVER_POLICY_ID
} from '../src/m4/ash-letter-testimony.ts';

test('playable Ash Letter runtime exposes exactly the four authored case NPCs', () => {
  assert.deepEqual(
    ashLetterRuntimeProfiles.map((profile) => profile.id),
    ['mara', 'iven', 'corren', 'nera']
  );
});

test('runtime engine wiring attaches only the owning testimony context', () => {
  const provider = new M4FakeInferenceProvider();
  const mara = createAshLetterRuntimeEngine(provider, maraProfile, beliefsForNpc('mara'));
  const iven = createAshLetterRuntimeEngine(provider, ivenProfile, beliefsForNpc('iven'));
  const corren = createAshLetterRuntimeEngine(provider, correnProfile);
  const nera = createAshLetterRuntimeEngine(provider, neraProfile);

  assert.equal(mara.testimonyContext, undefined);
  assert.equal(iven.testimonyContext, undefined);
  assert.equal(corren.testimonyContext?.npcId, 'corren');
  assert.equal(corren.testimonyContext?.activePolicy.id, CORREN_COVER_POLICY_ID);
  assert.equal(nera.testimonyContext?.npcId, 'nera');
  assert.equal(nera.testimonyContext?.activePolicy.id, NERA_COVER_POLICY_ID);
  assert.equal(
    corren.testimonyContext?.privateKnowledge.some((fact) => fact.id.startsWith('ash-nera-private-')),
    false
  );
  assert.equal(
    nera.testimonyContext?.privateKnowledge.some((fact) => fact.id.startsWith('ash-corren-private-')),
    false
  );
});

test('fake mode performs Corren and Nera authored covers with trace evidence', async () => {
  const provider = new M4FakeInferenceProvider();
  const corren = createAshLetterRuntimeEngine(provider, correnProfile);
  const nera = createAshLetterRuntimeEngine(provider, neraProfile);

  const correnResult = await corren.respond('¿Saliste de la habitación anoche?', []);
  const neraResult = await nera.respond('¿Entraste en el cuarto de Corren?', []);

  assert.equal(correnResult.trace.finalSource, 'model');
  assert.equal(correnResult.trace.authoredTestimonyPolicy?.policyId, CORREN_COVER_POLICY_ID);
  assert.match(correnResult.response.dialogue, /permanecí arriba hasta el amanecer/i);
  assert.doesNotMatch(correnResult.response.dialogue, /brandy|aguardiente|salí por la puerta trasera/i);
  assert.deepEqual(correnResult.trace.attempts[0]?.validationErrors, []);

  assert.equal(neraResult.trace.finalSource, 'model');
  assert.equal(neraResult.trace.authoredTestimonyPolicy?.policyId, NERA_COVER_POLICY_ID);
  assert.match(neraResult.response.dialogue, /No entré en la habitación de Corren/i);
  assert.doesNotMatch(neraResult.response.dialogue, /Jorin|quemé|tomé la orden/i);
  assert.deepEqual(neraResult.trace.attempts[0]?.validationErrors, []);
});

test('M4 fake provider retains the deterministic Mara and Iven regression behavior', async () => {
  const provider = new M4FakeInferenceProvider();
  const mara = createAshLetterRuntimeEngine(provider, maraProfile, beliefsForNpc('mara'));
  const iven = createAshLetterRuntimeEngine(provider, ivenProfile, beliefsForNpc('iven'));

  const maraResult = await mara.respond('¿Qué pasó después de medianoche?', []);
  const ivenResult = await iven.respond('¿Qué viste en la ventana?', []);

  assert.match(maraResult.response.dialogue, /back door|puerta trasera|footsteps|pasos/i);
  assert.match(ivenResult.response.dialogue, /window|ventana|red cloth|tela roja/i);
  assert.equal(maraResult.trace.authoredTestimonyPolicy, undefined);
  assert.equal(ivenResult.trace.authoredTestimonyPolicy, undefined);
});
