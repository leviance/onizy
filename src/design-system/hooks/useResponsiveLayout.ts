import { useWindowDimensions } from 'react-native';

import { layout, spacing } from '../tokens';

export function useResponsiveLayout() {
  const { width, height, fontScale } = useWindowDimensions();
  const compact = width < layout.compactBreakpoint;
  const wide = width >= layout.tabletBreakpoint && fontScale < 1.5;
  return {
    width,
    height,
    compact,
    wide,
    largeText: fontScale >= 1.5,
    gutter: compact ? spacing.lg : wide ? spacing['3xl'] : spacing.xl,
  };
}
