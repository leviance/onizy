import { normalizeSearch } from '@/shared/utils/search';

export function filterDecks<T extends { title: string; topic: string | null }>(
  decks: readonly T[],
  query: string,
  topic: string | null,
): T[] {
  const needle = normalizeSearch(query);
  return decks.filter(
    (deck) => (!topic || deck.topic === topic) && normalizeSearch(deck.title).includes(needle),
  );
}
