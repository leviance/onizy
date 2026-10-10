import type { LearningDeck } from '../content/learning';

export type StudyMode = 'flashcard' | 'quiz' | 'review';
export type FeedbackTiming = 'immediate' | 'after-submit';
export type RecallDecision = 'again' | 'remembered';
export type SessionConfig = {
  mode: StudyMode;
  feedback: FeedbackTiming;
  limit: number;
  shuffle: boolean;
};
export type SessionState = {
  ids: readonly string[];
  index: number;
  revealed: boolean;
  answers: Readonly<Record<string, string>>;
  decisions: Readonly<Record<string, RecallDecision>>;
  submitted: boolean;
};
export type SessionAction =
  | { type: 'flip' }
  | { type: 'decide'; decision: RecallDecision; itemId: string }
  | { type: 'answer'; itemId: string; answerId: string }
  | { type: 'go'; index: number }
  | { type: 'submit' };
export type SessionRecord = {
  id: string;
  deckId: string;
  mode: StudyMode;
  finishedAt: number;
  durationSeconds: number;
  itemIds: readonly string[];
  answers: Readonly<Record<string, string>>;
  decisions: Readonly<Record<string, RecallDecision>>;
};
export type ReviewSchedule = { decision: RecallDecision; reviewedAt: number; dueAt: number };

export function startSession(
  deck: LearningDeck,
  config: SessionConfig,
  targetIds?: readonly string[],
): SessionState {
  const source = config.mode === 'quiz' ? deck.questions : deck.cards;
  const ids = source
    .filter((item) => !targetIds || targetIds.includes(item.id))
    .map((item) => item.id);
  if (config.shuffle) {
    for (let index = ids.length - 1; index > 0; index--) {
      const swap = Math.floor(Math.random() * (index + 1));
      [ids[index], ids[swap]] = [ids[swap]!, ids[index]!];
    }
  }
  return {
    ids: ids.slice(0, Math.max(0, Math.floor(config.limit))),
    index: 0,
    revealed: false,
    answers: {},
    decisions: {},
    submitted: false,
  };
}

/** All outcomes are keyed by item ID; repeated input cannot count an item twice. */
export function transitionSession(
  state: SessionState,
  action: SessionAction,
  deck: LearningDeck,
  config: SessionConfig,
): SessionState {
  if (state.submitted || !state.ids.length) return state;
  const currentId = state.ids[state.index];
  switch (action.type) {
    case 'flip':
      return config.mode === 'quiz' ? state : { ...state, revealed: !state.revealed };
    case 'decide': {
      if (
        config.mode === 'quiz' ||
        !state.revealed ||
        action.itemId !== currentId ||
        state.decisions[action.itemId]
      )
        return state;
      const decisions = { ...state.decisions, [action.itemId]: action.decision };
      const last = state.index + 1 === state.ids.length;
      return {
        ...state,
        decisions,
        index: last ? state.index : state.index + 1,
        revealed: false,
        submitted: last,
      };
    }
    case 'answer': {
      const question = deck.questions.find((item) => item.id === action.itemId);
      if (
        config.mode !== 'quiz' ||
        action.itemId !== currentId ||
        !question?.choices.some((choice) => choice.id === action.answerId)
      )
        return state;
      if (config.feedback === 'immediate' && state.answers[action.itemId]) return state;
      return { ...state, answers: { ...state.answers, [action.itemId]: action.answerId } };
    }
    case 'go': {
      if (
        config.mode !== 'quiz' ||
        !Number.isInteger(action.index) ||
        action.index < 0 ||
        action.index >= state.ids.length
      )
        return state;
      if (
        config.feedback === 'immediate' &&
        (!state.answers[currentId!] || action.index !== state.index + 1)
      )
        return state;
      return { ...state, index: action.index };
    }
    case 'submit': {
      if (config.mode !== 'quiz') return state;
      if (config.feedback === 'immediate' && state.ids.some((id) => !state.answers[id]))
        return state;
      return { ...state, submitted: true };
    }
  }
}

export function quizResult(
  deck: LearningDeck,
  ids: readonly string[],
  answers: Readonly<Record<string, string>>,
) {
  const questions = ids
    .map((id) => deck.questions.find((question) => question.id === id))
    .filter((question) => question !== undefined);
  const correct = questions.filter(
    (question) => answers[question.id] === question.correctId,
  ).length;
  return {
    correct,
    total: questions.length,
    incorrect: questions
      .filter((question) => answers[question.id] !== question.correctId)
      .map((question) => question.id),
    unanswered: questions.filter((question) => !answers[question.id]).length,
  };
}

/** A simple local review suggestion, not an FSRS calculation or an account schedule. */
export function suggestReview(decision: RecallDecision, now: number): ReviewSchedule {
  return {
    decision,
    reviewedAt: now,
    dueAt: now + (decision === 'again' ? 10 * 60_000 : 24 * 60 * 60_000),
  };
}

export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
