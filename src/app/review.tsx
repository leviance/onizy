import { router } from 'expo-router';
import { useLearning } from '@/application/providers/LearningProvider';
import { navigateMain } from '@/application/navigation/main-navigation';
import { ReviewScreen } from '@/features/study';

export default function ReviewRoute() {
  const learning = useLearning();
  return (
    <ReviewScreen
      decks={learning.decks}
      schedules={learning.schedules}
      onNavigate={navigateMain}
      onStudy={(deck, ids) =>
        router.push({ pathname: '/study', params: { deck, mode: 'review', items: ids.join(',') } })
      }
    />
  );
}
