import { useState } from 'react';
import { Screen, StateView } from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import type { SessionConfig, SessionRecord, StudyMode } from '@/domain/review/learning-session';
import { useTranslation } from '@/shared/i18n';
import { ActiveSession } from '../components/ActiveSession';
import { SessionResult } from '../components/SessionResult';
import { SessionSetup } from '../components/SessionSetup';

export function StudyScreen({
  deck,
  mode = 'flashcard',
  targetIds,
  onExit,
  onProgress,
  onComplete,
  onNextDeck,
  returnDestination = 'deck',
}: {
  deck: LearningDeck | undefined;
  mode?: StudyMode;
  targetIds?: readonly string[] | undefined;
  onExit: () => void;
  onProgress: () => void;
  onComplete: (record: SessionRecord) => void;
  onNextDeck?: (() => void) | undefined;
  returnDestination?: 'deck' | 'review' | 'practice' | 'history';
}) {
  const { t } = useTranslation();
  const [config, setConfig] = useState<SessionConfig | null>(null);
  const [targets, setTargets] = useState(targetIds);
  const [record, setRecord] = useState<SessionRecord | null>(null);
  const [answersOpen, setAnswersOpen] = useState(false);
  const [run, setRun] = useState(0);
  if (!deck)
    return (
      <Screen includeTopInset>
        <StateView
          status="error"
          title={t('learning.missingDeck')}
          actionLabel={t('learning.backLibrary')}
          onAction={onExit}
        />
      </Screen>
    );
  if (!config)
    return (
      <SessionSetup deck={deck} mode={mode} targets={targets} onStart={setConfig} onExit={onExit} />
    );
  if (record)
    return (
      <SessionResult
        deck={deck}
        record={record}
        answersOpen={answersOpen}
        onToggleAnswers={() => setAnswersOpen((value) => !value)}
        onReplay={() => {
          setRecord(null);
          setConfig(null);
          setTargets(undefined);
          setAnswersOpen(false);
          setRun((value) => value + 1);
        }}
        onRetry={(ids) => {
          setRecord(null);
          setAnswersOpen(false);
          setTargets(ids);
          setConfig({ ...config, limit: ids.length });
          setRun((value) => value + 1);
        }}
        onProgress={onProgress}
        onExit={onExit}
        onNextDeck={onNextDeck}
        exitLabel={t(
          returnDestination === 'history'
            ? 'progress.backHistory'
            : returnDestination === 'practice'
              ? 'progress.backPractice'
              : returnDestination === 'review'
                ? 'session.backReview'
                : 'session.backDeck',
        )}
      />
    );
  return (
    <ActiveSession
      key={run}
      deck={deck}
      config={config}
      targets={targets}
      onExit={onExit}
      onFinished={(finished) => {
        onComplete(finished);
        setRecord(finished);
      }}
    />
  );
}
