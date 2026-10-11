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
      records={learning.records}
      onNavigate={navigateMain}
      onStartQueue={(ids) =>
        router.push({
          pathname: '/study',
          params: { batch: ids.join(','), mode: 'review', origin: 'review' },
        })
      }
      onStudy={(deck, ids) =>
        router.push({
          pathname: '/study',
          params: { deck, mode: 'review', items: ids.join(','), origin: 'review' },
        })
      }
    />
  );
}
