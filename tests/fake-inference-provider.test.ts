import assert from 'node:assert/strict';
import test from 'node:test';

import { FakeInferenceProvider } from '../src/ai/fake-inference-provider.ts';
import { maraProfile } from '../src/ai/mara.ts';
import { NpcConversationEngine } from '../src/ai/npc-conversation-engine.ts';
import { buildNpcMessages } from '../src/ai/prompt.ts';

test('FakeInferenceProvider remains deterministic at the raw provider boundary', async () => {
  const provider = new FakeInferenceProvider();
  const request = {
    messages: buildNpcMessages(maraProfile, '  hello   there  ', []),
    maxTokens: 180,
    temperature: 0.55
  };

  const first = await provider.generate(request);
  const second = await provider.generate(request);

  assert.deepEqual(first, second);
  assert.equal(first.providerId, 'fake');
  assert.match(first.text, /hello there/);
});

test('NpcConversationEngine validates the fake response and records a trace', async () => {
  const engine = new NpcConversationEngine(new FakeInferenceProvider(), maraProfile);
  const result = await engine.respond('hello there', []);

  assert.equal(result.response.schemaVersion, 1);
  assert.equal(result.response.emotion, 'neutral');
  assert.equal(result.trace.finalSource, 'model');
  assert.deepEqual(result.trace.permittedFactIds, maraProfile.knownFacts.map((fact) => fact.id));
  assert.equal(result.trace.attempts.length, 1);
});
