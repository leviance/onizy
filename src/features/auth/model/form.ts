import type { TranslationKey } from '@/shared/i18n';

export type AuthMode = 'login' | 'register';
export type AuthValues = {
  name: string;
  identifier: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  accepted: boolean;
};
export type AuthField = Exclude<keyof AuthValues, 'accepted'>;
export type AuthErrors = Partial<Record<keyof AuthValues, TranslationKey>>;

export const emptyAuthValues: AuthValues = {
  name: '',
  identifier: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  accepted: false,
};

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value: string) => /^\+?\d{8,15}$/.test(value.replace(/[\s().-]/g, ''));
export const hasValidPassword = (value: string) =>
  value.length >= 8 && /\p{L}/u.test(value) && /\d/.test(value);

export function validateAuthForm(mode: AuthMode, values: AuthValues): AuthErrors {
  const errors: AuthErrors = {};
  if (mode === 'login') {
    const identifier = values.identifier.trim();
    if (!identifier) errors.identifier = 'auth.error.identifierRequired';
    else if (!isEmail(identifier) && !isPhone(identifier))
      errors.identifier = 'auth.error.identifierInvalid';
    if (!values.password) errors.password = 'auth.error.passwordRequired';
    return errors;
  }
  if (!values.name.trim()) errors.name = 'auth.error.nameRequired';
  if (!values.email.trim()) errors.email = 'auth.error.emailRequired';
  else if (!isEmail(values.email.trim())) errors.email = 'auth.error.emailInvalid';
  if (values.phone.trim() && !isPhone(values.phone.trim()))
    errors.phone = 'auth.error.phoneInvalid';
  if (!hasValidPassword(values.password)) errors.password = 'auth.error.passwordInvalid';
  if (!values.confirmPassword) errors.confirmPassword = 'auth.error.confirmRequired';
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = 'auth.error.confirmMismatch';
  if (!values.accepted) errors.accepted = 'auth.error.consentRequired';
  return errors;
}
