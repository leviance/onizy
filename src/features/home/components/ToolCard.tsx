import { Pressable, StyleSheet, View } from 'react-native';

import {
  AppText,
  BrandArtwork,
  Icon,
  Sparkle,
  colors,
  elevation,
  radius,
  spacing,
} from '@/design-system';
import { useTranslation } from '@/shared/i18n';

import { HomeArtwork } from './HomeArtwork';

export function ToolCard({ kind, onPress }: { kind: 'ai' | 'import'; onPress: () => void }) {
  const { t } = useTranslation();
  const palette = colors.topic[kind === 'ai' ? 'yellow' : 'green'];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: palette.background },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[styles.glow, { backgroundColor: palette.highlight }]}
        pointerEvents="none"
        aria-hidden
      />
      <View style={styles.sparkle} pointerEvents="none" aria-hidden>
        <Sparkle size={22} />
      </View>
      <View style={styles.artwork} aria-hidden>
        {kind === 'ai' ? (
          <>
            <BrandArtwork variant="mascot" width={88} />
            <View style={styles.bulb}>
              <Icon name="bulb" size={26} color={palette.foreground} />
            </View>
          </>
        ) : (
          <HomeArtwork name="browser-import" size={92} />
        )}
      </View>
      <View style={styles.copy}>
        <AppText variant="label">{t(kind === 'ai' ? 'home.aiTitle' : 'home.importTitle')}</AppText>
        <AppText variant="bodySmall" tone="secondary">
          {t(kind === 'ai' ? 'home.aiBody' : 'home.importBody')}
        </AppText>
      </View>
      <View
        style={[
          styles.arrow,
          { backgroundColor: kind === 'ai' ? colors.explore.primary : colors.explore.green },
        ]}
      >
        <Icon name="arrow" size={18} color={colors.text.primary} />
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.sm,
    minHeight: 190,
    overflow: 'hidden',
    boxShadow: elevation.soft,
  },
  artwork: { flexDirection: 'row', height: 92, alignItems: 'center' },
  bulb: {
    alignSelf: 'flex-start',
    marginLeft: -8,
    backgroundColor: colors.explore.sunny,
    borderRadius: radius.pill,
    padding: spacing.xs,
  },
  glow: {
    position: 'absolute',
    top: -70,
    right: -55,
    width: 190,
    height: 190,
    borderRadius: radius.pill,
    opacity: 0.65,
  },
  sparkle: { position: 'absolute', top: 22, right: 24 },
  copy: { gap: spacing.xs, paddingRight: spacing['2xl'] },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 14,
    bottom: 14,
  },
  pressed: { opacity: 0.8 },
});
