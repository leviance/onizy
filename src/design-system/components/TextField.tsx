import { useState } from 'react';
import type { ReactNode, Ref } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

import { borderWidth, colors, fonts, layout, radius, spacing } from '../tokens';
import { AppText } from './AppText';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string | undefined;
  leadingIcon?: ReactNode;
  trailingAction?: ReactNode;
  inputRef?: Ref<TextInput>;
};

export function TextField({
  label,
  error,
  leadingIcon,
  trailingAction,
  inputRef,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.group}>
      <AppText style={styles.label}>{label}</AppText>
      <View
        style={[
          styles.field,
          focused && styles.focused,
          Boolean(error) && styles.invalid,
          props.editable === false && styles.disabled,
        ]}
      >
        {leadingIcon}
        <TextInput
          {...props}
          ref={inputRef}
          accessibilityLabel={label}
          accessibilityHint={error}
          accessibilityState={{ ...props.accessibilityState, disabled: props.editable === false }}
          aria-invalid={Boolean(error)}
          placeholderTextColor={colors.text.secondary}
          selectionColor={colors.brand.deep}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={styles.input}
        />
        {trailingAction}
      </View>
      {error ? (
        <AppText accessibilityLiveRegion="polite" aria-live="polite" style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.xs },
  label: { fontSize: 13, lineHeight: 18, fontFamily: fonts.bold },
  field: {
    minHeight: layout.buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.surface.subtle,
    borderWidth: borderWidth.default,
    borderColor: colors.surface.subtle,
  },
  focused: { borderColor: colors.brand.deep, backgroundColor: colors.surface.warm },
  invalid: { borderColor: colors.feedback.error.text },
  disabled: { backgroundColor: colors.surface.disabled },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: layout.buttonHeight,
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
  },
  error: { fontSize: 12, lineHeight: 18, color: colors.feedback.error.text },
});
