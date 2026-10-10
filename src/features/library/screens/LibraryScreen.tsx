import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppText,
  BottomNavigation,
  BrandArtwork,
  Button,
  Dialog,
  FilterChip,
  IconButton,
  SectionHeading,
  StateView,
  colors,
  layout,
  spacing,
  useResponsiveLayout,
  useScrollNavigation,
} from '@/design-system';
import type { NavigationKey } from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import {
  libraryEntries,
  libraryFolders,
  selectLibraryEntries,
} from '@/domain/content/deck-library';
import type {
  LibraryFilter,
  LibraryFolder,
  LibraryPreferences,
  LibrarySort,
} from '@/domain/content/deck-library';
import type { ReviewSchedule, SessionRecord } from '@/domain/review/learning-session';
import { useCurrentTime } from '@/shared/hooks/useCurrentTime';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { useTranslation } from '@/shared/i18n';
import type { TranslationKey } from '@/shared/i18n';

import { LibraryBackdrop } from '../components/LibraryBackdrop';
import { LibraryChip, LibraryControls } from '../components/LibraryControls';
import { LibraryDeckItem } from '../components/LibraryDeckItem';
import { LibraryFolderCard } from '../components/LibraryFolderCard';
import { LibrarySummaryCard } from '../components/LibrarySummaryCard';
import { LibraryTools } from '../components/LibraryTools';

type LibraryScreenProps = {
  decks: readonly LearningDeck[];
  schedules: Readonly<Record<string, ReviewSchedule>>;
  records: readonly SessionRecord[];
  preferences: LibraryPreferences;
  onToggleFavorite: (id: string) => void;
  onMoveToFolder: (id: string, folder: LibraryFolder) => void;
  onOpenDeck: (id: string) => void;
  onNavigate: (key: NavigationKey) => void;
};
type Notice = 'notifications' | 'ai' | 'extension' | 'document';
const noticeCopy: Record<Notice, { title: TranslationKey; body: TranslationKey }> = {
  notifications: { title: 'home.notifications', body: 'home.noNotifications' },
  ai: { title: 'library.aiTitle', body: 'home.aiNotice' },
  extension: { title: 'library.importTitle', body: 'home.importNotice' },
  document: { title: 'library.documentImport', body: 'library.documentNotice' },
};

