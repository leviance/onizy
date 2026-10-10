import assert from 'node:assert/strict';
import test from 'node:test';
import { deckReviewSummary } from './review-summary.ts';
import { suggestReview } from './learning-session.ts';

const deck = {
  id: 'deck',
  title: '',
  subject: '',
  sample: false,
  questions: [],
  cards: ['new', 'again', 'known'].map((id) => ({ id, front: '', back: '' })),
};
test('new cards are due; practice and remembered counts stay independent of due time', () => {
  const schedules = { again: suggestReview('again', 0), known: suggestReview('remembered', 0) };
  assert.deepEqual(deckReviewSummary(deck, schedules, 599999), {
    dueIds: ['new'],
    practiceIds: ['again'],
    remembered: 1,
    progress: (1 / 3) * 100,
  });
  assert.deepEqual(deckReviewSummary(deck, schedules, 600000).dueIds, ['new', 'again']);
  const nextDay = deckReviewSummary(deck, schedules, 86400000);
  assert.deepEqual(nextDay.dueIds, ['new', 'again', 'known']);
  assert.equal(nextDay.remembered, 1);
});
test('quiz-only decks have finite zero mastery and no recall queue', () => {
  assert.deepEqual(deckReviewSummary({ ...deck, cards: [] }, {}, 0), {
    dueIds: [],
    practiceIds: [],
    remembered: 0,
    progress: 0,
  });
});
