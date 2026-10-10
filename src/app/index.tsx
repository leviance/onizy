import { router } from 'expo-router';

import { OnboardingScreen } from '@/features/onboarding';

export default function WelcomeRoute() {
  return <OnboardingScreen onFinish={() => router.replace('/login')} />;
}
