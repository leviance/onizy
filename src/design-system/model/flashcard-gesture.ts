export type FlashcardDecision = 'again' | 'remembered';

export function isHorizontalSwipe(dx: number, dy: number) {
  return (
    Number.isFinite(dx) &&
    Number.isFinite(dy) &&
    Math.abs(dx) > 10 &&
    Math.abs(dx) > Math.abs(dy) * 1.5
  );
}

export function getFlashcardDecision(
  dx: number,
  dy: number,
  vx: number,
  width: number,
): FlashcardDecision | null {
  if (!isHorizontalSwipe(dx, dy)) return null;
  const threshold = Math.min(
    120,
    Math.max(72, (Number.isFinite(width) && width > 0 ? width : 300) * 0.28),
  );
  const distance = Math.abs(dx);
  const flick =
    Number.isFinite(vx) &&
    Math.abs(vx) >= 0.75 &&
    Math.sign(vx) === Math.sign(dx) &&
    distance >= 32;
  if (distance < threshold && !flick) return null;
  return dx < 0 ? 'again' : 'remembered';
}
