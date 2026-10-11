import type { LearningDeck } from '../content/learning';
import type { ReviewSchedule, SessionRecord } from './learning-session';

/** Only the latest completed attempt determines whether a question still needs practice. */
export function practiceContent(
  decks: readonly LearningDeck[],
  records: readonly SessionRecord[],
  schedules: Readonly<Record<string, ReviewSchedule>>,
  now: number,
) {
  return decks
    .flatMap((deck) => {
      const latest = new Map<string, SessionRecord>();
      for (const record of records) {
        if (record.deckId !== deck.id || record.mode !== 'quiz' || record.finishedAt > now)
          continue;
        for (const id of record.itemIds) {
          if (!latest.has(id) || latest.get(id)!.finishedAt < record.finishedAt)
            latest.set(id, record);
        }
      }
      return [
        ...deck.cards
          .filter((card) => schedules[card.id]?.decision === 'again')
          .map((card) => ({
            deckId: deck.id,
            deckTitle: deck.title,
            id: card.id,
            mode: 'flashcard' as const,
            title: card.front,
            detail: card.back,
            timestamp: schedules[card.id]!.reviewedAt,
          })),
        ...deck.questions
          .filter((question) => {
            const record = latest.get(question.id);
            return record && record.answers[question.id] !== question.correctId;
          })
          .map((question) => ({
            deckId: deck.id,
            deckTitle: deck.title,
            id: question.id,
            mode: 'quiz' as const,
            title: question.question,
            detail: '',
            timestamp: latest.get(question.id)!.finishedAt,
          })),
      ];
    })
    .sort((a, b) => b.timestamp - a.timestamp);
}
