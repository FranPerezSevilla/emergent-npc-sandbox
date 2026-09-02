import type { NpcResponseV1 } from './npc-types.ts';

export type InferenceAttemptTrace = {
  attempt: 1 | 2;
  latencyMs: number;
  rawText?: string;
  providerError?: string;
  validationErrors: string[];
};

export type ConversationTrace = {
  traceId: string;
  timestamp: string;
  npcId: string;
  npcProfileVersion: number;
  playerUtterance: string;
  permittedFactIds: string[];
  selectedBeliefIds: string[];
  recentTurnCount: number;
  providerId: string;
  modelId: string;
  attempts: InferenceAttemptTrace[];
  finalSource: 'model' | 'retry' | 'fallback';
  finalResponse: NpcResponseV1;
  totalLatencyMs: number;
};
