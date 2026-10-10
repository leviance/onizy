import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from '@/shared/i18n';

import { colors, elevation, fonts, interaction, layout, radius, spacing } from '../../tokens';
import { AppText } from '../AppText';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import { IllustratedIcon } from '../IllustratedIcon';

export type NavigationKey = 'home' | 'library' | 'create' | 'review' | 'profile';
export type BottomNavigationProps = {
  active: NavigationKey;
  onNavigate: (key: NavigationKey) => void;
  floating?: boolean;
  onHeightChange?: (height: number) => void;
  disabledKeys?: readonly NavigationKey[];
  busyKey?: NavigationKey | undefined;
  appearance?: 'default' | 'expressive';
};
const items: readonly { key: NavigationKey; icon: IconName }[] = [
  { key: 'home', icon: 'home' },
  { key: 'library', icon: 'decks' },
  { key: 'create', icon: 'plus' },
  { key: 'review', icon: 'review' },
  { key: 'profile', icon: 'user' },
];

export function BottomNavigation({
  active,
  onNavigate,
  floating = true,
  onHeightChange,
  disabledKeys = [],
  busyKey,
  appearance = 'default',
}: BottomNavigationProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [focused, setFocused] = useState<NavigationKey | null>(null);
  return (
    <View
      style={[
        styles.container,
        floating && styles.floating,
        floating && { bottom: insets.bottom + spacing.md },
      ]}
      onLayout={(event) =>
        onHeightChange?.(event.nativeEvent.layout.height + insets.bottom + spacing['3xl'])
      }
    >
      <View style={styles.bar} accessibilityRole="tablist" accessibilityLabel={t('app.name')}>
        {items.map((item) => {
          const selected = item.key === active;
          const busy = item.key === busyKey;
          const disabled = busy || disabledKeys.includes(item.key);
          return (
            <Pressable
              key={item.key}
              accessibilityRole={item.key === 'create' ? 'button' : 'tab'}
              accessibilityLabel={t(`nav.${item.key}`)}
              accessibilityState={{ selected, disabled, busy }}
              aria-busy={busy}
              aria-selected={item.key === 'create' ? undefined : selected}
              onPress={() => onNavigate(item.key)}
              onFocus={() => setFocused(item.key)}
              onBlur={() => setFocused(null)}
              disabled={disabled}
              style={({ pressed }) => [
                styles.item,
                focused === item.key && interaction.focusRing,
                pressed && styles.pressed,
                disabled && styles.disabled,
              ]}
            >
              <View
                style={[
                  styles.icon,
                  item.key === 'create' && styles.create,
                  item.key === 'create' &&
                    appearance === 'expressive' && { backgroundColor: colors.explore.primary },
                  selected && item.key !== 'create' && styles.active,
                ]}
              >
                {busy ? (
                  <ActivityIndicator color={colors.brand.deep} />
                ) : selected && item.key === 'home' && appearance === 'expressive' ? (
                  <IllustratedIcon name="home" size={25} />
                ) : (
                  <Icon
                    name={item.icon}
                    size={item.key === 'create' ? 28 : 23}
                    color={
                      item.key === 'create'
                        ? appearance === 'expressive'
                          ? colors.text.inverse
                          : colors.text.primary
                        : selected
                          ? colors.brand.deep
                          : colors.text.secondary
                    }
                  />
                )}
              </View>
              <AppText
                variant="bodySmall"
                style={[
                  styles.label,
                  { color: selected ? colors.brand.deep : colors.text.secondary },
                ]}
              >
                {t(`nav.${item.key}`)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: spacing.md },
  floating: { position: 'absolute' },
  bar: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    boxShadow: elevation.floating,
  },
  item: {
    flex: 1,
    minWidth: layout.minTouchTarget,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.sm,
  },
  icon: {
    width: 36,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { backgroundColor: colors.brand.soft },
  create: {
    width: 48,
    height: 48,
    marginTop: -24,
    backgroundColor: colors.brand.primary,
    borderRadius: radius.pill,
    borderWidth: 4,
    borderColor: colors.surface.card,
  },
  label: { fontSize: 11, lineHeight: 16, fontFamily: fonts.bold, textAlign: 'center' },
  pressed: { opacity: interaction.pressedOpacity },
  disabled: { opacity: interaction.disabledOpacity },
});
