import test from 'node:test';
import assert from 'node:assert/strict';
import { studyActivity } from './study-activity.ts';

test('activity counts card decisions by local calendar day and keeps Quiz separate', () => {
  const now = new Date(2026, 9, 11, 12).getTime();
  const records = [
    {
      mode: 'review',
      finishedAt: now - 1000,
      itemIds: ['a', 'b'],
      decisions: { a: 'remembered', b: 'again', extra: 'remembered' },
    },
    {
      mode: 'flashcard',
      finishedAt: new Date(2026, 9, 10, 23, 59).getTime(),
      itemIds: ['a'],
      decisions: { a: 'remembered' },
    },
    { mode: 'quiz', finishedAt: now - 1000, itemIds: ['q'], decisions: {} },
    { mode: 'review', finishedAt: now + 1000, itemIds: ['a'], decisions: { a: 'again' } },
    {
      mode: 'review',
      finishedAt: new Date(2026, 8, 1).getTime(),
      itemIds: ['a'],
      decisions: { a: 'again' },
    },
  ];
  const original = structuredClone(records);
  const activity = studyActivity(records, 7, now);
  assert.equal(activity.length, 7);
  assert.deepEqual(activity.at(-1), {
    timestamp: new Date(2026, 9, 11).getTime(),
    remembered: 1,
    again: 1,
    total: 2,
  });
  assert.equal(activity.at(-2).total, 1);
  assert.equal(activity[0].total, 0);
  assert.equal(studyActivity(records, 30, now).length, 30);
  assert.deepEqual(records, original);
});
