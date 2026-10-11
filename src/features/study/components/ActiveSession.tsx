import { useEffect, useReducer, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Button, Dialog, Flashcard, ProgressBar, Screen, StateView } from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import { startSession, transitionSession } from '@/domain/review/learning-session';
import type {
  SessionAction,
  SessionConfig,
  SessionRecord,
  SessionState,
  RecallDecision,
} from '@/domain/review/learning-session';
import { useTranslation } from '@/shared/i18n';
import { createLocalId } from '@/shared/utils/local-id';
import { SessionHeader } from './SessionHeader';
import { QuizSubmitSheet } from './QuizSubmitSheet';
import { RecallCounters } from './RecallCounters';
import { ActiveQuiz } from './ActiveQuiz';

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
  const [markedQuestionIds, setMarkedQuestionIds] = useState<readonly string[]>([]);
  const [exitOpen, setExitOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [committedDecision, setCommittedDecision] = useState<RecallDecision | null>(null);
  const saved = useRef(false);
  const swipeProgress = useSharedValue(0);
  const [state, dispatch] = useReducer(
    (previous: SessionState, action: SessionAction) =>
      transitionSession(previous, action, deck, config),
    undefined,
    () => startSession(deck, config, targets),
  );
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
      ...(config.mode === 'quiz' ? { markedQuestionIds } : {}),
    });
  }, [state, sessionId, deck.id, config.mode, startedAt, onFinished, markedQuestionIds]);
  const itemId = state.ids[state.index];
  const card = deck.cards.find((item) => item.id === itemId);
  const question = deck.questions.find((item) => item.id === itemId);
  const instant = config.feedback === 'immediate';
  const answered = Object.keys(state.answers).length;
  const decisions = Object.values(state.decisions);
  const overlays = (
    <>
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
    </>
  );
  if (config.mode === 'quiz')
    return question ? (
      <ActiveQuiz
        title={deck.title}
        question={question}
        state={state}
        instant={instant}
        markedIds={markedQuestionIds}
        onMark={() =>
          setMarkedQuestionIds((ids) =>
            ids.includes(question.id)
              ? ids.filter((id) => id !== question.id)
              : [...ids, question.id],
          )
        }
        onAnswer={(answerId) => dispatch({ type: 'answer', itemId: question.id, answerId })}
        onGo={(index) => dispatch({ type: 'go', index })}
        onSubmit={() => setSubmitOpen(true)}
        onExit={() => setExitOpen(true)}
        overlays={overlays}
      />
    ) : (
      <Screen includeTopInset>
        <StateView
          status="empty"
          message={t('learning.emptyContent')}
          actionLabel={t('session.backDeck')}
          onAction={onExit}
        />
      </Screen>
    );
  return (
    <Screen key={itemId} includeTopInset>
      <SessionHeader
        title={deck.title}
        subtitle={t(config.mode === 'review' ? 'learning.review' : 'learning.flashcard')}
        counter={`${formatNumber(state.index + 1)} / ${formatNumber(state.ids.length)}`}
        close
        onBack={() => setExitOpen(true)}
      />
      <ProgressBar
        value={state.index}
        total={state.ids.length}
        label={formatText('learning.cardIndex', {
          value: state.index + 1,
          total: state.ids.length,
        })}
        tone={config.mode === 'review' ? 'green' : 'orange'}
        showLabel={false}
      />
      {card ? (
        <>
          <RecallCounters
            learning={
              decisions.filter((decision) => decision === 'again').length +
              (committedDecision === 'again' ? 1 : 0)
            }
            known={
              decisions.filter((decision) => decision === 'remembered').length +
              (committedDecision === 'remembered' ? 1 : 0)
            }
            swipeProgress={swipeProgress}
          />
          <Flashcard
            key={card.id}
            front={card.front}
            back={card.back}
            revealed={state.revealed}
            swipeProgress={swipeProgress}
            onSwipeCommit={setCommittedDecision}
            onFlip={() => dispatch({ type: 'flip' })}
            onDecision={(decision) => {
              setCommittedDecision(null);
              dispatch({ type: 'decide', itemId: card.id, decision });
            }}
          />
        </>
      ) : null}
      {overlays}
    </Screen>
  );
}
