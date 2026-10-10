import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '../tokens';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

export type ScreenProps = PropsWithChildren<{ includeTopInset?: boolean }>;

export function Screen({ children, includeTopInset = false }: ScreenProps) {
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
      <ScrollView
        contentContainerStyle={[styles.content, { paddingHorizontal: gutter }]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
      >
        {children}
      </ScrollView>
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
    paddingBottom: spacing['2xl'],
    gap: spacing['2xl'],
  },
});
