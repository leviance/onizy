import { router } from 'expo-router';

import { RegisterScreen } from '@/features/auth';

export default function RegisterRoute() {
  return (
    <RegisterScreen
      onSwitchMode={() => router.replace('/login')}
      onExplore={() => router.dismissTo('/home')}
    />
  );
}
