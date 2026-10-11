import type { LearningCard, LearningQuestion } from '@/domain/content/learning';
import { toeicVocabularyCards } from './toeic-vocabulary.ts';

/** Translated built-in examples; user-authored content is never rewritten. */
export const englishDemoContent: Readonly<
  Record<
    string,
    {
      cards: readonly Omit<LearningCard, 'id'>[];
      questions: readonly Omit<LearningQuestion, 'id'>[];
    }
  >
> = {
  english: {
    cards: [
      {
        front: 'What does “keep in touch” mean?',
        back: 'Stay in contact.\n“Let’s keep in touch!”',
      },
      {
        front: 'How do you politely ask for help?',
        back: '“Could you help me, please?”\nA polite way to ask for assistance.',
      },
    ],
    questions: [
      {
        question: 'What does “keep in touch” mean?',
        choices: [
          { id: 'a', text: 'Stay in contact' },
          { id: 'b', text: 'Stay quiet' },
          { id: 'c', text: 'Start working' },
        ],
        correctId: 'a',
        explanation:
          '“Keep in touch” means to continue communicating with someone, even when you do not meet often.',
      },
      {
        question: 'Which request for help is polite?',
        choices: [
          { id: 'a', text: 'Help me now.' },
          { id: 'b', text: 'Could you help me, please?' },
          { id: 'c', text: 'You must help me.' },
        ],
        correctId: 'b',
        explanation: '“Could you… please?” is a polite way to ask for help.',
      },
    ],
  },
  biology: {
    cards: [
      {
        front: 'What is photosynthesis?',
        back: 'Plants use light energy to produce organic compounds from CO₂ and water, releasing oxygen.',
      },
      {
        front: 'Which organelle performs photosynthesis?',
        back: 'The chloroplast, an organelle containing chlorophyll in plant cells.',
      },
    ],
    questions: [
      {
        question: 'Which organelle performs photosynthesis?',
        choices: [
          { id: 'a', text: 'Nucleus' },
          { id: 'b', text: 'Chloroplast' },
          { id: 'c', text: 'Ribosome' },
        ],
        correctId: 'b',
        explanation: 'Chloroplasts contain chlorophyll, which absorbs light for photosynthesis.',
      },
      {
        question: 'Which gas is released during photosynthesis?',
        choices: [
          { id: 'a', text: 'Oxygen' },
          { id: 'b', text: 'Nitrogen' },
          { id: 'c', text: 'Helium' },
        ],
        correctId: 'a',
        explanation: 'Plants release oxygen when water is split during photosynthesis.',
      },
    ],
  },
  astronomy: {
    cards: [
      {
        front: 'Which planet is famous for its rings?',
        back: 'Saturn. Its rings consist of particles of ice, rock and dust.',
      },
      { front: 'What does a light-year measure?', back: 'The distance light travels in one year.' },
    ],
    questions: [
      {
        question: 'What does a light-year measure?',
        choices: [
          { id: 'a', text: 'Time' },
          { id: 'b', text: 'Distance' },
          { id: 'c', text: 'Mass' },
        ],
        correctId: 'b',
        explanation: 'Despite the word “year”, a light-year is a unit of distance.',
      },
      {
        question: 'Which planet has prominent rings?',
        choices: [
          { id: 'a', text: 'Mercury' },
          { id: 'b', text: 'Venus' },
          { id: 'c', text: 'Saturn' },
        ],
        correctId: 'c',
        explanation: 'Saturn has a large ring system visible through a telescope.',
      },
    ],
  },
  toeic: {
    cards: toeicVocabularyCards.en,
    questions: [
      {
        question: 'What does “deadline” mean?',
        choices: [
          { id: 'a', text: 'Holiday schedule' },
          { id: 'b', text: 'Latest completion time' },
          { id: 'c', text: 'Meeting' },
        ],
        correctId: 'b',
        explanation: 'A deadline is the latest time by which work must be completed.',
      },
      {
        question: 'What does “appointment” mean?',
        choices: [
          { id: 'a', text: 'Arranged meeting' },
          { id: 'b', text: 'Report' },
          { id: 'c', text: 'Office' },
        ],
        correctId: 'a',
        explanation: 'An appointment is a meeting arranged in advance.',
      },
    ],
  },
};
