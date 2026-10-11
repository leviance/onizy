import { StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { colors, radius, spacing, typography, useResponsiveLayout } from '@/design-system';
import { useTranslation } from '@/shared/i18n';

function RecallCounter({
  count,
  direction,
  swipeProgress,
}: {
  count: number;
  direction: -1 | 1;
  swipeProgress: SharedValue<number>;
}) {
  const { t, formatNumber } = useTranslation();
  const palette = direction === -1 ? colors.feedback.error : colors.feedback.success;
  const animatedStyle = useAnimatedStyle(() => {
    const strength = Math.max(0, Math.min(1, swipeProgress.value * direction));
    return {
      backgroundColor: interpolateColor(
        strength,
        [0, 1],
        [colors.surface.card, palette.background],
      ),
      borderColor: interpolateColor(strength, [0, 1], [colors.border.subtle, palette.text]),
    };
  });
  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      Math.max(0, Math.min(1, swipeProgress.value * direction)),
      [0, 1],
      [colors.text.primary, palette.text],
    ),
  }));
  return (
    <Animated.View
      accessible
      accessibilityRole="text"
      accessibilityLabel={t(direction === -1 ? 'study.learningCount' : 'study.knownCount', {
        count,
      })}
      accessibilityLiveRegion="polite"
      style={[styles.counter, animatedStyle]}
    >
      <Animated.Text style={[typography.h3, textStyle]}>{formatNumber(count)}</Animated.Text>
      <Animated.Text style={[typography.label, styles.label, textStyle]}>
        {t(direction === -1 ? 'study.learningLabel' : 'study.knownLabel')}
      </Animated.Text>
    </Animated.View>
  );
}

export function RecallCounters({
  learning,
  known,
  swipeProgress,
}: {
  learning: number;
  known: number;
  swipeProgress: SharedValue<number>;
}) {
  const { largeText } = useResponsiveLayout();
  return (
    <View style={[styles.row, largeText && styles.stack]}>
      <RecallCounter count={learning} direction={-1} swipeProgress={swipeProgress} />
      <RecallCounter count={known} direction={1} swipeProgress={swipeProgress} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  stack: { flexDirection: 'column' },
  counter: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  label: { flexShrink: 1 },
});
