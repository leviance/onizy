import { StyleSheet, View } from 'react-native';
import { AppText, ProgressBar, StateView, colors, radius, spacing } from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import type { ReviewSchedule, SessionRecord } from '@/domain/review/learning-session';
import { learningStatistics } from '@/domain/review/learning-statistics';
import { useTranslation } from '@/shared/i18n';

export function DeckProgress({
  deck,
  records,
  schedules,
  now,
}: {
  deck: LearningDeck;
  records: readonly SessionRecord[];
  schedules: Readonly<Record<string, ReviewSchedule>>;
  now: number;
}) {
  const { t, formatNumber, formatDateTime } = useTranslation();
  const selected = records.filter((record) => record.deckId === deck.id);
  const stats = learningStatistics([deck], selected, null, now);
  return (
    <View style={styles.group}>
      <View style={styles.metrics}>
        {[
          { label: t('learning.studied'), value: stats.cards },
          { label: t('learning.quizCount'), value: stats.quizzes },
          { label: t('learning.studyDays'), value: stats.studyDays },
        ].map((item) => (
          <View key={item.label} style={styles.metric}>
            <AppText variant="number">{formatNumber(item.value)}</AppText>
            <AppText variant="caption" tone="secondary">
              {item.label}
            </AppText>
          </View>
        ))}
      </View>
      <AppText variant="h4" accessibilityRole="header">
        {t('learning.history')}
      </AppText>
      {selected.length ? (
        [...selected]
          .sort((a, b) => b.finishedAt - a.finishedAt)
          .slice(0, 5)
          .map((record) => (
            <View key={record.id} style={styles.card}>
              <AppText variant="label">
                {t(record.mode === 'quiz' ? 'learning.quiz' : 'learning.flashcard')}
              </AppText>
              <AppText variant="bodySmall" tone="secondary">
                {formatDateTime(record.finishedAt)}
              </AppText>
              <AppText variant="bodySmall">
                {t(record.mode === 'quiz' ? 'common.questions' : 'common.cards', {
                  count: record.itemIds.length,
                })}
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
      {deck.cards.length ? (
        <View style={styles.card}>
          <AppText variant="h4">{t('deck.reviewSchedule')}</AppText>
          {deck.cards
            .filter((card) => schedules[card.id])
            .map((card) => (
              <View key={card.id} style={styles.schedule}>
                <AppText variant="bodySmall" style={styles.grow}>
                  {card.front}
                </AppText>
                <AppText variant="caption" tone="secondary">
                  {formatDateTime(schedules[card.id]!.dueAt)}
                </AppText>
              </View>
            ))}
          {!deck.cards.some((card) => schedules[card.id]) ? (
            <AppText variant="bodySmall" tone="secondary">
              {t('deck.noSchedule')}
            </AppText>
          ) : null}
          <ProgressBar
            value={
              deck.cards.filter((card) => schedules[card.id]?.decision === 'remembered').length
            }
            total={deck.cards.length}
            label={t('deck.recalled')}
          />
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  group: { gap: spacing.lg },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metric: {
    flex: 1,
    minWidth: 88,
    backgroundColor: colors.surface.card,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  card: {
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
  },
  schedule: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  grow: { flexGrow: 1, flexShrink: 1 },
});
