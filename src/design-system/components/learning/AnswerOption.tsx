import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { useTranslation } from '@/shared/i18n';
import type { TranslationKey } from '@/shared/i18n';

import type { AnswerState } from '../../model/state';
import { borderWidth, colors, interaction, radius, spacing } from '../../tokens';
import { AppText } from '../AppText';
import { Icon } from '../Icon';

const labels: Partial<Record<AnswerState, TranslationKey>> = {
  selected: 'study.selected',
  correct: 'study.correctAnswer',
  incorrect: 'study.incorrect',
};
// Quiz feedback accents from the approved reference; text keeps semantic ink colors.
const answerAccent = { correct: '#00BE73', incorrect: '#F04452' } as const;

export type AnswerOptionProps = {
  label: string;
  marker: string;
  state?: AnswerState;
  disabled?: boolean;
  checked?: boolean;
  onPress: () => void;
};
export function AnswerOption({
  label,
  marker,
  state = 'default',
  disabled = false,
  checked,
  onPress,
}: AnswerOptionProps) {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const key = labels[state];
  const isChecked =
    checked ?? (state === 'selected' || state === 'incorrect' || state === 'correct');
  const feedback = state === 'correct' || state === 'incorrect';
  const showFilled = state === 'selected' || (feedback && isChecked);
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={`${marker}. ${label}${key ? `. ${t(key)}` : ''}`}
      accessibilityState={{ checked: isChecked, disabled }}
      aria-checked={isChecked}
      disabled={disabled}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...(Platform.OS === 'web'
        ? {
            onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
              if (!disabled && !event.repeat && (event.key === ' ' || event.key === 'Enter')) {
                event.preventDefault();
                onPress();
              }
            },
          }
        : {})}
      style={({ pressed }) => [
        styles.option,
        styles[state],
        state === 'correct' && !isChecked && styles.reviewed,
        (focused || pressed) && styles.focused,
      ]}
    >
      <View
        style={[
          styles.marker,
          state === 'selected' && styles.selectedMarker,
          state === 'correct' && isChecked && styles.correctMarker,
          state === 'incorrect' && styles.incorrectMarker,
        ]}
      >
        <AppText
          variant="label"
          style={{
            color: showFilled ? colors.text.inverse : colors.text.primary,
          }}
        >
          {marker}
        </AppText>
      </View>
      <View style={styles.body}>
        <AppText variant={showFilled ? 'label' : 'body'}>{label}</AppText>
      </View>
      {feedback ? (
        <View
          style={[
            styles.result,
            state === 'correct' ? styles.correctMarker : styles.incorrectMarker,
          ]}
        >
          <Icon
            name={state === 'correct' ? 'check' : 'close'}
            size={16}
            color={colors.text.inverse}
          />
        </View>
      ) : (
        <View style={[styles.radio, isChecked && styles.radioSelected]}>
          {isChecked ? <View style={styles.dot} /> : null}
        </View>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  option: {
    minHeight: 64,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: borderWidth.default,
  },
  default: { backgroundColor: colors.surface.card, borderColor: colors.border.subtle },
  selected: { backgroundColor: colors.brand.soft, borderColor: colors.explore.primary },
  correct: {
    backgroundColor: colors.feedback.success.background,
    borderColor: answerAccent.correct,
  },
  incorrect: {
    backgroundColor: colors.feedback.error.background,
    borderColor: answerAccent.incorrect,
  },
  reviewed: { backgroundColor: colors.surface.card, borderColor: colors.border.subtle },
  focused: interaction.focusRing,
  marker: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.surface.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMarker: { backgroundColor: colors.explore.primary },
  correctMarker: { backgroundColor: answerAccent.correct },
  incorrectMarker: { backgroundColor: answerAccent.incorrect },
  body: { flex: 1, gap: spacing.xs },
  result: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.text.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.explore.primary },
  dot: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.explore.primary,
  },
});
