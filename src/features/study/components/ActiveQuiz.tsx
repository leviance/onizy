import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import {
  AppText,
  Button,
  Dialog,
  ProgressBar,
  QuizQuestion,
  colors,
  radius,
  spacing,
} from '@/design-system';
import type { LearningQuestion } from '@/domain/content/learning';
import { canNavigateQuizQuestion } from '@/domain/review/learning-session';
import type { SessionState } from '@/domain/review/learning-session';
import { useTranslation } from '@/shared/i18n';
import { quizArtwork } from '../assets';
import { useQuestionSpeech } from '../hooks/useQuestionSpeech';
import type { QuizSwipeDirection } from '../hooks/quiz-swipe';
import { QuizIconButton } from './QuizIconButton';
import { QuizScaffold } from './QuizScaffold';
import { QuizSwipeQuestion } from './QuizSwipeQuestion';
import { StudyIcon } from './StudyIcon';

export function ActiveQuiz({
  title,
  question,
  state,
  instant,
  markedIds,
  onMark,
  onAnswer,
  onGo,
  onSubmit,
  onExit,
  overlays,
}: {
  title: string;
  question: LearningQuestion;
  state: SessionState;
  instant: boolean;
  markedIds: readonly string[];
  onMark: () => void;
  onAnswer: (answerId: string) => void;
  onGo: (index: number) => void;
  onSubmit: () => void;
  onExit: () => void;
  overlays: ReactNode;
}) {
  const { t, formatNumber } = useTranslation();
  useEffect(() => {
    if (Platform.OS === 'web') return;
    // Only warm the two small images needed by the next likely interaction.
    for (const source of [quizArtwork.correct, quizArtwork.incorrect]) {
      const asset = Image.resolveAssetSource(source);
      if (asset?.uri) void Image.prefetch(asset.uri).catch(() => {});
    }
  }, []);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [entryDirection, setEntryDirection] = useState<QuizSwipeDirection | 0>(0);
  const answer = state.answers[question.id] ?? null;
  const finalQuestion = state.index + 1 === state.ids.length;
  const marked = markedIds.includes(question.id);
  const speech = useQuestionSpeech(question.id, question.question);
  const answered = Object.keys(state.answers).length;
  const counter = `${formatNumber(state.index + 1)} / ${formatNumber(state.ids.length)}`;
  const feedback = instant ? 'immediate' : 'after-submit';
  const canPrevious = canNavigateQuizQuestion(state, state.index - 1, feedback);
  const canNext = canNavigateQuizQuestion(state, state.index + 1, feedback);
  const navigate = (index: number) => {
    if (!canNavigateQuizQuestion(state, index, feedback)) return;
    speech.stop();
    setEntryDirection(index > state.index ? 1 : -1);
    onGo(index);
  };
  const navigationAccessibility = {
    accessibilityHint: t('quiz.swipeHint'),
    accessibilityActions: [
      ...(canPrevious ? [{ name: 'previousQuestion', label: t('quiz.previousQuestion') }] : []),
      ...(canNext ? [{ name: 'nextQuestion', label: t('learning.nextQuestion') }] : []),
    ],
    onAccessibilityAction: (event: { nativeEvent: { actionName: string } }) => {
      if (event.nativeEvent.actionName === 'previousQuestion') navigate(state.index - 1);
      if (event.nativeEvent.actionName === 'nextQuestion') navigate(state.index + 1);
    },
  };
  return (
    <QuizScaffold
      scrollKey={question.id}
      header={
        <>
          <View style={styles.header}>
            <QuizIconButton
              name="navigation-system/close"
              label={t('learning.exit')}
              onPress={onExit}
              plain
            />
            <View style={styles.title}>
              <AppText variant="h4" accessibilityRole="header" style={styles.center}>
                {t('quiz.title')}
              </AppText>
              <AppText variant="bodySmall" tone="secondary" style={styles.center}>
                {title}
              </AppText>
            </View>
            {!instant ? (
              <Pressable
                {...navigationAccessibility}
                accessibilityRole="button"
                accessibilityLabel={
                  t('learning.questionNav') +
                  ', ' +
                  t('learning.questionIndex', { value: state.index + 1, total: state.ids.length })
                }
                onPress={() => setNavigationOpen(true)}
                style={styles.counter}
              >
                <AppText variant="bodySmall" tone="secondary">
                  {counter}
                </AppText>
              </Pressable>
            ) : (
              <AppText
                {...navigationAccessibility}
                accessible
                accessibilityLabel={t('learning.questionIndex', {
                  value: state.index + 1,
                  total: state.ids.length,
                })}
                variant="bodySmall"
                tone="secondary"
                style={styles.counterText}
              >
                {counter}
              </AppText>
            )}
          </View>
          <ProgressBar
            value={answered}
            total={state.ids.length}
            tone="orange"
            showLabel={false}
            label={t('learning.answered', { answered, total: state.ids.length })}
          />
        </>
      }
      footer={
        <>
          <View style={styles.actions}>
            <QuizIconButton
              name={
                marked ? 'flashcards-vocabulary/bookmark-fill' : 'flashcards-vocabulary/bookmark'
              }
              label={t(marked ? 'quiz.unmark' : 'quiz.mark')}
              selected={marked}
              onPress={onMark}
            />
            <Button
              label={t(
                finalQuestion
                  ? instant
                    ? 'learning.finishQuiz'
                    : 'learning.submit'
                  : 'learning.nextQuestion',
              )}
              variant="tinted"
              trailingIcon="arrow"
              disabled={instant && !answer}
              style={styles.next}
              onPress={() => (finalQuestion ? onSubmit() : navigate(state.index + 1))}
            />
          </View>
          {!instant ? (
            <Pressable
              style={styles.navigator}
              accessibilityRole="button"
              accessibilityLabel={t('learning.questionNav')}
              onPress={() => setNavigationOpen(true)}
            >
              <StudyIcon name="navigation-system/grid" />
              <AppText variant="caption" tone="secondary">
                {t('learning.answered', { answered, total: state.ids.length })}
              </AppText>
            </Pressable>
          ) : null}
        </>
      }
    >
      <QuizSwipeQuestion
        key={question.id}
        canPrevious={canPrevious}
        canNext={canNext}
        entryDirection={entryDirection}
        onNavigate={(direction) => navigate(state.index + direction)}
      >
        {(runWhenIdle) => (
          <QuizQuestion
            question={question.question}
            choices={question.choices}
            correctId={question.correctId}
            selectedId={answer}
            submitted={instant && !!answer}
            explanation={question.explanation}
            layout="session"
            showSubmitButton={false}
            onSelect={(answerId) => {
              runWhenIdle(() => {
                speech.stop();
                onAnswer(answerId);
              });
            }}
            onSubmit={onSubmit}
            headerAction={
              speech.available ? (
                <QuizIconButton
                  name={
                    speech.playing ? 'flashcards-vocabulary/mute' : 'flashcards-vocabulary/speaker'
                  }
                  label={t(speech.playing ? 'quiz.stopReading' : 'quiz.readQuestion')}
                  selected={speech.playing}
                  plain
                  onPress={() => runWhenIdle(speech.toggle)}
                />
              ) : undefined
            }
            feedbackVisual={
              <Image
                source={answer === question.correctId ? quizArtwork.correct : quizArtwork.incorrect}
                style={styles.feedbackArtwork}
                resizeMode="contain"
                fadeDuration={0}
                accessible={false}
                aria-hidden
              />
            }
          />
        )}
      </QuizSwipeQuestion>
      {speech.failed ? (
        <AppText variant="bodySmall" style={styles.error} accessibilityLiveRegion="polite">
          {t('quiz.speechError')}
        </AppText>
      ) : null}
      <Dialog
        visible={navigationOpen}
        title={t('learning.questionNav')}
        message={t('learning.answered', { answered, total: state.ids.length })}
        onClose={() => setNavigationOpen(false)}
      >
        <View style={styles.numbers}>
          {state.ids.map((id, index) => (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={
                t('session.navigateQuestion', { value: index + 1 }) +
                ', ' +
                t(state.answers[id] ? 'session.answeredCount' : 'session.unansweredCount', {
                  count: 1,
                }) +
                (markedIds.includes(id) ? ', ' + t('quiz.marked') : '')
              }
              accessibilityState={{ selected: index === state.index }}
              style={[
                styles.number,
                !!state.answers[id] && styles.answered,
                index === state.index && styles.current,
              ]}
              onPress={() => {
                navigate(index);
                setNavigationOpen(false);
              }}
            >
              <AppText variant="label" style={index === state.index ? styles.inverse : undefined}>
                {formatNumber(index + 1)}
              </AppText>
              {markedIds.includes(id) ? <View style={styles.mark} /> : null}
            </Pressable>
          ))}
        </View>
        <Button
          label={t('learning.submit')}
          variant="tinted"
          onPress={() => {
            setNavigationOpen(false);
            onSubmit();
          }}
        />
      </Dialog>
      {overlays}
    </QuizScaffold>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { flex: 1, minWidth: 0, gap: spacing.xs },
  center: { textAlign: 'center' },
  counter: { minHeight: 44, minWidth: 52, justifyContent: 'center', alignItems: 'center' },
  counterText: { minWidth: 52, textAlign: 'right' },
  actions: { flexDirection: 'row', gap: spacing.md, alignItems: 'stretch' },
  next: { flex: 1, minHeight: 60, borderRadius: radius.lg, paddingHorizontal: spacing.lg },
  navigator: {
    minHeight: 44,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackArtwork: { width: 128, height: 96, alignSelf: 'center' },
  error: { color: colors.feedback.error.text },
  numbers: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  number: {
    minWidth: 44,
    minHeight: 44,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.surface.subtle,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  answered: { backgroundColor: colors.brand.soft, borderColor: colors.explore.primary },
  current: { backgroundColor: colors.explore.primary },
  inverse: { color: colors.text.inverse },
  mark: {
    position: 'absolute',
    right: 3,
    top: 3,
    width: 5,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.sunny,
  },
});
