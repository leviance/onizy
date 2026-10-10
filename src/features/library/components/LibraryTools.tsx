import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  AppText,
  BrandArtwork,
  Button,
  Icon,
  Sparkle,
  colors,
  interaction,
  radius,
  spacing,
  useResponsiveLayout,
} from '@/design-system';
import { useTranslation } from '@/shared/i18n';
import { LibraryArtwork } from './LibraryArtwork';

function LibraryToolCard({ kind, onPress }: { kind: 'ai' | 'import'; onPress: () => void }) {
  const { t } = useTranslation();
  const { largeText } = useResponsiveLayout();
  const palette = colors.topic[kind === 'ai' ? 'yellow' : 'mint'];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.tool,
        { backgroundColor: palette.background },
        pressed && styles.pressed,
      ]}
    >
      {!largeText ? (
        <View style={styles.toolArtwork} aria-hidden>
          {kind === 'ai' ? (
            <>
              <BrandArtwork variant="mascot" width={80} />
              <View style={styles.bulb}>
                <Icon name="bulb" size={24} color={colors.topic.yellow.foreground} />
              </View>
            </>
          ) : (
            <LibraryArtwork name="browser-import" size={88} />
          )}
          <View style={styles.sparkle}>
            <Sparkle size={20} />
          </View>
        </View>
      ) : null}
      <View style={[styles.copy, styles.toolCopy]}>
        <AppText variant="label">
          {t(kind === 'ai' ? 'library.aiTitle' : 'library.importTitle')}
        </AppText>
        <AppText variant="bodySmall" tone="secondary">
          {t(kind === 'ai' ? 'library.aiBody' : 'library.importBody')}
        </AppText>
      </View>
      <View
        style={[
          styles.arrow,
          { backgroundColor: kind === 'ai' ? colors.explore.primary : colors.explore.green },
        ]}
      >
        <Icon name="arrow" size={18} color={colors.text.inverse} />
      </View>
    </Pressable>
  );
}
export function LibraryTools({
  onAI,
  onExtension,
  onCreate,
  onImport,
}: {
  onAI: () => void;
  onExtension: () => void;
  onCreate: () => void;
  onImport: () => void;
}) {
  const { t } = useTranslation();
  const { compact, wide, largeText } = useResponsiveLayout();
  const tools = (
    <>
      <View
        style={
          largeText
            ? styles.full
            : wide
              ? styles.half
              : [styles.toolWidth, compact && styles.compactToolWidth]
        }
      >
        <LibraryToolCard kind="import" onPress={onExtension} />
      </View>
      <View
        style={
          largeText
            ? styles.full
            : wide
              ? styles.half
              : [styles.toolWidth, compact && styles.compactToolWidth]
        }
      >
        <LibraryToolCard kind="ai" onPress={onAI} />
      </View>
    </>
  );
  return (
    <View style={styles.group}>
      {wide || largeText ? (
        <View style={[styles.row, largeText && styles.column]}>{tools}</View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {tools}
        </ScrollView>
      )}
      <View style={styles.quick}>
        <View style={styles.row}>
          {!largeText ? <LibraryArtwork name="new-cards" size={72} /> : null}
          <View style={styles.copy}>
            <AppText variant="label">{t('library.quickTitle')}</AppText>
            <AppText variant="bodySmall" tone="secondary">
              {t('library.quickBody')}
            </AppText>
          </View>
        </View>
        <View style={[styles.row, styles.actions]}>
          <Button
            label={t('library.manualCreate')}
            variant="tinted"
            leadingIcon="plus"
            onPress={onCreate}
            style={styles.quickAction}
          />
          <Button
            label={t('library.documentImport')}
            variant="secondary"
            leadingIcon="decks"
            onPress={onImport}
            style={styles.quickAction}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  group: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  half: { flex: 1 },
  full: { width: '100%' },
  column: { flexDirection: 'column', alignItems: 'stretch' },
  toolWidth: { width: 264 },
  compactToolWidth: { width: 236 },
  tool: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.card,
    minHeight: 158,
  },
  toolArtwork: { width: 88, height: 100, justifyContent: 'center' },
  bulb: {
    position: 'absolute',
    right: -3,
    top: 0,
    backgroundColor: colors.explore.sunny,
    borderRadius: radius.pill,
    padding: 3,
  },
  sparkle: { position: 'absolute', left: 0, bottom: 0 },
  copy: { flex: 1, gap: spacing.xs },
  toolCopy: { paddingBottom: spacing['2xl'] },
  arrow: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quick: {
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.surface.card,
    gap: spacing.lg,
  },
  actions: { flexWrap: 'wrap' },
  quickAction: { flexGrow: 1, flexBasis: 140 },
  pressed: { opacity: interaction.pressedOpacity },
});
