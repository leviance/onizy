import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, useResponsiveLayout } from '@/design-system';

/** The action stays above the device inset; only the question body scrolls. */
export function QuizScaffold({
  children,
  header,
  footer,
  scrollKey,
  intro = false,
}: PropsWithChildren<{
  header: ReactNode;
  footer: ReactNode;
  scrollKey?: string | undefined;
  intro?: boolean;
}>) {
  const { gutter } = useResponsiveLayout();
  return (
    <SafeAreaView
      style={styles.root}
      edges={{ top: 'maximum', bottom: 'maximum', left: 'additive', right: 'additive' }}
    >
      <View pointerEvents="none" style={styles.wave} accessible={false} aria-hidden>
        <Svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
          <Path
            d="M0 210C75 168 90 250 185 226C280 202 280 42 400 30V300H0Z"
            fill={colors.brand.soft}
            opacity={0.65}
          />
          <Path
            d="M0 280C120 132 190 155 400 250V300H0Z"
            fill={colors.topic.orange.background}
            opacity={0.28}
          />
        </Svg>
      </View>
      {intro ? (
        <View pointerEvents="none" style={styles.introWave} accessible={false} aria-hidden>
          <Svg width="100%" height="100%" viewBox="0 0 400 260" preserveAspectRatio="none">
            <Path
              d="M0 40C30 0 82 18 80 40C78 75 0 88 10 115C20 145 80 100 102 148C120 190 46 232 0 260Z"
              fill={colors.topic.orange.highlight}
              opacity={0.55}
            />
            <Path
              d="M400 0C265 20 364 62 310 106C272 140 322 185 400 172Z"
              fill={colors.topic.orange.highlight}
              opacity={0.6}
            />
          </Svg>
        </View>
      ) : null}
      <View style={[styles.header, { paddingHorizontal: gutter }]}>{header}</View>
      <ScrollView
        key={scrollKey}
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingHorizontal: gutter }]}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      <View style={[styles.footer, { paddingHorizontal: gutter }]}>{footer}</View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface.onboarding,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.sm,
  },
  wave: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 270 },
  introWave: { position: 'absolute', top: 60, left: 0, right: 0, height: 230 },
  header: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  scroll: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  footer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
});
