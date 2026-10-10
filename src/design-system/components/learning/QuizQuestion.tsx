import type { KeyboardEvent } from 'react';
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
  return (
    <View style={styles.container}>
      <View style={styles.question}>
        <AppText variant="caption" style={styles.eyebrow}>
          {t('study.choose')}
        </AppText>
        <AppText variant="studyQuestion" accessibilityRole="header">
          {question}
        </AppText>
      </View>
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
      {submitted && showExplanation ? (
        <View
          style={[
            styles.explanation,
            {
              backgroundColor:
                selectedId === correctId
                  ? colors.feedback.success.background
                  : colors.feedback.error.background,
              borderColor:
                selectedId === correctId ? colors.topic.green.accent : colors.topic.pink.accent,
            },
          ]}
          accessibilityLiveRegion="polite"
          aria-live="polite"
        >
          <View style={styles.feedbackTitle}>
            <Icon
              name={selectedId === correctId ? 'check' : 'alert'}
              color={
                selectedId === correctId ? colors.feedback.success.text : colors.feedback.error.text
              }
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
              {t(selectedId === correctId ? 'study.correct' : 'study.incorrect')}
            </AppText>
          </View>
          <AppText variant="bodySmall" tone="secondary">
            {t('study.explanation')}
          </AppText>
          <AppText>{explanation}</AppText>
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
