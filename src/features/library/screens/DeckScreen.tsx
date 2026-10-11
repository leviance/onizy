import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AppText,
  Button,
  Dialog,
  FilterChip,
  Icon,
  IconButton,
  Screen,
  SegmentedControl,
  StateView,
  TextField,
  colors,
  radius,
  spacing,
} from '@/design-system';
import { defaultDeckPreference, libraryFolders } from '@/domain/content/deck-library';
import type { DeckPreference, LibraryFolder } from '@/domain/content/deck-library';
import type { LearningCard, LearningDeck, LearningQuestion } from '@/domain/content/learning';
import type { ReviewSchedule, SessionRecord, StudyMode } from '@/domain/review/learning-session';
import { deckReviewSummary } from '@/domain/review/review-summary';
import { useCurrentTime } from '@/shared/hooks/useCurrentTime';
import { useTranslation } from '@/shared/i18n';
import { DeckOverview } from '../components/DeckOverview';
import { DeckProgress } from '../components/DeckProgress';
import { selectDeckContent } from '../model/deck-content';
import type { DeckContentFilter } from '../model/deck-content';

export function DeckScreen({
  deck,
  schedules,
  records,
  preference = defaultDeckPreference,
  onStart,
  onBack,
  onToggleFavorite,
  onMoveToFolder,
}: {
  deck: LearningDeck | undefined;
  schedules: Readonly<Record<string, ReviewSchedule>>;
  records: readonly SessionRecord[];
  preference?: DeckPreference | undefined;
  onStart: (mode: StudyMode, ids?: readonly string[]) => void;
  onBack: () => void;
  onToggleFavorite: () => void;
  onMoveToFolder: (folder: LibraryFolder) => void;
}) {
  const { t } = useTranslation();
  const now = useCurrentTime();
  const [tab, setTab] = useState('content');
  const [filter, setFilter] = useState<DeckContentFilter>('all');
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<
    { kind: 'card'; item: LearningCard } | { kind: 'question'; item: LearningQuestion } | null
  >(null);
  if (!deck)
    return (
      <Screen includeTopInset>
        <StateView
          status="error"
          title={t('learning.missingDeck')}
          actionLabel={t('learning.backLibrary')}
          onAction={onBack}
        />
      </Screen>
    );
  const content = selectDeckContent(deck, query, filter);
  return (
    <Screen includeTopInset>
      <View style={styles.header}>
        <IconButton icon="back" label={t('common.back')} onPress={onBack} />
        <AppText variant="label" style={styles.grow}>
          {t('learning.deckDetails')}
        </AppText>
        <IconButton
          icon="more"
          label={t('library.options', { title: deck.title })}
          onPress={() => setMenuOpen(true)}
        />
      </View>
      <DeckOverview
        deck={deck}
        summary={deckReviewSummary(deck, schedules, now)}
        onStart={onStart}
      />
      <SegmentedControl
        label={t('deck.sections')}
        value={tab}
        onChange={setTab}
        options={[
          { value: 'content', label: t('learning.content') },
          { value: 'progress', label: t('common.progress') },
        ]}
      />
      {tab === 'progress' ? (
        <DeckProgress deck={deck} records={records} schedules={schedules} now={now} />
      ) : (
        <View style={styles.group}>
          <TextField
            label={t('deck.search')}
            placeholder={t('deck.search')}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            returnKeyType="search"
            leadingIcon={<Icon name="search" color={colors.text.secondary} />}
            trailingAction={
              query ? (
                <IconButton icon="close" label={t('common.clear')} onPress={() => setQuery('')} />
              ) : null
            }
          />
          <View style={styles.filters}>
            {(['all', 'cards', 'questions'] as const).map((value) => (
              <FilterChip
                key={value}
                label={t(
                  value === 'all'
                    ? 'common.all'
                    : value === 'cards'
                      ? 'learning.cards'
                      : 'learning.questions',
                )}
                selected={filter === value}
                onPress={() => setFilter(value)}
              />
            ))}
          </View>
          {content.cards.map((card) => (
            <View key={card.id} style={styles.item}>
              <View style={styles.itemHeading}>
                <AppText variant="h4" style={styles.grow}>
                  {card.front}
                </AppText>
                <IconButton
                  icon="more"
                  label={t('deck.itemOptions', { title: card.front })}
                  onPress={() => setSelected({ kind: 'card', item: card })}
                />
              </View>
              <AppText tone="secondary">{card.back}</AppText>
            </View>
          ))}
          {content.questions.map((question) => (
            <View key={question.id} style={styles.item}>
              <View style={styles.itemHeading}>
                <AppText variant="h4" style={styles.grow}>
                  {question.question}
                </AppText>
                <IconButton
                  icon="more"
                  label={t('deck.itemOptions', { title: question.question })}
                  onPress={() => setSelected({ kind: 'question', item: question })}
                />
              </View>
              <AppText variant="caption" tone="secondary">
                {t('learning.quiz')}
              </AppText>
            </View>
          ))}
          {!content.cards.length && !content.questions.length ? (
            <StateView
              status="empty"
              title={t('deck.noResults')}
              message={t('deck.noResultsBody')}
              {...(query || filter !== 'all'
                ? {
                    actionLabel: t('deck.clearFilters'),
                    onAction: () => {
                      setQuery('');
                      setFilter('all');
                    },
                  }
                : {})}
            />
          ) : null}
        </View>
      )}
      <Dialog visible={menuOpen} title={deck.title} onClose={() => setMenuOpen(false)}>
        <Button
          label={t(preference.favorite ? 'library.removeFavorite' : 'library.addFavorite')}
          variant="soft"
          onPress={() => {
            onToggleFavorite();
            setMenuOpen(false);
          }}
        />
        <AppText variant="label">{t('library.moveToFolder')}</AppText>
        <View style={styles.filters}>
          {libraryFolders.map((folder) => (
            <FilterChip
              key={folder}
              label={t(`library.folder.${folder}`)}
              selected={preference.folder === folder}
              onPress={() => {
                onMoveToFolder(folder);
                setMenuOpen(false);
              }}
            />
          ))}
        </View>
      </Dialog>
      <Dialog
        visible={!!selected}
        title={t(selected?.kind === 'question' ? 'learning.question' : 'learning.cards')}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <>
            <AppText variant="h4">
              {selected.kind === 'card' ? selected.item.front : selected.item.question}
            </AppText>
            {selected.kind === 'card' ? (
              <AppText tone="secondary">{selected.item.back}</AppText>
            ) : null}
            <Button
              label={t(selected.kind === 'card' ? 'deck.studyItem' : 'learning.startQuiz')}
              variant="tinted"
              onPress={() => {
                onStart(selected.kind === 'card' ? 'flashcard' : 'quiz', [selected.item.id]);
                setSelected(null);
              }}
            />
          </>
        ) : null}
      </Dialog>
    </Screen>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  grow: { flex: 1, minWidth: 0 },
  group: { gap: spacing.lg },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  item: {
    backgroundColor: colors.surface.card,
    padding: spacing.xl,
    borderRadius: radius.card,
    gap: spacing.sm,
  },
  itemHeading: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
});
