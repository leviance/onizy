import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTranslation } from '@/shared/i18n';

import { isBlockingStatus } from '../../model/state';
import type { ComponentStateProps } from '../../model/state';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { colors, interaction, radius, spacing } from '../../tokens';
import { AppText } from '../AppText';
import { StateView } from '../feedback/StateView';

export type ReviewRatingValue = 'again' | 'hard' | 'good' | 'easy';
export type ReviewRatingProps = ComponentStateProps & {
  onRate: (value: ReviewRatingValue) => void;
  disabled?: boolean;
  intervals?: Partial<Record<ReviewRatingValue, string>>;
};
const values: readonly ReviewRatingValue[] = ['again', 'hard', 'good', 'easy'];
const tones = {
  again: colors.feedback.info,
  hard: colors.feedback.warning,
  good: colors.feedback.success,
  easy: { text: colors.topic.mint.foreground, background: colors.topic.mint.background },
};

export function ReviewRating({
  onRate,
  disabled = false,
  intervals,
  status = 'default',
  onRetry,
}: ReviewRatingProps) {
  const { t } = useTranslation();
  const [focused, setFocused] = useState<ReviewRatingValue | null>(null);
  const { wide, largeText } = useResponsiveLayout();
  if (isBlockingStatus(status)) return <StateView status={status} onAction={onRetry} />;
  if (status === 'complete') return <StateView status="complete" />;
  return (
    <View style={styles.group}>
      <AppText variant="label">{t('study.rate')}</AppText>
      {disabled ? (
        <AppText variant="bodySmall" tone="secondary">
          {t('study.rateHint')}
        </AppText>
      ) : null}
      <View style={styles.options}>
        {values.map((value) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityLabel={`${t(`study.${value}`)}${intervals?.[value] ? `, ${intervals[value]}` : ''}`}
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={() => onRate(value)}
            onFocus={() => setFocused(value)}
            onBlur={() => setFocused(null)}
            style={({ pressed }) => [
              styles.option,
              { flexBasis: largeText ? '100%' : wide ? '22%' : '45%' },
              { backgroundColor: tones[value].background },
              focused === value && interaction.focusRing,
              pressed && styles.pressed,
              disabled && styles.disabled,
            ]}
          >
            <AppText variant="label" style={[styles.centered, { color: tones[value].text }]}>
              {t(`study.${value}`)}
            </AppText>
            {intervals?.[value] ? (
              <AppText variant="bodySmall" style={styles.centered}>
                {intervals[value]}
              </AppText>
            ) : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  group: { gap: spacing.md },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  option: {
    flexGrow: 1,
    minHeight: 60,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  centered: { textAlign: 'center' },
  disabled: { opacity: interaction.disabledOpacity },
  pressed: { opacity: interaction.pressedOpacity },
});
