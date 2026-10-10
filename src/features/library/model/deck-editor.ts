import type { CardDraft, QuestionDraft } from './deck-draft';

type DraftRow<T> = T & { rowId: string };
export type DeckEditorState = {
  title: string;
  subject: string;
  cards: readonly DraftRow<CardDraft>[];
  questions: readonly DraftRow<QuestionDraft>[];
  nextRowId: number;
};
export type DeckEditorAction =
  | { type: 'title' | 'subject'; value: string }
  | { type: 'add-card' | 'add-question' }
  | { type: 'remove-card' | 'remove-question'; rowId: string }
  | { type: 'update-card'; rowId: string; patch: Partial<CardDraft> }
  | { type: 'update-question'; rowId: string; patch: Partial<QuestionDraft> };

export function createDeckEditor(): DeckEditorState {
  return {
    title: '',
    subject: '',
    cards: [{ rowId: 'row-0', front: '', back: '' }],
    questions: [],
    nextRowId: 1,
  };
}

export function updateDeckEditor(
  state: DeckEditorState,
  action: DeckEditorAction,
): DeckEditorState {
  switch (action.type) {
    case 'title':
    case 'subject':
      return { ...state, [action.type]: action.value };
    case 'add-card':
      return {
        ...state,
        nextRowId: state.nextRowId + 1,
        cards: [...state.cards, { rowId: `row-${state.nextRowId}`, front: '', back: '' }],
      };
    case 'add-question':
      return {
        ...state,
        nextRowId: state.nextRowId + 1,
        questions: [
          ...state.questions,
          {
            rowId: `row-${state.nextRowId}`,
            question: '',
            choices: ['', '', '', ''],
            correctIndex: 0,
            explanation: '',
          },
        ],
      };
    case 'remove-card':
      return { ...state, cards: state.cards.filter((row) => row.rowId !== action.rowId) };
    case 'remove-question':
      return { ...state, questions: state.questions.filter((row) => row.rowId !== action.rowId) };
    case 'update-card':
      return {
        ...state,
        cards: state.cards.map((row) =>
          row.rowId === action.rowId ? { ...row, ...action.patch } : row,
        ),
      };
    case 'update-question':
      return {
        ...state,
        questions: state.questions.map((row) =>
          row.rowId === action.rowId ? { ...row, ...action.patch } : row,
        ),
      };
  }
}

export function isDeckEditorDirty(state: DeckEditorState): boolean {
  return !!(
    state.title.trim() ||
    state.subject.trim() ||
    state.cards.some((card) => card.front.trim() || card.back.trim()) ||
    state.questions.some(
      (question) =>
        question.question.trim() ||
        question.explanation.trim() ||
        question.choices.some((choice) => choice.trim()),
    )
  );
}
