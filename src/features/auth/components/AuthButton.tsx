import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, colors, fonts, layout, radius, spacing } from '@/design-system';

import { AuthIcon, ProviderIcon } from './AuthIcon';

type AuthButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  provider?: 'google' | 'apple';
  testID?: string;
};

export function AuthButton({
  label,
  onPress,
  variant = 'primary',
  provider,
  testID,
}: AuthButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        provider ? styles.provider : styles[variant],
        pressed && styles.pressed,
      ]}
    >
      {provider ? <ProviderIcon provider={provider} /> : null}
      {!provider && variant === 'primary' ? <View style={styles.iconSlot} /> : null}
      <AppText
        style={[
          styles.label,
          !provider && variant === 'primary' && styles.expandedLabel,
          provider
            ? styles.providerLabel
            : variant === 'primary'
              ? styles.primaryLabel
              : styles.secondaryLabel,
        ]}
      >
        {label}
      </AppText>
      {!provider && variant === 'primary' ? (
        <View style={styles.iconSlot}>
          <AuthIcon name="arrow" color={colors.text.inverse} size={24} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.buttonHeight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  primary: { backgroundColor: colors.accent.tangerine },
  secondary: {
    borderColor: colors.accent.tangerine,
    borderWidth: 1.5,
    backgroundColor: colors.surface.card,
  },
  provider: {
    borderWidth: 1.5,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.card,
  },
  label: { flexShrink: 1, textAlign: 'center' },
  expandedLabel: { flex: 1 },
  primaryLabel: {
    color: colors.text.inverse,
    fontFamily: fonts.extraBold,
    fontSize: 20,
    lineHeight: 26,
  },
  secondaryLabel: {
    color: colors.brand.deep,
    fontFamily: fonts.extraBold,
    fontSize: 15,
    lineHeight: 22,
  },
  providerLabel: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 22 },
  iconSlot: { width: 24, flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.72 },
});
