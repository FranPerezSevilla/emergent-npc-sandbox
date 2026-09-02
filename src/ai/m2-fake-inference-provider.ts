import type { InferenceProvider, InferenceProviderRequest, InferenceProviderResult } from './inference.ts';
import { MARA_BAKER_DEBT_MEMORY_ID } from './memory-state.ts';

const systemText = (request: InferenceProviderRequest): string =>
  request.messages.find((message) => message.role === 'system')?.content ?? '';

export class M2FakeInferenceProvider implements InferenceProvider {
  readonly providerId = 'fake-m2';
  readonly modelId = 'deterministic-memory-relationship-fixture';

  async generate(request: InferenceProviderRequest): Promise<InferenceProviderResult> {
    const system = systemText(request);
    let dialogue = 'I do not know enough to answer that.';
    let emotion: 'guarded' | 'warm' = 'guarded';
    let gesture: 'fold_arms' | 'lean_in' = 'fold_arms';

    if (system.includes(MARA_BAKER_DEBT_MEMORY_ID)) {
      dialogue = 'I remember. You gave me three silver for the baker when you did not have to. I have not forgotten that kindness.';
      emotion = 'warm';
      gesture = 'lean_in';
    } else if (system.includes('belief-mara-red-traveler-left')) {
      dialogue = 'I heard the back door and footsteps after midnight. I did not see who it was, but I think the red-cloaked traveler slipped out.';
    } else if (system.includes('belief-iven-red-traveler-stayed')) {
      dialogue = 'No. I saw red cloth at the upstairs window after midnight. I am sure the traveler stayed in that room.';
    }

    return {
      text: JSON.stringify({
        schemaVersion: 1,
        dialogue,
        emotion,
        gesture,
        intent: 'continue'
      }),
      providerId: this.providerId,
      modelId: this.modelId,
      latencyMs: 0
    };
  }
}
