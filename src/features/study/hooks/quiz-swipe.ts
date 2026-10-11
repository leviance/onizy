export type QuizSwipeDirection = -1 | 1;

export function isQuizHorizontalSwipe(dx: number, dy: number): boolean {
  'worklet';
  return (
    Number.isFinite(dx) &&
    Number.isFinite(dy) &&
    Math.abs(dx) > 12 &&
    Math.abs(dx) > Math.abs(dy) * 1.5
  );
}

/** Velocity is in dp/second, matching Gesture Handler. */
export function getQuizSwipeDirection(
  dx: number,
  dy: number,
  velocityX: number,
  width: number,
): QuizSwipeDirection | null {
  'worklet';
  if (!isQuizHorizontalSwipe(dx, dy)) return null;
  const threshold = Math.min(
    110,
    Math.max(64, (Number.isFinite(width) && width > 0 ? width : 300) * 0.24),
  );
  const flick =
    Math.abs(dx) >= 32 &&
    Number.isFinite(velocityX) &&
    Math.abs(velocityX) >= 750 &&
    Math.sign(velocityX) === Math.sign(dx);
  if (Math.abs(dx) < threshold && !flick) return null;
  return dx < 0 ? 1 : -1;
}
