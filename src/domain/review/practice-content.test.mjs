import test from 'node:test';
import assert from 'node:assert/strict';
import { practiceContent } from './practice-content.ts';

test('practice content uses the latest attempt, excludes future attempts and keeps unanswered items', () => {
  const deck = {
    id: 'deck',
    title: 'Original content',
    cards: [{ id: 'c', front: 'front', back: 'back' }],
    questions: [
      { id: 'q', question: 'Question', correctId: 'yes' },
      { id: 'u', question: 'Unanswered', correctId: 'yes' },
    ],
  };
  const records = [
    { deckId: 'deck', mode: 'quiz', finishedAt: 30, itemIds: ['q'], answers: { q: 'no' } },
    { deckId: 'deck', mode: 'quiz', finishedAt: 20, itemIds: ['q', 'u'], answers: { q: 'yes' } },
    { deckId: 'deck', mode: 'quiz', finishedAt: 200, itemIds: ['u'], answers: { u: 'yes' } },
    { deckId: 'deleted', mode: 'quiz', finishedAt: 90, itemIds: ['q'], answers: { q: 'no' } },
  ];
  const schedules = { c: { decision: 'again', reviewedAt: 40 } };
  const original = structuredClone({ deck, records, schedules });
  assert.deepEqual(
    practiceContent([deck], records, schedules, 100).map((item) => item.id),
    ['c', 'q', 'u'],
  );
  assert.deepEqual({ deck, records, schedules }, original);
  assert.deepEqual(
    practiceContent(
      [deck],
      [
        ...records,
        { deckId: 'deck', mode: 'quiz', finishedAt: 50, itemIds: ['q'], answers: { q: 'yes' } },
      ],
      { c: { decision: 'remembered', reviewedAt: 60 } },
      100,
    ).map((item) => item.id),
    ['u'],
  );
  assert.deepEqual(practiceContent([], records, schedules, 100), []);
});
