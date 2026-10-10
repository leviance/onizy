import { StyleSheet, View } from 'react-native';
import {
  AppText,
  Button,
  QuizQuestion,
  Screen,
  SectionHeading,
  Sparkle,
  colors,
  radius,
  spacing,
} from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import { formatDuration, quizResult } from '@/domain/review/learning-session';
import type { SessionRecord } from '@/domain/review/learning-session';
import { useTranslation } from '@/shared/i18n';
import { SessionHeader } from './SessionHeader';

export function SessionResult({
  deck,
  record,
  answersOpen,
  onToggleAnswers,
  onReplay,
  onRetry,
  onProgress,
  onExit,
}: {
  deck: LearningDeck;
  record: SessionRecord;
  answersOpen: boolean;
  onToggleAnswers: () => void;
  onReplay: () => void;
  onRetry: (ids: readonly string[]) => void;
  onProgress: () => void;
  onExit: () => void;
}) {
  const { formatText, t, formatNumber, formatPercent } = useTranslation();
  const quiz = record.mode === 'quiz';
  const result = quizResult(deck, record.itemIds, record.answers);
  const good = quiz
    ? result.correct
    : Object.values(record.decisions).filter((value) => value === 'remembered').length;
  const missed = quiz
    ? result.incorrect
    : record.itemIds.filter((id) => record.decisions[id] === 'again');
  if (answersOpen)
    return (
      <Screen key="answers" includeTopInset>
        <SessionHeader
          title={t('learning.answers')}
          subtitle={deck.title}
          onBack={onToggleAnswers}
        />
        {record.itemIds.map((id, index) => {
          const question = deck.questions.find((item) => item.id === id);
          return question ? (
            <View key={id} style={{ gap: spacing.md }}>
              <AppText variant="label">
                {formatText('learning.questionIndex', {
                  value: index + 1,
                  total: record.itemIds.length,
                })}
              </AppText>
              {!record.answers[id] ? (
                <AppText tone="secondary">{t('learning.unanswered')}</AppText>
              ) : null}
              <QuizQuestion
                {...question}
                selectedId={record.answers[id] ?? null}
                submitted
                explanation={question.explanation}
                showSubmitButton={false}
                onSelect={() => {}}
                onSubmit={() => {}}
              />
            </View>
          ) : null;
        })}
        <Button label={t('common.back')} variant="tinted" onPress={onToggleAnswers} />
      </Screen>
    );
  return (
    <Screen key="result" includeTopInset>
      <SessionHeader
        title={t(quiz ? 'learning.quizResult' : 'learning.result')}
        subtitle={deck.title}
        onBack={onExit}
      />
      <View style={styles.hero}>
        <View style={styles.heroTitle}>
          <Sparkle size={20} color={colors.explore.sunny} />
          <AppText variant="h4" style={styles.inverse}>
            {t('learning.wellDone')}
          </AppText>
          <Sparkle size={20} color={colors.explore.sunny} />
        </View>
        <AppText variant="display" style={styles.inverse}>
          {formatNumber(good)}/{formatNumber(record.itemIds.length)}
        </AppText>
        <AppText style={styles.inverse}>
          {t(quiz ? 'learning.accuracy' : 'learning.remembered')}
          {quiz ? ` · ${formatPercent((good / Math.max(1, record.itemIds.length)) * 100)}` : ''}
        </AppText>
      </View>
      <View style={styles.metrics}>
        {[
          {
            label: t(quiz ? 'learning.correct' : 'learning.remembered'),
            value: good,
            background: colors.topic.green.background,
          },
          {
            label: t('learning.improve'),
            value: missed.length,
            background: colors.feedback.error.background,
          },
          {
            label: t('learning.time'),
            value: formatDuration(record.durationSeconds),
            background: colors.topic.orange.background,
          },
        ].map((metric) => (
          <View key={metric.label} style={[styles.metric, { backgroundColor: metric.background }]}>
            <AppText variant="h3">
              {typeof metric.value === 'number' ? formatNumber(metric.value) : metric.value}
            </AppText>
            <AppText variant="caption" tone="secondary" style={{ textAlign: 'center' }}>
              {metric.label}
            </AppText>
          </View>
        ))}
      </View>
      <SectionHeading title={t('learning.again')} decorate={false} />
      {missed.length ? (
        missed.map((id) => {
          const question = deck.questions.find((item) => item.id === id);
          const card = deck.cards.find((item) => item.id === id);
          return (
            <View key={id} style={styles.missed}>
              <AppText variant="label">{quiz ? question?.question : card?.front}</AppText>
              <AppText variant="bodySmall" tone="secondary">
                {quiz
                  ? formatText('learning.yourAnswer', {
                      answer:
                        question?.choices.find((choice) => choice.id === record.answers[id])
                          ?.text ?? t('learning.unanswered'),
                    })
                  : card?.back}
              </AppText>
            </View>
          );
        })
      ) : (
        <AppText tone="secondary">{t('learning.perfect')}</AppText>
      )}
      {missed.length ? (
        <Button
          label={t('learning.retryMissed')}
          variant="tinted"
          trailingIcon="arrow"
          onPress={() => onRetry(missed)}
        />
      ) : null}
      {quiz ? (
        <Button label={t('learning.seeAnswers')} variant="soft" onPress={onToggleAnswers} />
      ) : (
        <AppText variant="bodySmall" tone="secondary">
          {t('learning.reviewSuggestion')}
        </AppText>
      )}
      <Button label={t('learning.replay')} variant="secondary" onPress={onReplay} />
      <Button
        label={t('learning.seeProgress')}
        variant="soft"
        leadingIcon="chart"
        onPress={onProgress}
      />
      <Button label={t('learning.backLibrary')} variant="ghost" onPress={onExit} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.explore.primary,
    padding: spacing['3xl'],
    borderRadius: radius.card,
    alignItems: 'center',
    gap: spacing.lg,
  },
  heroTitle: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  inverse: { color: colors.text.inverse, textAlign: 'center' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metric: {
    flex: 1,
    minWidth: 88,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  missed: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface.card,
    gap: spacing.sm,
  },
});
