import test from 'node:test';
import assert from 'node:assert/strict';
import { classify } from './rules.js';

test('no flags is minimal', () => assert.equal(classify([]).level, 'minimal'));
test('chatbot is limited', () => assert.equal(classify(['chatbot']).level, 'limited'));
test('HR screening is high risk', () => assert.equal(classify(['hr']).level, 'high'));
test('prohibited wins over high and limited', () => {
  const r = classify(['hr', 'chatbot', 'social_scoring']);
  assert.equal(r.level, 'prohibited');
  assert.equal(r.reasons.length, 1);
});
