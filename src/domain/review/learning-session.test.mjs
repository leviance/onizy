import assert from 'node:assert/strict';
import test from 'node:test';
import {
  startSession,
  transitionSession,
  quizResult,
  suggestReview,
  formatDuration,
  canNavigateQuizQuestion,
} from './learning-session.ts';
import { learningStatistics } from './learning-statistics.ts';

const deck = {
  id: 'test',
  title: 'Test',
  subject: 'Vocabulary',
  sample: false,
  cards: [
    { id: 'c1', front: 'One', back: 'Một' },
    { id: 'c2', front: 'Two', back: 'Hai' },
  ],
  questions: [1, 2, 3].map((n) => ({
    id: `q${n}`,
    question: `Question ${n}`,
    choices: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
    ],
    correctId: 'a',
    explanation: 'Because A',
  })),
};
const config = (mode = 'flashcard', feedback = 'immediate') => ({
  mode,
  feedback,
  limit: 20,
  shuffle: false,
});
const reduce = (state, action, options = config()) =>
  transitionSession(state, action, deck, options);

test('either card face accepts recall once, advances and completes flashcard/review sessions', () => {
  for (const mode of ['flashcard', 'review']) {
    for (const revealFirst of [false, true]) {
      const options = config(mode);
      let state = startSession(deck, options);
      if (revealFirst) state = reduce(state, { type: 'flip' }, options);
      assert.equal(
        reduce(state, { type: 'decide', itemId: 'c2', decision: 'again' }, options),
        state,
      );
      state = reduce(state, { type: 'decide', itemId: 'c1', decision: 'again' }, options);
      assert.equal(state.index, 1);
      assert.equal(state.revealed, false);
      assert.equal(state.submitted, false);
      assert.equal(
        reduce(state, { type: 'decide', itemId: 'c1', decision: 'remembered' }, options),
        state,
      );
      if (!revealFirst) state = reduce(state, { type: 'flip' }, options);
      state = reduce(state, { type: 'decide', itemId: 'c2', decision: 'remembered' }, options);
      assert.equal(state.submitted, true);
      assert.deepEqual(state.decisions, { c1: 'again', c2: 'remembered' });
      assert.equal(reduce(state, { type: 'flip' }, options), state);
      assert.equal(
        reduce(state, { type: 'decide', itemId: 'c2', decision: 'again' }, options),
        state,
      );
    }
  }
});

test('immediate quiz locks a choice, rejects skipping and premature submission', () => {
  const options = config('quiz');
  let state = startSession(deck, options);
  assert.equal(
    reduce(state, { type: 'decide', itemId: 'q1', decision: 'remembered' }, options),
    state,
  );
  assert.equal(reduce(state, { type: 'go', index: 1 }, options), state);
  assert.equal(reduce(state, { type: 'submit' }, options), state);
  state = reduce(state, { type: 'answer', itemId: 'q1', answerId: 'b' }, options);
  assert.equal(reduce(state, { type: 'answer', itemId: 'q1', answerId: 'a' }, options), state);
  assert.equal(reduce(state, { type: 'go', index: 2 }, options), state);
  state = reduce(state, { type: 'go', index: 1 }, options);
  state = reduce(state, { type: 'go', index: 0 }, options);
  assert.equal(state.index, 0);
  assert.deepEqual(state.answers, { q1: 'b' });
  assert.equal(reduce(state, { type: 'answer', itemId: 'q1', answerId: 'a' }, options), state);
  state = reduce(state, { type: 'go', index: 1 }, options);
  for (const id of ['q2', 'q3']) {
    state = reduce(state, { type: 'answer', itemId: id, answerId: 'a' }, options);
    if (id === 'q2') state = reduce(state, { type: 'go', index: 2 }, options);
  }
  assert.equal(state.submitted, false);
  state = reduce(state, { type: 'submit' }, options);
  assert.equal(state.submitted, true);
  assert.deepEqual(quizResult(deck, state.ids, state.answers), {
    correct: 2,
    total: 3,
    incorrect: ['q1'],
    unanswered: 0,
  });
});

