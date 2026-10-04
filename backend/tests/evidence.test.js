import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyEvidence } from '../src/utils/evidence.js';
import { cleanText } from '../src/rag/chunkers/cleanText.js';

test('evidence keeps only quotes the candidate actually wrote', () => {
  const answer = 'I would sort the array first, then use two pointers.';
  const { verified, unverifiedCount } = verifyEvidence([
    { quote: 'sort the array  first', observation: '' },
    { quote: 'use a hash map', observation: '' },
  ], answer);
  assert.equal(verified.length, 1);
  assert.equal(unverifiedCount, 1);
});

test('cleanText joins hyphenated line breaks and collapses blank lines', () => {
  assert.equal(cleanText('infor-\nmation\r\n\n\n\nnext'), 'information\n\nnext');
});
