import { router } from 'expo-router';

import { HomeScreen } from '@/features/home';
import { navigateMain } from '@/application/navigation/main-navigation';
import { useLearning } from '@/application/providers/LearningProvider';

export default function HomeRoute() {
  const learning = useLearning();
  return (
    <HomeScreen
      learningDecks={learning.decks}
      records={learning.records}
      schedules={learning.schedules}
      onOpenStudy={(deckId, mode) =>
        router.push({ pathname: '/study', params: { deck: deckId, mode } })
      }
      onMainNavigate={navigateMain}
    />
  );
}
