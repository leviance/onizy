import { AuthScreen } from './AuthScreen';
import type { AuthScreenProps } from './AuthScreen';

export function RegisterScreen(props: AuthScreenProps) {
  return <AuthScreen {...props} mode="register" />;
}
