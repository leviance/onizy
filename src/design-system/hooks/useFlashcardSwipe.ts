import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Platform } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

import { getFlashcardDecision, isHorizontalSwipe } from '../model/flashcard-gesture';
import type { FlashcardDecision } from '../model/flashcard-gesture';
import { motion } from '../tokens';

export function useFlashcardSwipe({
  enabled,
  onDecision,
  resetKey,
}: {
  enabled: boolean;
  onDecision: ((decision: FlashcardDecision) => void) | undefined;
  resetKey: string;
}) {
  const [translation] = useState(() => new Animated.Value(0));
  const width = useRef(300);
  const busy = useRef(false);
  const generation = useRef(0);
  const mounted = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      generation.current += 1;
      translation.stopAnimation();
    };
  }, [translation]);

  useEffect(() => {
    generation.current += 1;
    translation.stopAnimation();
    translation.setValue(0);
    busy.current = false;
  }, [resetKey, enabled, translation]);

  const responder = useMemo(() => {
    const release = () => {
      translation.setValue(0);
      busy.current = false;
    };
    const cancel = () => {
      if (reducedMotion) release();
      else
        Animated.spring(translation, {
          toValue: 0,
          tension: 100,
          friction: 16,
          useNativeDriver: Platform.OS !== 'web',
        }).start(({ finished }) => {
          if (finished) release();
        });
    };
    // PanResponder stores handlers; these refs are read only when an input event arrives.
    // eslint-disable-next-line react-hooks/refs
    return PanResponder.create({
      // Leave taps to Pressable and vertical movement to the parent ScrollView.
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        enabled && !busy.current && isHorizontalSwipe(gesture.dx, gesture.dy),
      onPanResponderGrant: () => {
        busy.current = true;
        translation.stopAnimation();
      },
      onPanResponderMove: (_, gesture) => translation.setValue(gesture.dx),
      onPanResponderRelease: (_, gesture) => {
        const decision = enabled
          ? getFlashcardDecision(gesture.dx, gesture.dy, gesture.vx, width.current)
          : null;
        if (!decision || !onDecision) {
          cancel();
          return;
        }
        const currentGeneration = generation.current;
        const commit = () => {
          if (!mounted.current || currentGeneration !== generation.current) return;
          release();
          onDecision(decision);
        };
        if (reducedMotion) commit();
        else
          Animated.timing(translation, {
            toValue: (decision === 'again' ? -1 : 1) * (width.current + 80),
            duration: motion.normal,
            useNativeDriver: Platform.OS !== 'web',
          }).start(({ finished }) => {
            if (finished) commit();
          });
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderTerminate: cancel,
    });
  }, [enabled, onDecision, reducedMotion, translation]);

  return {
    panHandlers: responder.panHandlers,
    onLayout: (event: LayoutChangeEvent) => {
      width.current = event.nativeEvent.layout.width;
    },
    runWhenIdle: (action: () => void) => {
      if (!busy.current) action();
    },
    translation,
    rotation: reducedMotion
      ? '0deg'
      : translation.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: ['-6deg', '0deg', '6deg'],
          extrapolate: 'clamp',
        }),
  };
}
