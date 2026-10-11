import { router, useLocalSearchParams } from 'expo-router';

import { ReviewBatchScreen, StudyScreen } from '@/features/study';
import { useLearning } from '@/application/providers/LearningProvider';

export default function StudyRoute() {
  const { deck, mode, items, batch, origin } = useLocalSearchParams<{
    deck?: string | string[];
    mode?: string;
    items?: string;
    batch?: string;
    origin?: string;
  }>();
  const learning = useLearning();
  const deckId = typeof deck === 'string' ? deck : learning.decks[0]?.id;
  const studyMode = mode === 'quiz' || mode === 'review' ? mode : 'flashcard';
  if (typeof batch === 'string')
    return (
      <ReviewBatchScreen
        key={batch}
        decks={learning.decks}
        schedules={learning.schedules}
        deckIds={batch.split(',')}
        onComplete={learning.completeSession}
        onExit={() => router.dismissTo('/review')}
        onProgress={() => router.push('/progress')}
      />
    );
  return (
    <StudyScreen
      key={`${deckId}-${studyMode}-${items ?? ''}`}
      deck={learning.decks.find((item) => item.id === deckId)}
      mode={studyMode}
      targetIds={typeof items === 'string' ? items.split(',') : undefined}
      onComplete={learning.completeSession}
      onExit={() =>
        origin === 'practice'
          ? router.dismissTo('/practice')
          : origin === 'history'
            ? router.dismissTo('/history')
            : origin === 'review'
              ? router.dismissTo('/review')
              : deckId
                ? router.dismissTo({ pathname: '/deck', params: { deck: deckId } })
                : router.dismissTo('/library')
      }
      returnDestination={
        origin === 'history' || origin === 'practice' || origin === 'review' ? origin : 'deck'
      }
      onProgress={() => router.push('/progress')}
    />
  );
}
