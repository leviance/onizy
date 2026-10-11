import { useCallback, useEffect } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  cancelAnimation,
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import {
  getFlashcardDecision,
  getFlashcardSwipeProgress,
  isHorizontalSwipe,
} from '../model/flashcard-gesture';
import type { FlashcardDecision } from '../model/flashcard-gesture';
import { colors, motion } from '../tokens';

export function useFlashcardSwipe({
  enabled,
  interactive,
  onFlip,
  onDecision,
  onSwipeCommit,
  swipeProgress,
  swipeBlocked,
  resetKey,
}: {
  enabled: boolean;
  interactive: boolean;
  onFlip: () => void;
  onDecision: ((decision: FlashcardDecision) => void) | undefined;
  onSwipeCommit: ((decision: FlashcardDecision) => void) | undefined;
  swipeProgress: SharedValue<number> | undefined;
  swipeBlocked: SharedValue<boolean>;
  resetKey: string;
}) {
  const translation = useSharedValue(0);
  const localProgress = useSharedValue(0);
  const progress = swipeProgress ?? localProgress;
  const width = useSharedValue(300);
  // 0: idle, 1: dragging, 2: committed, 3: returning after a cancelled swipe.
  const phase = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const epoch = useSharedValue(0);
  const mounted = useSharedValue(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    mounted.set(true);
    return () => {
      mounted.set(false);
      epoch.set(epoch.get() + 1);
      cancelAnimation(translation);
      cancelAnimation(progress);
      progress.set(0);
    };
  }, [translation, progress, mounted, epoch]);

  useEffect(() => {
    epoch.set(epoch.get() + 1);
    cancelAnimation(translation);
    cancelAnimation(progress);
    translation.set(0);
    progress.set(0);
    phase.set(0);
  }, [resetKey, enabled, translation, progress, phase, epoch]);

  const accept = useCallback(
    (decision: FlashcardDecision, revision: number) => {
      if (mounted.get() && revision === epoch.get()) onSwipeCommit?.(decision);
    },
    [onSwipeCommit, mounted, epoch],
  );
  const finish = useCallback(
    (decision: FlashcardDecision, revision: number) => {
      if (!mounted.get() || revision !== epoch.get()) return;
      translation.set(0);
      progress.set(0);
      phase.set(0);
      onDecision?.(decision);
    },
    [onDecision, translation, progress, phase, mounted, epoch],
  );
  const flip = useCallback(() => {
    if (mounted.get() && phase.value === 0) onFlip();
  }, [onFlip, phase, mounted]);

  const returnToCenter = () => {
    'worklet';
    phase.set(3);
    const revision = epoch.value;
    const timing = { duration: reducedMotion ? 0 : motion.normal, easing: Easing.out(Easing.quad) };
    progress.set(withTiming(0, timing));
    translation.set(
      withTiming(0, timing, (finished) => {
        if (finished && epoch.value === revision) phase.set(0);
      }),
    );
  };

  const pan = Gesture.Pan()
    .enabled(interactive)
    .maxPointers(1)
    .manualActivation(true)
    .onTouchesDown((event, manager) => {
      if (swipeBlocked.value || phase.value !== 0 || event.numberOfTouches !== 1) {
        manager.fail();
        return;
      }
      const touch = event.allTouches[0];
      if (!touch) return;
      startX.set(touch.absoluteX);
      startY.set(touch.absoluteY);
    })
    .onTouchesMove((event, manager) => {
      if (phase.value === 1) return;
      if (swipeBlocked.value || phase.value !== 0 || event.numberOfTouches !== 1) {
        manager.fail();
        return;
      }
      const touch = event.allTouches[0];
      if (!touch) return;
      const dx = touch.absoluteX - startX.value;
      const dy = touch.absoluteY - startY.value;
      if (isHorizontalSwipe(dx, dy)) manager.activate();
      else if (Math.abs(dy) > 10) manager.fail();
    })
    .onStart((event) => {
      cancelAnimation(translation);
      cancelAnimation(progress);
      phase.set(1);
      if (enabled) {
        const dx = event.absoluteX - startX.value;
        translation.set(dx);
        progress.set(getFlashcardSwipeProgress(dx, width.value));
      }
    })
    .onUpdate((event) => {
      if (phase.value !== 1 || !enabled) return;
      const dx = event.absoluteX - startX.value;
      translation.set(dx);
      progress.set(getFlashcardSwipeProgress(dx, width.value));
    })
    .onEnd((event, success) => {
      if (phase.value !== 1) return;
      // Gesture Handler uses dp/second; the shared decision model uses dp/millisecond.
      const decision =
        success && enabled
          ? getFlashcardDecision(
              event.absoluteX - startX.value,
              event.absoluteY - startY.value,
              event.velocityX / 1000,
              width.value,
            )
          : null;
      if (!decision || !onDecision) {
        returnToCenter();
        return;
      }
      phase.set(2);
      const revision = epoch.value;
      progress.set(decision === 'again' ? -1 : 1);
      // Count the accepted release immediately; advance after the outgoing card animation.
      scheduleOnRN(accept, decision, revision);
      translation.set(
        withTiming(
          (decision === 'again' ? -1 : 1) * (width.value + 80),
          { duration: reducedMotion ? 0 : motion.normal, easing: Easing.out(Easing.quad) },
          (finished) => {
            if (finished && epoch.value === revision) scheduleOnRN(finish, decision, revision);
          },
        ),
      );
    })
    .onFinalize(() => {
      if (phase.value === 1) returnToCenter();
    });
  const tap = Gesture.Tap()
    .enabled(interactive)
    .maxDistance(10)
    .onEnd((_, success) => {
      if (success && phase.value === 0) scheduleOnRN(flip);
    });
  const gesture = Gesture.Race(pan, tap);

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [-1, 0, 1],
      [colors.feedback.error.text, colors.border.subtle, colors.feedback.success.text],
    ),
  }));
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translation.value },
      {
        rotate: reducedMotion
          ? '0deg'
          : `${interpolate(translation.value, [-200, 0, 200], [-6, 0, 6], 'clamp')}deg`,
      },
    ],
  }));
  const faceLabelStyle = useAnimatedStyle(() => ({ opacity: progress.value === 0 ? 1 : 0 }));
  const learningLabelStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.max(0, -progress.value * 3)),
  }));
  const knownLabelStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.max(0, progress.value * 3)),
  }));

  return {
    gesture,
    cardStyle,
    borderStyle,
    faceLabelStyle,
    learningLabelStyle,
    knownLabelStyle,
    onLayout: (event: LayoutChangeEvent) => {
      width.set(event.nativeEvent.layout.width);
    },
    runWhenIdle: (action: () => void, allowDuringFlip = false) => {
      if (phase.value === 0 && (allowDuringFlip || !swipeBlocked.value)) action();
    },
  };
}
