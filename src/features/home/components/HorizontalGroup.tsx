import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { spacing } from '@/design-system';

export function HorizontalGroup({ children, wide }: { children: ReactNode; wide: boolean }) {
  return wide ? (
    <View style={styles.row}>{children}</View>
  ) : (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, paddingBottom: spacing.xs },
});
