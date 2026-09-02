import assert from 'node:assert/strict';
import test from 'node:test';

import { M1_OPENROUTER_MODEL_ID } from '../src/ai/openrouter-inference-provider.ts';

test('M1 OpenRouter experiment pins one explicit free model', () => {
  assert.equal(M1_OPENROUTER_MODEL_ID, 'minimax/minimax-m3:free');
});
