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
        (focused || pressed) && styles.focused,
      ]}
    >
      <View
        style={[
          styles.marker,
          state === 'selected' && styles.selectedMarker,
          state === 'correct' && styles.correctMarker,
          state === 'incorrect' && styles.incorrectMarker,
        ]}
      >
        <AppText
          variant="label"
          style={{
            color: state === 'selected' || feedback ? colors.text.inverse : colors.text.primary,
          }}
        >
          {marker}
        </AppText>
      </View>
      <View style={styles.body}>
        <AppText>{label}</AppText>
        {key ? (
          <AppText
            variant="bodySmall"
            style={{
              color:
                state === 'incorrect'
                  ? colors.feedback.error.text
                  : state === 'correct'
                    ? colors.feedback.success.text
                    : colors.brand.deep,
            }}
          >
            {t(key)}
          </AppText>
        ) : null}
      </View>
      {feedback ? (
        <Icon
          name={state === 'correct' ? 'check' : 'close'}
          color={state === 'correct' ? colors.feedback.success.text : colors.feedback.error.text}
        />
      ) : null}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  option: {
    minHeight: 64,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: borderWidth.default,
  },
  default: { backgroundColor: colors.surface.card, borderColor: colors.border.default },
  selected: { backgroundColor: colors.brand.soft, borderColor: colors.explore.primary },
  correct: {
    backgroundColor: colors.feedback.success.background,
    borderColor: colors.topic.green.accent,
  },
  incorrect: {
    backgroundColor: colors.feedback.error.background,
    borderColor: colors.topic.pink.accent,
  },
  reviewed: { backgroundColor: colors.surface.card, borderColor: colors.border.subtle },
  focused: interaction.focusRing,
  marker: {
    width: 32,
    minHeight: 32,
    borderRadius: radius.xs,
    backgroundColor: colors.surface.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMarker: { backgroundColor: colors.explore.primary },
  correctMarker: { backgroundColor: colors.feedback.success.text },
  incorrectMarker: { backgroundColor: colors.feedback.error.text },
  body: { flex: 1, gap: spacing.xs },
});
