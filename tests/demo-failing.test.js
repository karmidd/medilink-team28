import { test } from 'node:test';
import assert from 'node:assert/strict';

// Deliberately failing test to show that branch protection blocks the merge (#5). Do not merge.
test('deliberately failing test', () => {
  assert.equal(1, 2);
});