test('quiz navigation preserves answers and never submits at either boundary', () => {
  for (const feedback of ['immediate', 'after-submit']) {
    const options = config('quiz', feedback);
    let state = startSession(deck, options);
    for (const index of [-1, 0, 3, 1.5, NaN]) {
      assert.equal(canNavigateQuizQuestion(state, index, feedback), false);
      assert.equal(reduce(state, { type: 'go', index }, options), state);
    }
    for (let index = 0; index < 3; index++) {
      state = reduce(state, { type: 'answer', itemId: `q${index + 1}`, answerId: 'b' }, options);
      if (index < 2) state = reduce(state, { type: 'go', index: index + 1 }, options);
    }
    const answers = state.answers;
    assert.equal(reduce(state, { type: 'go', index: 3 }, options), state);
    state = reduce(state, { type: 'go', index: 1 }, options);
    state = reduce(state, { type: 'go', index: 0 }, options);
    state = reduce(state, { type: 'go', index: 1 }, options);
    state = reduce(state, { type: 'go', index: 2 }, options);
    assert.equal(state.answers, answers);
    assert.equal(state.index, 2);
    assert.equal(state.submitted, false);
    state = reduce(state, { type: 'submit' }, options);
    assert.equal(canNavigateQuizQuestion(state, 1, feedback), false);
    assert.equal(reduce(state, { type: 'go', index: 1 }, options), state);
  }
});

test('after-submit quiz supports changing answers and visiting unanswered questions', () => {
  const options = config('quiz', 'after-submit');
  let state = startSession(deck, options);
  state = reduce(state, { type: 'answer', itemId: 'q1', answerId: 'b' }, options);
  state = reduce(state, { type: 'answer', itemId: 'q1', answerId: 'a' }, options);
  state = reduce(state, { type: 'go', index: 2 }, options);
  assert.equal(reduce(state, { type: 'answer', itemId: 'q2', answerId: 'a' }, options), state);
  assert.equal(
    reduce(state, { type: 'answer', itemId: 'q3', answerId: 'invalid' }, options),
    state,
  );
  state = reduce(state, { type: 'answer', itemId: 'q3', answerId: 'b' }, options);
  assert.equal(state.submitted, false);
  state = reduce(state, { type: 'submit' }, options);
  assert.deepEqual(quizResult(deck, state.ids, state.answers), {
    correct: 1,
    total: 3,
    incorrect: ['q2', 'q3'],
    unanswered: 1,
  });
});

test('retry targets and new sessions are isolated without mutating the deck', () => {
  const original = JSON.stringify(deck);
  const state = startSession(deck, { ...config('review'), shuffle: true, limit: 1 }, [
    'c2',
    'missing',
  ]);
  assert.deepEqual(state.ids, ['c2']);
  assert.deepEqual(startSession(deck, config(), []).ids, []);
  assert.deepEqual(startSession(deck, config()).decisions, {});
  assert.equal(JSON.stringify(deck), original);
});

test('local review suggestions and elapsed time have exact boundaries', () => {
  assert.equal(suggestReview('again', 100).dueAt, 600100);
  assert.equal(suggestReview('remembered', 100).dueAt, 86400100);
  assert.equal(formatDuration(65.9), '1:05');
  assert.equal(formatDuration(-3), '0:00');
});

test('statistics use local period bounds and weighted accuracy including unanswered', () => {
  const now = new Date(2026, 9, 10, 12).getTime();
  const start = new Date(2026, 9, 4).getTime();
  const record = (id, finishedAt, itemIds, answers = {}, mode = 'quiz') => ({
    id,
    deckId: 'test',
    mode,
    finishedAt,
    durationSeconds: 1,
    itemIds,
    answers,
    decisions: {},
  });
  const records = [
    record('outside', start - 1, ['q1'], { q1: 'a' }),
    record('first', start, ['q1'], { q1: 'a' }),
    record('today', now, ['q1', 'q2', 'q3'], { q1: 'a', q2: 'b' }),
    record('cards', now, ['c1', 'c2'], {}, 'review'),
    record('future', now + 1, ['q1'], { q1: 'a' }),
  ];
  const stats = learningStatistics([deck], records, 7, now);
  assert.equal(stats.quizzes, 2);
  assert.equal(stats.accuracy, 50);
  assert.equal(stats.cards, 2);
  assert.equal(stats.studyDays, 2);
  assert.equal(stats.activity[0].count, 1);
  assert.equal(stats.activity[6].count, 5);
  assert.equal(learningStatistics([deck], [], null, now).accuracy, null);
  assert.equal(learningStatistics([deck], records, null, now).quizzes, 3);
});

test('statistics resolve question identity within its deck and ignore removed content', () => {
  const otherDeck = {
    ...deck,
    id: 'other',
    questions: deck.questions.map((question) => ({ ...question, correctId: 'b' })),
  };
  const now = Date.now();
  const records = ['test', 'other', 'deleted'].map((deckId) => ({
    id: deckId,
    deckId,
    mode: 'quiz',
    finishedAt: now,
    durationSeconds: 1,
    itemIds: ['q1'],
    answers: { q1: 'a' },
    decisions: {},
  }));
  const result = learningStatistics([deck, otherDeck], records, null, now);
  assert.equal(result.quizzes, 3);
  assert.equal(result.accuracy, 50);
});
