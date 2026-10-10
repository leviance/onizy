import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, colors, fonts, radius, spacing } from '@/design-system';
import { useTranslation } from '@/shared/i18n';

import { FooterDecoration, OnboardingArtwork } from '../components/OnboardingArtwork';
import { SlideToStart } from '../components/SlideToStart';
import { onboardingSlides } from '../model/slides';

type OnboardingScreenProps = {
  onFinish: () => void;
};

export function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const { t } = useTranslation();
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = onboardingSlides[activeIndex] ?? onboardingSlides[0];
  const isLastSlide = activeIndex === onboardingSlides.length - 1;
  const frameWidth = Math.min(width, 520);
  const scale = frameWidth / 390;
  const bottomPadding = Math.max(insets.bottom, spacing.lg);
  const artworkHeight = Math.min(
    frameWidth * 1.34,
    Math.max(
      frameWidth * 0.82,
      height - insets.top - bottomPadding - Math.max(264, 264 * scale * fontScale),
    ),
  );

  const advance = useCallback(() => {
    if (isLastSlide) onFinish();
    else setActiveIndex((index) => index + 1);
  }, [isLastSlide, onFinish]);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { minHeight: height }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
      >
        <View style={[styles.frame, { width: frameWidth, minHeight: height }]}>
          <OnboardingArtwork height={artworkHeight + insets.top} />
          <View
            style={[
              styles.content,
              { paddingHorizontal: 27 * scale, paddingBottom: bottomPadding },
            ]}
          >
            <FooterDecoration scale={scale} />
            <View
              style={styles.pagination}
              accessible
              accessibilityLabel={`${t('onboarding.progress')} ${activeIndex + 1} / ${onboardingSlides.length}`}
            >
              {onboardingSlides.map((item, index) => (
                <View
                  key={item.title}
                  style={[
                    styles.dot,
                    { width: (index === activeIndex ? 27 : 10) * scale, height: 8 * scale },
                    index === activeIndex && styles.activeDot,
                  ]}
                />
              ))}
            </View>
            <AppText
              accessibilityRole="header"
              accessibilityLiveRegion="polite"
              style={[
                styles.title,
                { fontSize: 44.5 * scale, lineHeight: 48 * scale, letterSpacing: -1.5 * scale },
              ]}
            >
              {t(slide.title)}
            </AppText>
            <AppText
              tone="secondary"
              style={[
                styles.description,
                { fontSize: Math.max(14, 15 * scale), lineHeight: 20 * scale },
              ]}
            >
              {t(slide.description)}
            </AppText>
            <View style={styles.action}>
              <SlideToStart
                key={activeIndex}
                label={t(
                  isLastSlide
                    ? 'onboarding.finish'
                    : activeIndex === 0
                      ? 'onboarding.start'
                      : 'onboarding.continue',
                )}
                hint={t('onboarding.continueHint')}
                onComplete={advance}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.onboarding },
  scrollContent: { alignItems: 'center' },
  frame: { overflow: 'hidden' },
  content: { paddingTop: spacing['2xl'], flexGrow: 1 },
  pagination: { flexDirection: 'row', gap: 5, marginBottom: spacing.lg },
  dot: { borderRadius: radius.pill, backgroundColor: colors.accent.inactiveDot },
  activeDot: { backgroundColor: colors.accent.tangerine },
  title: { fontFamily: fonts.black, color: colors.accent.ink },
  description: { marginTop: spacing.sm },
  action: { marginTop: spacing.xl },
});
