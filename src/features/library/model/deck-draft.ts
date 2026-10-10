import type { LearningDeck } from '@/domain/content/learning';

export type CardDraft = { front: string; back: string };
export type QuestionDraft = {
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};
export function buildDeckDraft(
  id: string,
  title: string,
  subject: string,
  cards: readonly CardDraft[],
  questions: readonly QuestionDraft[],
): LearningDeck | null {
  const filledCards = cards.filter((card) => card.front.trim() || card.back.trim());
  const filledQuestions = questions.filter(
    (question) =>
      question.question.trim() ||
      question.explanation.trim() ||
      question.choices.some((choice) => choice.trim()),
  );
  if (
    !title.trim() ||
    (!filledCards.length && !filledQuestions.length) ||
    filledCards.some((card) => !card.front.trim() || !card.back.trim()) ||
    filledQuestions.some(
      (question) =>
        !question.question.trim() ||
        !question.explanation.trim() ||
        question.choices.length < 2 ||
        question.choices.some((choice) => !choice.trim()) ||
        new Set(question.choices.map((choice) => choice.trim().toLowerCase())).size !==
          question.choices.length ||
        !Number.isInteger(question.correctIndex) ||
        question.correctIndex < 0 ||
        question.correctIndex >= question.choices.length,
    )
  )
    return null;
  return {
    id,
    title: title.trim(),
    subject: subject.trim(),
    sample: false,
    cards: filledCards.map((card, index) => ({
      id: `${id}-card-${index}`,
      front: card.front.trim(),
      back: card.back.trim(),
    })),
    questions: filledQuestions.map((question, index) => ({
      id: `${id}-quiz-${index}`,
      question: question.question.trim(),
      choices: question.choices.map((text, choice) => ({ id: String(choice), text: text.trim() })),
      correctId: String(question.correctIndex),
      explanation: question.explanation.trim(),
    })),
  };
}
