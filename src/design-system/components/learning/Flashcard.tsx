import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { useTranslation } from '@/shared/i18n';

import { isBlockingStatus } from '../../model/state';
import type { ComponentStateProps } from '../../model/state';
import type { FlashcardDecision } from '../../model/flashcard-gesture';
import { useFlashcardSwipe } from '../../hooks/useFlashcardSwipe';
import { borderWidth, colors, elevation, radius, spacing } from '../../tokens';
import { AppText } from '../AppText';
import { StateView } from '../feedback/StateView';

export type FlashcardProps = ComponentStateProps & {
  front: string;
  back: string;
  revealed: boolean;
  onFlip: () => void;
  onDecision?: (decision: FlashcardDecision) => void;
  disabled?: boolean;
  contentSize?: 'auto' | 'term' | 'body';
};

export function Flashcard({
  front,
  back,
  revealed,
  onFlip,
  onDecision,
  status = 'default',
  onRetry,
  disabled = false,
  contentSize = 'auto',
}: FlashcardProps) {
  const { t } = useTranslation();
  const swipe = useFlashcardSwipe({
    enabled: revealed && !disabled && status === 'default' && !!onDecision,
    onDecision,
    resetKey: JSON.stringify([front, back]),
  });
  const flip = () => {
    if (!disabled) swipe.runWhenIdle(onFlip);
  };
  if (isBlockingStatus(status)) return <StateView status={status} onAction={onRetry} />;
  if (status === 'complete') return <StateView status="complete" />;
  const content = revealed ? back : front;
  const body =
    contentSize === 'body' ||
    (contentSize === 'auto' && (content.length > 120 || content.includes('\n')));
  return (
    <Animated.View
      {...swipe.panHandlers}
      onLayout={swipe.onLayout}
      style={[
        styles.card,
        { transform: [{ translateX: swipe.translation }, { rotate: swipe.rotation }] },
      ]}
    >
      <Pressable
        style={styles.face}
        accessibilityRole="button"
        accessibilityLabel={`${t(revealed ? 'study.back' : 'study.front')}: ${content}`}
        accessibilityHint={t('study.tapToFlip')}
        accessibilityActions={[
          { name: 'activate', label: t('study.flip') },
          ...(revealed && onDecision
            ? [
                { name: 'again', label: t('study.needsReview') },
                { name: 'remembered', label: t('study.remembered') },
              ]
            : []),
        ]}
        onAccessibilityAction={(event) => {
          if (disabled) return;
          const action = event.nativeEvent.actionName;
          if (action === 'activate') flip();
          else if (revealed && (action === 'again' || action === 'remembered'))
            swipe.runWhenIdle(() => onDecision?.(action));
        }}
        accessibilityState={{ disabled }}
        accessibilityLiveRegion="polite"
        aria-live="polite"
        onPress={flip}
        disabled={disabled}
      >
        <AppText variant="bodySmall" tone="secondary">
          {t(revealed ? 'study.back' : 'study.front')}
        </AppText>
        <AppText
          variant={body ? 'bodyLg' : 'studyTerm'}
          style={body ? styles.body : styles.content}
        >
          {content}
        </AppText>
        {!revealed ? (
          <AppText variant="bodySmall" tone="secondary" style={styles.centered}>
            {t('study.recall')}
          </AppText>
        ) : null}
      </Pressable>
      <AppText variant="bodySmall" tone="secondary" style={styles.centered}>
        {t('study.tapToFlip')}
      </AppText>
      {revealed && onDecision ? (
        <View style={styles.swipeHint}>
          <AppText variant="bodySmall" style={styles.again}>
            {t('study.swipeLeft')}
          </AppText>
          <AppText variant="bodySmall" style={styles.remembered}>
            {t('study.swipeRight')}
          </AppText>
        </View>
      ) : null}
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  card: {
    padding: spacing['2xl'],
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
    borderWidth: borderWidth.subtle,
    borderColor: colors.border.subtle,
    boxShadow: elevation.soft,
    gap: spacing.xl,
  },
  face: { minHeight: 260, gap: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  content: { textAlign: 'center' },
  body: { alignSelf: 'stretch', textAlign: 'left' },
  centered: { textAlign: 'center' },
  swipeHint: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  again: { color: colors.brand.deep, flexShrink: 1 },
  remembered: { color: colors.feedback.success.text, flexShrink: 1 },
});
