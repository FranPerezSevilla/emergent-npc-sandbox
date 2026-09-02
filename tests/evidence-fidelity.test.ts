import assert from 'node:assert/strict';
import test from 'node:test';

import { deriveSocialDialogueDecision } from '../src/ai/dialogue-metabehavior.ts';
import type { DialogueIntentRequest } from '../src/ai/dialogue-metabehavior.ts';
import { validateEvidenceFidelity } from '../src/ai/evidence-fidelity.ts';
import type {
  InferenceProvider,
  InferenceProviderRequest,
  InferenceProviderResult
} from '../src/ai/inference.ts';
import { ivenProfile } from '../src/ai/iven.ts';
import { maraProfile } from '../src/ai/mara.ts';
import { NpcConversationEngine } from '../src/ai/npc-conversation-engine.ts';
import {
  emptyM3State,
  propagatedBeliefsForNpc,
  recordPlayerRedTravelerClaimToMara,
  transferPlayerClaimFromMaraToIven
} from '../src/ai/propagation-state.ts';
import { buildNpcMessages } from '../src/ai/prompt.ts';
import { beliefsForNpc, redTravelerExitFact } from '../src/ai/world-state.ts';
import type { Belief } from '../src/ai/world-state.ts';

const intent = (value: DialogueIntentRequest['intent']): DialogueIntentRequest => ({
  intent: value,
  topicFactId: redTravelerExitFact.id
});

const maraBeliefsWithPlayerClaim = (): readonly Belief[] => {
  const state = recordPlayerRedTravelerClaimToMara(emptyM3State(), '2026-09-02T08:00:00.000Z');
  return [...beliefsForNpc('mara'), ...propagatedBeliefsForNpc(state, 'mara')];
};

const ivenBeliefsAfterTransfer = (): readonly Belief[] => {
  let state = recordPlayerRedTravelerClaimToMara(emptyM3State(), '2026-09-02T08:00:00.000Z');
  state = transferPlayerClaimFromMaraToIven(state, '2026-09-02T08:01:00.000Z');
  return [...beliefsForNpc('iven'), ...propagatedBeliefsForNpc(state, 'iven')];
};

test('rejects Mara inventing when where and exclusivity around a real direct source', () => {
  const beliefs = maraBeliefsWithPlayerClaim();
  const decision = deriveSocialDialogueDecision(maraProfile, beliefs, intent('ask_source'), 1);
  const errors = validateEvidenceFidelity(
    'Tú mismo. Anoche me lo contaste aquí mismo, delante de la barra. No he hablado con nadie más sobre eso.',
    beliefs,
    decision
  );

  assert.ok(errors.some((error) => /when or where/i.test(error)));
  assert.ok(errors.some((error) => /exclusivity/i.test(error)));
});

test('rejects Iven inventing neighborhood consensus when Mara is the only structured immediate source', () => {
  const beliefs = ivenBeliefsAfterTransfer();
  const decision = deriveSocialDialogueDecision(ivenProfile, beliefs, intent('ask_rumor'), 0);
  const errors = validateEvidenceFidelity(
    'Eso es lo que le repiten unos y otros por el barrio, pero yo no me fío de lo que se cuenta sin verse. Mara dice que alguien vio salir al de rojo.',
    beliefs,
    decision
  );

  assert.ok(errors.some((error) => /additional sources or social consensus/i.test(error)));
});

test('allows skeptical hearsay and source answers that stay inside structured provenance', () => {
  const beliefs = ivenBeliefsAfterTransfer();
  const rumorDecision = deriveSocialDialogueDecision(ivenProfile, beliefs, intent('ask_rumor'), 0);
  const sourceDecision = deriveSocialDialogueDecision(ivenProfile, beliefs, intent('ask_source'), 0);

  assert.deepEqual(
    validateEvidenceFidelity(
      'Mara me dijo que alguien afirma que el de la capa roja salió por la puerta trasera. Yo no lo vi y no me fío demasiado del rumor.',
      beliefs,
      rumorDecision
    ),
    []
  );
  assert.deepEqual(
    validateEvidenceFidelity(
      'Eso me lo dijo Mara. Ella me repitió la afirmación; yo no escuché al testigo directo, solo a ella.',
      beliefs,
      sourceDecision
    ),
    []
  );
});

