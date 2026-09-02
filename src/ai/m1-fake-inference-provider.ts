import type { InferenceProvider, InferenceProviderRequest, InferenceProviderResult } from './inference.ts';

const systemText = (request: InferenceProviderRequest): string =>
  request.messages.find((message) => message.role === 'system')?.content ?? '';

export class M1FakeInferenceProvider implements InferenceProvider {
  readonly providerId = 'fake-m1';
  readonly modelId = 'deterministic-truth-belief-fixture';

  async generate(request: InferenceProviderRequest): Promise<InferenceProviderResult> {
    const system = systemText(request);
    let dialogue = 'I do not know enough to answer that.';

    if (system.includes('belief-mara-red-traveler-left')) {
      dialogue = 'I heard the back door and footsteps after midnight. I did not see who it was, but I think the red-cloaked traveler slipped out.';
    } else if (system.includes('belief-iven-red-traveler-stayed')) {
      dialogue = 'No. I saw red cloth at the upstairs window after midnight. I am sure the traveler stayed in that room.';
    }

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