export function LibraryScreen({
  decks,
  schedules,
  records,
  preferences,
  onToggleFavorite,
  onMoveToFolder,
  onOpenDeck,
  onNavigate,
}: LibraryScreenProps) {
  const { t, locale } = useTranslation();
  const { compact, wide, largeText, gutter } = useResponsiveLayout();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const scroll = useRef<ScrollView>(null);
  const navigation = useScrollNavigation();
  const now = useCurrentTime();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<LibraryFilter>('all');
  const [sort, setSort] = useState<LibrarySort>('newest');
  const [folder, setFolder] = useState<LibraryFolder | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [foldersOpen, setFoldersOpen] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const entries = libraryEntries(decks, schedules, records, preferences, now);
  const matches = selectLibraryEntries(entries, {
    query,
    filter,
    sort,
    folder,
    locale,
    folderLabel: (value) => t(`library.folder.${value}`),
  });
  const menuEntry = entries.find((entry) => entry.deck.id === menuId);
  const filtering = Boolean(query.trim() || folder || filter !== 'all');
  const hasFlashcards = decks.some((deck) => deck.cards.length);
  const unfilteredDue = filter === 'due' && !query.trim() && !folder;
  const reviewDone = unfilteredDue && hasFlashcards && !matches.length;
  const create = () => onNavigate('create');
  const clearFilters = () => {
    setQuery('');
    setFolder(null);
    setFilter('all');
  };
  const chooseFolder = (value: LibraryFolder) => {
    setFolder(value);
    setFoldersOpen(false);
  };
  const navigate = (key: NavigationKey) => {
    if (key === 'library') scroll.current?.scrollTo({ y: 0, animated: !reducedMotion });
    else onNavigate(key);
  };
  const countInFolder = (value: LibraryFolder) =>
    entries.filter((entry) => entry.preference.folder === value).length;
  const emptyTitle: TranslationKey = !decks.length
    ? 'library.emptyTitle'
    : unfilteredDue && !hasFlashcards
      ? 'learning.noFlashcards'
      : filter === 'favorites'
        ? 'library.noFavorites'
        : filter === 'recent'
          ? 'library.noRecent'
          : filter === 'downloaded'
            ? 'library.noDownloads'
            : 'library.noMatches';
  const emptyBody: TranslationKey = !decks.length
    ? 'library.emptyDescription'
    : unfilteredDue && !hasFlashcards
      ? 'learning.noFlashcardsBody'
      : filter === 'favorites'
        ? 'library.noFavoritesBody'
        : filter === 'recent'
          ? 'library.noRecentBody'
          : filter === 'downloaded'
            ? 'library.offlineBody'
            : 'library.noMatchesBody';
  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <Animated.ScrollView
        ref={scroll}
        testID="library-scroll"
        onScroll={navigation.onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: gutter,
            paddingTop: Math.max(insets.top, spacing['3xl']),
            paddingBottom: navigation.bottomPadding,
          },
        ]}
      >
        {!largeText ? <LibraryBackdrop /> : null}
        <View style={styles.header}>
          {!largeText ? (
            <View aria-hidden>
              <BrandArtwork variant="mascot" width={compact ? 48 : 60} />
            </View>
          ) : null}
          <View style={styles.heading}>
            <AppText
              variant="h3"
              accessibilityRole="header"
              style={compact ? styles.compactTitle : undefined}
            >
              {t('library.title')}
            </AppText>
            <AppText variant="bodySmall" tone="secondary">
              {t('library.description')}
            </AppText>
          </View>
          <IconButton
            icon="bell"
            label={t('home.notifications')}
            onPress={() => setNotice('notifications')}
          />
        </View>
        <LibraryControls
          query={query}
          onQuery={setQuery}
          filter={filter}
          onFilter={setFilter}
          sort={sort}
          onSort={setSort}
          onOpenFilters={() => setFiltersOpen(true)}
        />
        {!filtering ? (
          <>
            <LibrarySummaryCard
              deckCount={decks.length}
              cardCount={decks.reduce((sum, deck) => sum + deck.cards.length, 0)}
              dueCount={entries.filter((entry) => entry.dueIds.length > 0).length}
              onCreate={create}
            />
            <View style={styles.section}>
              <SectionHeading
                title={t('library.folders')}
                accent="orange"
                onViewAll={() => setFoldersOpen(true)}
                decorate={!largeText}
              />
              {wide ? (
                <View style={styles.folderGrid}>
                  {libraryFolders.map((value) => (
                    <View key={value} style={styles.folderColumn}>
                      <LibraryFolderCard
                        folder={value}
                        count={countInFolder(value)}
                        selected={folder === value}
                        onPress={() => chooseFolder(value)}
                      />
                    </View>
                  ))}
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.folderRow}
                >
                  {libraryFolders.map((value) => (
                    <View key={value} style={styles.folderWidth}>
                      <LibraryFolderCard
                        folder={value}
                        count={countInFolder(value)}
                        selected={folder === value}
                        onPress={() => chooseFolder(value)}
                      />
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </>
        ) : null}
        <View style={styles.section}>
          <SectionHeading
            title={
              folder
                ? t(`library.folder.${folder}`)
                : t(filtering ? 'library.results' : 'library.myDecks')
            }
            decorate={!largeText}
          />
          {filtering ? (
            <Button
              label={t('library.showAll')}
              variant="link"
              leadingIcon="close"
              onPress={clearFilters}
              style={styles.clear}
            />
          ) : null}
          {matches.length ? (
            <View style={[styles.deckList, wide && styles.deckGrid]}>
              {matches.map((entry) => (
                <View key={entry.deck.id} style={wide ? styles.deckColumn : undefined}>
                  <LibraryDeckItem
                    entry={entry}
                    onOpen={() => onOpenDeck(entry.deck.id)}
                    onOptions={() => setMenuId(entry.deck.id)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <StateView
              status={reviewDone ? 'complete' : 'empty'}
              title={reviewDone ? t('learning.reviewDone') : t(emptyTitle)}
              message={reviewDone ? t('learning.reviewDoneBody') : t(emptyBody)}
              actionLabel={t(decks.length ? 'library.showAll' : 'library.create')}
              onAction={decks.length ? clearFilters : create}
            />
          )}
        </View>
        {!filtering ? (
          <View style={styles.section}>
            <SectionHeading title={t('library.tools')} accent="yellow" decorate={!largeText} />
            <LibraryTools
              onAI={() => setNotice('ai')}
              onExtension={() => setNotice('extension')}
              onCreate={create}
              onImport={() => setNotice('document')}
            />
          </View>
        ) : null}
      </Animated.ScrollView>
      <BottomNavigation
        active="library"
        visible={navigation.visible}
        hideProgress={navigation.hideProgress}
        appearance="expressive"
        onNavigate={navigate}
        onHeightChange={navigation.onNavigationHeightChange}
      />
      <Dialog
        visible={filtersOpen}
        title={t('library.filters')}
        onClose={() => setFiltersOpen(false)}
      >
        <View style={styles.dialogChoices}>
          {(['all', 'recent', 'favorites', 'due', 'downloaded'] as const).map((value) => (
            <LibraryChip
              key={value}
              label={t(`library.filter.${value}`)}
              selected={filter === value}
              onPress={() => {
                setFilter(value);
                setFiltersOpen(false);
              }}
            />
          ))}
        </View>
        <AppText variant="label">{t('library.sort')}</AppText>
        <View style={styles.dialogChoices}>
          {(['newest', 'alphabetical', 'progress'] as const).map((value) => (
            <LibraryChip
              key={value}
              label={t(`library.sort.${value}`)}
              selected={sort === value}
              outlined
              onPress={() => {
                setSort(value);
                setFiltersOpen(false);
              }}
            />
          ))}
        </View>
      </Dialog>
      <Dialog
        visible={foldersOpen}
        title={t('library.folders')}
        onClose={() => setFoldersOpen(false)}
      >
        {libraryFolders.map((value) => (
          <LibraryFolderCard
            key={value}
            folder={value}
            count={countInFolder(value)}
            selected={folder === value}
            onPress={() => chooseFolder(value)}
          />
        ))}
      </Dialog>
      <Dialog
        visible={Boolean(menuEntry)}
        title={menuEntry?.deck.title ?? t('library.title')}
        onClose={() => setMenuId(null)}
      >
        {menuEntry ? (
          <>
            <Button
              label={t(
                menuEntry.preference.favorite ? 'library.removeFavorite' : 'library.addFavorite',
              )}
              variant="tinted"
              onPress={() => {
                onToggleFavorite(menuEntry.deck.id);
                setMenuId(null);
              }}
            />
            <AppText variant="label">{t('library.moveToFolder')}</AppText>
            <View style={styles.dialogChoices}>
              {libraryFolders.map((value) => (
                <FilterChip
                  key={value}
                  label={t(`library.folder.${value}`)}
                  selected={menuEntry.preference.folder === value}
                  onPress={() => {
                    onMoveToFolder(menuEntry.deck.id, value);
                    setMenuId(null);
                  }}
                />
              ))}
            </View>
            <Button
              label={t('common.reviewNow')}
              variant="secondary"
              onPress={() => {
                setMenuId(null);
                onOpenDeck(menuEntry.deck.id);
              }}
            />
          </>
        ) : null}
      </Dialog>
      <Dialog
        visible={notice !== null}
        title={notice ? t(noticeCopy[notice].title) : ''}
        message={notice ? t(noticeCopy[notice].body) : ''}
        onClose={() => setNotice(null)}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.explore.canvas },
  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: layout.homeMaxWidth,
    gap: spacing['2xl'],
  },
  header: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  heading: { flex: 1, gap: spacing.xs },
  compactTitle: { fontSize: 20, lineHeight: 26 },
  section: { gap: spacing.lg },
  folderRow: { gap: spacing.md },
  folderWidth: { width: 196 },
  folderGrid: { flexDirection: 'row', gap: spacing.md },
  folderColumn: { flex: 1 },
  deckList: { gap: spacing.lg },
  deckGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl, alignItems: 'flex-start' },
  deckColumn: { flexBasis: '48%', flexGrow: 1 },
  clear: { alignSelf: 'flex-start' },
  dialogChoices: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
