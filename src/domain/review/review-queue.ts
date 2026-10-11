import type { LearningDeck } from '../content/learning';
import type { ReviewSchedule, SessionRecord } from './learning-session';
import { deckReviewSummary } from './review-summary.ts';

/** Preserve deck order and the canonical due/practice rules for single and batch review. */
export function buildReviewQueue(
  decks: readonly LearningDeck[],
  schedules: Readonly<Record<string, ReviewSchedule>>,
  now: number,
  scope: 'due' | 'practice' = 'due',
) {
  return decks
    .map((deck) => {
      const summary = deckReviewSummary(deck, schedules, now);
      return { deck, summary, ids: scope === 'due' ? summary.dueIds : summary.practiceIds };
    })
    .filter((entry) => entry.ids.length > 0);
}

/** A calendar-day streak can remain active yesterday until today's first completed session. */
export function currentStudyStreak(records: readonly SessionRecord[], now: number) {
  const days = new Set(
    records
      .filter((record) => record.finishedAt <= now)
      .map((record) => new Date(record.finishedAt).toDateString()),
  );
  const day = new Date(now);
  if (!days.has(day.toDateString())) day.setDate(day.getDate() - 1);
  let streak = 0;
  while (days.has(day.toDateString())) {
    streak++;
    day.setDate(day.getDate() - 1);
  }
  return streak;
}