test('rejects flattening Mara hearsay into a direct player to Iven conversation', () => {
  const beliefs = ivenBeliefsAfterTransfer();
  const decision = deriveSocialDialogueDecision(ivenProfile, beliefs, intent('ask_source'), 0);
  const errors = validateEvidenceFidelity('Tú me dijiste que lo viste salir por la puerta trasera.', beliefs, decision);

  assert.ok(errors.some((error) => /direct player-to-NPC conversation/i.test(error)));
});

test('rejects inference being upgraded into eyewitness identification', () => {
  const beliefs = ivenBeliefsAfterTransfer();
  const decision = deriveSocialDialogueDecision(ivenProfile, beliefs, intent('ask_observation'), 0);
  const errors = validateEvidenceFidelity('Vi al viajero junto a la ventana después de medianoche.', beliefs, decision);

  assert.ok(errors.some((error) => /inference into direct eyewitness identification/i.test(error)));
});

test('rejects certainty stronger than medium evidence', () => {
  const beliefs = maraBeliefsWithPlayerClaim();
  const decision = deriveSocialDialogueDecision(maraProfile, beliefs, intent('ask_observation'), 1);
  const errors = validateEvidenceFidelity(
    'Estoy completamente segura de que el viajero salió por la puerta trasera.',
    beliefs,
    decision
  );

  assert.ok(errors.some((error) => /confidence beyond the supplied evidence/i.test(error)));
});

test('prompt explicitly separates expressive freedom from evidence-bearing invention', () => {
  const beliefs = ivenBeliefsAfterTransfer();
  const decision = deriveSocialDialogueDecision(ivenProfile, beliefs, intent('ask_rumor'), 0);
  const system =
    buildNpcMessages(
      ivenProfile,
      '¿Qué se rumorea?',
      [],
      undefined,
      beliefs,
      [],
      { npcId: 'iven', trust: 0 },
      decision
    )[0]?.content ?? '';

  assert.match(system, /EVIDENCE FIDELITY/);
  assert.match(system, /may embellish tone, hesitation, attitude and phrasing/i);
  assert.match(system, /do not invent additional witnesses, additional sources, social consensus/i);
  assert.match(system, /If an evidence-bearing detail is not represented, omit it/i);
});

class SequenceProvider implements InferenceProvider {
  readonly providerId = 'evidence-fidelity-test';
  readonly modelId = 'sequence';
  private callIndex = 0;

  async generate(_request: InferenceProviderRequest): Promise<InferenceProviderResult> {
    this.callIndex += 1;
    const dialogue =
      this.callIndex === 1
        ? 'Eso es lo que le repiten unos y otros por el barrio. Mara dice que alguien vio salir al de rojo.'
        : 'Mara me dijo que alguien afirma que el de rojo salió por atrás. Yo no lo vi y no me fío del rumor.';

    return {
      text: JSON.stringify({
        schemaVersion: 1,
        dialogue,
        emotion: 'guarded',
        gesture: 'fold_arms',
        intent: 'continue'
      }),
      providerId: this.providerId,
      modelId: this.modelId,
      latencyMs: 0
    };
  }
}

test('conversation engine traces evidence rejection and accepts a repaired retry', async () => {
  const beliefs = ivenBeliefsAfterTransfer();
  const engine = new NpcConversationEngine(new SequenceProvider(), ivenProfile, beliefs);
  const result = await engine.respond(
    '¿Qué se rumorea?',
    [],
    { memories: [], relationship: { npcId: 'iven', trust: 0 } },
    intent('ask_rumor')
  );

  assert.equal(result.trace.finalSource, 'retry');
  assert.equal(result.trace.attempts.length, 2);
  assert.ok(
    result.trace.attempts[0]?.validationErrors.some((error) =>
      /additional sources or social consensus/i.test(error)
    )
  );
  assert.deepEqual(result.trace.attempts[1]?.validationErrors, []);
  assert.match(result.response.dialogue, /Mara me dijo/i);
});
