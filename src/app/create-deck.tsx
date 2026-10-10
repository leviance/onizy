import { router } from 'expo-router';
import { useLearning } from '@/application/providers/LearningProvider';
import { CreateDeckScreen } from '@/features/library';

export default function CreateDeckRoute() {
  const learning = useLearning();
  return (
    <CreateDeckScreen
      onBack={() => router.dismissTo('/library')}
      onSave={(deck) => {
        learning.addDeck(deck);
        router.replace({ pathname: '/deck', params: { deck: deck.id } });
      }}
    />
  );
}
