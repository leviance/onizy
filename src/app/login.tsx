import { router } from 'expo-router';

import { LoginScreen } from '@/features/auth';

export default function LoginRoute() {
  return (
    <LoginScreen
      onSwitchMode={() => router.replace('/register')}
      onExplore={() => router.dismissTo('/home')}
      onDevelopmentSignIn={() => router.dismissTo('/home')}
    />
  );
}
