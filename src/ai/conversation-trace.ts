import type { AuthoredTestimonyTraceSnapshot } from './authored-testimony.ts';
import type { SocialDialogueDecision } from './dialogue-metabehavior.ts';
import type { NpcResponseV1 } from './npc-types.ts';

export type InferenceAttemptTrace = {
  attempt: 1 | 2;
  latencyMs: number;
  rawText?: string;
  providerError?: string;
  validationErrors: string[];
};

export type RelationshipTraceSnapshot = {
  trust: number;
};

export type ConversationTrace = {
  traceId: string;
  timestamp: string;
  npcId: string;
  npcProfileVersion: number;
  playerUtterance: string;
  permittedFactIds: string[];
  selectedBeliefIds: string[];
  selectedMemoryIds: string[];
  relationshipSnapshot?: RelationshipTraceSnapshot;
  socialDialogueDecision: SocialDialogueDecision;
  authoredTestimonyPolicy?: AuthoredTestimonyTraceSnapshot;
  recentTurnCount: number;
  providerId: string;
  modelId: string;
  attempts: InferenceAttemptTrace[];
  finalSource: 'model' | 'retry' | 'fallback';
  finalResponse: NpcResponseV1;
  totalLatencyMs: number;
};
