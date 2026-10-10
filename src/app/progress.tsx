import { useLearning } from '@/application/providers/LearningProvider';
import { navigateMain } from '@/application/navigation/main-navigation';
import { ProgressScreen } from '@/features/progress';
import { LanguageSelector } from '@/features/settings';

export default function ProgressRoute() {
  const learning = useLearning();
  return (
    <ProgressScreen
      languageControl={<LanguageSelector />}
      decks={learning.decks}
      records={learning.records}
      schedules={learning.schedules}
      onNavigate={navigateMain}
    />
  );
}
