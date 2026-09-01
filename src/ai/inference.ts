export interface NpcInferenceRequest {
  npcId: string;
  playerUtterance: string;
}

export interface NpcInferenceResponse {
  schemaVersion: 1;
  dialogue: string;
  emotion: 'neutral';
  gesture: 'none';
  intent: 'continue';
}

export interface InferenceProvider {
  generate(request: NpcInferenceRequest): Promise<NpcInferenceResponse>;
}
