import assert from 'node:assert/strict';
import test from 'node:test';
import { createInitialLearningData, initialDecks, localizeDemoDeck } from './learning-decks.ts';
import { addLearningDeck } from '../../domain/review/learning-state.ts';

test('release starts without sample decks, folder assignments, results or schedules', () => {
  const release = createInitialLearningData(false);
  assert.deepEqual(release, {
    state: { decks: [], records: [], schedules: {} },
    preferences: {},
  });
  const development = createInitialLearningData(true);
  assert.equal(development.state.decks.length, 4);
  assert.ok(development.state.decks.every((deck) => deck.sample));
  assert.equal(development.preferences.english.folder, 'vocabulary');
  assert.deepEqual(createInitialLearningData(false), release);
});

test('release can add user content without restoring fixtures', () => {
  const { state } = createInitialLearningData(false);
  const userDeck = { ...initialDecks[0], id: 'user-deck', sample: false, title: 'My own deck' };
  const updated = addLearningDeck(state, userDeck);
  assert.deepEqual(updated.decks, [userDeck]);
  assert.deepEqual(state.decks, []);
});

test('demo localization preserves card/question identities and correct answers', () => {
  for (const deck of initialDecks) {
    const english = localizeDemoDeck(deck, 'en');
    assert.notEqual(english.title, deck.title);
    assert.deepEqual(
      english.cards.map((card) => card.id),
      deck.cards.map((card) => card.id),
    );
    assert.deepEqual(
      english.questions.map((question) => [question.id, question.correctId]),
      deck.questions.map((question) => [question.id, question.correctId]),
    );
    for (const question of english.questions) {
      assert.ok(question.choices.some((choice) => choice.id === question.correctId));
    }
    assert.deepEqual(localizeDemoDeck(deck, 'vi').cards, deck.cards);
  }
});
test('language switching never translates or rewrites user-authored content', () => {
  const userDeck = { ...initialDecks[0], sample: false, title: 'Nội dung của tôi' };
  assert.equal(localizeDemoDeck(userDeck, 'en'), userDeck);
  assert.equal(userDeck.title, 'Nội dung của tôi');
});
