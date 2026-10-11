import { StyleSheet, View } from 'react-native';
import {
  AppText,
  Button,
  ProgressBar,
  colors,
  radius,
  spacing,
  useResponsiveLayout,
} from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import type { StudyMode } from '@/domain/review/learning-session';
import type { deckReviewSummary } from '@/domain/review/review-summary';
import { useTranslation } from '@/shared/i18n';
import { LibraryArtwork } from './LibraryArtwork';

export function DeckOverview({
  deck,
  summary,
  onStart,
}: {
  deck: LearningDeck;
  summary: ReturnType<typeof deckReviewSummary>;
  onStart: (mode: StudyMode, ids?: readonly string[]) => void;
}) {
  const { t, formatNumber, formatPercent } = useTranslation();
  const { compact, largeText } = useResponsiveLayout();
  return (
    <View style={styles.card}>
      <View style={[styles.heading, largeText && styles.stack]}>
        <View style={styles.cover}>
          <LibraryArtwork name="stack-books" size={56} />
        </View>
        <View style={styles.title}>
          <AppText variant={compact ? 'h3' : 'h2'} accessibilityRole="header">
            {deck.title}
          </AppText>
          <View style={styles.subject}>
            <AppText variant="bodySmall" style={styles.orange}>
              {deck.subject}
            </AppText>
          </View>
          <AppText variant="bodySmall" tone="secondary">
            {t('common.questions', { count: deck.questions.length })}
          </AppText>
        </View>
      </View>
      <View style={[styles.metrics, largeText && styles.stack]}>
        {[
          { value: formatNumber(deck.cards.length), label: t('deck.cardCount') },
          { value: formatNumber(summary.dueIds.length), label: t('learning.due') },
          { value: formatPercent(summary.progress), label: t('deck.recalled') },
        ].map((metric) => (
          <View key={metric.label} style={styles.metric}>
            <AppText variant="number">{metric.value}</AppText>
            <AppText variant="caption" tone="secondary" style={styles.center}>
              {metric.label}
            </AppText>
          </View>
        ))}
      </View>
      <ProgressBar
        value={summary.progress}
        showLabel={false}
        label={t('deck.recalled')}
        appearance="expressive"
      />
      <View style={[styles.actions, (compact || largeText) && styles.stack]}>
        <Button
          label={
            summary.dueIds.length
              ? t('deck.reviewCards', { count: summary.dueIds.length })
              : t('learning.startCards')
          }
          variant="tinted"
          style={styles.action}
          disabled={!deck.cards.length}
          onPress={() =>
            onStart(
              summary.dueIds.length ? 'review' : 'flashcard',
              summary.dueIds.length ? summary.dueIds : undefined,
            )
          }
        />
        <Button
          label={t('learning.startQuiz')}
          variant="soft"
          style={styles.action}
          disabled={!deck.questions.length}
          onPress={() => onStart('quiz')}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  heading: { flexDirection: 'row', gap: spacing.lg, alignItems: 'flex-start' },
  cover: {
    width: 72,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.surface.warm,
  },
  title: { flex: 1, minWidth: 0, gap: spacing.sm },
  subject: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brand.soft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  orange: { color: colors.brand.deep },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metric: { flex: 1, minWidth: 64, alignItems: 'center', gap: spacing.xs },
  center: { textAlign: 'center' },
  actions: { flexDirection: 'row', gap: spacing.md },
  action: { flex: 1, paddingHorizontal: spacing.lg },
  stack: { flexDirection: 'column', alignItems: 'stretch' },
});
