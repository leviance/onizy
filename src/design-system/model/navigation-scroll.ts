type ScrollDirection = 'up' | 'down' | null;

export type NavigationScrollState = {
  offset: number;
  anchor: number;
  direction: ScrollDirection;
  visible: boolean;
};

export function createNavigationScrollState(): NavigationScrollState {
  return { offset: 0, anchor: 0, direction: null, visible: true };
}

const directionThreshold = 4;

export function updateNavigationScroll(
  state: NavigationScrollState,
  {
    offset,
    contentHeight,
    viewportHeight,
    navigationPadding = 0,
  }: {
    offset: number;
    contentHeight: number;
    viewportHeight: number;
    navigationPadding?: number;
  },
): NavigationScrollState {
  'worklet';
  if (![offset, contentHeight, viewportHeight, navigationPadding].every(Number.isFinite))
    return state;
  const maximum = Math.max(0, contentHeight - viewportHeight - Math.max(0, navigationPadding));
  // Clamp overscroll so an iOS edge bounce cannot count as a direction reversal.
  const boundedOffset = Math.min(maximum, Math.max(0, offset));
  if (boundedOffset <= directionThreshold) {
    return { offset: boundedOffset, anchor: boundedOffset, direction: null, visible: true };
  }
  if (state.offset > maximum) {
    // A smaller scroll range clamps the offset; it is not an upward gesture.
    return { ...state, offset: boundedOffset, anchor: boundedOffset, direction: null };
  }
  const delta = boundedOffset - state.offset;
  if (!delta) return state;
  const direction = delta > 0 ? 'down' : 'up';
  const anchor = direction === state.direction ? state.anchor : state.offset;
  return {
    offset: boundedOffset,
    anchor,
    direction,
    visible:
      Math.abs(boundedOffset - anchor) >= directionThreshold ? direction === 'up' : state.visible,
  };
}
