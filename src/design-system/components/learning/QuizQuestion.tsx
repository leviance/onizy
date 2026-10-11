import type { KeyboardEvent, ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { useTranslation } from '@/shared/i18n';

import { getAnswerState, getQuizContentStatus, isBlockingStatus } from '../../model/state';
import type { ComponentStateProps } from '../../model/state';
import { colors, radius, spacing } from '../../tokens';
import { AppText } from '../AppText';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { StateView } from '../feedback/StateView';
import { AnswerOption } from './AnswerOption';

export type QuizChoice = { id: string; text: string };
export type QuizQuestionProps = ComponentStateProps & {
  question: string;
  choices: readonly QuizChoice[];
  correctId: string;
  selectedId: string | null;
  submitted: boolean;
  explanation: string;
  onSelect: (id: string) => void;
  onSubmit: () => void;
  showSubmitButton?: boolean;
  showExplanation?: boolean;
  layout?: 'default' | 'session';
  headerAction?: ReactNode;
  feedbackVisual?: ReactNode;
};
export function QuizQuestion({
  question,
  choices,
  correctId,
  selectedId,
  submitted,
  explanation,
  onSelect,
  onSubmit,
  showSubmitButton = true,
  showExplanation = true,
  layout = 'default',
  headerAction,
  feedbackVisual,
  status = 'default',
  onRetry,
}: QuizQuestionProps) {
  const { t } = useTranslation();
  if (isBlockingStatus(status)) return <StateView status={status} onAction={onRetry} />;
  if (status === 'complete') return <StateView status="complete" />;
  const contentStatus = getQuizContentStatus(choices, correctId);
  if (contentStatus === 'empty') return <StateView status="empty" onAction={onRetry} />;
  if (contentStatus === 'invalid' || !question.trim())
    return <StateView status="error" message={t('study.invalidQuestion')} onAction={onRetry} />;
  const isCorrect = selectedId === correctId;
  const correctChoice = choices.find((choice) => choice.id === correctId);
  const feedbackColor = isCorrect ? colors.feedback.success.text : colors.feedback.error.text;
  return (
    <View style={styles.container}>
      {layout === 'session' && submitted ? (
        <View
          style={[
            styles.feedback,
            {
              backgroundColor: isCorrect
                ? colors.feedback.success.background
                : colors.feedback.error.background,
            },
          ]}
          accessibilityLiveRegion="polite"
          aria-live="polite"
        >
          {feedbackVisual}
          <AppText variant="h3" style={{ color: feedbackColor }}>
            {t(isCorrect ? 'quiz.correctTitle' : 'quiz.incorrectTitle')}
          </AppText>
          <AppText>{t('quiz.answerIs', { answer: correctChoice?.text ?? '' })}</AppText>
        </View>
      ) : null}
      <View style={layout === 'session' ? styles.sessionCard : styles.defaultCard}>
        {layout !== 'session' || !submitted ? (
          <View style={layout === 'session' ? styles.sessionQuestion : styles.question}>
            <View style={styles.questionHeading}>
              <AppText variant="caption" style={styles.eyebrow}>
                {t('study.choose')}
              </AppText>
            </View>
            <View style={styles.questionHeading}>
              <AppText
                variant="studyQuestion"
                accessibilityRole="header"
                style={styles.questionText}
              >
                {question}
              </AppText>
              {headerAction}
            </View>
          </View>
        ) : (
          <AppText variant="bodySmall" accessibilityRole="header" tone="secondary">
            {question}
          </AppText>
        )}
        <View
          style={styles.choices}
          accessibilityRole="radiogroup"
          accessibilityLabel={t('study.choose')}
          {...(Platform.OS === 'web'
            ? {
                onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
                  if (
                    submitted ||
                    event.altKey ||
                    event.ctrlKey ||
                    event.metaKey ||
                    !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(
                      event.key,
                    )
                  )
                    return;
                  event.preventDefault();
                  const options = [
                    ...event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]'),
                  ];
                  const current = options.findIndex(
                    (option) => option === event.target || option.contains(event.target as Node),
                  );
                  const nextIndex =
                    event.key === 'Home'
                      ? 0
                      : event.key === 'End'
                        ? options.length - 1
                        : (current +
                            (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) +
                            options.length) %
                          options.length;
                  const choice = choices[nextIndex];
                  if (choice) {
                    options[nextIndex]?.focus();
                    onSelect(choice.id);
                  }
                },
              }
            : {})}
        >
          {choices.map((choice, index) => (
            <AnswerOption
              key={choice.id}
              label={choice.text}
              marker={String.fromCharCode(65 + index)}
              state={getAnswerState(choice.id, selectedId, correctId, submitted)}
              checked={selectedId === choice.id}
              disabled={submitted}
              onPress={() => {
                if (!submitted) onSelect(choice.id);
              }}
            />
          ))}
        </View>
      </View>
      {submitted && showExplanation ? (
        <View
          style={[
            styles.explanation,
            {
              backgroundColor:
                layout === 'session'
                  ? colors.feedback.info.background
                  : selectedId === correctId
                    ? colors.feedback.success.background
                    : colors.feedback.error.background,
              borderColor: layout === 'session' ? 'transparent' : feedbackColor,
            },
          ]}
          accessibilityLiveRegion="polite"
          aria-live="polite"
        >
          <View style={styles.feedbackTitle}>
            <Icon
              name={layout === 'session' ? 'book' : isCorrect ? 'check' : 'alert'}
              color={layout === 'session' ? colors.explore.primary : feedbackColor}
            />
            <AppText
              variant="label"
              style={{
                flex: 1,
                color:
                  selectedId === correctId
                    ? colors.feedback.success.text
                    : colors.feedback.error.text,
              }}
            >
              {t(
                layout === 'session'
                  ? 'study.explanation'
                  : isCorrect
                    ? 'study.correct'
                    : 'study.incorrect',
              )}
            </AppText>
          </View>
          {layout !== 'session' ? (
            <AppText variant="bodySmall" tone="secondary">
              {t('study.explanation')}
            </AppText>
          ) : null}
          <AppText variant="bodySmall">{explanation}</AppText>
        </View>
      ) : !submitted && showSubmitButton ? (
        <Button
          label={t('study.check')}
          variant="dark"
          disabled={!choices.some((choice) => choice.id === selectedId)}
          onPress={onSubmit}
        />
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { gap: spacing.xl },
  defaultCard: { gap: spacing.xl },
  sessionCard: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  sessionQuestion: { gap: spacing.lg, padding: spacing.xs },
  questionHeading: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  questionText: { flex: 1, minWidth: 0 },
  feedback: { padding: spacing.xl, borderRadius: radius.lg, gap: spacing.sm },
  question: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  eyebrow: {
    color: colors.brand.deep,
    backgroundColor: colors.brand.soft,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  feedbackTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  choices: { gap: spacing.md },
  explanation: {
    borderWidth: 1,
    padding: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
});
