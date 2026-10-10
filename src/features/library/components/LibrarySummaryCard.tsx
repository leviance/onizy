import { StyleSheet, View } from 'react-native';
import {
  AppText,
  Button,
  Icon,
  IllustratedIcon,
  Sparkle,
  colors,
  fonts,
  radius,
  spacing,
  useResponsiveLayout,
} from '@/design-system';
import { useTranslation } from '@/shared/i18n';
import { LibraryArtwork } from './LibraryArtwork';

export function LibrarySummaryCard({
  deckCount,
  cardCount,
  dueCount,
  onCreate,
}: {
  deckCount: number;
  cardCount: number;
  dueCount: number;
  onCreate: () => void;
}) {
  const { t } = useTranslation();
  const { compact, wide, largeText } = useResponsiveLayout();
  return (
    <View style={styles.card}>
      <View style={styles.glow} pointerEvents="none" aria-hidden />
      <View style={styles.row}>
        <IllustratedIcon name="chart" size={22} color={colors.explore.sunny} />
        <AppText style={styles.white}>{t('library.summary')}</AppText>
      </View>
      <View style={styles.hero}>
        <View style={styles.copy}>
          <AppText style={[styles.count, compact && styles.compactCount]}>
            {t('library.decks', { count: deckCount })}
          </AppText>
          <View style={styles.row}>
            <Icon name="decks" size={18} color={colors.text.inverse} />
            <AppText variant="bodySmall" style={styles.white}>
              {t('common.cards', { count: cardCount })}
            </AppText>
          </View>
          <View style={styles.row}>
            <Icon name="clock" size={18} color={colors.text.inverse} />
            <AppText variant="bodySmall" style={styles.white}>
              {t('library.dueDecks', { count: dueCount })}
            </AppText>
          </View>
        </View>
        {!largeText ? (
          <View style={styles.artwork} aria-hidden>
            <View style={styles.sparkle}>
              <Sparkle size={22} color={colors.explore.sunny} />
            </View>
            <LibraryArtwork name="mascot-cards" size={wide ? 194 : compact ? 112 : 144} />
          </View>
        ) : null}
      </View>
      <Button
        label={t('library.create')}
        variant="link"
        leadingIcon="plus"
        trailingIcon="chevron"
        onPress={onCreate}
        style={styles.action}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    borderRadius: radius.hero,
    padding: spacing.xl,
    gap: spacing.lg,
    backgroundColor: colors.explore.primary,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 330,
    height: 330,
    right: -75,
    top: -70,
    borderRadius: radius.pill,
    backgroundColor: colors.explore.heroGlow,
    opacity: 0.6,
  },
  hero: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  artwork: { position: 'relative' },
  sparkle: { position: 'absolute', top: -14, left: 0 },
  copy: { flex: 1, gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  white: { color: colors.text.inverse, flexShrink: 1 },
  count: { color: colors.text.inverse, fontFamily: fonts.black, fontSize: 34, lineHeight: 40 },
  compactCount: { fontSize: 24, lineHeight: 32 },
  action: { backgroundColor: colors.surface.card, borderWidth: 0 },
});
