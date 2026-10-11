import type { ReactNode } from 'react';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import type { QuizSwipeDirection } from '../hooks/quiz-swipe';
import { useQuizSwipe } from '../hooks/useQuizSwipe';

/** A question owns its gesture lifetime; changing its key cancels queued navigation. */
export function QuizSwipeQuestion({
  children,
  ...options
}: {
  children: (runWhenIdle: (action: () => void) => void) => ReactNode;
  canPrevious: boolean;
  canNext: boolean;
  entryDirection: QuizSwipeDirection | 0;
  onNavigate: (direction: QuizSwipeDirection) => void;
}) {
  const swipe = useQuizSwipe(options);
  return (
    <GestureDetector gesture={swipe.gesture} touchAction="pan-y">
      <Animated.View onLayout={swipe.onLayout} style={swipe.style} collapsable={false}>
        {children(swipe.runWhenIdle)}
      </Animated.View>
    </GestureDetector>
  );
}
