import assert from 'node:assert/strict';
import test from 'node:test';
import { getQuizSwipeDirection, isQuizHorizontalSwipe } from './quiz-swipe.ts';

test('quiz taps, short drags and vertical scrolls do not change questions', () => {
  for (const [dx, dy, velocity] of [
    [0, 0, 0],
    [8, 2, 1000],
    [25, 0, 1200],
    [40, 1, 200],
    [100, 90, 1000],
    [20, 80, 1200],
    [NaN, 0, 0],
    [100, Infinity, 0],
  ])
    assert.equal(getQuizSwipeDirection(dx, dy, velocity, 340), null);
  assert.equal(isQuizHorizontalSwipe(8, 0), false);
  assert.equal(isQuizHorizontalSwipe(30, 40), false);
});

test('quiz swipes move left to next and right to previous across phone/tablet sizes', () => {
  assert.equal(getQuizSwipeDirection(-90, 10, 0, 340), 1);
  assert.equal(getQuizSwipeDirection(90, -10, 0, 340), -1);
  assert.equal(getQuizSwipeDirection(-65, 0, 0, 240), 1);
  assert.equal(getQuizSwipeDirection(109, 0, 0, 820), null);
  assert.equal(getQuizSwipeDirection(111, 0, 0, 820), -1);
  assert.equal(getQuizSwipeDirection(-80, 0, 0, NaN), 1);
});

test('quiz flicks require deliberate distance and velocity in the same direction', () => {
  assert.equal(getQuizSwipeDirection(-40, 2, -800, 340), 1);
  assert.equal(getQuizSwipeDirection(40, -2, 800, 340), -1);
  assert.equal(getQuizSwipeDirection(40, 0, -800, 340), null);
  assert.equal(getQuizSwipeDirection(40, 0, NaN, 340), null);
  assert.equal(getQuizSwipeDirection(31, 0, 1500, 340), null);
});
