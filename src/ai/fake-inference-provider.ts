import type { InferenceProvider, InferenceProviderRequest, InferenceProviderResult } from './inference.ts';

const extractPlayerUtterance = (request: InferenceProviderRequest): string => {
  const user = [...request.messages].reverse().find((message) => message.role === 'user');
  if (!user) return '';

  const jsonStart = user.content.indexOf('{');
  if (jsonStart === -1) return user.content.trim();

  try {
    const parsed = JSON.parse(user.content.slice(jsonStart)) as { utterance?: unknown };
    return typeof parsed.utterance === 'string' ? parsed.utterance.trim().replace(/\s+/g, ' ').slice(0, 180) : '';
  } catch {
    return '';
  }
};

export class FakeInferenceProvider implements InferenceProvider {
  readonly providerId = 'fake';
  readonly modelId = 'deterministic-test-double';

  async generate(request: InferenceProviderRequest): Promise<InferenceProviderResult> {
    const utterance = extractPlayerUtterance(request);
    const response = {
      schemaVersion: 1,
      dialogue: utterance
        ? `Mara studies you for a moment. “I heard you say: ${utterance}”`
        : 'Mara waits, saying nothing.',
      emotion: 'neutral',
      gesture: 'none',
      intent: 'continue'
    };

    return {
      text: JSON.stringify(response),
      providerId: this.providerId,
      modelId: this.modelId,
      latencyMs: 0
    };
  }
}
