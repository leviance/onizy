import type { LearningDeck } from '../content/learning';
import type { SessionRecord } from './learning-session';

export function learningStatistics(
  decks: readonly LearningDeck[],
  records: readonly SessionRecord[],
  days: number | null,
  now: number,
) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const since = new Date(today);
  if (days !== null) since.setDate(since.getDate() - Math.max(0, days - 1));
  const selected = records.filter(
    (record) => record.finishedAt <= now && (days === null || record.finishedAt >= since.getTime()),
  );
  const quizzes = selected.filter((record) => record.mode === 'quiz');
  let answered = 0;
  let correct = 0;
  const questionIndex = new Map(
    decks.map((deck) => [
      deck.id,
      new Map(deck.questions.map((question) => [question.id, question])),
    ]),
  );
  for (const record of quizzes)
    for (const id of record.itemIds) {
      const question = questionIndex.get(record.deckId)?.get(id);
      if (question) {
        answered++;
        if (record.answers[id] === question.correctId) correct++;
      }
    }
  const activity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - 6 + index);
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return {
      timestamp: date.getTime(),
      count: selected
        .filter(
          (record) => record.finishedAt >= date.getTime() && record.finishedAt < next.getTime(),
        )
        .reduce((count, record) => count + record.itemIds.length, 0),
    };
  });
  return {
    selected,
    activity,
    studyDays: new Set(selected.map((record) => new Date(record.finishedAt).toDateString())).size,
    cards: selected
      .filter((record) => record.mode !== 'quiz')
      .reduce((count, record) => count + record.itemIds.length, 0),
    quizzes: quizzes.length,
    accuracy: answered ? Math.round((correct / answered) * 100) : null,
  };
}
