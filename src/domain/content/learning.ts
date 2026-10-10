export type LearningCard = { id: string; front: string; back: string };
export type LearningQuestion = {
  id: string;
  question: string;
  choices: readonly { id: string; text: string }[];
  correctId: string;
  explanation: string;
};
export type LearningDeck = {
  id: string;
  title: string;
  subject: string;
  cards: readonly LearningCard[];
  questions: readonly LearningQuestion[];
  sample: boolean;
};
