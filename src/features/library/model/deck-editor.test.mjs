import assert from 'node:assert/strict';
import test from 'node:test';
import { createDeckEditor, isDeckEditorDirty, updateDeckEditor } from './deck-editor.ts';
import { buildDeckDraft } from './deck-draft.ts';

test('removing a card preserves the identity and contents of all surviving input rows', () => {
  let draft = updateDeckEditor(createDeckEditor(), { type: 'add-card' });
  const first = draft.cards[0].rowId;
  const second = draft.cards[1].rowId;
  draft = updateDeckEditor(draft, {
    type: 'update-card',
    rowId: second,
    patch: { front: 'Two', back: 'Hai' },
  });
  const survivor = draft.cards[1];
  draft = updateDeckEditor(draft, { type: 'remove-card', rowId: first });
  assert.equal(draft.cards[0], survivor);
  draft = updateDeckEditor(draft, { type: 'add-card' });
  assert.notEqual(draft.cards[1].rowId, first);
  assert.notEqual(draft.cards[1].rowId, second);
  const stale = updateDeckEditor(draft, {
    type: 'update-card',
    rowId: first,
    patch: { front: 'Stale event' },
  });
  assert.equal(stale.cards[0].front, 'Two');
  assert.equal(stale.cards[1].front, '');
});

test('quiz row identity survives deletion and draft metadata does not enter saved content', () => {
  let draft = createDeckEditor();
  for (let i = 0; i < 2; i++) draft = updateDeckEditor(draft, { type: 'add-question' });
  const id = draft.questions[1].rowId;
  draft = updateDeckEditor(draft, {
    type: 'update-question',
    rowId: id,
    patch: {
      question: 'One?',
      choices: ['Một', 'Hai'],
      correctIndex: 1,
      explanation: 'Explanation',
    },
  });
  draft = updateDeckEditor(draft, { type: 'remove-question', rowId: draft.questions[0].rowId });
  draft = updateDeckEditor(draft, { type: 'title', value: ' Quiz ' });
  const question = draft.questions[0];
  assert.equal(question.rowId, id);
  assert.equal(question.correctIndex, 1);
  const deck = buildDeckDraft('deck', draft.title, draft.subject, draft.cards, draft.questions);
  assert.equal(deck.questions[0].correctId, '1');
  assert.equal('rowId' in deck.questions[0], false);
});

test('blank rows are safe to leave while any entered field marks the editor as dirty', () => {
  const blank = updateDeckEditor(createDeckEditor(), { type: 'add-question' });
  assert.equal(isDeckEditorDirty(blank), false);
  const typed = updateDeckEditor(blank, {
    type: 'update-question',
    rowId: blank.questions[0].rowId,
    patch: { choices: ['Typed', '', '', ''] },
  });
  assert.equal(isDeckEditorDirty(typed), true);
  assert.equal(
    isDeckEditorDirty(
      updateDeckEditor(typed, { type: 'remove-question', rowId: typed.questions[0].rowId }),
    ),
    false,
  );
});
