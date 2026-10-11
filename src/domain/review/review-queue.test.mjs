import assert from 'node:assert/strict';
import test from 'node:test';
import { buildReviewQueue, currentStudyStreak } from './review-queue.ts';

const decks = [
  { id: 'a', cards: [{ id: 'a1' }, { id: 'a2' }], questions: [] },
  { id: 'q', cards: [], questions: [{ id: 'q1' }] },
  { id: 'b', cards: [{ id: 'b1' }], questions: [] },
];
test('review batches use actual due boundaries and exclude question-only decks', () => {
  const schedules = {
    a1: { decision: 'remembered', dueAt: 101 },
    a2: { decision: 'again', dueAt: 100 },
  };
  const before = JSON.stringify(decks);
  assert.deepEqual(
    buildReviewQueue(decks, schedules, 100).map((x) => [x.deck.id, x.ids]),
    [
      ['a', ['a2']],
      ['b', ['b1']],
    ],
  );
  assert.deepEqual(
    buildReviewQueue(decks, schedules, 99, 'practice').map((x) => x.ids),
    [['a2']],
  );
  assert.deepEqual(buildReviewQueue([], {}, 100), []);
  assert.equal(JSON.stringify(decks), before);
});
test('streaks deduplicate sessions and respect missing days, future dates and month boundaries', () => {
  const now = new Date(2026, 10, 2, 12).getTime();
  const record = (date) => ({ finishedAt: new Date(date).getTime() });
  const records = [
    record('2026-11-01T10:00:00'),
    record('2026-11-01T11:00:00'),
    record('2026-10-31T11:00:00'),
    record('2026-10-29T11:00:00'),
    record('2026-11-03T11:00:00'),
  ];
  assert.equal(currentStudyStreak(records, now), 2);
  assert.equal(currentStudyStreak([...records, record('2026-11-02T10:00:00')], now), 3);
  assert.equal(currentStudyStreak([record('2026-10-29T11:00:00')], now), 0);
  assert.equal(currentStudyStreak([], now), 0);
});
