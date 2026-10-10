import { router } from 'expo-router';

import { LibraryScreen } from '@/features/library';
import { useLearning } from '@/application/providers/LearningProvider';
import { navigateMain } from '@/application/navigation/main-navigation';

export default function LibraryRoute() {
  const learning = useLearning();
  return (
    <LibraryScreen
      decks={learning.decks}
      schedules={learning.schedules}
      records={learning.records}
      preferences={learning.libraryPreferences}
      onToggleFavorite={learning.toggleFavorite}
      onMoveToFolder={learning.moveToFolder}
      onOpenDeck={(deck) => router.push({ pathname: '/deck', params: { deck } })}
      onNavigate={navigateMain}
    />
  );
}
