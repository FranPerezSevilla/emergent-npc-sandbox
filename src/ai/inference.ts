export type InferenceRole = 'system' | 'user' | 'assistant';

export type InferenceMessage = {
  role: InferenceRole;
  content: string;
};

export type InferenceProviderRequest = {
  messages: InferenceMessage[];
  maxTokens: number;
  temperature: number;
};

export type InferenceProviderResult = {
  text: string;
  providerId: string;
  modelId: string;
  latencyMs: number;
};

export type InferenceLoadProgress = {
  progress?: number;
  text: string;
};

export type InferenceProvider = {
  readonly providerId: string;
  readonly modelId: string;
  initialize?(onProgress?: (progress: InferenceLoadProgress) => void): Promise<void>;
  generate(request: InferenceProviderRequest): Promise<InferenceProviderResult>;
};
