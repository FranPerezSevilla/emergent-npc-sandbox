import { puter } from '@heyputer/puter.js';

import type {
  InferenceProvider,
  InferenceProviderRequest,
  InferenceProviderResult
} from './inference.ts';

export const M0_PUTER_MODEL_ID = 'gpt-5.6-luna';

const extractTextContent = (content: unknown): string | undefined => {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return undefined;

  const parts = content
    .map((part) => {
      if (typeof part === 'string') return part;
      if (typeof part !== 'object' || part === null) return '';
      const text = 'text' in part ? part.text : undefined;
      return typeof text === 'string' ? text : '';
    })
    .filter((part) => part.length > 0);

  return parts.length > 0 ? parts.join('\n') : undefined;
};

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
    const response = await puter.ai.chat(request.messages, {
      model: this.modelId,
      max_tokens: request.maxTokens
    });
    const content = extractTextContent(response.message?.content);

    if (content === undefined || content.trim().length === 0) {
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
