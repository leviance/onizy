import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { TextInput, TextInputProps } from 'react-native';

import { layout, spacing, TextField } from '@/design-system';
import { useTranslation } from '@/shared/i18n';
import type { TranslationKey } from '@/shared/i18n';

import type { AuthErrors, AuthField, AuthMode, AuthValues } from '../model/form';
import { AuthIcon } from './AuthIcon';
import type { AuthIconName } from './AuthIcon';

type Field = {
  name: AuthField;
  icon: AuthIconName;
  label: TranslationKey;
  placeholder: TranslationKey;
  input: TextInputProps;
};
const loginFields: Field[] = [
  {
    name: 'identifier',
    icon: 'mail',
    label: 'auth.identifier',
    placeholder: 'auth.identifierPlaceholder',
    input: { autoCapitalize: 'none', autoComplete: 'username', textContentType: 'username' },
  },
  {
    name: 'password',
    icon: 'lock',
    label: 'auth.password',
    placeholder: 'auth.passwordPlaceholder',
    input: { autoComplete: 'current-password', textContentType: 'password' },
  },
];
const registerFields: Field[] = [
  {
    name: 'name',
    icon: 'user',
    label: 'auth.name',
    placeholder: 'auth.namePlaceholder',
    input: { autoCapitalize: 'words', autoComplete: 'name', textContentType: 'name' },
  },
  {
    name: 'email',
    icon: 'mail',
    label: 'auth.email',
    placeholder: 'auth.emailPlaceholder',
    input: {
      keyboardType: 'email-address',
      autoCapitalize: 'none',
      autoComplete: 'email',
      textContentType: 'emailAddress',
    },
  },
  {
    name: 'phone',
    icon: 'phone',
    label: 'auth.phone',
    placeholder: 'auth.phonePlaceholder',
    input: { keyboardType: 'phone-pad', autoComplete: 'tel', textContentType: 'telephoneNumber' },
  },
  {
    name: 'password',
    icon: 'lock',
    label: 'auth.password',
    placeholder: 'auth.newPasswordPlaceholder',
    input: { autoComplete: 'new-password', textContentType: 'newPassword' },
  },
  {
    name: 'confirmPassword',
    icon: 'shield',
    label: 'auth.confirmPassword',
    placeholder: 'auth.confirmPlaceholder',
    input: { autoComplete: 'new-password', textContentType: 'newPassword' },
  },
];

type AuthFieldsProps = {
  mode: AuthMode;
  values: AuthValues;
  errors: AuthErrors;
  update: (field: AuthField, value: string) => void;
  onSubmit: () => void;
  focusRequest: { field: AuthField; revision: number } | null;
};

export function AuthFields({
  mode,
  values,
  errors,
  update,
  onSubmit,
  focusRequest,
}: AuthFieldsProps) {
  const { t } = useTranslation();
  const refs = useRef<Partial<Record<AuthField, TextInput | null>>>({});
  const [visible, setVisible] = useState({ password: false, confirmPassword: false });
  const fields = mode === 'login' ? loginFields : registerFields;
  useEffect(() => {
    if (focusRequest) refs.current[focusRequest.field]?.focus();
  }, [focusRequest]);

  return (
    <View style={styles.fields}>
      {fields.map((field, index) => {
        const passwordField =
          field.name === 'password' || field.name === 'confirmPassword' ? field.name : null;
        const isVisible = passwordField ? visible[passwordField] : false;
        const next = fields[index + 1];
        const error = errors[field.name];
        return (
          <TextField
            key={field.name}
            {...field.input}
            label={t(field.label)}
            placeholder={t(field.placeholder)}
            value={values[field.name]}
            onChangeText={(value) => update(field.name, value)}
            autoCorrect={false}
            secureTextEntry={Boolean(passwordField && !isVisible)}
            error={error ? t(error) : undefined}
            leadingIcon={<AuthIcon name={field.icon} />}
            trailingAction={
              passwordField ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${t(isVisible ? 'auth.hidePassword' : 'auth.showPassword')}: ${t(field.label)}`}
                  onPress={() =>
                    setVisible((current) => ({
                      ...current,
                      [passwordField]: !current[passwordField],
                    }))
                  }
                  style={styles.eye}
                  testID={`toggle-${field.name}`}
                >
                  <AuthIcon name={isVisible ? 'eye' : 'eye-off'} />
                </Pressable>
              ) : null
            }
            inputRef={(input) => {
              refs.current[field.name] = input;
            }}
            returnKeyType={next ? 'next' : 'done'}
            submitBehavior="submit"
            onSubmitEditing={() => (next ? refs.current[next.name]?.focus() : onSubmit())}
            testID={`auth-${field.name}`}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fields: { gap: spacing.md },
  eye: {
    width: layout.minTouchTarget,
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
