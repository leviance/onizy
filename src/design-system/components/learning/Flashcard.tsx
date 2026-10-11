import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { useTranslation } from '@/shared/i18n';

import { isBlockingStatus } from '../../model/state';
import type { ComponentStateProps } from '../../model/state';
import type { FlashcardDecision } from '../../model/flashcard-gesture';
import { useFlashcardSwipe } from '../../hooks/useFlashcardSwipe';
import { useFlashcardFlip } from '../../hooks/useFlashcardFlip';
import { borderWidth, colors, elevation, radius, spacing, typography } from '../../tokens';
import { AppText } from '../AppText';
import { StateView } from '../feedback/StateView';

export type FlashcardProps = ComponentStateProps & {
  front: string;
  back: string;
  revealed: boolean;
  onFlip: () => void;
  onDecision?: (decision: FlashcardDecision) => void;
  onSwipeCommit?: (decision: FlashcardDecision) => void;
  swipeProgress?: SharedValue<number>;
  disabled?: boolean;
  contentSize?: 'auto' | 'term' | 'body';
};

export function Flashcard({
  front,
  back,
  revealed,
  onFlip,
  onDecision,
  onSwipeCommit,
  swipeProgress,
  status = 'default',
  onRetry,
  disabled = false,
  contentSize = 'auto',
}: FlashcardProps) {
  const { t } = useTranslation();
  const [faceHeights, setFaceHeights] = useState({ front: 0, back: 0 });
  const resetKey = JSON.stringify([front, back]);
  const animation = useFlashcardFlip(revealed, resetKey);
  const swipe = useFlashcardSwipe({
    enabled: !disabled && status === 'default' && !!onDecision,
    interactive: !disabled && status === 'default',
    onFlip,
    onDecision,
    onSwipeCommit,
    swipeProgress,
    swipeBlocked: animation.animating,
    resetKey,
  });
  const flip = () => {
    if (!disabled) swipe.runWhenIdle(onFlip, true);
  };
  const measureFace = (face: 'front' | 'back', event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    setFaceHeights((previous) =>
      previous[face] === height ? previous : { ...previous, [face]: height },
    );
  };
  if (isBlockingStatus(status)) return <StateView status={status} onAction={onRetry} />;
  if (status === 'complete') return <StateView status="complete" />;
  const content = revealed ? back : front;
  return (
    <GestureDetector gesture={swipe.gesture} touchAction="pan-y">
      <Animated.View
        onLayout={swipe.onLayout}
        style={[
          styles.frame,
          { height: Math.max(faceHeights.front, faceHeights.back) + borderWidth.strong * 2 },
          swipe.cardStyle,
        ]}
      >
        <Pressable
          style={styles.touchSurface}
          accessibilityRole="button"
          accessibilityLabel={`${t(revealed ? 'study.back' : 'study.front')}: ${content}`}
          accessibilityHint={t('study.tapToFlip')}
          accessibilityActions={[
            { name: 'activate', label: t('study.flip') },
            ...(onDecision
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
            else if (action === 'again' || action === 'remembered')
              swipe.runWhenIdle(() => onDecision?.(action));
          }}
          accessibilityState={{ disabled }}
          accessibilityLiveRegion="polite"
          aria-live="polite"
          disabled={disabled}
        >
          {(['front', 'back'] as const).map((face) => (
            <Animated.View
              key={face}
              pointerEvents="none"
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              aria-hidden
              style={[
                styles.card,
                swipe.borderStyle,
                face === 'front' ? animation.frontStyle : animation.backStyle,
              ]}
            >
              <FlashcardFace
                content={face === 'front' ? front : back}
                back={face === 'back'}
                contentSize={contentSize}
                showSwipeHint={!!onDecision}
                swipe={swipe}
                onLayout={(event) => measureFace(face, event)}
              />
            </Animated.View>
          ))}
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

function FlashcardFace({
  content,
  back,
  contentSize,
  showSwipeHint,
  swipe,
  onLayout,
}: {
  content: string;
  back: boolean;
  contentSize: 'auto' | 'term' | 'body';
  showSwipeHint: boolean;
  swipe: ReturnType<typeof useFlashcardSwipe>;
  onLayout: (event: LayoutChangeEvent) => void;
}) {
  const { t } = useTranslation();
  const body =
    contentSize === 'body' ||
    (contentSize === 'auto' && (content.length > 120 || content.includes('\n')));
  return (
    <View style={styles.faceContent} onLayout={onLayout}>
      <View style={styles.face}>
        <View style={styles.faceLabel}>
          <Animated.View style={swipe.faceLabelStyle}>
            <AppText variant="bodySmall" tone="secondary">
              {t(back ? 'study.back' : 'study.front')}
            </AppText>
          </Animated.View>
          <Animated.View style={[styles.decisionLabel, swipe.learningLabelStyle]}>
            <AppText variant="label" style={styles.again}>
              {t('study.learningLabel')}
            </AppText>
          </Animated.View>
          <Animated.View style={[styles.decisionLabel, swipe.knownLabelStyle]}>
            <AppText variant="label" style={styles.remembered}>
              {t('study.knownLabel')}
            </AppText>
          </Animated.View>
        </View>
        <AppText
          variant={body ? 'bodyLg' : 'studyTerm'}
          style={body ? styles.body : styles.content}
        >
          {content}
        </AppText>
        {!back ? (
          <AppText variant="bodySmall" tone="secondary" style={styles.centered}>
            {t('study.recall')}
          </AppText>
        ) : null}
      </View>
      <AppText variant="bodySmall" tone="secondary" style={styles.centered}>
        {t('study.tapToFlip')}
      </AppText>
      {showSwipeHint ? (
        <View style={styles.swipeHint}>
          <AppText variant="bodySmall" style={styles.again}>
            {t('study.swipeLeft')}
          </AppText>
          <AppText variant="bodySmall" style={styles.remembered}>
            {t('study.swipeRight')}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    minHeight:
      260 +
      spacing['2xl'] * 2 +
      spacing.xl +
      typography.bodySmall.lineHeight +
      borderWidth.strong * 2,
  },
  touchSurface: { flex: 1 },
  card: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    transformOrigin: ['50%', '50%', 0],
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
    borderWidth: borderWidth.strong,
    borderColor: colors.border.subtle,
    boxShadow: elevation.soft,
  },
  faceContent: { padding: spacing['2xl'], gap: spacing.xl },
  face: { minHeight: 260, gap: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  faceLabel: { alignSelf: 'stretch', alignItems: 'center', minHeight: 24 },
  decisionLabel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { textAlign: 'center' },
  body: { alignSelf: 'stretch', textAlign: 'left' },
  centered: { textAlign: 'center' },
  swipeHint: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  again: { color: colors.feedback.error.text, flexShrink: 1 },
  remembered: { color: colors.feedback.success.text, flexShrink: 1 },
});
