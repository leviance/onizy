import { useState } from 'react';
import { Screen, StateView } from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import type { ReviewSchedule, SessionRecord } from '@/domain/review/learning-session';
import { buildReviewQueue } from '@/domain/review/review-queue';
import { useTranslation } from '@/shared/i18n';
import { StudyScreen } from './StudyScreen';

export function ReviewBatchScreen({
  decks,
  schedules,
  deckIds,
  onComplete,
  onExit,
  onProgress,
}: {
  decks: readonly LearningDeck[];
  schedules: Readonly<Record<string, ReviewSchedule>>;
  deckIds: readonly string[];
  onComplete: (record: SessionRecord) => void;
  onExit: () => void;
  onProgress: () => void;
}) {
  const { t } = useTranslation();
  // Keep scope stable as completing earlier decks changes provider schedules.
  const [queue] = useState(() =>
    buildReviewQueue(
      decks.filter((deck) => deckIds.includes(deck.id)),
      schedules,
      Date.now(),
    ).map((entry) => ({ deckId: entry.deck.id, ids: entry.ids })),
  );
  const [index, setIndex] = useState(0);
  const entry = queue[index];
  if (!entry)
    return (
      <Screen includeTopInset>
        <StateView
          status="complete"
          title={t('learning.reviewDone')}
          actionLabel={t('session.backReview')}
          onAction={onExit}
        />
      </Screen>
    );
  return (
    <StudyScreen
      key={entry.deckId}
      deck={decks.find((deck) => deck.id === entry.deckId)}
      mode="review"
      targetIds={entry.ids}
      onComplete={onComplete}
      onExit={onExit}
      onProgress={onProgress}
      returnDestination="review"
      onNextDeck={index + 1 < queue.length ? () => setIndex((value) => value + 1) : undefined}
    />
  );
}
