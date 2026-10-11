import type { ImageSourcePropType } from 'react-native';

export const quizArtwork = {
  intro: require('../../../../assets/illustrations/study/quiz-intro.png') as ImageSourcePropType,
  correct:
    require('../../../../assets/illustrations/study/quiz-correct.png') as ImageSourcePropType,
  incorrect:
    require('../../../../assets/illustrations/study/quiz-incorrect.png') as ImageSourcePropType,
} as const;
