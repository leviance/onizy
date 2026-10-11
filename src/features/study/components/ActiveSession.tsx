import { useEffect, useReducer, useRef, useState } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  AppText,
  Button,
  Dialog,
  Flashcard,
  ProgressBar,
  QuizQuestion,
  Screen,
  colors,
  radius,
  spacing,
} from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import { formatDuration, startSession, transitionSession } from '@/domain/review/learning-session';
import type {
  SessionAction,
  SessionConfig,
  SessionRecord,
  SessionState,
} from '@/domain/review/learning-session';
import { useTranslation } from '@/shared/i18n';
import { createLocalId } from '@/shared/utils/local-id';
import { SessionHeader } from './SessionHeader';
import { QuizSubmitSheet } from './QuizSubmitSheet';

export function ActiveSession({
  deck,
  config,
  targets,
  onFinished,
  onExit,
}: {
  deck: LearningDeck;
  config: SessionConfig;
  targets?: readonly string[] | undefined;
  onFinished: (record: SessionRecord) => void;
  onExit: () => void;
}) {
  const { formatText, formatNumber, t } = useTranslation();
  const [startedAt] = useState(Date.now);
  const [sessionId] = useState(() => createLocalId('session'));
  const [elapsed, setElapsed] = useState(0);
  const [exitOpen, setExitOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const saved = useRef(false);
  const [state, dispatch] = useReducer(
    (previous: SessionState, action: SessionAction) =>
      transitionSession(previous, action, deck, config),
    undefined,
    () => startSession(deck, config, targets),
  );
  useEffect(() => {
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [startedAt]);
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setExitOpen(true);
      return true;
    });
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    if (!state.submitted || saved.current) return;
    saved.current = true;
    const finishedAt = Date.now();
    onFinished({
      id: sessionId,
      deckId: deck.id,
      mode: config.mode,
      finishedAt,
      durationSeconds: Math.floor((finishedAt - startedAt) / 1000),
      itemIds: state.ids,
      answers: state.answers,
      decisions: state.decisions,
    });
  }, [state, sessionId, deck.id, config.mode, startedAt, onFinished]);
  const itemId = state.ids[state.index];
  const card = deck.cards.find((item) => item.id === itemId);
  const question = deck.questions.find((item) => item.id === itemId);
  const answer = itemId ? (state.answers[itemId] ?? null) : null;
  const instant = config.feedback === 'immediate';
  const answered = Object.keys(state.answers).length;
  const finalQuestion = state.index + 1 === state.ids.length;
  return (
    <Screen key={itemId} includeTopInset>
      <SessionHeader
        title={deck.title}
        subtitle={t(
          config.mode === 'quiz'
            ? 'learning.quiz'
            : config.mode === 'review'
              ? 'learning.review'
              : 'learning.flashcard',
        )}
        {...(config.mode === 'quiz'
          ? { time: formatDuration(elapsed) }
          : { counter: `${formatNumber(state.index + 1)} / ${formatNumber(state.ids.length)}` })}
        close
        onBack={() => setExitOpen(true)}
      />
      <ProgressBar
        value={config.mode === 'quiz' ? answered : state.index}
        total={state.ids.length}
        label={formatText(
          config.mode === 'quiz' ? 'learning.questionIndex' : 'learning.cardIndex',
          { value: state.index + 1, total: state.ids.length },
        )}
        tone={config.mode === 'review' ? 'green' : 'orange'}
        showLabel={false}
      />
      {config.mode === 'quiz' && question ? (
        <>
          <View style={styles.feedbackMode}>
            <AppText variant="caption" style={styles.feedbackText}>
              {t(instant ? 'learning.immediate' : 'learning.afterSubmit')}
            </AppText>
          </View>
          {!instant ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.questionNumbers}
              accessibilityLabel={t('learning.questionNav')}
            >
              {state.ids.map((id, index) => (
                <Pressable
                  key={id}
                  accessibilityRole="button"
                  accessibilityLabel={
                    t('session.navigateQuestion', { value: index + 1 }) +
                    ', ' +
                    t(state.answers[id] ? 'session.answeredCount' : 'session.unansweredCount', {
                      count: 1,
                    })
                  }
                  accessibilityState={{ selected: index === state.index }}
                  style={[
                    styles.questionNumber,
                    state.answers[id] && styles.answered,
                    index === state.index && styles.current,
                  ]}
                  onPress={() => dispatch({ type: 'go', index })}
                >
                  <AppText
                    variant="label"
                    style={index === state.index ? styles.currentText : undefined}
                  >
                    {formatNumber(index + 1)}
                  </AppText>
                </Pressable>
              ))}
            </ScrollView>
          ) : null}
          <QuizQuestion
            question={question.question}
            choices={question.choices}
            correctId={question.correctId}
            selectedId={answer}
            submitted={instant && !!answer}
            explanation={question.explanation}
            showSubmitButton={false}
            onSelect={(answerId) => dispatch({ type: 'answer', itemId: question.id, answerId })}
            onSubmit={() => {}}
          />
          {instant ? (
            answer ? (
              <Button
                label={t(finalQuestion ? 'learning.finishQuiz' : 'learning.nextQuestion')}
                variant="tinted"
                trailingIcon="arrow"
                onPress={() =>
                  finalQuestion
                    ? setSubmitOpen(true)
                    : dispatch({ type: 'go', index: state.index + 1 })
                }
              />
            ) : null
          ) : (
            <>
              <AppText variant="bodySmall" tone="secondary">
                {formatText('learning.answered', { answered, total: state.ids.length })}
              </AppText>
              <Button
                label={t(finalQuestion ? 'learning.submit' : 'learning.nextQuestion')}
                variant="tinted"
                trailingIcon="arrow"
                onPress={() =>
                  finalQuestion
                    ? setSubmitOpen(true)
                    : dispatch({ type: 'go', index: state.index + 1 })
                }
              />
              {!finalQuestion ? (
                <Button
                  label={t('learning.submit')}
                  variant="link"
                  onPress={() => setSubmitOpen(true)}
                />
              ) : null}
            </>
          )}
        </>
      ) : card ? (
        <>
          <Flashcard
            key={card.id}
            front={card.front}
            back={card.back}
            revealed={state.revealed}
            onFlip={() => dispatch({ type: 'flip' })}
            onDecision={(decision) => dispatch({ type: 'decide', itemId: card.id, decision })}
          />
        </>
      ) : null}
      <Dialog
        visible={exitOpen}
        title={t('learning.exit')}
        message={t('learning.exitBody')}
        onClose={() => setExitOpen(false)}
      >
        <Button
          label={t('learning.keepStudying')}
          variant="tinted"
          onPress={() => setExitOpen(false)}
        />
        <Button label={t('learning.leave')} variant="ghost" onPress={onExit} />
      </Dialog>
      <QuizSubmitSheet
        visible={submitOpen}
        answered={answered}
        total={state.ids.length}
        onClose={() => setSubmitOpen(false)}
        onSubmit={() => {
          setSubmitOpen(false);
          dispatch({ type: 'submit' });
        }}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  questionNumbers: { gap: spacing.sm, paddingVertical: spacing.xs },
  questionNumber: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.subtle,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  answered: { backgroundColor: colors.brand.soft, borderColor: colors.brand.primary },
  current: { backgroundColor: colors.explore.primary, borderColor: colors.explore.primary },
  currentText: { color: colors.text.inverse },
  feedbackMode: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    backgroundColor: colors.brand.soft,
  },
  feedbackText: { color: colors.brand.deep },
});
