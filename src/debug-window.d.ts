import type { ConversationTrace } from './ai/conversation-trace.ts';

declare global {
  interface Window {
    __npcTraces: ConversationTrace[];
    __m1TruthBeliefs: unknown;
    __m2State: unknown;
    __m3State: unknown;
    __m4State: unknown;
  }
}

export {};
