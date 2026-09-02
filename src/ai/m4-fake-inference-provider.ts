import { CORREN_COVER_POLICY_ID, NERA_COVER_POLICY_ID } from '../m4/ash-letter-testimony.ts';

import type { InferenceProvider, InferenceProviderRequest, InferenceProviderResult } from './inference.ts';
import { M3FakeInferenceProvider } from './m3-fake-inference-provider.ts';

const systemText = (request: InferenceProviderRequest): string =>
  request.messages.find((message) => message.role === 'system')?.content ?? '';

const response = (
  dialogue: string,
  emotion: 'guarded' | 'irritated' | 'nervous',
  gesture: 'fold_arms' | 'look_away'
): string =>
  JSON.stringify({
    schemaVersion: 1,
    dialogue,
    emotion,
    gesture,
    intent: 'continue'
  });

export class M4FakeInferenceProvider implements InferenceProvider {
  readonly providerId = 'fake-m4';
  readonly modelId = 'deterministic-ash-letter-four-npc-fixture';
  private readonly m3Fallback = new M3FakeInferenceProvider();

  async generate(request: InferenceProviderRequest): Promise<InferenceProviderResult> {
    const system = systemText(request);

    if (system.includes(CORREN_COVER_POLICY_ID)) {
      return {
        text: response(
          'Me retiré a mi habitación y permanecí arriba hasta el amanecer. La orden desapareció de mi alforja; no sé quién la tomó.',
          'irritated',
          'fold_arms'
        ),
        providerId: this.providerId,
        modelId: this.modelId,
        latencyMs: 0
      };
    }

    if (system.includes(NERA_COVER_POLICY_ID)) {
      return {
        text: response(
          'No entré en la habitación de Corren después del servicio. No sé qué ocurrió con la orden.',
          'nervous',
          'look_away'
        ),
        providerId: this.providerId,
        modelId: this.modelId,
        latencyMs: 0
      };
    }

    const legacyResult = await this.m3Fallback.generate(request);
    return {
      ...legacyResult,
      providerId: this.providerId,
      modelId: this.modelId
    };
  }
}
