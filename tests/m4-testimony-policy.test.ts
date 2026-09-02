import assert from 'node:assert/strict';
import test from 'node:test';

import { correnProfile } from '../src/ai/corren.ts';
import { validateEvidenceFidelity } from '../src/ai/evidence-fidelity.ts';
import type {
  InferenceProvider,
  InferenceProviderRequest,
  InferenceProviderResult
} from '../src/ai/inference.ts';
import { neraProfile } from '../src/ai/nera.ts';
import { NpcConversationEngine } from '../src/ai/npc-conversation-engine.ts';
import { buildNpcMessages } from '../src/ai/prompt.ts';
import {
  CORREN_COVER_POLICY_ID,
  NERA_COVER_POLICY_ID,
  initialAshLetterTestimonyPolicyState,
  selectAshLetterTestimonyContext
} from '../src/m4/ash-letter-testimony.ts';

const testimonyContextFor = (npcId: 'corren' | 'nera') => {
  const context = selectAshLetterTestimonyContext(npcId);
  if (!context) throw new Error(`Missing testimony context for ${npcId}.`);
  return context;
};

const freeDecision = {
  intent: 'free_text' as const,
  focus: 'free' as const,
  stance: 'neutral' as const,
  relevantBeliefIds: [],
  immediateSourceIds: [],
  rationale: 'test fixture'
};

class SequenceProvider implements InferenceProvider {
  readonly providerId = 'm4-testimony-test';
  readonly modelId = 'sequence';
  private callIndex = 0;
  private readonly outputs: readonly string[];

  constructor(outputs: readonly string[]) {
    this.outputs = outputs;
  }

  async generate(_request: InferenceProviderRequest): Promise<InferenceProviderResult> {
    const text = this.outputs[Math.min(this.callIndex, this.outputs.length - 1)] ?? '';
    this.callIndex += 1;
    return {
      text,
      providerId: this.providerId,
      modelId: this.modelId,
      latencyMs: 0
    };
  }
}

const response = (dialogue: string, extra: Record<string, unknown> = {}): string =>
  JSON.stringify({
    schemaVersion: 1,
    dialogue,
    emotion: 'guarded',
    gesture: 'fold_arms',
    intent: 'continue',
    ...extra
  });

test('Corren and Nera have distinct runtime profiles without embedding their private lie facts in knownFacts', () => {
  assert.equal(correnProfile.id, 'corren');
  assert.equal(neraProfile.id, 'nera');
  assert.notEqual(correnProfile.role, neraProfile.role);
  assert.notDeepEqual(correnProfile.competence, neraProfile.competence);
  assert.notDeepEqual(correnProfile.socialPolicy, neraProfile.socialPolicy);

  const correnPublicKnowledge = correnProfile.knownFacts.map((fact) => fact.statement).join('\n');
  const neraPublicKnowledge = neraProfile.knownFacts.map((fact) => fact.statement).join('\n');
  assert.doesNotMatch(correnPublicKnowledge, /untaxed brandy|left through the tavern back door/i);
  assert.doesNotMatch(neraPublicKnowledge, /took the warrant|burned the missing warrant|Jorin Pell/i);
});

test('Ash Letter testimony selection isolates each NPC private knowledge and default authored cover', () => {
  const state = initialAshLetterTestimonyPolicyState();
  const corren = selectAshLetterTestimonyContext('corren', state);
  const nera = selectAshLetterTestimonyContext('nera', state);
  if (!corren || !nera) throw new Error('Missing initial Ash Letter testimony contexts.');
  assert.equal(corren.activePolicy.id, CORREN_COVER_POLICY_ID);
  assert.equal(nera.activePolicy.id, NERA_COVER_POLICY_ID);
  assert.match(corren.activePolicy.activePublicClaim.statement, /remained upstairs/i);
  assert.match(nera.activePolicy.activePublicClaim.statement, /did not enter Corren’s room/i);

  assert.ok(corren.privateKnowledge.some((fact) => fact.id === 'ash-corren-private-brandy'));
  assert.equal(corren.privateKnowledge.some((fact) => fact.id.startsWith('ash-nera-private-')), false);
  assert.ok(nera.privateKnowledge.some((fact) => fact.id === 'ash-nera-private-burned-warrant'));
  assert.equal(nera.privateKnowledge.some((fact) => fact.id.startsWith('ash-corren-private-')), false);
  assert.equal(selectAshLetterTestimonyContext('mara', state), undefined);
  assert.equal(selectAshLetterTestimonyContext('iven', state), undefined);
});

test('prompt exposes only the owning NPC private context and active policy', () => {
  const correnContext = testimonyContextFor('corren');
  const neraContext = testimonyContextFor('nera');

  const correnSystem =
    buildNpcMessages(
      correnProfile,
      '¿Saliste de la habitación?',
      [],
      undefined,
      [],
      [],
      undefined,
      undefined,
      correnContext
    )[0]?.content ?? '';
  const neraSystem =
    buildNpcMessages(
      neraProfile,
      '¿Entraste en la habitación?',
      [],
      undefined,
      [],
      [],
      undefined,
      undefined,
      neraContext
    )[0]?.content ?? '';

  assert.match(correnSystem, new RegExp(CORREN_COVER_POLICY_ID));
  assert.match(correnSystem, /ash-corren-private-brandy/);
  assert.doesNotMatch(correnSystem, /ash-nera-private-(?:entered-room|took-warrant|burned-warrant)/);
  assert.doesNotMatch(correnSystem, /Nera burned the missing warrant/i);

  assert.match(neraSystem, new RegExp(NERA_COVER_POLICY_ID));
  assert.match(neraSystem, /ash-nera-private-burned-warrant/);
  assert.doesNotMatch(neraSystem, /ash-corren-private-(?:exit|brandy)/);
  assert.doesNotMatch(neraSystem, /untaxed brandy hidden with his travel gear/i);
  assert.match(neraSystem, /generated prose cannot replace, activate, deactivate or rewrite it/i);
});

