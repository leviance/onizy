import { AuthScreen } from './AuthScreen';
import type { AuthScreenProps } from './AuthScreen';

type LoginScreenProps = AuthScreenProps & { onDevelopmentSignIn: () => void };

export function LoginScreen(props: LoginScreenProps) {
  return <AuthScreen {...props} mode="login" />;
}
