import { Pressable, StyleSheet, View } from 'react-native';
import {
  AppText,
  Icon,
  IllustratedIcon,
  colors,
  interaction,
  radius,
  spacing,
} from '@/design-system';
import type { LibraryFolder } from '@/domain/content/deck-library';
import { useTranslation } from '@/shared/i18n';
import { LibraryArtwork } from './LibraryArtwork';

export function LibraryFolderCard({
  folder,
  count,
  selected,
  onPress,
}: {
  folder: LibraryFolder;
  count: number;
  selected: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const palette =
    colors.topic[folder === 'vocabulary' ? 'yellow' : folder === 'exam' ? 'orange' : 'mint'];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${t(`library.folder.${folder}`)}, ${t('library.decks', { count })}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: palette.background,
          borderColor: selected ? palette.accent : 'transparent',
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.artwork, { backgroundColor: palette.highlight }]} aria-hidden>
        {folder === 'vocabulary' ? (
          <LibraryArtwork name="folder" size={40} />
        ) : folder === 'exam' ? (
          <IllustratedIcon name="target" size={38} />
        ) : (
          <Icon name="user" size={38} color={colors.topic.green.accent} />
        )}
      </View>
      <View style={styles.copy}>
        <AppText variant="label">{t(`library.folder.${folder}`)}</AppText>
        <AppText variant="bodySmall" tone="secondary">
          {t('library.decks', { count })}
        </AppText>
      </View>
      <Icon name="chevron" size={18} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 100,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 2,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: spacing.xs },
  pressed: { opacity: interaction.pressedOpacity },
});
