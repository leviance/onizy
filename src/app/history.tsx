import { router, useLocalSearchParams } from 'expo-router';
import { useLearning } from '@/application/providers/LearningProvider';
import { HistoryScreen } from '@/features/progress';
import { SessionRecordScreen } from '@/features/study';

export default function HistoryRoute() {
  const { record: recordId } = useLocalSearchParams<{ record?: string }>();
  const learning = useLearning();
  if (recordId) {
    const record = learning.records.find((item) => item.id === recordId);
    return (
      <SessionRecordScreen
        key={recordId}
        record={record}
        deck={learning.decks.find((deck) => deck.id === record?.deckId)}
        onBack={() => router.dismissTo('/history')}
        onProgress={() => router.push('/progress')}
        onStudy={(deck, mode, ids) =>
          router.push({
            pathname: '/study',
            params: { deck, mode, origin: 'history', ...(ids ? { items: ids.join(',') } : {}) },
          })
        }
      />
    );
  }
  return (
    <HistoryScreen
      decks={learning.decks}
      records={learning.records}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/progress'))}
      onRecord={(record) => router.push({ pathname: '/history', params: { record } })}
      onStudy={() => router.push('/review')}
    />
  );
}
