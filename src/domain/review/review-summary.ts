import type { LearningDeck } from '../content/learning';
import type { ReviewSchedule } from './learning-session';

/** A single definition of due/practice/mastery for Library, Review and Progress. */
export function deckReviewSummary(
  deck: LearningDeck,
  schedules: Readonly<Record<string, ReviewSchedule>>,
  now: number,
) {
  const dueIds: string[] = [];
  const practiceIds: string[] = [];
  let remembered = 0;
  for (const card of deck.cards) {
    const schedule = schedules[card.id];
    if (!schedule || schedule.dueAt <= now) dueIds.push(card.id);
    if (schedule?.decision === 'again') practiceIds.push(card.id);
    if (schedule?.decision === 'remembered') remembered++;
  }
  return {
    dueIds,
    practiceIds,
    remembered,
    progress: deck.cards.length ? (remembered / deck.cards.length) * 100 : 0,
  };
}
