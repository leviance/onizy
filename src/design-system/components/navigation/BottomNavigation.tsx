import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from '@/shared/i18n';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

import {
  colors,
  elevation,
  fonts,
  interaction,
  layout,
  motion,
  radius,
  spacing,
} from '../../tokens';
import { AppText } from '../AppText';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import { IllustratedIcon } from '../IllustratedIcon';

export type NavigationKey = 'home' | 'library' | 'create' | 'review' | 'profile';
export type BottomNavigationProps = {
  active: NavigationKey;
  onNavigate: (key: NavigationKey) => void;
  floating?: boolean;
  visible?: boolean;
  hideProgress?: SharedValue<number>;
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
const createButtonSize = spacing['6xl'];
const labelLineHeight = 16;

export function BottomNavigation({
  active,
  onNavigate,
  floating = true,
  visible = true,
  hideProgress,
  onHeightChange,
  disabledKeys = [],
  busyKey,
  appearance = 'default',
}: BottomNavigationProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const [focused, setFocused] = useState<NavigationKey | null>(null);
  const [height, setHeight] = useState(
    createButtonSize + spacing.xs + labelLineHeight + spacing.sm * 2,
  );
  const hidden = floating && !visible;
  const fallbackProgress = useDerivedValue(() => {
    if (hideProgress) return 0;
    return withTiming(hidden ? 1 : 0, {
      duration: motion.normal,
      easing: Easing.bezier(...motion.easing),
      reduceMotion: reducedMotion ? ReduceMotion.Always : ReduceMotion.System,
    });
  });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: floating
          ? Math.max(0, Math.min(1, (hideProgress ?? fallbackProgress).value)) *
            (height + insets.bottom + spacing.md + spacing.lg)
          : 0,
      },
    ],
  }));

  return (
    <Animated.View
      pointerEvents={hidden ? 'none' : 'auto'}
      accessibilityElementsHidden={hidden}
      importantForAccessibility={hidden ? 'no-hide-descendants' : 'auto'}
      aria-hidden={hidden}
      style={[
        styles.container,
        floating && styles.floating,
        floating && { bottom: insets.bottom + spacing.md },
        animatedStyle,
      ]}
      onLayout={(event) => {
        const measuredHeight = event.nativeEvent.layout.height;
        setHeight(measuredHeight);
        onHeightChange?.(measuredHeight);
      }}
    >
      <View style={styles.bar} accessibilityRole="tablist" accessibilityLabel={t('app.name')}>
        <View pointerEvents="none" style={styles.surface} />
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
                item.key === 'create' && styles.createItem,
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
                    size={item.key === 'create' ? 32 : 23}
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
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: spacing.md },
  floating: { position: 'absolute' },
  bar: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
  },
  // The capsule starts lower while every icon remains inside its touchable row.
  surface: {
    position: 'absolute',
    top: spacing['2xl'],
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border.default,
    boxShadow: elevation.floating,
  },
  item: {
    flex: 1,
    minWidth: layout.minTouchTarget,
    minHeight: createButtonSize + spacing.xs + labelLineHeight,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
    borderRadius: radius.sm,
  },
  createItem: { minWidth: createButtonSize },
  icon: {
    width: 36,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { backgroundColor: colors.brand.soft },
  create: {
    width: createButtonSize,
    height: createButtonSize,
    backgroundColor: colors.brand.primary,
    borderRadius: radius.pill,
    borderWidth: 4,
    borderColor: colors.surface.card,
  },
  label: {
    fontSize: 11,
    lineHeight: labelLineHeight,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  pressed: { opacity: interaction.pressedOpacity },
  disabled: { opacity: interaction.disabledOpacity },
});
