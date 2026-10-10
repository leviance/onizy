import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import type { ScrollViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '../tokens';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

export type ScreenProps = PropsWithChildren<{
  includeTopInset?: boolean;
  onScroll?: ScrollViewProps['onScroll'];
  bottomPadding?: number;
}>;

export function Screen({
  children,
  includeTopInset = false,
  onScroll,
  bottomPadding = spacing.lg,
}: ScreenProps) {
  const { gutter } = useResponsiveLayout();

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={{
        top: includeTopInset ? 'maximum' : 'off',
        left: 'additive',
        right: 'additive',
        bottom: 'additive',
      }}
    >
      <Animated.ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: gutter, paddingBottom: bottomPadding },
        ]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        onScroll={onScroll}
        scrollEventThrottle={onScroll ? 16 : undefined}
      >
        {children}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface.canvas,
    paddingTop: spacing['2xl'],
  },
  content: {
    width: '100%',
    maxWidth: layout.studyMaxWidth,
    alignSelf: 'center',
    flexGrow: 1,
    gap: spacing['2xl'],
  },
});
