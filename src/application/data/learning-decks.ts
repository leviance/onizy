import type { LearningDeck } from '@/domain/content/learning';
import type { LibraryPreferences } from '@/domain/content/deck-library';
import type { LearningState } from '@/domain/review/learning-state';
import { locales } from '../../shared/i18n/resources.ts';
import type { Locale, TranslationKey } from '../../shared/i18n/resources.ts';
import { englishDemoContent } from './learning-decks.en.ts';

type StudySample = {
  title: string;
  cards: readonly { front: string; back: string }[];
  questions: readonly {
    question: string;
    choices: readonly { id: string; text: string }[];
    correctId: string;
    explanation: string;
  }[];
};

const english: StudySample = {
  title: 'Tiếng Anh giao tiếp',
  cards: [
    {
      front: 'What does “keep in touch” mean?',
      back: 'Giữ liên lạc.\n“Let’s keep in touch!” — Hãy giữ liên lạc nhé!',
    },
    {
      front: 'How do you politely ask for help?',
      back: '“Could you help me, please?”\nBạn có thể giúp tôi được không?',
    },
  ],
  questions: [
    {
      question: '“Keep in touch” có nghĩa là gì?',
      choices: [
        { id: 'a', text: 'Giữ liên lạc' },
        { id: 'b', text: 'Giữ yên lặng' },
        { id: 'c', text: 'Bắt đầu làm việc' },
      ],
      correctId: 'a',
      explanation:
        '“Keep in touch” nghĩa là tiếp tục liên lạc với một người, dù không thường xuyên gặp nhau.',
    },
    {
      question: 'Câu nào là lời đề nghị giúp đỡ lịch sự?',
      choices: [
        { id: 'a', text: 'Help me now.' },
        { id: 'b', text: 'Could you help me, please?' },
        { id: 'c', text: 'You must help me.' },
      ],
      correctId: 'b',
      explanation: '“Could you… please?” là cách đề nghị lịch sự trong giao tiếp.',
    },
  ],
};
const biology: StudySample = {
  title: 'Sinh học cơ bản',
  cards: [
    {
      front: 'Quang hợp là gì?',
      back: 'Quá trình thực vật sử dụng năng lượng ánh sáng để tạo chất hữu cơ từ CO₂ và nước; đồng thời giải phóng oxy.',
    },
    {
      front: 'Bào quan nào thực hiện quang hợp?',
      back: 'Lục lạp — bào quan chứa diệp lục trong tế bào thực vật.',
    },
  ],
  questions: [
    {
      question: 'Bào quan nào thực hiện quang hợp?',
      choices: [
        { id: 'a', text: 'Nhân tế bào' },
        { id: 'b', text: 'Lục lạp' },
        { id: 'c', text: 'Ribosome' },
      ],
      correctId: 'b',
      explanation: 'Lục lạp chứa diệp lục giúp hấp thụ ánh sáng và thực hiện quang hợp.',
    },
    {
      question: 'Khí nào được giải phóng trong quang hợp?',
      choices: [
        { id: 'a', text: 'Oxy' },
        { id: 'b', text: 'Nitơ' },
        { id: 'c', text: 'Heli' },
      ],
      correctId: 'a',
      explanation: 'Quang hợp ở thực vật giải phóng oxy từ quá trình phân tách nước.',
    },
  ],
};
const astronomy: StudySample = {
  title: 'Thiên văn học',
  cards: [
    {
      front: 'Hành tinh nào nổi tiếng với hệ vành đai?',
      back: 'Sao Thổ. Vành đai của Sao Thổ gồm nhiều hạt băng, đá và bụi.',
    },
    {
      front: 'Một năm ánh sáng đo đại lượng nào?',
      back: 'Khoảng cách ánh sáng truyền được trong một năm.',
    },
  ],
  questions: [
    {
      question: 'Một năm ánh sáng là đơn vị đo gì?',
      choices: [
        { id: 'a', text: 'Thời gian' },
        { id: 'b', text: 'Khoảng cách' },
        { id: 'c', text: 'Khối lượng' },
      ],
      correctId: 'b',
      explanation: 'Dù có từ “năm”, năm ánh sáng là đơn vị khoảng cách.',
    },
    {
      question: 'Hành tinh nào có hệ vành đai nổi bật?',
      choices: [
        { id: 'a', text: 'Sao Thủy' },
        { id: 'b', text: 'Sao Kim' },
        { id: 'c', text: 'Sao Thổ' },
      ],
      correctId: 'c',
      explanation: 'Sao Thổ có hệ vành đai lớn, dễ nhận thấy qua kính thiên văn.',
    },
  ],
};
const toeic: StudySample = {
  ...english,
  title: 'Từ vựng TOEIC',
  cards: [
    {
      front: 'appointment',
      back: 'Cuộc hẹn.\n“I have an appointment at 10.” — Tôi có một cuộc hẹn lúc 10 giờ.',
    },
    { front: 'deadline', back: 'Hạn chót.\n“The deadline is Friday.” — Hạn chót là thứ Sáu.' },
  ],
  questions: [
    {
      question: '“Deadline” có nghĩa là gì?',
      choices: [
        { id: 'a', text: 'Lịch nghỉ' },
        { id: 'b', text: 'Hạn chót' },
        { id: 'c', text: 'Cuộc họp' },
      ],
      correctId: 'b',
      explanation: '“Deadline” là thời điểm cuối cùng phải hoàn tất công việc.',
    },
    {
      question: '“Appointment” có nghĩa là gì?',
      choices: [
        { id: 'a', text: 'Cuộc hẹn' },
        { id: 'b', text: 'Bản báo cáo' },
        { id: 'c', text: 'Văn phòng' },
      ],
      correctId: 'a',
      explanation: '“Appointment” là cuộc hẹn đã được sắp xếp trước.',
    },
  ],
};

