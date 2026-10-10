import assert from 'node:assert/strict';
import test from 'node:test';
import { initialDecks } from '../../../application/data/learning-decks.ts';
import { locales } from '../../../shared/i18n/resources.ts';
import { buildHomeData } from './home-data.ts';

const now = new Date(2026, 9, 10, 12).getTime();
const build = (overrides = {}) =>
  buildHomeData({
    development: false,
    decks: [],
    records: [],
    schedules: {},
    now,
    translate: (key) => locales.en.messages[key],
    ...overrides,
  });

test('release Home has no fixtures, preview streak, goal or invented statistics', () => {
  for (const decks of [[], initialDecks]) {
    const data = build({ decks });
    assert.deepEqual(data.decks, []);
    assert.equal(data.dailyGoal, null);
    assert.equal(data.activity.cards, 0);
    assert.equal(data.activity.quizzes, 0);
    assert.equal(data.activity.accuracy, null);
  }
});

test('development keeps localized deck previews and illustrative activity', () => {
  const data = build({ development: true, decks: initialDecks });
  assert.equal(data.decks.length, 4);
  assert.equal(data.decks[0].title, 'Everyday English');
  assert.equal(data.decks[0].cardCount, 120);
  assert.deepEqual(data.dailyGoal, { streakDays: 12, completed: 24, total: 40, deckId: 'english' });
  assert.deepEqual(data.activity, { cards: 120, quizzes: 5, accuracy: 92 });
});

test('release routes quiz-only content to Quiz with its real question count', () => {
  const deck = { ...initialDecks[0], id: 'quiz-only', sample: false, cards: [] };
  const data = build({ decks: [deck] });
  assert.equal(data.decks[0].studyMode, 'quiz');
  assert.equal(data.decks[0].questionCount, deck.questions.length);
  assert.equal(data.decks[0].cardCount, 0);
  assert.equal(data.decks[0].dueCount, 0);
  assert.equal(data.decks[0].progress, 0);
});

test('release uses actual content, review schedules and today’s valid deck activity', () => {
  const deck = { ...initialDecks[0], sample: false, title: 'My own words', subject: 'My topic' };
  const card = deck.cards[0];
  const data = build({
    decks: [deck, initialDecks[1]],
    schedules: { [card.id]: { decision: 'remembered', reviewedAt: now, dueAt: now + 86_400_000 } },
    records: [
      { deckId: deck.id, mode: 'flashcard', finishedAt: now, itemIds: [card.id], answers: {} },
      {
        deckId: deck.id,
        mode: 'quiz',
        finishedAt: now,
        itemIds: [deck.questions[0].id],
        answers: { [deck.questions[0].id]: deck.questions[0].correctId },
      },
      {
        deckId: initialDecks[1].id,
        mode: 'flashcard',
        finishedAt: now,
        itemIds: ['fixture-card'],
        answers: {},
      },
      {
        deckId: deck.id,
        mode: 'flashcard',
        finishedAt: now - 86_400_000,
        itemIds: [card.id],
        answers: {},
      },
    ],
  });
  assert.equal(data.decks.length, 1);
  assert.equal(data.decks[0].title, deck.title);
  assert.equal(data.decks[0].subject, deck.subject);
  assert.equal(data.decks[0].cardCount, 2);
  assert.equal(data.decks[0].dueCount, 1);
  assert.equal(data.decks[0].progress, 50);
  assert.equal(data.dailyGoal, null);
  assert.equal(data.activity.cards, 1);
  assert.equal(data.activity.quizzes, 1);
  assert.equal(data.activity.accuracy, 100);
});
