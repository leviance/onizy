import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

import { borderWidth, colors, interaction, layout, radius, spacing } from '../tokens';
import { AppText } from './AppText';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  loading?: boolean;
  variant?:
    | 'primary'
    | 'secondary'
    | 'contrast'
    | 'dark'
    | 'soft'
    | 'ghost'
    | 'danger'
    | 'vivid'
    | 'tinted'
    | 'link';
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  loading = false,
  disabled = false,
  variant = 'primary',
  accessibilityState,
  leadingIcon,
  trailingIcon,
  style,
  onFocus,
  onBlur,
  onHoverIn,
  onHoverOut,
  ...props
}: ButtonProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const inverse = ['dark', 'contrast', 'danger', 'tinted'].includes(variant);
  const foreground = inverse
    ? colors.text.inverse
    : variant === 'link'
      ? colors.brand.deep
      : colors.text.primary;
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, disabled: disabled || loading, busy: loading }}
      aria-busy={loading}
      disabled={disabled || loading}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      onHoverIn={(event) => {
        setHovered(true);
        onHoverIn?.(event);
      }}
      onHoverOut={(event) => {
        setHovered(false);
        onHoverOut?.(event);
      }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        (pressed || hovered) && styles.pressed,
        focused && styles.focused,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? <ActivityIndicator style={styles.spinner} color={foreground} /> : null}
      {leadingIcon ? <Icon name={leadingIcon} color={foreground} /> : null}
      <AppText variant="button" style={[styles.label, { color: foreground }]}>
        {label}
      </AppText>
      {trailingIcon ? <Icon name={trailingIcon} color={foreground} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.buttonHeight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primary: { backgroundColor: colors.brand.primary },
  vivid: { backgroundColor: colors.explore.primary },
  tinted: { backgroundColor: colors.explore.primary },
  link: { backgroundColor: 'transparent' },
  contrast: { backgroundColor: colors.brand.deep },
  dark: { backgroundColor: colors.text.primary },
  soft: { backgroundColor: colors.brand.soft },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.feedback.error.text },
  secondary: {
    backgroundColor: colors.surface.card,
    borderWidth: borderWidth.strong,
    borderColor: colors.border.strong,
  },
  pressed: { opacity: interaction.pressedOpacity },
  focused: interaction.focusRing,
  disabled: { opacity: interaction.disabledOpacity },
  spinner: { position: 'absolute', left: 12 },
  label: { flexShrink: 1, textAlign: 'center' },
});
