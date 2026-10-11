import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  AppText,
  Screen,
  SegmentedControl,
  StateView,
  colors,
  radius,
  spacing,
} from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import { quizResult } from '@/domain/review/learning-session';
import type { SessionRecord } from '@/domain/review/learning-session';
import { useCurrentTime } from '@/shared/hooks/useCurrentTime';
import { useTranslation } from '@/shared/i18n';
import { ProgressHeader } from '../components/ProgressHeader';
import { ProgressIcon } from '../components/ProgressIcon';

export function HistoryScreen({
  decks,
  records,
  onBack,
  onRecord,
  onStudy,
}: {
  decks: readonly LearningDeck[];
  records: readonly SessionRecord[];
  onBack: () => void;
  onRecord: (id: string) => void;
  onStudy: () => void;
}) {
  const { t, formatNumber, formatDate, formatDateTime } = useTranslation();
  const [filter, setFilter] = useState('all');
  const now = useCurrentTime();
  const selected = records
    .filter(
      (record) =>
        record.finishedAt <= now &&
        (filter === 'all' || (filter === 'quiz' ? record.mode === 'quiz' : record.mode !== 'quiz')),
    )
    .sort((a, b) => b.finishedAt - a.finishedAt);
  const groups = new Map<string, SessionRecord[]>();
  for (const record of selected) {
    const day = new Date(record.finishedAt).toDateString();
    const group = groups.get(day) ?? [];
    group.push(record);
    groups.set(day, group);
  }
  return (
    <Screen includeTopInset>
      <ProgressHeader title={t('learning.history')} onBack={onBack} />
      <AppText tone="secondary">{t('progress.historyBody')}</AppText>
      <SegmentedControl
        label={t('learning.history')}
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: t('learning.all') },
          { value: 'flashcard', label: t('learning.cards') },
          { value: 'quiz', label: t('learning.quiz') },
        ]}
      />
      {[...groups.entries()].map(([day, group]) => (
        <View key={day} style={styles.group}>
          <AppText variant="h4" accessibilityRole="header">
            {formatDate(group[0]!.finishedAt, { dateStyle: 'medium' })}
          </AppText>
          {group.map((record) => {
            const deck = decks.find((item) => item.id === record.deckId);
            const quiz = record.mode === 'quiz';
            const good =
              quiz && deck
                ? quizResult(deck, record.itemIds, record.answers).correct
                : Object.values(record.decisions).filter((value) => value === 'remembered').length;
            return (
              <Pressable
                key={record.id}
                accessibilityRole="button"
                onPress={() => onRecord(record.id)}
                style={styles.card}
              >
                <View style={[styles.cover, quiz && styles.quizCover]}>
                  <ProgressIcon name={quiz ? 'quiz/quiz' : 'flashcards-vocabulary/flashcard'} />
                </View>
                <View style={styles.grow}>
                  <AppText variant="h4">{deck?.title ?? t('learning.missingDeck')}</AppText>
                  <AppText variant="caption" style={styles.orange}>
                    {t(quiz ? 'learning.quiz' : 'learning.flashcard')}
                  </AppText>
                  <AppText variant="caption" tone="secondary">
                    {formatDateTime(record.finishedAt)}
                  </AppText>
                  <AppText variant="bodySmall">
                    {t(quiz ? 'progress.correctSummary' : 'progress.recallSummary', {
                      good: formatNumber(good),
                      total: formatNumber(record.itemIds.length),
                    })}
                  </AppText>
                </View>
                <ProgressIcon name="navigation-system/forward" />
              </Pressable>
            );
          })}
        </View>
      ))}
      {!selected.length ? (
        <StateView
          status="empty"
          title={t('learning.noHistory')}
          message={t('learning.noHistoryBody')}
          actionLabel={t('session.startReview')}
          onAction={onStudy}
        />
      ) : null}
    </Screen>
  );
}
const styles = StyleSheet.create({
  group: { gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface.card,
    padding: spacing.lg,
    borderRadius: radius.card,
  },
  cover: {
    width: 48,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.brand.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizCover: { backgroundColor: colors.topic.yellow.background },
  grow: { flex: 1, minWidth: 0, gap: spacing.sm },
  orange: { color: colors.brand.deep },
});
