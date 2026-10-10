import { useEffect, useReducer, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import {
  AppText,
  Button,
  Dialog,
  FilterChip,
  Flashcard,
  ProgressBar,
  QuizQuestion,
  Screen,
  colors,
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
  const { formatText, t } = useTranslation();
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
        title={t(
          config.mode === 'quiz'
            ? 'learning.quiz'
            : config.mode === 'review'
              ? 'learning.review'
              : 'learning.flashcard',
        )}
        subtitle={deck.title}
        time={formatDuration(elapsed)}
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
      />
      {config.mode === 'quiz' && question ? (
        <>
          {!instant ? (
            <View style={styles.questionNumbers} accessibilityLabel={t('learning.questionNav')}>
              {state.ids.map((id, index) => (
                <FilterChip
                  key={id}
                  label={`${index + 1}${state.answers[id] ? ' ✓' : ''}`}
                  selected={index === state.index}
                  onPress={() => dispatch({ type: 'go', index })}
                />
              ))}
            </View>
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
                  dispatch(
                    finalQuestion ? { type: 'submit' } : { type: 'go', index: state.index + 1 },
                  )
                }
              />
            ) : null
          ) : (
            <>
              <AppText variant="bodySmall" tone="secondary">
                {formatText('learning.answered', { answered, total: state.ids.length })}
              </AppText>
              <Button
                label={t('learning.submit')}
                variant="tinted"
                onPress={() => setSubmitOpen(true)}
              />
            </>
          )}
        </>
      ) : card ? (
        <>
          <View style={styles.subject}>
            <AppText variant="caption" style={{ color: colors.brand.deep }}>
              {deck.subject}
            </AppText>
          </View>
          <Flashcard
            key={card.id}
            front={card.front}
            back={card.back}
            revealed={state.revealed}
            onFlip={() => dispatch({ type: 'flip' })}
            onDecision={(decision) => dispatch({ type: 'decide', itemId: card.id, decision })}
          />
          {!state.revealed ? (
            <AppText variant="bodySmall" tone="secondary" style={{ textAlign: 'center' }}>
              {t('learning.tapHint')}
            </AppText>
          ) : null}
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
      <Dialog
        visible={submitOpen}
        title={t('learning.submitTitle')}
        message={formatText('learning.submitBody', { answered, total: state.ids.length })}
        onClose={() => setSubmitOpen(false)}
      >
        <Button
          label={t('learning.submit')}
          variant="tinted"
          onPress={() => {
            setSubmitOpen(false);
            dispatch({ type: 'submit' });
          }}
        />
        <Button
          label={t('learning.continueQuiz')}
          variant="ghost"
          onPress={() => setSubmitOpen(false)}
        />
      </Dialog>
    </Screen>
  );
}
const styles = StyleSheet.create({
  questionNumbers: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  subject: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    backgroundColor: colors.brand.soft,
  },
});
