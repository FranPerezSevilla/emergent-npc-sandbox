import {
  CreateWebWorkerMLCEngine,
  type InitProgressReport,
  type WebWorkerMLCEngine
} from '@mlc-ai/web-llm';

import type {
  InferenceLoadProgress,
  InferenceProvider,
  InferenceProviderRequest,
  InferenceProviderResult
} from './inference.ts';

export const M0_WEBLLM_MODEL_ID = 'Qwen3-0.6B-q4f16_1-MLC';

export class WebLlmInferenceProvider implements InferenceProvider {
  readonly providerId = 'webllm';
  readonly modelId = M0_WEBLLM_MODEL_ID;

  private engine?: WebWorkerMLCEngine;
  private initialization?: Promise<void>;

  initialize(onProgress?: (progress: InferenceLoadProgress) => void): Promise<void> {
    if (this.initialization) return this.initialization;

    this.initialization = this.initializeInternal(onProgress).catch((error) => {
      this.initialization = undefined;
      throw error;
    });
    return this.initialization;
  }

  async generate(request: InferenceProviderRequest): Promise<InferenceProviderResult> {
    if (!this.engine) await this.initialize();
    if (!this.engine) throw new Error('WebLLM engine failed to initialize.');

    const startedAt = performance.now();
    const completion = await this.engine.chat.completions.create({
      messages: request.messages,
      stream: false,
      max_tokens: request.maxTokens,
      temperature: request.temperature,
      top_p: 0.9,
      extra_body: {
        enable_thinking: false
      }
    });
    const content = completion.choices[0]?.message.content;

    if (typeof content !== 'string' || content.trim().length === 0) {
      throw new Error('WebLLM returned an empty non-text response.');
    }

    return {
      text: content,
      providerId: this.providerId,
      modelId: this.modelId,
      latencyMs: Math.round(performance.now() - startedAt)
    };
  }

  private async initializeInternal(onProgress?: (progress: InferenceLoadProgress) => void): Promise<void> {
    if (!('gpu' in navigator)) {
      throw new Error('WebGPU is unavailable in this browser. Use a recent WebGPU-capable browser.');
    }

    const progressCallback = (report: InitProgressReport): void => {
      onProgress?.({ progress: report.progress, text: report.text });
    };
    const worker = new Worker(new URL('./webllm-worker.ts', import.meta.url), { type: 'module' });

    this.engine = await CreateWebWorkerMLCEngine(
      worker,
      this.modelId,
      {
        initProgressCallback: progressCallback,
        logLevel: 'WARN'
      },
      {
        context_window_size: 2048
      }
    );
  }
}
