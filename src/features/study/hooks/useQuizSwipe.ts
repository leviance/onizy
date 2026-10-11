import { useCallback, useEffect } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { motion } from '@/design-system';
import { getQuizSwipeDirection, isQuizHorizontalSwipe } from './quiz-swipe';
import type { QuizSwipeDirection } from './quiz-swipe';

export function useQuizSwipe({
  canPrevious,
  canNext,
  entryDirection,
  onNavigate,
}: {
  canPrevious: boolean;
  canNext: boolean;
  entryDirection: QuizSwipeDirection | 0;
  onNavigate: (direction: QuizSwipeDirection) => void;
}) {
  const translation = useSharedValue(entryDirection * 48);
  const width = useSharedValue(300);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  // 0: idle, 1: dragging, 2: settling, 3: navigation queued.
  const phase = useSharedValue(2);
  const mounted = useSharedValue(false);

  useEffect(() => {
    mounted.set(true);
    if (!entryDirection) phase.set(0);
    else
      translation.set(
        withTiming(
          0,
          { duration: motion.normal, reduceMotion: ReduceMotion.System },
          (finished) => {
            if (finished && mounted.value) phase.set(0);
          },
        ),
      );
    return () => {
      mounted.set(false);
      cancelAnimation(translation);
    };
  }, [translation, phase, mounted, entryDirection]);

  const finish = useCallback(
    (direction: QuizSwipeDirection) => {
      if (mounted.get()) onNavigate(direction);
    },
    [mounted, onNavigate],
  );

  const settle = () => {
    'worklet';
    phase.set(2);
    translation.set(
      withTiming(
        0,
        {
          duration: motion.fast,
          easing: Easing.out(Easing.quad),
          reduceMotion: ReduceMotion.System,
        },
        (finished) => {
          if (finished && mounted.value) phase.set(0);
        },
      ),
    );
  };
  const drag = (dx: number) => {
    'worklet';
    // A boundary or unanswered immediate question gently resists the drag.
    const allowed = dx < 0 ? canNext : canPrevious;
    translation.set(allowed ? dx : dx * 0.14);
  };

  const gesture = Gesture.Pan()
    .maxPointers(1)
    .manualActivation(true)
    .onTouchesDown((event, manager) => {
      if (phase.value !== 0 || event.numberOfTouches !== 1) {
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
      if (phase.value !== 0 || event.numberOfTouches !== 1) {
        manager.fail();
        return;
      }
      const touch = event.allTouches[0];
      if (!touch) return;
      const dx = touch.absoluteX - startX.value;
      const dy = touch.absoluteY - startY.value;
      if (isQuizHorizontalSwipe(dx, dy)) manager.activate();
      else if (Math.abs(dy) > 10) manager.fail();
    })
    .onStart((event) => {
      phase.set(1);
      drag(event.absoluteX - startX.value);
    })
    .onUpdate((event) => {
      if (phase.value === 1) drag(event.absoluteX - startX.value);
    })
    .onEnd((event, success) => {
      if (phase.value !== 1) return;
      const direction = success
        ? getQuizSwipeDirection(
            event.absoluteX - startX.value,
            event.absoluteY - startY.value,
            event.velocityX,
            width.value,
          )
        : null;
      if (!direction || !(direction === 1 ? canNext : canPrevious)) {
        settle();
        return;
      }
      phase.set(2);
      translation.set(
        withTiming(
          -direction * (width.value + 24),
          {
            duration: motion.fast,
            easing: Easing.out(Easing.quad),
            reduceMotion: ReduceMotion.System,
          },
          (finished) => {
            if (!finished || !mounted.value) return;
            phase.set(3);
            scheduleOnRN(finish, direction);
          },
        ),
      );
    })
    .onFinalize(() => {
      if (phase.value === 1) settle();
    });

  return {
    gesture,
    style: useAnimatedStyle(() => ({ transform: [{ translateX: translation.value }] })),
    onLayout: (event: LayoutChangeEvent) => width.set(event.nativeEvent.layout.width),
    runWhenIdle: (action: () => void) => {
      if (mounted.get() && phase.get() === 0) action();
    },
  };
}
