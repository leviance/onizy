import type { LearningDeck } from '../content/learning';
import { suggestReview } from './learning-session.ts';
import type { ReviewSchedule, SessionRecord } from './learning-session';

export type LearningState = {
  decks: readonly LearningDeck[];
  records: readonly SessionRecord[];
  schedules: Readonly<Record<string, ReviewSchedule>>;
};

export function addLearningDeck(state: LearningState, deck: LearningDeck): LearningState {
  if (state.decks.some((item) => item.id === deck.id)) return state;
  return { ...state, decks: [...state.decks, deck] };
}

/** Only complete, valid sessions enter history. Unanswered quiz questions are allowed. */
export function recordLearningSession(state: LearningState, record: SessionRecord): LearningState {
  if (state.records.some((item) => item.id === record.id)) return state;
  const deck = state.decks.find((item) => item.id === record.deckId);
  const ids = new Set(record.itemIds);
  if (
    !deck ||
    !record.id ||
    !ids.size ||
    ids.size !== record.itemIds.length ||
    !Number.isFinite(record.finishedAt) ||
    !Number.isFinite(record.durationSeconds) ||
    record.durationSeconds < 0
  )
    return state;

  if (record.mode === 'quiz') {
    const questions = new Map(deck.questions.map((item) => [item.id, item]));
    if (
      record.itemIds.some((id) => !questions.has(id)) ||
      Object.keys(record.decisions).length ||
      Object.entries(record.answers).some(
        ([id, answer]) =>
          !ids.has(id) || !questions.get(id)?.choices.some((choice) => choice.id === answer),
      )
    )
      return state;
  } else {
    const cards = new Set(deck.cards.map((card) => card.id));
    if (
      (record.mode !== 'flashcard' && record.mode !== 'review') ||
      Object.keys(record.answers).length ||
      Object.keys(record.decisions).length !== ids.size ||
      record.itemIds.some(
        (id) =>
          !cards.has(id) ||
          (record.decisions[id] !== 'again' && record.decisions[id] !== 'remembered'),
      )
    )
      return state;
  }

  const schedules = { ...state.schedules };
  for (const [id, decision] of Object.entries(record.decisions)) {
    const previous = schedules[id];
    if (!previous || record.finishedAt >= previous.reviewedAt)
      schedules[id] = suggestReview(decision, record.finishedAt);
  }
  return { ...state, schedules, records: [...state.records, record] };
}
