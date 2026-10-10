import assert from 'node:assert/strict';
import test from 'node:test';

import { getFlashcardDecision, isHorizontalSwipe } from './flashcard-gesture.ts';

test('a tap, slight movement or vertical scroll cannot mark a card', () => {
  for (const [dx, dy] of [
    [0, 0],
    [8, 2],
    [30, 80],
    [100, 90],
    [NaN, 0],
    [100, Infinity],
  ]) {
    assert.equal(isHorizontalSwipe(dx, dy), false);
    assert.equal(getFlashcardDecision(dx, dy, 1, 340), null);
  }
});

test('left and right swipes classify cards with a size-aware bounded threshold', () => {
  assert.equal(getFlashcardDecision(-100, 12, 0, 340), 'again');
  assert.equal(getFlashcardDecision(100, -12, 0, 340), 'remembered');
  assert.equal(getFlashcardDecision(70, 0, 0, 240), null);
  assert.equal(getFlashcardDecision(73, 0, 0, 240), 'remembered');
  assert.equal(getFlashcardDecision(-121, 0, 0, 820), 'again');
  assert.equal(getFlashcardDecision(85, 0, 0, NaN), 'remembered');
});

test('short drags return to the card; intentional flicks require distance and matching direction', () => {
  assert.equal(getFlashcardDecision(45, 0, 0.2, 340), null);
  assert.equal(getFlashcardDecision(20, 0, 2, 340), null);
  assert.equal(getFlashcardDecision(45, 0, -1, 340), null);
  assert.equal(getFlashcardDecision(45, 0, NaN, 340), null);
  assert.equal(getFlashcardDecision(-45, 3, -1, 340), 'again');
  assert.equal(getFlashcardDecision(45, 3, 1, 340), 'remembered');
});
