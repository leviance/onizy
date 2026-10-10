import { useState } from 'react';
import {
  Easing,
  ReduceMotion,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

import { createNavigationScrollState, updateNavigationScroll } from '../model/navigation-scroll';
import { motion, spacing } from '../tokens';

export function useScrollNavigation({ bottomSafeAreaApplied = false } = {}) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const state = useSharedValue(createNavigationScrollState());
  const hideProgress = useSharedValue(0);
  const [visible, setVisible] = useState(true);
  const [navigationHeight, onNavigationHeightChange] = useState(0);
  const navigationPadding = navigationHeight + spacing.md;
  const bottomPadding =
    spacing.lg + (bottomSafeAreaApplied ? 0 : insets.bottom) + (visible ? navigationPadding : 0);
  const onScroll = useAnimatedScrollHandler((event) => {
    const next = updateNavigationScroll(state.value, {
      offset: event.contentOffset.y,
      contentHeight: event.contentSize.height,
      viewportHeight: event.layoutMeasurement.height,
      navigationPadding: visible ? navigationPadding : 0,
    });
    const wasVisible = state.value.visible;
    state.value = next;
    if (next.visible !== wasVisible) {
      const nextVisible = next.visible;
      // Start on the UI thread before React renders or changes the scroll range.
      hideProgress.value = withTiming(
        nextVisible ? 0 : 1,
        {
          duration: motion.normal,
          easing: Easing.bezier(...motion.easing),
          reduceMotion: reducedMotion ? ReduceMotion.Always : ReduceMotion.System,
        },
        (finished) => {
          // Interrupted transitions never commit stale padding/accessibility state.
          if (finished && state.value.visible === nextVisible)
            scheduleOnRN(setVisible, nextVisible);
        },
      );
    }
  });
  return { visible, hideProgress, onScroll, bottomPadding, onNavigationHeightChange };
}
