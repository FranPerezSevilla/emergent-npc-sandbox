import { puter } from '@heyputer/puter.js';

import type {
  InferenceProvider,
  InferenceProviderRequest,
  InferenceProviderResult
} from './inference.ts';

export const M0_PUTER_MODEL_ID = 'gpt-5.6-luna';

export class PuterInferenceProvider implements InferenceProvider {
  readonly providerId = 'puter-ai';
  readonly modelId = M0_PUTER_MODEL_ID;

  isSignedIn(): boolean {
    return puter.auth.isSignedIn();
  }

  async signIn(): Promise<void> {
    if (this.isSignedIn()) return;
    await puter.auth.signIn();
  }

  async generate(request: InferenceProviderRequest): Promise<InferenceProviderResult> {
    if (!this.isSignedIn()) {
      throw new Error('Remote AI authentication is required before generating dialogue.');
    }

    const startedAt = performance.now();
    const response = await puter.ai.chat(request.messages, false, {
      model: this.modelId,
      normalize: true,
      stream: false,
      max_tokens: request.maxTokens,
      temperature: request.temperature
    });
    const content = response.message?.content;

    if (typeof content !== 'string' || content.trim().length === 0) {
      throw new Error('Puter AI returned an empty or non-text response.');
    }

    return {
      text: content,
      providerId: this.providerId,
      modelId: this.modelId,
      latencyMs: Math.round(performance.now() - startedAt)
    };
  }
}
