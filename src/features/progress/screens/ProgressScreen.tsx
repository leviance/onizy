import { useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  AppText,
  BottomNavigation,
  Button,
  ProgressBar,
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
import { learningStatistics } from '@/domain/review/learning-statistics';
import { currentStudyStreak } from '@/domain/review/review-queue';
import { deckReviewSummary } from '@/domain/review/review-summary';
import { studyActivity } from '@/domain/review/study-activity';
import { useCurrentTime } from '@/shared/hooks/useCurrentTime';
import { useTranslation } from '@/shared/i18n';
import { ActivityChart } from '../components/ActivityChart';
import { ProgressHeader } from '../components/ProgressHeader';
import { ProgressIcon } from '../components/ProgressIcon';

export function ProgressScreen({
  decks,
  records,
  schedules,
  onBack,
  onHistory,
  onPractice,
  onDeck,
  onStudy,
  onNavigate,
  languageControl,
}: {
  decks: readonly LearningDeck[];
  records: readonly SessionRecord[];
  schedules: Readonly<Record<string, ReviewSchedule>>;
  onBack: () => void;
  onHistory: () => void;
  onPractice: () => void;
  onDeck: (id: string) => void;
  onStudy: () => void;
  onNavigate: (key: NavigationKey) => void;
  languageControl?: ReactNode;
}) {
  const { t, formatNumber, formatPercent } = useTranslation();
  const [period, setPeriod] = useState('7');
  const navigation = useScrollNavigation({ bottomSafeAreaApplied: true });
  const now = useCurrentTime();
  const data = learningStatistics(decks, records, period === 'all' ? null : Number(period), now);
  const activity = studyActivity(records, period === '7' ? 7 : 30, now);
  const streak = currentStudyStreak(records, now);
  const metrics = [
    {
      name: 'flashcards-vocabulary/remembered' as const,
      label: t('learning.accuracy'),
      value: data.accuracy === null ? '—' : formatPercent(data.accuracy),
    },
    {
      name: 'flashcards-vocabulary/flashcard' as const,
      label: t('learning.studied'),
      value: formatNumber(data.cards),
    },
    {
      name: 'quiz/quiz' as const,
      label: t('learning.quizCount'),
      value: formatNumber(data.quizzes),
    },
  ];
  const flashcardDecks = decks.filter((deck) => deck.cards.length);
  return (
    <View style={{ flex: 1 }}>
      <Screen
        includeTopInset
        onScroll={navigation.onScroll}
        bottomPadding={navigation.bottomPadding}
      >
        <ProgressHeader title={t('learning.progress')} onBack={onBack} />
        <AppText tone="secondary">{t('learning.progressBody')}</AppText>
        <SegmentedControl
          label={t('learning.progress')}
          value={period}
          onChange={setPeriod}
          options={[
            { value: '7', label: t('learning.week') },
            { value: '30', label: t('learning.month') },
            { value: 'all', label: t('learning.all') },
          ]}
        />
        <View style={styles.summary}>
          <View style={styles.row}>
            <View style={styles.grow}>
              <AppText variant="h4">{t('progress.summary')}</AppText>
              <AppText variant="bodySmall" tone="secondary">
                {t('learning.studyDays')}: {formatNumber(data.studyDays)}
              </AppText>
            </View>
            {streak ? (
              <View style={styles.streak}>
                <ProgressIcon name="statistics-achievements/streak" />
                <AppText variant="label" style={styles.orange}>
                  {t('home.days', { count: streak })}
                </AppText>
              </View>
            ) : null}
          </View>
          <View style={styles.metrics}>
            {metrics.map((metric) => (
              <View key={metric.label} style={styles.metric}>
                <ProgressIcon name={metric.name} />
                <AppText variant="h3">{metric.value}</AppText>
                <AppText variant="caption" tone="secondary">
                  {metric.label}
                </AppText>
              </View>
            ))}
          </View>
          {data.accuracy === null ? (
            <AppText variant="caption" tone="secondary">
              {t('progress.accuracyBody')}
            </AppText>
          ) : null}
        </View>
        {!data.selected.length ? (
          <StateView
            status="empty"
            title={t('learning.noHistory')}
            message={t('learning.noHistoryBody')}
            actionLabel={t('session.startReview')}
            onAction={onStudy}
          />
        ) : null}
        <ActivityChart data={activity} />
        <View style={styles.row}>
          <AppText variant="h4" accessibilityRole="header" style={styles.grow}>
            {t('learning.mastery')}
          </AppText>
          <Button label={t('progress.openHistory')} variant="link" onPress={onHistory} />
        </View>
        {flashcardDecks.map((deck) => (
          <Pressable
            key={deck.id}
            accessibilityRole="button"
            onPress={() => onDeck(deck.id)}
            style={styles.deck}
          >
            <View style={styles.row}>
              <View style={styles.cover}>
                <ProgressIcon name="flashcards-vocabulary/flashcard" />
              </View>
              <View style={styles.grow}>
                <AppText variant="label">{deck.title}</AppText>
                <AppText variant="bodySmall" tone="secondary">
                  {deck.subject}
                </AppText>
              </View>
              <ProgressIcon name="navigation-system/forward" />
            </View>
            <ProgressBar
              value={deckReviewSummary(deck, schedules, now).remembered}
              total={deck.cards.length}
              label={t('learning.remembered')}
              tone="green"
            />
          </Pressable>
        ))}
        {!flashcardDecks.length ? (
          <AppText variant="bodySmall" tone="secondary">
            {t('learning.noFlashcardsBody')}
          </AppText>
        ) : null}
        <Button
          label={t('learning.needsPractice')}
          variant="soft"
          trailingIcon="arrow"
          onPress={onPractice}
        />
        {languageControl}
      </Screen>
      <BottomNavigation
        active="profile"
        visible={navigation.visible}
        hideProgress={navigation.hideProgress}
        appearance="expressive"
        onNavigate={onNavigate}
        onHeightChange={navigation.onNavigationHeightChange}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.md },
  grow: { flex: 1, minWidth: 0, gap: spacing.xs },
  summary: {
    backgroundColor: colors.surface.card,
    padding: spacing.xl,
    borderRadius: radius.card,
    gap: spacing.xl,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.brand.soft,
  },
  orange: { color: colors.brand.deep },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metric: { flex: 1, minWidth: 80, padding: spacing.md, gap: spacing.md },
  deck: {
    backgroundColor: colors.surface.card,
    padding: spacing.xl,
    borderRadius: radius.card,
    gap: spacing.lg,
  },
  cover: {
    width: 48,
    height: 48,
    backgroundColor: colors.brand.soft,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
