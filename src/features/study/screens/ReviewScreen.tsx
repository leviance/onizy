import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  AppText,
  BottomNavigation,
  Button,
  Dialog,
  IconButton,
  Screen,
  SegmentedControl,
  StateView,
  colors,
  radius,
  spacing,
  useScrollNavigation,
} from '@/design-system';
import type { NavigationKey } from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import type { ReviewSchedule, SessionRecord } from '@/domain/review/learning-session';
import { buildReviewQueue, currentStudyStreak } from '@/domain/review/review-queue';
import { useCurrentTime } from '@/shared/hooks/useCurrentTime';
import { useTranslation } from '@/shared/i18n';
import { StudyIcon } from '../components/StudyIcon';

export function ReviewScreen({
  decks,
  schedules,
  records,
  onStudy,
  onStartQueue,
  onNavigate,
}: {
  decks: readonly LearningDeck[];
  schedules: Readonly<Record<string, ReviewSchedule>>;
  records: readonly SessionRecord[];
  onStudy: (deck: string, ids: readonly string[]) => void;
  onStartQueue: (deckIds: readonly string[]) => void;
  onNavigate: (key: NavigationKey) => void;
}) {
  const { t, formatNumber } = useTranslation();
  const [filter, setFilter] = useState<'due' | 'practice'>('due');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigation = useScrollNavigation({ bottomSafeAreaApplied: true });
  const now = useCurrentTime();
  const hasFlashcards = decks.some((deck) => deck.cards.length);
  const dueQueue = buildReviewQueue(decks, schedules, now);
  const queue = filter === 'due' ? dueQueue : buildReviewQueue(decks, schedules, now, 'practice');
  const total = dueQueue.reduce((count, entry) => count + entry.ids.length, 0);
  const streak = currentStudyStreak(records, now);
  return (
    <View style={styles.root}>
      <Screen
        includeTopInset
        onScroll={navigation.onScroll}
        bottomPadding={navigation.bottomPadding}
      >
        <View style={styles.header}>
          <AppText variant="h2" accessibilityRole="header" style={styles.grow}>
            {t('session.reviewToday')}
          </AppText>
          <IconButton
            icon="bell"
            label={t('home.notifications')}
            onPress={() => setNotificationsOpen(true)}
          />
        </View>
        {total ? (
          <View style={styles.hero}>
            <AppText variant="number" style={styles.inverse}>
              {t('common.reviewDue', { count: total })}
            </AppText>
            <AppText style={styles.inverse}>
              {t('library.decks', { count: dueQueue.length })}
            </AppText>
            <AppText variant="bodySmall" style={styles.inverse}>
              {t('session.queueBody')}
            </AppText>
            <Button
              label={t('session.startReview')}
              variant="link"
              leadingIcon="play"
              style={styles.heroAction}
              onPress={() => onStartQueue(dueQueue.map((entry) => entry.deck.id))}
            />
          </View>
        ) : (
          <StateView
            status={hasFlashcards ? 'complete' : 'empty'}
            title={t(
              !decks.length
                ? 'library.emptyTitle'
                : !hasFlashcards
                  ? 'learning.noFlashcards'
                  : 'learning.reviewDone',
            )}
            message={t(
              !decks.length
                ? 'library.emptyDescription'
                : !hasFlashcards
                  ? 'learning.noFlashcardsBody'
                  : 'session.noDueBody',
            )}
            actionLabel={t(!decks.length ? 'library.create' : 'learning.backLibrary')}
            onAction={() => onNavigate(!decks.length ? 'create' : 'library')}
          />
        )}
        {hasFlashcards ? (
          <View style={styles.group}>
            <AppText variant="h4" accessibilityRole="header">
              {t('session.dueDecks')}
            </AppText>
            <SegmentedControl
              label={t('learning.review')}
              value={filter}
              onChange={(value) => setFilter(value)}
              options={[
                { value: 'due', label: t('learning.due') },
                { value: 'practice', label: t('learning.needsPractice') },
              ]}
            />
            {queue.map(({ deck, ids }) => (
              <Pressable
                key={deck.id}
                accessibilityRole="button"
                accessibilityLabel={
                  deck.title +
                  ', ' +
                  t(filter === 'due' ? 'common.reviewDue' : 'common.cards', { count: ids.length })
                }
                onPress={() => onStudy(deck.id, ids)}
                style={({ pressed }) => [styles.deck, pressed && styles.pressed]}
              >
                <View style={styles.cover}>
                  <StudyIcon name="flashcards-vocabulary/flashcard" />
                </View>
                <View style={styles.grow}>
                  <AppText variant="h4">{deck.title}</AppText>
                  <AppText variant="bodySmall" tone="secondary">
                    {deck.subject}
                  </AppText>
                </View>
                <View style={styles.count}>
                  <AppText variant="h3" style={styles.orange}>
                    {formatNumber(ids.length)}
                  </AppText>
                  <AppText variant="caption" tone="secondary">
                    {t(filter === 'due' ? 'learning.due' : 'learning.needsPractice')}
                  </AppText>
                </View>
                <StudyIcon name="navigation-system/forward" />
              </Pressable>
            ))}
            {!queue.length ? (
              <StateView
                status="complete"
                title={t(filter === 'due' ? 'learning.reviewDone' : 'learning.practiceDone')}
                message={t('session.noDueBody')}
              />
            ) : null}
          </View>
        ) : null}
        {streak ? (
          <View style={styles.streak}>
            <StudyIcon name="statistics-achievements/streak" />
            <View style={styles.grow}>
              <AppText variant="label">{t('home.streak')}</AppText>
              <AppText variant="bodySmall" tone="secondary">
                {t('home.encouragement')}
              </AppText>
            </View>
            <AppText variant="h4" style={styles.green}>
              {t('home.days', { count: streak })}
            </AppText>
          </View>
        ) : null}
      </Screen>
      <BottomNavigation
        active="review"
        visible={navigation.visible}
        hideProgress={navigation.hideProgress}
        appearance="expressive"
        onNavigate={onNavigate}
        onHeightChange={navigation.onNavigationHeightChange}
      />
      <Dialog
        visible={notificationsOpen}
        title={t('home.notifications')}
        message={t('home.noNotifications')}
        onClose={() => setNotificationsOpen(false)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  grow: { flex: 1, minWidth: 0, gap: spacing.xs },
  hero: {
    backgroundColor: colors.explore.primary,
    padding: spacing['2xl'],
    borderRadius: radius.card,
    gap: spacing.lg,
  },
  inverse: { color: colors.text.inverse },
  heroAction: { backgroundColor: colors.surface.card },
  group: { gap: spacing.lg },
  deck: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.surface.card,
  },
  cover: {
    width: 48,
    height: 56,
    backgroundColor: colors.brand.soft,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  count: { gap: spacing.xs, alignItems: 'flex-end', maxWidth: 100 },
  orange: { color: colors.brand.deep },
  green: { color: colors.feedback.success.text },
  pressed: { opacity: 0.8 },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
  },
});
