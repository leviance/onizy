import assert from 'node:assert/strict';
import test from 'node:test';
import { buildDeckDraft } from './deck-draft.ts';

const card = { front: ' Hello ', back: ' Xin chào ' };
const question = {
  question: ' Hello nghĩa là? ',
  choices: [' Xin chào ', 'Tạm biệt'],
  correctIndex: 0,
  explanation: ' Lời chào ',
};
const build = (cards = [card], questions = [question]) =>
  buildDeckDraft('custom', ' Bộ mới ', ' Anh ', cards, questions);
test('manual content is trimmed and receives stable unique IDs', () => {
  const deck = build();
  assert.equal(deck.title, 'Bộ mới');
  assert.equal(deck.sample, false);
  assert.equal(deck.cards[0].front, 'Hello');
  assert.equal(deck.questions[0].correctId, '0');
  assert.notEqual(deck.cards[0].id, deck.questions[0].id);
});
test('empty rows are discarded; partially filled content is rejected', () => {
  assert.equal(build([{ front: '', back: '' }], []), null);
  assert.equal(build([card, { front: '', back: '' }], []).cards.length, 1);
  assert.equal(build([{ front: 'Partial', back: '' }], []), null);
  assert.equal(build([], [{ ...question, explanation: '' }]), null);
  assert.equal(buildDeckDraft('id', ' ', '', [card], []), null);
});
test('quiz answers must be distinct and have a valid correct choice', () => {
  for (const correctIndex of [-1, 2, NaN, 0.5])
    assert.equal(build([], [{ ...question, correctIndex }]), null);
  assert.equal(build([], [{ ...question, choices: [' Hello ', 'hello'] }]), null);
  assert.equal(build([], [{ ...question, choices: ['Hello', ' '] }]), null);
});
test('a deck can contain only cards or only quiz questions', () => {
  assert.equal(build([card], []).questions.length, 0);
  assert.equal(build([], [question]).cards.length, 0);
});