const studySamples: Readonly<Record<string, StudySample>> = {
  english,
  biology,
  astronomy,
  toeic,
};
export const initialDecks: readonly LearningDeck[] = Object.entries(studySamples).map(
  ([id, sample]) => ({
    id,
    title: sample.title,
    subject: id === 'biology' ? 'Sinh học' : id === 'astronomy' ? 'Khoa học' : 'Tiếng Anh',
    cards: sample.cards.map((card, index) => ({ ...card, id: `${id}-card-${index + 1}` })),
    questions: sample.questions.map((question, index) => ({
      ...question,
      id: `${id}-quiz-${index + 1}`,
    })),
    sample: true,
  }),
);

export const initialLibraryPreferences: LibraryPreferences = {
  english: { favorite: false, folder: 'vocabulary' },
  toeic: { favorite: false, folder: 'exam' },
};

/** Production starts without fixtures; user-created content is added separately. */
export function createInitialLearningData(development: boolean): {
  state: LearningState;
  preferences: LibraryPreferences;
} {
  return {
    state: { decks: development ? initialDecks : [], records: [], schedules: {} },
    preferences: development ? initialLibraryPreferences : {},
  };
}

const demoLabels: Readonly<Record<string, { title: TranslationKey; subject: TranslationKey }>> = {
  english: { title: 'demo.english', subject: 'topic.english' },
  biology: { title: 'demo.biology', subject: 'topic.biology' },
  astronomy: { title: 'demo.astronomy', subject: 'topic.astronomy' },
  toeic: { title: 'demo.toeic', subject: 'topic.english' },
};

/** Stable IDs and correct choice IDs preserve schedules/results across locale changes. */
export function localizeDemoDeck(deck: LearningDeck, locale: Locale): LearningDeck {
  const labels = demoLabels[deck.id];
  if (!deck.sample || !labels) return deck;
  const content = locale === 'en' ? englishDemoContent[deck.id] : undefined;
  return {
    ...deck,
    title: locales[locale].messages[labels.title],
    subject: locales[locale].messages[labels.subject],
    cards: deck.cards.map((card, index) => ({ ...card, ...content?.cards[index] })),
    questions: deck.questions.map((question, index) => ({
      ...question,
      ...content?.questions[index],
    })),
  };
}
