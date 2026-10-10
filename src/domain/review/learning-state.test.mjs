import assert from 'node:assert/strict';
import test from 'node:test';
import { addLearningDeck, recordLearningSession } from './learning-state.ts';

const deck = {
  id: 'deck',
  title: 'Deck',
  subject: '',
  sample: false,
  cards: [
    { id: 'c1', front: 'One', back: 'Một' },
    { id: 'c2', front: 'Two', back: 'Hai' },
  ],
  questions: [
    {
      id: 'q1',
      question: 'One?',
      choices: [
        { id: 'a', text: 'Một' },
        { id: 'b', text: 'Hai' },
      ],
      correctId: 'a',
      explanation: 'One = Một',
    },
  ],
};
const initial = () => ({ decks: [deck], records: [], schedules: {} });
const record = (patch = {}) => ({
  id: 'session',
  deckId: deck.id,
  mode: 'review',
  finishedAt: 1000,
  durationSeconds: 20,
  itemIds: ['c1', 'c2'],
  answers: {},
  decisions: { c1: 'again', c2: 'remembered' },
  ...patch,
});

test('completion updates history and schedules once without mutating previous state', () => {
  const before = initial();
  const snapshot = JSON.stringify(before);
  const completion = record();
  const after = recordLearningSession(before, completion);
  assert.equal(JSON.stringify(before), snapshot);
  assert.equal(after.records.length, 1);
  assert.equal(after.schedules.c1.dueAt, 601000);
  assert.equal(after.schedules.c2.dueAt, 86401000);
  assert.equal(recordLearningSession(after, completion), after);
  assert.equal(
    recordLearningSession(after, record({ decisions: { c1: 'remembered', c2: 'again' } })),
    after,
  );
});

test('a delayed older session enters history without overwriting a newer review', () => {
  const newer = recordLearningSession(initial(), record({ id: 'newer', finishedAt: 3000 }));
  const after = recordLearningSession(
    newer,
    record({ id: 'older', finishedAt: 1000, decisions: { c1: 'remembered', c2: 'again' } }),
  );
  assert.equal(after.records.length, 2);
  assert.equal(after.schedules.c1, newer.schedules.c1);
  assert.equal(after.schedules.c2, newer.schedules.c2);
  const latest = recordLearningSession(
    after,
    record({ id: 'latest', finishedAt: 4000, decisions: { c1: 'remembered', c2: 'again' } }),
  );
  assert.equal(latest.schedules.c1.decision, 'remembered');
  assert.equal(latest.schedules.c1.reviewedAt, 4000);
});

test('incomplete, unknown or inconsistent card outcomes cannot enter history', () => {
  const before = initial();
  for (const patch of [
    { decisions: { c1: 'again' } },
    { decisions: { c1: 'again', foreign: 'remembered' } },
    { decisions: { c1: 'unknown', c2: 'remembered' } },
    { deckId: 'missing' },
    { itemIds: [] },
    { itemIds: ['c1', 'c1'] },
    { itemIds: ['c1', 'foreign'], decisions: { c1: 'again', foreign: 'again' } },
    { answers: { c1: 'a' } },
    { finishedAt: NaN },
    { durationSeconds: -1 },
  ])
    assert.equal(recordLearningSession(before, record(patch)), before);
});

test('quiz may have unanswered questions but never updates recall schedules', () => {
  const before = recordLearningSession(initial(), record());
  const quiz = record({ id: 'quiz', mode: 'quiz', itemIds: ['q1'], answers: {}, decisions: {} });
  const after = recordLearningSession(before, quiz);
  assert.equal(after.records.length, 2);
  assert.deepEqual(after.schedules, before.schedules);
  for (const patch of [
    { answers: { q1: 'missing' } },
    { answers: { foreign: 'a' } },
    { decisions: { q1: 'remembered' } },
  ])
    assert.equal(recordLearningSession(before, { ...quiz, ...patch }), before);
  assert.equal(recordLearningSession(before, { ...quiz, answers: { q1: 'a' } }).records.length, 2);
});

test('adding a deck with the same identity preserves existing data', () => {
  const before = initial();
  assert.equal(addLearningDeck(before, { ...deck, title: 'Changed' }), before);
  const after = addLearningDeck(before, { ...deck, id: 'another' });
  assert.equal(after.decks.length, 2);
  assert.equal(before.decks.length, 1);
});
