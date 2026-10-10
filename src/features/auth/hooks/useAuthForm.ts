import { useState } from 'react';

import { createInitialAuthValues } from '../model/development-account';
import { emptyAuthValues, validateAuthForm } from '../model/form';
import type { AuthMode, AuthValues } from '../model/form';

export function useAuthForm(mode: AuthMode) {
  const [values, setValues] = useState<AuthValues>(() =>
    __DEV__ ? createInitialAuthValues(mode, true) : { ...emptyAuthValues },
  );
  const [submitted, setSubmitted] = useState(false);
  const errors = submitted ? validateAuthForm(mode, values) : {};

  function update<Key extends keyof AuthValues>(field: Key, value: AuthValues[Key]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function submit() {
    setSubmitted(true);
    return validateAuthForm(mode, values);
  }

  return { values, errors, update, submit };
}
