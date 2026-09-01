import assert from 'node:assert/strict';
import test from 'node:test';

import { FakeInferenceProvider } from '../src/ai/fake-inference-provider.ts';

test('FakeInferenceProvider is deterministic and returns schema v1', async () => {
  const provider = new FakeInferenceProvider();
  const request = { npcId: 'mara-placeholder', playerUtterance: '  hello   there  ' };

  const first = await provider.generate(request);
  const second = await provider.generate(request);

  assert.deepEqual(first, second);
  assert.equal(first.schemaVersion, 1);
  assert.equal(first.emotion, 'neutral');
  assert.equal(first.gesture, 'none');
  assert.equal(first.intent, 'continue');
  assert.match(first.dialogue, /hello there/);
});
