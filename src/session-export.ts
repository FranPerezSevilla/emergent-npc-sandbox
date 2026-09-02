import type { ConversationTrace } from './ai/conversation-trace.ts';
import type { M2State, NpcMemory, RelationshipState } from './ai/memory-state.ts';
import type { ConversationTurn } from './ai/npc-types.ts';
import type { M3State } from './ai/propagation-state.ts';
import type { Belief, WorldFact } from './ai/world-state.ts';
import type { M4CaseState } from './m4/ash-letter-case-state.ts';
import type { AshLetterTestimonyPolicyState } from './m4/ash-letter-testimony.ts';

export type SessionNpcConversation = {
  readonly npcId: string;
  readonly npcName: string;
  readonly role: string;
  readonly turns: readonly ConversationTurn[];
};

export type SessionNpcContextSnapshot = {
  readonly npcId: string;
  readonly beliefs: readonly Belief[];
  readonly memories: readonly NpcMemory[];
  readonly relationship: RelationshipState;
};

export type SessionExport = {
  readonly schemaVersion: 1;
  readonly exportedAt: string;
  readonly provider: {
    readonly providerId: string;
    readonly modelId: string;
  };
  readonly conversations: readonly SessionNpcConversation[];
  readonly traces: readonly ConversationTrace[];
  readonly npcContextSnapshots: readonly SessionNpcContextSnapshot[];
  readonly state: {
    readonly m1: {
      readonly objectiveTruth: WorldFact;
      readonly authoredBeliefs: readonly Belief[];
    };
    readonly m2: M2State;
    readonly m3: M3State;
    readonly m4: {
      readonly caseState: M4CaseState;
      readonly testimonyPolicyState: AshLetterTestimonyPolicyState;
    };
  };
  readonly privacy: {
    readonly credentialsIncluded: false;
    readonly note: string;
  };
};

export type BuildSessionExportInput = Omit<SessionExport, 'schemaVersion' | 'privacy'>;

export const buildSessionExport = (input: BuildSessionExportInput): SessionExport => ({
  schemaVersion: 1,
  exportedAt: input.exportedAt,
  provider: { ...input.provider },
  conversations: input.conversations.map((conversation) => ({
    ...conversation,
    turns: conversation.turns.map((turn) => ({ ...turn }))
  })),
  traces: input.traces.map((trace) => structuredClone(trace)),
  npcContextSnapshots: input.npcContextSnapshots.map((snapshot) => structuredClone(snapshot)),
  state: structuredClone(input.state),
  privacy: {
    credentialsIncluded: false,
    note: 'OpenRouter OAuth credentials, session-storage keys and browser authentication data are intentionally excluded.'
  }
});
