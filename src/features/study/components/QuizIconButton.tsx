import { Pressable, StyleSheet } from 'react-native';
import { colors, interaction, radius, spacing } from '@/design-system';
import type { GeneratedIconName } from '@/design-system';
import { StudyIcon } from './StudyIcon';

export function QuizIconButton({
  name,
  label,
  onPress,
  selected,
  plain = false,
}: {
  name: GeneratedIconName;
  label: string;
  onPress: () => void;
  selected?: boolean;
  plain?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={selected === undefined ? undefined : { selected }}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        styles.button,
        plain && styles.plain,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <StudyIcon name={name} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    minWidth: 52,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  plain: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderRadius: radius.pill,
    minWidth: 44,
    minHeight: 44,
    padding: spacing.sm,
  },
  selected: { backgroundColor: colors.brand.soft, borderColor: colors.explore.primary },
  pressed: { opacity: interaction.pressedOpacity },
});
