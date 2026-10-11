import type { LearningDeck } from '@/domain/content/learning';
import { normalizeSearch } from '../../../shared/utils/search.ts';

export type DeckContentFilter = 'all' | 'cards' | 'questions';

/** Search both card faces without changing authored content or its order. */
export function selectDeckContent(deck: LearningDeck, query: string, filter: DeckContentFilter) {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  const matches = (text: string) => terms.every((term) => normalizeSearch(text).includes(term));
  return {
    cards:
      filter === 'questions'
        ? []
        : deck.cards.filter((card) => matches(`${card.front} ${card.back}`)),
    questions:
      filter === 'cards' ? [] : deck.questions.filter((question) => matches(question.question)),
  };
}
