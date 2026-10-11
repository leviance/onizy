import { router, useLocalSearchParams } from 'expo-router';
import { useLearning } from '@/application/providers/LearningProvider';
import { DeckScreen } from '@/features/library';

export default function DeckRoute() {
  const { deck } = useLocalSearchParams<{ deck?: string }>();
  const learning = useLearning();
  return (
    <DeckScreen
      key={deck}
      deck={learning.decks.find((item) => item.id === deck)}
      schedules={learning.schedules}
      records={learning.records}
      preference={deck ? learning.libraryPreferences[deck] : undefined}
      onToggleFavorite={() => {
        if (deck) learning.toggleFavorite(deck);
      }}
      onMoveToFolder={(folder) => {
        if (deck) learning.moveToFolder(deck, folder);
      }}
      onBack={() => router.dismissTo('/library')}
      onStart={(mode, ids) =>
        router.push({
          pathname: '/study',
          params: { deck, mode, ...(ids ? { items: ids.join(',') } : {}) },
        })
      }
    />
  );
}
