import { useState } from 'react';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AppText,
  BottomNavigation,
  Button,
  IconButton,
  ProgressBar,
  Screen,
  SectionHeading,
  SegmentedControl,
  StateView,
  colors,
  radius,
  spacing,
} from '@/design-system';
import type { NavigationKey } from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import { formatDuration } from '@/domain/review/learning-session';
import type { ReviewSchedule, SessionRecord } from '@/domain/review/learning-session';
import { learningStatistics } from '@/domain/review/learning-statistics';
import { deckReviewSummary } from '@/domain/review/review-summary';
import { useCurrentTime } from '@/shared/hooks/useCurrentTime';
import { useTranslation } from '@/shared/i18n';

export function ProgressScreen({
  decks,
  records,
  schedules,
  onNavigate,
  languageControl,
}: {
  decks: readonly LearningDeck[];
  records: readonly SessionRecord[];
  schedules: Readonly<Record<string, ReviewSchedule>>;
  onNavigate: (key: NavigationKey) => void;
  languageControl?: ReactNode;
}) {
  const { t, formatNumber, formatPercent, formatDate, formatDateTime } = useTranslation();
  const [period, setPeriod] = useState('7');
  const [navSpace, setNavSpace] = useState(120);
  const now = useCurrentTime();
  const data = learningStatistics(decks, records, period === 'all' ? null : Number(period), now);
  const maximum = Math.max(1, ...data.activity.map((day) => day.count));
  const flashcardDecks = decks.filter((deck) => deck.cards.length);
  const metrics = [
    {
      label: t('learning.studyDays'),
      value: formatNumber(data.studyDays),
      background: colors.topic.orange.background,
    },
    {
      label: t('learning.studied'),
      value: formatNumber(data.cards),
      background: colors.topic.green.background,
    },
    {
      label: t('learning.accuracy'),
      value: data.accuracy === null ? '—' : formatPercent(data.accuracy),
      background: colors.topic.blue.background,
    },
  ];
  return (
    <View style={{ flex: 1 }}>
      <Screen includeTopInset>
        <View style={styles.header}>
          <IconButton icon="back" label={t('common.back')} onPress={() => onNavigate('home')} />
          <AppText variant="h3" accessibilityRole="header" style={{ flex: 1 }}>
            {t('learning.progress')}
          </AppText>
        </View>
        <AppText tone="secondary">{t('learning.progressBody')}</AppText>
        {languageControl}
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
        <View style={styles.metrics}>
          {metrics.map((metric) => (
            <View
              key={metric.label}
              style={[styles.metric, { backgroundColor: metric.background }]}
            >
              <AppText variant="h3">{metric.value}</AppText>
              <AppText variant="caption" tone="secondary" style={{ textAlign: 'center' }}>
                {metric.label}
              </AppText>
            </View>
          ))}
        </View>
        <SectionHeading title={t('learning.activity')} decorate={false} />
        <View style={styles.chart}>
          {data.activity.map((day, index) => (
            <View
              key={day.timestamp}
              style={styles.column}
              accessibilityLabel={`${formatDate(day.timestamp)}: ${formatNumber(day.count)}`}
            >
              <AppText variant="caption">{formatNumber(day.count)}</AppText>
              <View style={styles.track}>
                <View
                  style={{
                    height: day.count ? `${(day.count / maximum) * 100}%` : 2,
                    width: '100%',
                    backgroundColor: day.count
                      ? index === 6
                        ? colors.explore.primary
                        : colors.explore.green
                      : colors.border.default,
                    borderRadius: radius.sm,
                  }}
                />
              </View>
              <AppText variant="caption" tone="secondary">
                {formatDate(day.timestamp, { weekday: 'short' })}
              </AppText>
            </View>
          ))}
        </View>
        <SectionHeading title={t('learning.mastery')} decorate={false} />
        {flashcardDecks.length ? (
          flashcardDecks.map((deck) => (
            <View key={deck.id} style={styles.deck}>
              <AppText variant="label">{deck.title}</AppText>
              <ProgressBar
                value={deckReviewSummary(deck, schedules, now).remembered}
                total={deck.cards.length}
                label={t('learning.remembered')}
                appearance="expressive"
              />
            </View>
          ))
        ) : (
          <StateView
            status="empty"
            title={t(!decks.length ? 'library.emptyTitle' : 'learning.noFlashcards')}
            message={t(!decks.length ? 'library.emptyDescription' : 'learning.noFlashcardsBody')}
            actionLabel={t('library.create')}
            onAction={() => onNavigate('create')}
          />
        )}
        <SectionHeading title={t('learning.history')} decorate={false} />
        {data.selected.length ? (
          [...data.selected]
            .sort((first, second) => second.finishedAt - first.finishedAt)
            .slice(0, 10)
            .map((record) => (
              <View key={record.id} style={styles.deck}>
                <AppText variant="label">
                  {decks.find((deck) => deck.id === record.deckId)?.title}
                </AppText>
                <AppText variant="bodySmall" tone="secondary">
                  {t(
                    record.mode === 'quiz'
                      ? 'learning.quiz'
                      : record.mode === 'review'
                        ? 'learning.review'
                        : 'learning.flashcard',
                  )}{' '}
                  · {formatNumber(record.itemIds.length)} · {formatDuration(record.durationSeconds)}
                </AppText>
                <AppText variant="caption" tone="secondary">
                  {formatDateTime(record.finishedAt)}
                </AppText>
              </View>
            ))
        ) : (
          <StateView
            status="empty"
            title={t('learning.noHistory')}
            message={t('learning.noHistoryBody')}
          />
        )}
        <Button
          label={t('learning.backLibrary')}
          variant="tinted"
          onPress={() => onNavigate('library')}
        />
        <AppText variant="caption" tone="secondary">
          {t('learning.sessionOnly')}
        </AppText>
        <View style={{ height: navSpace + spacing.lg }} />
      </Screen>
      <BottomNavigation
        active="profile"
        appearance="expressive"
        onNavigate={onNavigate}
        onHeightChange={setNavSpace}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metric: {
    flex: 1,
    minWidth: 88,
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  chart: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.xl,
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
  },
  column: { flex: 1, minWidth: 18, alignItems: 'center', gap: spacing.sm },
  track: { height: 120, width: '80%', justifyContent: 'flex-end' },
  deck: {
    backgroundColor: colors.surface.card,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
});
