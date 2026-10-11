import { router } from 'expo-router';
import { useLearning } from '@/application/providers/LearningProvider';
import { navigateMain } from '@/application/navigation/main-navigation';
import { ProgressScreen } from '@/features/progress';
import { LanguageSelector } from '@/features/settings';

export default function ProgressRoute() {
  const learning = useLearning();
  return (
    <ProgressScreen
      decks={learning.decks}
      records={learning.records}
      schedules={learning.schedules}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      onNavigate={navigateMain}
      languageControl={<LanguageSelector />}
      onHistory={() => router.push('/history')}
      onPractice={() => router.push('/practice')}
      onDeck={(deck) => router.push({ pathname: '/deck', params: { deck } })}
      onStudy={() => router.push('/review')}
    />
  );
}
