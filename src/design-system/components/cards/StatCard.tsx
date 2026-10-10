import { StyleSheet, View } from 'react-native';

import { colors, elevation, radius, spacing } from '../../tokens';
import type { TopicTone } from '../../tokens';
import { AppText } from '../AppText';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import { IllustratedIcon } from '../IllustratedIcon';
import { Sparkle } from '../Sparkle';

export type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon: IconName;
  tone?: TopicTone;
  appearance?: 'default' | 'expressive';
};
export function StatCard({
  label,
  value,
  detail,
  icon,
  tone = 'green',
  appearance = 'default',
}: StatCardProps) {
  const palette = colors.topic[tone];
  const expressive = appearance === 'expressive';
  return (
    <View style={[styles.card, expressive && styles.expressive]}>
      {expressive ? (
        <View style={styles.sparkle} pointerEvents="none" aria-hidden>
          <Sparkle size={16} />
        </View>
      ) : null}
      <View
        style={[
          styles.icon,
          { backgroundColor: expressive ? palette.highlight : palette.background },
        ]}
      >
        {expressive && (icon === 'decks' || icon === 'target' || icon === 'chart') ? (
          <IllustratedIcon name={icon} size={28} />
        ) : (
          <Icon name={icon} color={palette.foreground} size={24} />
        )}
      </View>
      <AppText variant="bodySmall" tone="secondary" style={styles.label}>
        {label}
      </AppText>
      <AppText variant="h2" style={styles.value}>
        {value}
      </AppText>
      {detail ? (
        <AppText variant="bodySmall" style={{ color: palette.foreground }}>
          {detail}
        </AppText>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    backgroundColor: colors.surface.card,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.sm,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expressive: { borderColor: 'transparent', boxShadow: elevation.soft },
  sparkle: { position: 'absolute', top: spacing.lg, right: spacing.md },
  value: { fontSize: 28, lineHeight: 34 },
  label: { minHeight: 42 },
});
