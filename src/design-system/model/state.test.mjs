import assert from 'node:assert/strict';
import test from 'node:test';

import { getAnswerState, getQuizContentStatus, isBlockingStatus, progressRatio } from './state.ts';

test('unknown totals and non-finite progress never produce NaN or Infinity', () => {
  for (const [value, total] of [
    [24, 0],
    [12, -1],
    [NaN, 40],
    [24, Infinity],
    [Infinity, 40],
  ]) {
    assert.equal(progressRatio(value, total), 0);
  }
});
test('progress handles an unfinished goal, overshoot and negative input', () => {
  assert.equal(progressRatio(24, 40), 0.6);
  assert.equal(progressRatio(50, 40), 1);
  assert.equal(progressRatio(-1, 40), 0);
});
test('quiz never reveals the correct answer before submission', () => {
  assert.equal(getAnswerState('a', null, 'a', false), 'default');
  assert.equal(getAnswerState('a', 'b', 'a', false), 'default');
  assert.equal(getAnswerState('b', 'b', 'a', false), 'selected');
});
test('wrong submission distinguishes selected mistake, correct answer and other choices', () => {
  assert.equal(getAnswerState('a', 'b', 'a', true), 'correct');
  assert.equal(getAnswerState('b', 'b', 'a', true), 'incorrect');
  assert.equal(getAnswerState('c', 'b', 'a', true), 'reviewed');
});
test('correct submission has one correct state and no incorrect state', () => {
  assert.equal(getAnswerState('a', 'a', 'a', true), 'correct');
  assert.equal(getAnswerState('b', 'a', 'a', true), 'reviewed');
});
test('loading, empty and error block data content; completed data remains renderable', () => {
  for (const status of ['loading', 'empty', 'error']) assert.equal(isBlockingStatus(status), true);
  for (const status of ['default', 'complete']) assert.equal(isBlockingStatus(status), false);
});

test('an empty quiz has no question controls; valid choices remain usable', () => {
  assert.equal(getQuizContentStatus([], 'a'), 'empty');
  assert.equal(
    getQuizContentStatus(
      [
        { id: 'a', text: 'Answer' },
        { id: 'b', text: 'Other' },
      ],
      'a',
    ),
    'ready',
  );
});

test('malformed answer data cannot display an unanswerable quiz', () => {
  assert.equal(getQuizContentStatus([{ id: 'a', text: 'Answer' }], 'missing'), 'invalid');
  assert.equal(
    getQuizContentStatus(
      [
        { id: 'a', text: 'First' },
        { id: 'a', text: 'Second' },
      ],
      'a',
    ),
    'invalid',
  );
  assert.equal(getQuizContentStatus([{ id: 'a', text: '  ' }], 'a'), 'invalid');
  assert.equal(getQuizContentStatus([{ id: ' ', text: 'Answer' }], ' '), 'invalid');
});
