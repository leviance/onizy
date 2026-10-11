import { router } from 'expo-router';
import { useLearning } from '@/application/providers/LearningProvider';
import { PracticeScreen } from '@/features/progress';

export default function PracticeRoute() {
  const learning = useLearning();
  return (
    <PracticeScreen
      decks={learning.decks}
      records={learning.records}
      schedules={learning.schedules}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/review'))}
      onStudy={(deck, mode, ids) =>
        router.push({
          pathname: '/study',
          params: { deck, mode, items: ids.join(','), origin: 'practice' },
        })
      }
    />
  );
}
