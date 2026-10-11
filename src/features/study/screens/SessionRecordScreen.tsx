import { useState } from 'react';
import { Screen, StateView } from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import type { SessionRecord, StudyMode } from '@/domain/review/learning-session';
import { useTranslation } from '@/shared/i18n';
import { SessionResult } from '../components/SessionResult';

/** Displaying a saved result never records another completed session. */
export function SessionRecordScreen({
  deck,
  record,
  onBack,
  onStudy,
  onProgress,
}: {
  deck: LearningDeck | undefined;
  record: SessionRecord | undefined;
  onBack: () => void;
  onStudy: (deckId: string, mode: StudyMode, ids?: readonly string[]) => void;
  onProgress: () => void;
}) {
  const { t } = useTranslation();
  const [answersOpen, setAnswersOpen] = useState(false);
  if (!deck || !record)
    return (
      <Screen includeTopInset>
        <StateView
          status="error"
          title={t('progress.missingResult')}
          message={t('learning.missingDeck')}
          actionLabel={t('progress.openHistory')}
          onAction={onBack}
        />
      </Screen>
    );
  return (
    <SessionResult
      deck={deck}
      record={record}
      answersOpen={answersOpen}
      onToggleAnswers={() => setAnswersOpen((value) => !value)}
      onReplay={() => onStudy(deck.id, record.mode)}
      onRetry={(ids) => onStudy(deck.id, record.mode, ids)}
      onProgress={onProgress}
      onExit={onBack}
      exitLabel={t('progress.backHistory')}
    />
  );
}
