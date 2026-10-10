import type { IllustratedIconName, TopicTone } from '@/design-system';
import type { TranslationKey } from '@/shared/i18n';

import type { HomeArtworkName } from '../assets';

export const topics: readonly {
  id: string;
  label: TranslationKey;
  icon: IllustratedIconName;
  tone: TopicTone;
}[] = [
  { id: 'vocabulary', label: 'topic.vocabulary', icon: 'book', tone: 'yellow' },
  { id: 'science', label: 'topic.science', icon: 'atom', tone: 'pink' },
  { id: 'history', label: 'topic.history', icon: 'history', tone: 'blue' },
  { id: 'programming', label: 'topic.programming', icon: 'code', tone: 'mint' },
  { id: 'math', label: 'topic.math', icon: 'calculator', tone: 'purple' },
  { id: 'geography', label: 'topic.geography', icon: 'globe', tone: 'orange' },
];

export type HomeDeck = {
  id: string;
  title: string;
  subject: string;
  topic: string | null;
  tone: TopicTone;
  cardCount: number;
  questionCount: number;
  studyMode: 'flashcard' | 'quiz';
  dueCount: number;
  progress: number;
  artwork: HomeArtworkName;
};

/** Fixture values are only for the Home visual preview, never account statistics. */
export const sampleDecks: readonly (Omit<
  HomeDeck,
  'title' | 'subject' | 'questionCount' | 'studyMode'
> & {
  title: TranslationKey;
  subject: TranslationKey;
})[] = [
  {
    id: 'english',
    title: 'demo.english',
    subject: 'topic.english',
    topic: 'vocabulary',
    tone: 'yellow',
    cardCount: 120,
    dueCount: 12,
    progress: 75,
    artwork: 'conversation',
  },
  {
    id: 'biology',
    title: 'demo.biology',
    subject: 'topic.biology',
    topic: 'science',
    tone: 'green',
    cardCount: 85,
    dueCount: 8,
    progress: 40,
    artwork: 'biology',
  },
  {
    id: 'toeic',
    title: 'demo.toeic',
    subject: 'topic.vocabulary',
    topic: 'vocabulary',
    tone: 'mint',
    cardCount: 200,
    dueCount: 0,
    progress: 0,
    artwork: 'landscape',
  },
  {
    id: 'astronomy',
    title: 'demo.astronomy',
    subject: 'topic.astronomy',
    topic: 'science',
    tone: 'purple',
    cardCount: 96,
    dueCount: 0,
    progress: 0,
    artwork: 'planet',
  },
];

export const sampleDailyGoal = { streakDays: 12, completed: 24, total: 40, deckId: 'english' };
export const sampleActivity = { cards: 120, quizzes: 5, accuracy: 92 };
