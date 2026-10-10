import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, interaction, layout, radius, spacing } from '../tokens';
import { AppText } from './AppText';

export type FilterChipProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
};
export function FilterChip({ label, selected, disabled = false, onPress }: FilterChipProps) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, ...(selected === undefined ? {} : { selected }) }}
      aria-pressed={selected}
      disabled={disabled}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        focused && interaction.focusRing,
        pressed && styles.pressed,
        disabled && { opacity: interaction.disabledOpacity },
      ]}
    >
      <AppText
        variant="bodySmall"
        style={{ color: selected ? colors.text.inverse : colors.text.secondary }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  chip: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.pill,
  },
  selected: { backgroundColor: colors.text.primary, borderColor: colors.text.primary },
  pressed: { opacity: interaction.pressedOpacity },
});
