import type { ConversationTrace } from './ai/conversation-trace.ts';

declare global {
  // Interface declaration merging is required for browser debug globals.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    __npcTraces: ConversationTrace[];
    __m1TruthBeliefs: unknown;
    __m2State: unknown;
    __m3State: unknown;
    __m4State: unknown;
  }
}

export {};
