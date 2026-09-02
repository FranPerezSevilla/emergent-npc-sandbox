import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MARA_BAKER_DEBT_MEMORY_ID,
  M2_STORAGE_KEY,
  applyMaraBakerDebtHelp,
  emptyM2State,
  loadM2State,
  memoriesForNpc,
  relationshipForNpc,
  saveM2State,
  selectRelevantMemories,
  type NpcMemory,
  type StringStorage
} from '../src/ai/memory-state.ts';
import { M2FakeInferenceProvider } from '../src/ai/m2-fake-inference-provider.ts';
import { maraProfile } from '../src/ai/mara.ts';
import { NpcConversationEngine } from '../src/ai/npc-conversation-engine.ts';
import { buildNpcMessages } from '../src/ai/prompt.ts';
import { beliefsForNpc } from '../src/ai/world-state.ts';

class MemoryStorage implements StringStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

const recallQuestion = '¿Te acuerdas de lo que hice por ti antes?';
const createdAt = '2026-09-02T06:00:00.000Z';

test('authoritative player action creates one compact Mara memory and trust change', () => {
  const first = applyMaraBakerDebtHelp(emptyM2State(), createdAt);
  const second = applyMaraBakerDebtHelp(first, '2026-09-02T07:00:00.000Z');

  assert.equal(first.memories.length, 1);
  assert.equal(first.memories[0]?.id, MARA_BAKER_DEBT_MEMORY_ID);
  assert.equal(first.memories[0]?.ownerNpcId, 'mara');
  assert.equal(relationshipForNpc(first, 'mara').trust, 1);
  assert.equal(second.memories.length, 1);
  assert.equal(relationshipForNpc(second, 'mara').trust, 1);
});

test('memory selector retrieves the relevant memory but does not dump it into unrelated turns', () => {
  const state = applyMaraBakerDebtHelp(emptyM2State(), createdAt);
  const memories = memoriesForNpc(state, 'mara');

  assert.deepEqual(selectRelevantMemories(memories, '¿Cómo va la taberna?'), []);
  assert.deepEqual(
    selectRelevantMemories(memories, recallQuestion).map((memory) => memory.id),
    [MARA_BAKER_DEBT_MEMORY_ID]
  );
});

test('selected memory and relationship state enter the prompt without recent transcript help', () => {
  const state = applyMaraBakerDebtHelp(emptyM2State(), createdAt);
  const selected = selectRelevantMemories(memoriesForNpc(state, 'mara'), recallQuestion);
  const messages = buildNpcMessages(
    maraProfile,
    recallQuestion,
    [],
    undefined,
    beliefsForNpc('mara'),
    selected,
    relationshipForNpc(state, 'mara')
  );
  const system = messages.find((message) => message.role === 'system')?.content ?? '';

  assert.match(system, new RegExp(MARA_BAKER_DEBT_MEMORY_ID));
  assert.match(system, /trust: 1/);
  assert.match(system, /RECENT CONVERSATION DATA\n\(no prior turns\)/);
});

test('conversation engine rejects a memory owned by another NPC', async () => {
  const foreignMemory: NpcMemory = {
    id: 'memory-iven-only',
    ownerNpcId: 'iven',
    summary: 'Iven remembers an unrelated event.',
    provenance: { kind: 'conversation-event', description: 'Fixture.' },
    importance: 'medium',
    tags: ['fixture'],
    createdAt
  };
  const engine = new NpcConversationEngine(new M2FakeInferenceProvider(), maraProfile, beliefsForNpc('mara'));

  await assert.rejects(
    engine.respond(recallQuestion, [], {
      memories: [foreignMemory],
      relationship: { npcId: 'mara', trust: 0 }
    }),
    /belongs to iven, not mara/
  );
});

test('deterministic M2 provider changes later testimony from stored memory and traces why', async () => {
  const state = applyMaraBakerDebtHelp(emptyM2State(), createdAt);
  const selected = selectRelevantMemories(memoriesForNpc(state, 'mara'), recallQuestion);
  const engine = new NpcConversationEngine(new M2FakeInferenceProvider(), maraProfile, beliefsForNpc('mara'));
  const result = await engine.respond(recallQuestion, [], {
    memories: selected,
    relationship: relationshipForNpc(state, 'mara')
  });

  assert.match(result.response.dialogue, /three silver/i);
  assert.equal(result.response.emotion, 'warm');
  assert.deepEqual(result.trace.selectedMemoryIds, [MARA_BAKER_DEBT_MEMORY_ID]);
  assert.deepEqual(result.trace.relationshipSnapshot, { trust: 1 });
  assert.equal(result.trace.recentTurnCount, 0);
});

test('structured M2 state survives storage reload without persisting raw conversation history', () => {
  const storage = new MemoryStorage();
  const state = applyMaraBakerDebtHelp(emptyM2State(), createdAt);
  saveM2State(storage, state);

  const raw = storage.getItem(M2_STORAGE_KEY) ?? '';
  const reloaded = loadM2State(storage);

  assert.equal(memoriesForNpc(reloaded, 'mara')[0]?.id, MARA_BAKER_DEBT_MEMORY_ID);
  assert.equal(relationshipForNpc(reloaded, 'mara').trust, 1);
  assert.doesNotMatch(raw, /recentConversation|dialogue|turns/);
});
