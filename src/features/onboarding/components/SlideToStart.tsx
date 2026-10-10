import { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText, colors, radius, spacing } from '@/design-system';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

type SlideToStartProps = {
  label: string;
  hint: string;
  onComplete: () => void;
};

const thumbSize = 44;
const trackPadding = 4;

export function SlideToStart({ label, hint, onComplete }: SlideToStartProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const [offset] = useState(() => new Animated.Value(0));
  const completed = useRef(false);
  const dragged = useRef(false);
  const reducedMotion = useReducedMotion();
  const travel = Math.max(0, trackWidth - thumbSize - trackPadding * 2);

  const finish = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    onComplete();
  }, [onComplete]);

  const reset = useCallback(() => {
    if (reducedMotion) {
      offset.setValue(0);
    } else {
      Animated.spring(offset, {
        toValue: 0,
        useNativeDriver: Platform.OS !== 'web',
        speed: 24,
        bounciness: 0,
      }).start();
    }
  }, [offset, reducedMotion]);

  const panResponder = useMemo(
    () =>
      // PanResponder stores these handlers; refs are read only on input events.
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderGrant: () => {
          dragged.current = false;
          offset.stopAnimation();
        },
        onPanResponderMove: (_, gesture) => {
          if (Math.abs(gesture.dx) >= 5 || Math.abs(gesture.dy) >= 5) dragged.current = true;
          offset.setValue(Math.max(0, Math.min(travel, gesture.dx)));
        },
        onPanResponderRelease: (_, gesture) => {
          const tapped = !dragged.current && Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5;
          if (tapped || (travel > 0 && gesture.dx >= travel * 0.72)) {
            finish();
          } else {
            reset();
          }
        },
        onPanResponderTerminate: reset,
        onPanResponderTerminationRequest: () => true,
      }),
    [finish, offset, reset, travel],
  );

  return (
    <View onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)} style={styles.track}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={hint}
        onPress={finish}
        style={styles.labelContainer}
        testID="onboarding-continue"
      >
        <AppText style={styles.label}>{label}</AppText>
      </Pressable>
      <Svg
        style={styles.chevrons}
        width={25}
        height={25}
        viewBox="0 0 32 32"
        pointerEvents="none"
        aria-hidden
      >
        <Path
          d="M5 6 L15 16 L5 26 M16 6 L26 16 L16 26"
          stroke={colors.text.secondary}
          opacity={0.5}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.thumb, { transform: [{ translateX: offset }] }]}
        accessible={false}
        testID="onboarding-slider-thumb"
      >
        <Svg width={27} height={27} viewBox="0 0 32 32" aria-hidden>
          <Path
            d="M6 16 H26 M17 7 L26 16 L17 25"
            stroke={colors.surface.card}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    minHeight: thumbSize + trackPadding * 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface.card,
    padding: trackPadding,
    justifyContent: 'center',
  },
  labelContainer: {
    paddingLeft: thumbSize + spacing.sm,
    paddingRight: spacing['4xl'],
    paddingVertical: spacing.md,
    minHeight: thumbSize,
    justifyContent: 'center',
  },
  label: { textAlign: 'center', fontSize: 16, lineHeight: 22 },
  thumb: {
    width: thumbSize,
    height: thumbSize,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.tangerine,
    position: 'absolute',
    left: trackPadding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevrons: { position: 'absolute', right: spacing.lg },
});
