import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Icon, IllustratedIcon, colors, radius, spacing } from '@/design-system';
import type { IllustratedIconName, TopicTone } from '@/design-system';

export function TopicTile({
  label,
  icon,
  tone,
  selected,
  onPress,
}: {
  label: string;
  icon: IllustratedIconName;
  tone: TopicTone;
  selected: boolean;
  onPress: () => void;
}) {
  const palette = colors.topic[tone];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      aria-pressed={selected}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        {
          backgroundColor: palette.background,
          borderColor: selected ? palette.foreground : 'transparent',
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.icon}>
        <IllustratedIcon name={icon} size={30} color={palette.accent} />
      </View>
      <AppText variant="label" style={styles.label}>
        {label}
      </AppText>
      <Icon name="chevron" size={17} color={selected ? palette.foreground : colors.text.primary} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  tile: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 2,
    padding: spacing.md,
  },
  icon: { width: 30, alignItems: 'center' },
  label: { flex: 1, fontSize: 14, lineHeight: 20 },
  pressed: { opacity: 0.75 },
});
