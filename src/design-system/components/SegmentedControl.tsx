import { useRef, useState } from 'react';
import type { ComponentRef, KeyboardEvent } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { borderWidth, colors, interaction, layout, radius, spacing } from '../tokens';
import { AppText } from './AppText';

export type SegmentOption<Value extends string = string> = {
  value: Value;
  label: string;
  disabled?: boolean;
};
export type SegmentedControlProps<Value extends string = string> = {
  label: string;
  options: readonly SegmentOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
  disabled?: boolean;
};

/** Controlled single choice. Web Arrow/Home/End keys skip unavailable options. */
export function SegmentedControl<Value extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: SegmentedControlProps<Value>) {
  const [focused, setFocused] = useState<Value | null>(null);
  const refs = useRef(new Map<Value, ComponentRef<typeof View>>());
  const enabled = options.filter((option) => !option.disabled);
  const tabStop = enabled.some((option) => option.value === value) ? value : enabled[0]?.value;
  return (
    <View style={styles.track} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.map((option) => {
        const unavailable = disabled || Boolean(option.disabled);
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            ref={(node) => {
              if (node) refs.current.set(option.value, node);
              else refs.current.delete(option.value);
            }}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected, disabled: unavailable }}
            aria-checked={selected}
            tabIndex={option.value === tabStop && !unavailable ? 0 : -1}
            disabled={unavailable}
            onPress={() => {
              if (!selected) onChange(option.value);
            }}
            onFocus={() => setFocused(option.value)}
            onBlur={() => setFocused(null)}
            {...(Platform.OS === 'web'
              ? {
                  onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
                    if (
                      unavailable ||
                      event.nativeEvent.altKey ||
                      event.nativeEvent.ctrlKey ||
                      event.nativeEvent.metaKey
                    )
                      return;
                    const key = event.nativeEvent.key;
                    if (key === ' ' || key === 'Enter') {
                      event.preventDefault();
                      if (!event.repeat && !selected) onChange(option.value);
                      return;
                    }
                    if (
                      !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(
                        key,
                      )
                    )
                      return;
                    event.preventDefault();
                    const index = enabled.findIndex((item) => item.value === option.value);
                    const nextIndex =
                      key === 'Home'
                        ? 0
                        : key === 'End'
                          ? enabled.length - 1
                          : (index +
                              (key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 1) +
                              enabled.length) %
                            enabled.length;
                    const next = enabled[nextIndex];
                    if (next) {
                      refs.current.get(next.value)?.focus();
                      if (next.value !== value) onChange(next.value);
                    }
                  },
                }
              : {})}
            style={({ pressed }) => [
              styles.option,
              selected && styles.selected,
              focused === option.value && interaction.focusRing,
              pressed && { opacity: interaction.pressedOpacity },
              unavailable && { opacity: interaction.disabledOpacity },
            ]}
          >
            <AppText variant="button" style={styles.label}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    padding: spacing.xs,
    borderRadius: radius.lg,
    backgroundColor: colors.surface.subtle,
  },
  option: {
    flexGrow: 1,
    flexBasis: 100,
    minHeight: layout.minTouchTarget,
    minWidth: layout.minTouchTarget,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: borderWidth.strong,
    borderColor: 'transparent',
  },
  selected: { backgroundColor: colors.brand.soft, borderColor: colors.brand.deep },
  label: { textAlign: 'center' },
});
