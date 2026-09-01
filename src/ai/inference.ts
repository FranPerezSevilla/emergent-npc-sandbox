export type NpcInferenceRequest = {
  npcId: string;
  playerUtterance: string;
};

export type NpcInferenceResponse = {
  schemaVersion: 1;
  dialogue: string;
  emotion: 'neutral';
  gesture: 'none';
  intent: 'continue';
};

export type InferenceProvider = {
  generate(request: NpcInferenceRequest): Promise<NpcInferenceResponse>;
};
