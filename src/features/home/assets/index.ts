import type { ImageSourcePropType } from 'react-native';

export const homeArtwork = {
  'reading-book':
    require('../../../../assets/illustrations/home/reading-book.png') as ImageSourcePropType,
  conversation:
    require('../../../../assets/illustrations/home/conversation.png') as ImageSourcePropType,
  biology: require('../../../../assets/illustrations/home/biology.png') as ImageSourcePropType,
  landscape: require('../../../../assets/illustrations/home/landscape.png') as ImageSourcePropType,
  planet: require('../../../../assets/illustrations/home/planet.png') as ImageSourcePropType,
  'browser-import':
    require('../../../../assets/illustrations/home/browser-import.png') as ImageSourcePropType,
} as const;
export type HomeArtworkName = keyof typeof homeArtwork;
