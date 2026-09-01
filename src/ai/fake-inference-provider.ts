import type { InferenceProvider, NpcInferenceRequest, NpcInferenceResponse } from './inference.ts';

const normalizeUtterance = (value: string): string => value.trim().replace(/\s+/g, ' ').slice(0, 180);

export class FakeInferenceProvider implements InferenceProvider {
  async generate(request: NpcInferenceRequest): Promise<NpcInferenceResponse> {
    const utterance = normalizeUtterance(request.playerUtterance);
    const dialogue = utterance
      ? `Mara studies you for a moment. “I heard you say: ${utterance}”`
      : 'Mara waits, saying nothing.';

    return {
      schemaVersion: 1,
      dialogue,
      emotion: 'neutral',
      gesture: 'none',
      intent: 'continue'
    };
  }
}
