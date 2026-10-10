import { emptyAuthValues } from './form.ts';
import type { AuthMode, AuthValues } from './form';

const developmentAccount = {
  identifier: 'dev@onizy.test',
  password: 'OnizyDev123!',
};

export function createInitialAuthValues(mode: AuthMode, isDevelopment: boolean): AuthValues {
  return {
    ...emptyAuthValues,
    ...(isDevelopment && mode === 'login' ? developmentAccount : {}),
  };
}

export function canSignInWithDevelopmentAccount(
  mode: AuthMode,
  values: AuthValues,
  isDevelopment: boolean,
): boolean {
  return (
    isDevelopment &&
    mode === 'login' &&
    values.identifier.trim().toLowerCase() === developmentAccount.identifier &&
    values.password === developmentAccount.password
  );
}
