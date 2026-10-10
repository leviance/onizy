import { router, useLocalSearchParams } from 'expo-router';
import { useLearning } from '@/application/providers/LearningProvider';
import { DeckScreen } from '@/features/library';

export default function DeckRoute() {
  const { deck } = useLocalSearchParams<{ deck?: string }>();
  const learning = useLearning();
  return (
    <DeckScreen
      deck={learning.decks.find((item) => item.id === deck)}
      onBack={() => router.dismissTo('/library')}
      onStart={(mode) => router.push({ pathname: '/study', params: { deck, mode } })}
    />
  );
}
