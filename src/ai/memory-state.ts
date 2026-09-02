export type MemoryImportance = 'low' | 'medium' | 'high';

export type MemoryProvenance = {
  readonly kind: 'direct-player-action' | 'conversation-event';
  readonly description: string;
};

export type NpcMemory = {
  readonly id: string;
  readonly ownerNpcId: string;
  readonly summary: string;
  readonly provenance: MemoryProvenance;
  readonly importance: MemoryImportance;
  readonly tags: readonly string[];
  readonly createdAt: string;
};

export type RelationshipState = {
  readonly npcId: string;
  readonly trust: number;
};

export type NpcSocialContext = {
  readonly memories: readonly NpcMemory[];
  readonly relationship: RelationshipState;
};

export type M2State = {
  readonly schemaVersion: 1;
  readonly memories: readonly NpcMemory[];
  readonly relationships: Readonly<Record<string, RelationshipState>>;
};

export type StringStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

export const M2_STORAGE_KEY = 'emergent-npc-sandbox.m2-state-v1';
export const MARA_BAKER_DEBT_MEMORY_ID = 'memory-mara-player-covered-baker-debt';

const clampTrust = (trust: number): number => Math.max(-2, Math.min(2, trust));

export const emptyM2State = (): M2State => ({
  schemaVersion: 1,
  memories: [],
  relationships: {}
});

export const relationshipForNpc = (state: M2State, npcId: string): RelationshipState =>
  state.relationships[npcId] ?? { npcId, trust: 0 };

export const memoriesForNpc = (state: M2State, npcId: string): readonly NpcMemory[] =>
  state.memories.filter((memory) => memory.ownerNpcId === npcId);

export const applyMaraBakerDebtHelp = (state: M2State, createdAt: string): M2State => {
  if (state.memories.some((memory) => memory.id === MARA_BAKER_DEBT_MEMORY_ID)) return state;

  const maraRelationship = relationshipForNpc(state, 'mara');
  const memory: NpcMemory = {
    id: MARA_BAKER_DEBT_MEMORY_ID,
    ownerNpcId: 'mara',
    summary: 'The player gave Mara three silver coins specifically to help cover the baker\'s overdue debt.',
    provenance: {
      kind: 'direct-player-action',
      description: 'Recorded by game code when the player used the explicit give-coins interaction with Mara.'
    },
    importance: 'high',
    tags: ['help', 'favor', 'baker', 'debt', 'coins'],
    createdAt
  };

  return {
    schemaVersion: 1,
    memories: [...state.memories, memory],
    relationships: {
      ...state.relationships,
      mara: {
        npcId: 'mara',
        trust: clampTrust(maraRelationship.trust + 1)
      }
    }
  };
};

const normalize = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const recallCue = /\b(recuerd\w*|remember\w*|antes|earlier|favor|ayud\w*|help\w*|deuda|debt|panader\w*|baker|moned\w*|coin\w*|plata|silver)\b/;

export const selectRelevantMemories = (
  memories: readonly NpcMemory[],
  playerUtterance: string,
  limit = 2
): readonly NpcMemory[] => {
  const normalized = normalize(playerUtterance);
  if (!recallCue.test(normalized)) return [];

  const scored = memories
    .map((memory) => {
      const tagHits = memory.tags.filter((tag) => normalized.includes(normalize(tag))).length;
      const genericRecall = /\b(recuerd\w*|remember\w*|antes|earlier|favor)\b/.test(normalized) ? 1 : 0;
      const importance = memory.importance === 'high' ? 2 : memory.importance === 'medium' ? 1 : 0;
      return { memory, score: tagHits * 3 + genericRecall + importance };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.memory.createdAt.localeCompare(a.memory.createdAt));

  return scored.slice(0, limit).map(({ memory }) => memory);
};

const isMemory = (value: unknown): value is NpcMemory => {
  if (typeof value !== 'object' || value === null) return false;
  const memory = value as Partial<NpcMemory>;
  return (
    typeof memory.id === 'string' &&
    typeof memory.ownerNpcId === 'string' &&
    typeof memory.summary === 'string' &&
    (memory.importance === 'low' || memory.importance === 'medium' || memory.importance === 'high') &&
    Array.isArray(memory.tags) &&
    memory.tags.every((tag) => typeof tag === 'string') &&
    typeof memory.createdAt === 'string' &&
    typeof memory.provenance === 'object' &&
    memory.provenance !== null &&
    (memory.provenance.kind === 'direct-player-action' || memory.provenance.kind === 'conversation-event') &&
    typeof memory.provenance.description === 'string'
  );
};

const isRelationship = (value: unknown): value is RelationshipState => {
  if (typeof value !== 'object' || value === null) return false;
  const relationship = value as Partial<RelationshipState>;
  return (
    typeof relationship.npcId === 'string' &&
    typeof relationship.trust === 'number' &&
    Number.isFinite(relationship.trust) &&
    relationship.trust >= -2 &&
    relationship.trust <= 2
  );
};

export const loadM2State = (storage: StringStorage): M2State => {
  const raw = storage.getItem(M2_STORAGE_KEY);
  if (!raw) return emptyM2State();

  try {
    const value = JSON.parse(raw) as {
      schemaVersion?: unknown;
      memories?: unknown;
      relationships?: unknown;
    };
    if (value.schemaVersion !== 1 || !Array.isArray(value.memories) || !value.memories.every(isMemory)) {
      return emptyM2State();
    }
    if (typeof value.relationships !== 'object' || value.relationships === null) return emptyM2State();
    const relationshipEntries = Object.entries(value.relationships);
    if (!relationshipEntries.every(([, relationship]) => isRelationship(relationship))) return emptyM2State();

    return {
      schemaVersion: 1,
      memories: value.memories,
      relationships: Object.fromEntries(relationshipEntries) as Record<string, RelationshipState>
    };
  } catch {
    return emptyM2State();
  }
};

export const saveM2State = (storage: StringStorage, state: M2State): void => {
  storage.setItem(M2_STORAGE_KEY, JSON.stringify(state));
};

export const resetM2State = (storage: StringStorage): M2State => {
  storage.removeItem(M2_STORAGE_KEY);
  return emptyM2State();
};
