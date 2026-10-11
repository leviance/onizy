import { Pressable, StyleSheet, View } from 'react-native';
import {
  AppText,
  Button,
  Screen,
  colors,
  radius,
  spacing,
  useResponsiveLayout,
} from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import { formatDuration, quizResult, suggestReview } from '@/domain/review/learning-session';
import type { SessionRecord } from '@/domain/review/learning-session';
import { useTranslation } from '@/shared/i18n';
import { AnswerReview } from './AnswerReview';
import { SessionHeader } from './SessionHeader';
import { StudyIcon } from './StudyIcon';

export function SessionResult({
  deck,
  record,
  answersOpen,
  onToggleAnswers,
  onReplay,
  onRetry,
  onProgress,
  onExit,
  onNextDeck,
  exitLabel,
}: {
  deck: LearningDeck;
  record: SessionRecord;
  answersOpen: boolean;
  onToggleAnswers: () => void;
  onReplay: () => void;
  onRetry: (ids: readonly string[]) => void;
  onProgress: () => void;
  onExit: () => void;
  onNextDeck?: (() => void) | undefined;
  exitLabel: string;
}) {
  const { t, formatNumber, formatPercent, formatDateTime } = useTranslation();
  const { wide } = useResponsiveLayout();
  const stackMetrics = !wide;
  const quiz = record.mode === 'quiz';
  const result = quizResult(deck, record.itemIds, record.answers);
  const good = quiz
    ? result.correct
    : Object.values(record.decisions).filter((value) => value === 'remembered').length;
  const missed = quiz
    ? result.incorrect
    : record.itemIds.filter((id) => record.decisions[id] === 'again');
  const nextReview = quiz
    ? null
    : Math.min(
        ...Object.values(record.decisions).map(
          (decision) => suggestReview(decision, record.finishedAt).dueAt,
        ),
      );
  if (answersOpen) return <AnswerReview deck={deck} record={record} onBack={onToggleAnswers} />;
  return (
    <Screen key="result" includeTopInset>
      <SessionHeader title={t('session.resultsTitle')} subtitle={deck.title} onBack={onExit} />
      <View style={styles.intro}>
        <View style={styles.complete}>
          <StudyIcon name="navigation-system/success" />
        </View>
        <AppText variant="h2" accessibilityRole="header">
          {t(quiz ? 'session.answerSummary' : 'learning.result')}
        </AppText>
        <AppText tone="secondary">{t('session.resultBody')}</AppText>
      </View>
      <View style={styles.summary}>
        <AppText variant="display">
          {quiz
            ? formatNumber(good) + ' / ' + formatNumber(record.itemIds.length)
            : formatNumber(record.itemIds.length)}
        </AppText>
        <AppText tone="secondary">{t(quiz ? 'learning.correct' : 'session.totalCards')}</AppText>
        {quiz ? (
          <View style={styles.accuracy}>
            <StudyIcon name="navigation-system/success" />
            <AppText variant="label" style={styles.green}>
              {formatPercent((good / Math.max(1, record.itemIds.length)) * 100)} ·{' '}
              {t('learning.accuracy')}
            </AppText>
          </View>
        ) : null}
        <View style={[styles.metrics, stackMetrics && styles.metricsStack]}>
          {[
            {
              name: quiz ? ('quiz/quiz' as const) : ('flashcards-vocabulary/remembered' as const),
              label: t(quiz ? 'session.totalQuestions' : 'deck.recalled'),
              value: formatNumber(quiz ? record.itemIds.length : good),
            },
            {
              name: 'srs/review' as const,
              label: t('learning.time'),
              value: formatDuration(record.durationSeconds),
            },
            {
              name: 'statistics-achievements/target' as const,
              label: t('learning.improve'),
              value: formatNumber(missed.length),
            },
          ].map((metric) => (
            <View key={metric.label} style={[styles.metric, stackMetrics && styles.metricRow]}>
              <StudyIcon name={metric.name} />
              <AppText variant="h3" style={stackMetrics && styles.metricValue}>
                {metric.value}
              </AppText>
              <AppText variant="caption" tone="secondary" style={stackMetrics && styles.grow}>
                {metric.label}
              </AppText>
            </View>
          ))}
        </View>
      </View>
      {nextReview !== null && Number.isFinite(nextReview) ? (
        <View style={styles.nextReview}>
          <StudyIcon name="srs/calendar" />
          <View style={styles.grow}>
            <AppText variant="caption" tone="secondary">
              {t('session.nextReview')}
            </AppText>
            <AppText variant="label">{formatDateTime(nextReview)}</AppText>
          </View>
        </View>
      ) : null}
      {missed.length ? (
        <View style={styles.group}>
          <AppText variant="h4" accessibilityRole="header">
            {t('learning.again')}
          </AppText>
          {missed.map((id) => {
            const question = deck.questions.find((item) => item.id === id);
            const card = deck.cards.find((item) => item.id === id);
            return (
              <Pressable
                key={id}
                accessibilityRole="button"
                onPress={() => (quiz ? onToggleAnswers() : onRetry([id]))}
                style={({ pressed }) => [styles.missed, pressed && styles.pressed]}
              >
                <View style={styles.grow}>
                  <AppText variant="label">{quiz ? question?.question : card?.front}</AppText>
                  <AppText variant="bodySmall" tone="secondary">
                    {quiz
                      ? t('learning.yourAnswer', {
                          answer:
                            question?.choices.find((choice) => choice.id === record.answers[id])
                              ?.text ?? t('learning.unanswered'),
                        })
                      : card?.back}
                  </AppText>
                </View>
                <StudyIcon name="navigation-system/forward" />
              </Pressable>
            );
          })}
        </View>
      ) : (
        <AppText variant="bodySmall" tone="secondary">
          {t('learning.perfect')}
        </AppText>
      )}
      <View style={styles.group}>
        {onNextDeck ? (
          <Button
            label={t('session.nextDeck')}
            variant="tinted"
            trailingIcon="arrow"
            onPress={onNextDeck}
          />
        ) : null}
        {quiz ? (
          <Button
            label={t('learning.seeAnswers')}
            variant={onNextDeck ? 'soft' : 'tinted'}
            trailingIcon="arrow"
            onPress={onToggleAnswers}
          />
        ) : null}
        {missed.length ? (
          <Button
            label={t('learning.retryMissed')}
            variant={!quiz && !onNextDeck ? 'tinted' : 'soft'}
            onPress={() => onRetry(missed)}
          />
        ) : null}
        <Button
          label={exitLabel}
          variant={!quiz && !missed.length && !onNextDeck ? 'tinted' : 'soft'}
          onPress={onExit}
        />
        <View style={styles.links}>
          <Button label={t('learning.replay')} variant="link" onPress={onReplay} />
          <Button label={t('learning.seeProgress')} variant="link" onPress={onProgress} />
        </View>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  intro: { gap: spacing.md },
  complete: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.feedback.success.background,
  },
  summary: {
    padding: spacing.xl,
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
    gap: spacing.md,
  },
  accuracy: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    backgroundColor: colors.feedback.success.background,
    padding: spacing.sm,
    borderRadius: radius.pill,
    gap: spacing.sm,
  },
  green: { color: colors.feedback.success.text, flexShrink: 1 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  metric: {
    flex: 1,
    minWidth: 80,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface.warm,
    gap: spacing.sm,
  },
  metricsStack: { flexDirection: 'column', flexWrap: 'nowrap' },
  metricRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  metricValue: { minWidth: 64 },
  nextReview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
    backgroundColor: colors.brand.soft,
    borderRadius: radius.lg,
  },
  grow: { flex: 1, minWidth: 0, gap: spacing.sm },
  group: { gap: spacing.md },
  missed: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
  },
  pressed: { opacity: 0.8 },
  links: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
});
