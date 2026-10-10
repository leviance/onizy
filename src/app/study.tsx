import { router, useLocalSearchParams } from 'expo-router';

import { StudyScreen } from '@/features/study';
import { useLearning } from '@/application/providers/LearningProvider';

export default function StudyRoute() {
  const { deck, mode, items } = useLocalSearchParams<{
    deck?: string | string[];
    mode?: string;
    items?: string;
  }>();
  const learning = useLearning();
  const deckId = typeof deck === 'string' ? deck : learning.decks[0]?.id;
  const studyMode = mode === 'quiz' || mode === 'review' ? mode : 'flashcard';
  return (
    <StudyScreen
      key={`${deckId}-${studyMode}-${items ?? ''}`}
      deck={learning.decks.find((item) => item.id === deckId)}
      mode={studyMode}
      targetIds={typeof items === 'string' ? items.split(',') : undefined}
      onComplete={learning.completeSession}
      onExit={() => router.dismissTo('/library')}
      onProgress={() => router.replace('/progress')}
    />
  );
}
