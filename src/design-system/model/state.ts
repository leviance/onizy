export type ComponentStatus = 'default' | 'loading' | 'empty' | 'error' | 'complete';
export type ComponentStateProps = { status?: ComponentStatus; onRetry?: () => void };

/** Unknown or invalid progress is represented by zero, never by NaN or Infinity. */
export function progressRatio(value: number, total = 100): number {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) return 0;
  return Math.min(1, Math.max(0, value / total));
}

export function isBlockingStatus(status: ComponentStatus): status is 'loading' | 'empty' | 'error' {
  return status === 'loading' || status === 'empty' || status === 'error';
}

export type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect' | 'reviewed';

/** Invalid answer sets must not present a quiz that can never be answered correctly. */
export function getQuizContentStatus(
  choices: readonly { id: string; text: string }[],
  correctId: string,
): 'ready' | 'empty' | 'invalid' {
  if (choices.length === 0) return 'empty';
  const ids = new Set(choices.map((choice) => choice.id));
  return ids.size !== choices.length ||
    !ids.has(correctId) ||
    choices.some((choice) => !choice.id.trim() || !choice.text.trim())
    ? 'invalid'
    : 'ready';
}

/** A submitted single-answer quiz marks the correct choice and the selected wrong choice. */
export function getAnswerState(
  id: string,
  selectedId: string | null,
  correctId: string,
  submitted: boolean,
): AnswerState {
  if (!submitted) return id === selectedId ? 'selected' : 'default';
  if (id === correctId) return 'correct';
  return id === selectedId ? 'incorrect' : 'reviewed';
}
