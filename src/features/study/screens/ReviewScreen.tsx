import { useState } from 'react';
import { View } from 'react-native';
import {
  AppText,
  BottomNavigation,
  Button,
  DeckCard,
  Screen,
  SegmentedControl,
  StateView,
  spacing,
} from '@/design-system';
import type { NavigationKey } from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import type { ReviewSchedule } from '@/domain/review/learning-session';
import { deckReviewSummary } from '@/domain/review/review-summary';
import { useCurrentTime } from '@/shared/hooks/useCurrentTime';
import { useTranslation } from '@/shared/i18n';
import { SessionHeader } from '../components/SessionHeader';

export function ReviewScreen({
  decks,
  schedules,
  onStudy,
  onNavigate,
}: {
  decks: readonly LearningDeck[];
  schedules: Readonly<Record<string, ReviewSchedule>>;
  onStudy: (deck: string, ids: readonly string[]) => void;
  onNavigate: (key: NavigationKey) => void;
}) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('due');
  const [navSpace, setNavSpace] = useState(120);
  const now = useCurrentTime();
  const hasFlashcards = decks.some((deck) => deck.cards.length);
  const queue = decks
    .map((deck) => {
      const summary = deckReviewSummary(deck, schedules, now);
      return {
        deck,
        summary,
        ids: filter === 'due' ? summary.dueIds : summary.practiceIds,
      };
    })
    .filter((item) => item.ids.length);
  return (
    <View style={{ flex: 1 }}>
      <Screen includeTopInset>
        <SessionHeader title={t('learning.review')} onBack={() => onNavigate('home')} />
        <AppText tone="secondary">{t('learning.reviewBody')}</AppText>
        {hasFlashcards ? (
          <SegmentedControl
            label={t('learning.review')}
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'due', label: t('learning.due') },
              { value: 'practice', label: t('learning.needsPractice') },
            ]}
          />
        ) : null}
        {queue.length ? (
          queue.map(({ deck, ids, summary }) => (
            <DeckCard
              key={deck.id}
              title={deck.title}
              subject={deck.subject}
              cardCount={deck.cards.length}
              dueCount={ids.length}
              progress={summary.progress}
              appearance="expressive"
              onOpen={() => onStudy(deck.id, ids)}
            />
          ))
        ) : (
          <StateView
            status={hasFlashcards ? 'complete' : 'empty'}
            title={t(
              !decks.length
                ? 'library.emptyTitle'
                : !hasFlashcards
                  ? 'learning.noFlashcards'
                  : filter === 'due'
                    ? 'learning.reviewDone'
                    : 'learning.practiceDone',
            )}
            message={t(
              !decks.length
                ? 'library.emptyDescription'
                : !hasFlashcards
                  ? 'learning.noFlashcardsBody'
                  : 'learning.reviewDoneBody',
            )}
            {...(!decks.length
              ? {
                  actionLabel: t('library.create'),
                  onAction: () => onNavigate('create'),
                }
              : {})}
          />
        )}
        {hasFlashcards ? (
          <AppText variant="bodySmall" tone="secondary">
            {t('learning.reviewSuggestion')}
          </AppText>
        ) : null}
        <Button
          label={t('learning.backLibrary')}
          variant="soft"
          onPress={() => onNavigate('library')}
        />
        <View style={{ height: navSpace + spacing.lg }} />
      </Screen>
      <BottomNavigation
        active="review"
        appearance="expressive"
        onNavigate={onNavigate}
        onHeightChange={setNavSpace}
      />
    </View>
  );
}
