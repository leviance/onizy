import { useEffect, useRef } from 'react';
import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { motion } from '../tokens';

export function useFlashcardFlip(revealed: boolean, resetKey: string) {
  const progress = useSharedValue(revealed ? 1 : 0);
  const animating = useSharedValue(false);
  const epoch = useSharedValue(0);
  const contentKey = useRef(resetKey);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const target = revealed ? 1 : 0;
    const reset = contentKey.current !== resetKey;
    contentKey.current = resetKey;
    cancelAnimation(progress);
    const revision = epoch.get() + 1;
    epoch.set(revision);
    if (reset || reducedMotion || progress.get() === target) {
      animating.set(false);
      progress.set(target);
    } else {
      animating.set(true);
      // Retarget from the current angle, so a second tap smoothly reverses the flip.
      progress.set(
        withTiming(
          target,
          { duration: motion.flip, easing: Easing.bezier(...motion.easing) },
          (finished) => {
            if (finished && epoch.value === revision) animating.set(false);
          },
        ),
      );
    }
    return () => {
      epoch.set(epoch.get() + 1);
      cancelAnimation(progress);
      animating.set(false);
    };
  }, [revealed, resetKey, reducedMotion, progress, animating, epoch]);

  const frontStyle = useAnimatedStyle(() => ({
    opacity: progress.value < 0.5 ? 1 : 0,
    transform: [{ perspective: 1000 }, { rotateX: `${progress.value * 180}deg` }],
  }));
  const backStyle = useAnimatedStyle(() => ({
    opacity: progress.value >= 0.5 ? 1 : 0,
    transform: [{ perspective: 1000 }, { rotateX: `${(progress.value - 1) * 180}deg` }],
  }));

  return { frontStyle, backStyle, animating };
}
