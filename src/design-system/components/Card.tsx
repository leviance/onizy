import { StyleSheet, View } from 'react-native';
import type { ViewProps } from 'react-native';

import { borderWidth, colors, radius, spacing } from '../tokens';

export type CardProps = ViewProps;

export function Card({ style, ...props }: CardProps) {
  return <View {...props} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
    borderWidth: borderWidth.subtle,
    borderColor: colors.border.subtle,
    padding: spacing['2xl'],
    gap: spacing.lg,
  },
});
