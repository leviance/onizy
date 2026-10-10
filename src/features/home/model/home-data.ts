import type { LearningDeck } from '@/domain/content/learning';
import type { ReviewSchedule, SessionRecord } from '@/domain/review/learning-session';
import type { TranslationKey } from '@/shared/i18n';
import { learningStatistics } from '../../../domain/review/learning-statistics.ts';
import { deckReviewSummary } from '../../../domain/review/review-summary.ts';
import { normalizeSearch } from '../../../shared/utils/search.ts';
import { sampleActivity, sampleDailyGoal, sampleDecks, topics } from './sample.ts';
import type { HomeDeck } from './sample';

export function buildHomeData({
  development,
  decks,
  records,
  schedules,
  now,
  translate,
}: {
  development: boolean;
  decks: readonly LearningDeck[];
  records: readonly SessionRecord[];
  schedules: Readonly<Record<string, ReviewSchedule>>;
  now: number;
  translate: (key: TranslationKey) => string;
}) {
  // Also reject fixtures here so a future storage adapter cannot expose them on Home.
  const visibleDecks = development ? decks : decks.filter((deck) => !deck.sample);
  const deckIndex = new Map(visibleDecks.map((deck) => [deck.id, deck]));
  const ids = new Set(deckIndex.keys());
  const previewDecks = development
    ? sampleDecks
        .filter((deck) => deckIndex.get(deck.id)?.sample)
        .map((deck) => ({
          ...deck,
          title: translate(deck.title),
          subject: translate(deck.subject),
          questionCount: deckIndex.get(deck.id)?.questions.length ?? 0,
          studyMode: 'flashcard' as const,
        }))
    : [];
  const previewIds = new Set(previewDecks.map((deck) => deck.id));
  const actualDecks: HomeDeck[] = visibleDecks
    .filter((deck) => !previewIds.has(deck.id))
    .map((deck) => {
      const subject = normalizeSearch(deck.subject.trim());
      const matches = (key: TranslationKey) => subject === normalizeSearch(translate(key));
      const topic =
        topics.find((item) => matches(item.label))?.id ??
        (matches('topic.english')
          ? 'vocabulary'
          : matches('topic.biology') || matches('topic.astronomy')
            ? 'science'
            : null);
      const summary = deckReviewSummary(deck, schedules, now);
      return {
        id: deck.id,
        title: deck.title,
        subject: deck.subject,
        topic,
        tone: topic === 'science' ? 'green' : topic === 'vocabulary' ? 'yellow' : 'mint',
        artwork: 'landscape',
        cardCount: deck.cards.length,
        questionCount: deck.questions.length,
        studyMode: deck.cards.length ? 'flashcard' : 'quiz',
        dueCount: summary.dueIds.length,
        progress: summary.progress,
      };
    });
  const stats = learningStatistics(
    visibleDecks,
    records.filter((record) => ids.has(record.deckId)),
    1,
    now,
  );
  return {
    decks: [...previewDecks, ...actualDecks],
    activity: development ? sampleActivity : stats,
    dailyGoal: development && previewIds.has(sampleDailyGoal.deckId) ? sampleDailyGoal : null,
  };
}
