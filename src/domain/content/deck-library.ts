import type { LearningDeck } from './learning';
import type { ReviewSchedule, SessionRecord } from '../review/learning-session';
import { deckReviewSummary } from '../review/review-summary.ts';

export const libraryFolders = ['vocabulary', 'exam', 'personal'] as const;
export type LibraryFolder = (typeof libraryFolders)[number];
export type LibraryFilter = 'all' | 'recent' | 'favorites' | 'due' | 'downloaded';
export type LibrarySort = 'newest' | 'alphabetical' | 'progress';
export type DeckPreference = { favorite: boolean; folder: LibraryFolder };
export type LibraryPreferences = Readonly<Record<string, DeckPreference>>;
export const defaultDeckPreference: DeckPreference = { favorite: false, folder: 'personal' };

export function updateDeckPreference(
  decks: readonly LearningDeck[],
  preferences: LibraryPreferences,
  id: string,
  patch: Partial<DeckPreference>,
): LibraryPreferences {
  if (!decks.some((deck) => deck.id === id)) return preferences;
  if (patch.folder && !libraryFolders.includes(patch.folder)) return preferences;
  return { ...preferences, [id]: { ...(preferences[id] ?? defaultDeckPreference), ...patch } };
}

export function libraryEntries(
  decks: readonly LearningDeck[],
  schedules: Readonly<Record<string, ReviewSchedule>>,
  records: readonly SessionRecord[],
  preferences: LibraryPreferences,
  now: number,
) {
  const lastStudied = new Map<string, number>();
  for (const record of records)
    lastStudied.set(
      record.deckId,
      Math.max(lastStudied.get(record.deckId) ?? 0, record.finishedAt),
    );
  return decks.map((deck, index) => ({
    deck,
    position: index,
    preference: preferences[deck.id] ?? defaultDeckPreference,
    lastStudied: lastStudied.get(deck.id) ?? null,
    ...deckReviewSummary(deck, schedules, now),
  }));
}
export type LibraryEntry = ReturnType<typeof libraryEntries>[number];

function searchKey(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLocaleLowerCase();
}

export function selectLibraryEntries(
  entries: readonly LibraryEntry[],
  options: {
    query: string;
    filter: LibraryFilter;
    sort: LibrarySort;
    folder: LibraryFolder | null;
    locale: string;
    folderLabel: (folder: LibraryFolder) => string;
  },
) {
  const terms = searchKey(options.query).trim().split(/\s+/).filter(Boolean);
  const selected = entries.filter((entry) => {
    const content = searchKey(
      `${entry.deck.title} ${entry.deck.subject} ${options.folderLabel(entry.preference.folder)}`,
    );
    if (!terms.every((term) => content.includes(term))) return false;
    if (options.folder && entry.preference.folder !== options.folder) return false;
    switch (options.filter) {
      case 'recent':
        return entry.lastStudied !== null;
      case 'favorites':
        return entry.preference.favorite;
      case 'due':
        return entry.dueIds.length > 0;
      // No offline storage adapter exists yet; in-memory decks are not downloads.
      case 'downloaded':
        return false;
      default:
        return true;
    }
  });
  const collator = new Intl.Collator(options.locale, { numeric: true, sensitivity: 'base' });
  return selected.sort((a, b) => {
    if (options.sort === 'alphabetical') return collator.compare(a.deck.title, b.deck.title);
    if (options.sort === 'progress') return b.progress - a.progress || b.position - a.position;
    if (options.filter === 'recent') return (b.lastStudied ?? 0) - (a.lastStudied ?? 0);
    return b.position - a.position;
  });
}
