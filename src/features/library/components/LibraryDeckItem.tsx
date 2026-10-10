import { StyleSheet, View } from 'react-native';
import {
  AppText,
  Button,
  Card,
  DeckCard,
  IconButton,
  IllustratedIcon,
  colors,
  spacing,
} from '@/design-system';
import type { TopicTone } from '@/design-system';
import type { LibraryEntry } from '@/domain/content/deck-library';
import { useTranslation } from '@/shared/i18n';
import { LibraryArtwork } from './LibraryArtwork';

export function LibraryDeckItem({
  entry,
  onOpen,
  onOptions,
}: {
  entry: LibraryEntry;
  onOpen: () => void;
  onOptions: () => void;
}) {
  const { t, formatDate } = useTranslation();
  const { deck } = entry;
  const status =
    entry.lastStudied !== null
      ? t('library.lastStudied', {
          date: formatDate(entry.lastStudied, { day: 'numeric', month: 'short' }),
        })
      : !deck.sample
        ? t(`library.folder.${entry.preference.folder}`)
        : null;
  const tone: TopicTone =
    deck.id === 'biology'
      ? 'pink'
      : deck.id === 'astronomy'
        ? 'purple'
        : deck.id === 'english'
          ? 'yellow'
          : 'mint';
  const artwork =
    deck.id === 'english' ? (
      <LibraryArtwork name="conversation" size={56} />
    ) : deck.id === 'astronomy' ? (
      <LibraryArtwork name="planet" size={56} />
    ) : deck.id === 'biology' ? (
      <IllustratedIcon name="atom" size={48} />
    ) : (
      <LibraryArtwork name="stack-books" size={56} />
    );
  return (
    <View style={styles.item}>
      {!deck.cards.length && deck.questions.length ? (
        <Card style={styles.quizDeck}>
          <View style={styles.quizHeading}>
            {artwork}
            <View style={styles.quizContent}>
              <AppText variant="label" accessibilityRole="header">
                {deck.title}
              </AppText>
              <AppText variant="bodySmall" tone="secondary">
                {deck.subject}
              </AppText>
            </View>
          </View>
          <AppText variant="bodySmall" tone="secondary">
            {t('common.questions', { count: deck.questions.length })}
          </AppText>
          <Button
            label={t('learning.startQuiz')}
            accessibilityLabel={`${t('learning.startQuiz')}: ${deck.title}`}
            variant="tinted"
            trailingIcon="chevron"
            onPress={onOpen}
          />
        </Card>
      ) : (
        <DeckCard
          title={deck.title}
          subject={deck.subject}
          cardCount={deck.cards.length}
          dueCount={entry.dueIds.length}
          progress={entry.progress}
          tone={tone}
          appearance="expressive"
          artwork={artwork}
          onOpen={onOpen}
        />
      )}
      <View style={styles.toolbar}>
        {status ? (
          <AppText variant="caption" tone="tertiary" style={styles.status}>
            {status}
          </AppText>
        ) : (
          <View style={styles.status} />
        )}
        {entry.preference.favorite ? (
          <LibraryArtwork name="heart" size={18} tintColor={colors.explore.primary} />
        ) : null}
        <IconButton
          icon="more"
          label={t('library.options', { title: deck.title })}
          onPress={onOptions}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  item: { gap: spacing.xs },
  toolbar: {
    paddingLeft: spacing.xl,
    paddingRight: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
  },
  status: { flex: 1 },
  quizDeck: { borderColor: colors.border.subtle, borderWidth: 1 },
  quizHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  quizContent: { flex: 1, minWidth: 0, gap: spacing.xs },
});
