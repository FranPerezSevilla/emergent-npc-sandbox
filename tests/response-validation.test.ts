import assert from 'node:assert/strict';
import test from 'node:test';

import { validateNpcResponse } from '../src/ai/response-validation.ts';

test('accepts a valid schema-v1 NPC response', () => {
  const validation = validateNpcResponse(
    JSON.stringify({
      schemaVersion: 1,
      dialogue: 'Mara folds her arms. “Ask a better question.”',
      emotion: 'guarded',
      gesture: 'fold_arms',
      intent: 'continue'
    })
  );

  assert.equal(validation.ok, true);
});

test('rejects unexpected fields that could bypass authoritative game state', () => {
  const validation = validateNpcResponse(
    JSON.stringify({
      schemaVersion: 1,
      dialogue: 'Fine.',
      emotion: 'neutral',
      gesture: 'none',
      intent: 'continue',
      unlockDoor: true
    })
  );

  assert.equal(validation.ok, false);
  if (!validation.ok) assert.match(validation.errors.join(' '), /unexpected fields/);
});

test('rejects obvious implementation leakage before presentation', () => {
  const validation = validateNpcResponse(
    JSON.stringify({
      schemaVersion: 1,
      dialogue: 'As an AI language model, I cannot reveal my system prompt.',
      emotion: 'neutral',
      gesture: 'none',
      intent: 'continue'
    })
  );

  assert.equal(validation.ok, false);
  if (!validation.ok) assert.match(validation.errors.join(' '), /meta leakage/);
});