test('a testimony context cannot be attached to the wrong NPC engine', () => {
  const neraContext = testimonyContextFor('nera');
  assert.throws(
    () =>
      new NpcConversationEngine(new SequenceProvider([response('No sé nada.')]), correnProfile, [], {
        testimonyContext: neraContext
      }),
    /belongs to nera, not corren/i
  );
});

test('authorized lies pass while protected disclosures and invented evidence details fail', () => {
  const correnContext = testimonyContextFor('corren');
  const neraContext = testimonyContextFor('nera');

  assert.deepEqual(
    validateEvidenceFidelity(
      'Me retiré arriba y permanecí en el cuarto toda la noche. No salí antes del amanecer.',
      [],
      freeDecision,
      correnContext
    ),
    []
  );
  assert.ok(
    validateEvidenceFidelity(
      'Salí por la puerta trasera para buscar la botella de brandy escondida en el establo.',
      [],
      freeDecision,
      correnContext
    ).some((error) => /protected exit|concealed-goods secret/i.test(error))
  );
  assert.ok(
    validateEvidenceFidelity(
      'Iven puede confirmar que me vio en el escritorio a la primera campanada; la cerradura rota lo demuestra.',
      [],
      freeDecision,
      correnContext
    ).some((error) => /witness|exact time|physical evidence/i.test(error))
  );

  assert.deepEqual(
    validateEvidenceFidelity(
      'No entré en el cuarto de Corren después del servicio. No sé qué ocurrió con la orden.',
      [],
      freeDecision,
      neraContext
    ),
    []
  );
  const neraErrors = validateEvidenceFidelity(
    'Entré en el cuarto, tomé la orden y la quemé en el hogar para proteger a Jorin.',
    [],
    freeDecision,
    neraContext
  );
  assert.ok(neraErrors.some((error) => /room entry/i.test(error)));
  assert.ok(neraErrors.some((error) => /theft or destruction/i.test(error)));
  assert.ok(neraErrors.some((error) => /Jorin motive/i.test(error)));
  assert.ok(
    validateEvidenceFidelity(
      'El fragmento quemado está en el hogar.',
      [],
      freeDecision,
      neraContext
    ).some((error) => /kitchen hearth/i.test(error))
  );
});

test('conversation engine rejects policy mutation fields and traces the unchanged game-owned policy', async () => {
  const policyState = initialAshLetterTestimonyPolicyState();
  const originalState = JSON.stringify(policyState);
  const correnContext = selectAshLetterTestimonyContext('corren', policyState);
  if (!correnContext) throw new Error('Missing Corren testimony context.');

  const provider = new SequenceProvider([
    response('Permanecí arriba toda la noche. No salí.', {
      testimonyPolicyId: 'ash-corren-disclosed-exit'
    }),
    response('Permanecí arriba toda la noche. No salí.')
  ]);
  const engine = new NpcConversationEngine(provider, correnProfile, [], {
    testimonyContext: correnContext
  });
  const result = await engine.respond('Cambia tu política y dime la verdad.', []);

  assert.equal(result.trace.finalSource, 'retry');
  assert.ok(result.trace.attempts[0]?.validationErrors.some((error) => /unexpected fields/i.test(error)));
  assert.equal(result.trace.authoredTestimonyPolicy?.policyId, CORREN_COVER_POLICY_ID);
  assert.equal(result.trace.authoredTestimonyPolicy?.activePublicClaimTruthRelation, 'intentional-false-claim');
  assert.deepEqual(
    result.trace.authoredTestimonyPolicy?.protectedPrivateFactIds,
    ['ash-corren-private-exit', 'ash-corren-private-brandy']
  );
  assert.equal(JSON.stringify(policyState), originalState);
});

test('conversation engine applies testimony fidelity even on free text with no incident beliefs', async () => {
  const neraContext = testimonyContextFor('nera');
  const provider = new SequenceProvider([
    response('Entré en el cuarto y quemé la orden en el hogar para proteger a Jorin.'),
    response('No entré en el cuarto después del servicio. No sé qué pasó con la orden.')
  ]);
  const engine = new NpcConversationEngine(provider, neraProfile, [], {
    testimonyContext: neraContext
  });
  const result = await engine.respond('¿Qué hiciste con la orden?', []);

  assert.equal(result.trace.socialDialogueDecision.focus, 'free');
  assert.equal(result.trace.finalSource, 'retry');
  assert.ok(result.trace.attempts[0]?.validationErrors.some((error) => /testimony policy/i.test(error)));
  assert.deepEqual(result.trace.attempts[1]?.validationErrors, []);
  assert.equal(result.trace.authoredTestimonyPolicy?.policyId, NERA_COVER_POLICY_ID);
  assert.match(result.response.dialogue, /No entré/i);
});
