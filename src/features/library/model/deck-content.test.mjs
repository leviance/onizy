import assert from 'node:assert/strict';
import test from 'node:test';
import { selectDeckContent } from './deck-content.ts';

const deck = {
  cards: [
    { id: 'a', front: 'deadline', back: 'Hạn chót để hoàn thành' },
    { id: 'b', front: 'appointment', back: 'Cuộc hẹn' },
  ],
  questions: [{ id: 'q', question: 'Định nghĩa của deadline là gì?', choices: [] }],
};
test('deck search matches every term across both faces, ignoring Vietnamese accents', () => {
  const before = JSON.stringify(deck);
  assert.deepEqual(
    selectDeckContent(deck, ' HAN deadline ', 'all').cards.map((x) => x.id),
    ['a'],
  );
  assert.equal(selectDeckContent(deck, 'dinh nghia', 'all').questions.length, 1);
  assert.equal(selectDeckContent(deck, 'han appointment', 'all').cards.length, 0);
  assert.equal(JSON.stringify(deck), before);
});
test('filters support question-only decks, empty queries and no matches', () => {
  assert.equal(selectDeckContent(deck, '', 'cards').questions.length, 0);
  assert.equal(selectDeckContent(deck, '', 'questions').cards.length, 0);
  assert.equal(selectDeckContent({ ...deck, cards: [] }, '', 'all').questions.length, 1);
  assert.equal(selectDeckContent(deck, 'unknown', 'all').cards.length, 0);
});
