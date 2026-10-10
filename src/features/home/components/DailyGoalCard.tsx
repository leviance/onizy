import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  AppText,
  Button,
  ProgressBar,
  StreakBadge,
  Sparkle,
  colors,
  fonts,
  radius,
  spacing,
  useResponsiveLayout,
} from '@/design-system';
import { useTranslation } from '@/shared/i18n';

import { HomeArtwork } from './HomeArtwork';

export function DailyGoalCard({
  streakDays,
  completed,
  total,
  onContinue,
}: {
  streakDays: number;
  completed: number;
  total: number;
  onContinue: () => void;
}) {
  const { formatText, t } = useTranslation();
  const { compact, largeText, wide } = useResponsiveLayout();
  return (
    <View style={styles.card}>
      <View style={styles.glow} pointerEvents="none" aria-hidden>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 350 260"
          preserveAspectRatio="none"
          aria-hidden
        >
          <Path
            d="M184-30C117 53 168 157 252 184s113 72 135 108V-30Z"
            fill={colors.explore.heroGlow}
          />
        </Svg>
      </View>
      <View style={styles.hero}>
        <View style={styles.copy}>
          <StreakBadge days={streakDays} prominent />
          <View style={styles.daysRow}>
            <AppText style={[styles.days, compact && styles.compactDays]}>
              {formatText('home.days', { count: streakDays })}
            </AppText>
            {!compact && !largeText ? <Sparkle size={18} color={colors.explore.sunny} /> : null}
          </View>
        </View>
        {!largeText ? (
          <View style={styles.artwork} aria-hidden>
            <View style={styles.artSparkle}>
              <Sparkle size={26} color={colors.explore.sunny} />
            </View>
            <HomeArtwork name="reading-book" size={wide ? 194 : compact ? 118 : 148} />
          </View>
        ) : null}
      </View>
      <ProgressBar
        value={completed}
        total={total}
        label={formatText('home.todayGoal', { value: completed, total })}
        tone="yellow"
        appearance="onBrand"
      />
      <Button
        variant="link"
        label={t('home.continue')}
        leadingIcon="play"
        trailingIcon="chevron"
        onPress={onContinue}
        style={styles.action}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
    borderRadius: radius.hero,
    backgroundColor: colors.explore.primary,
    gap: spacing.lg,
    overflow: 'hidden',
  },
  glow: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, opacity: 0.7 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  copy: { flex: 1, gap: spacing.sm },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
  days: { fontFamily: fonts.black, fontSize: 36, lineHeight: 42, color: colors.text.inverse },
  compactDays: { fontSize: 30, lineHeight: 38 },
  artwork: { position: 'relative' },
  artSparkle: { position: 'absolute', top: -8, right: 2 },
  action: { borderWidth: 0, backgroundColor: colors.surface.card },
});
