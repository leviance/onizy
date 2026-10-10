import type { ImageSourcePropType } from 'react-native';

export const libraryArtwork = {
  'mascot-cards':
    require('../../../../assets/illustrations/library/mascot-cards.png') as ImageSourcePropType,
  folder: require('../../../../assets/illustrations/library/folder.png') as ImageSourcePropType,
  'stack-books':
    require('../../../../assets/illustrations/library/stack-books.png') as ImageSourcePropType,
  'new-cards':
    require('../../../../assets/illustrations/library/new-cards.png') as ImageSourcePropType,
  heart: require('../../../../assets/illustrations/library/heart.png') as ImageSourcePropType,
  calendar: require('../../../../assets/illustrations/library/calendar.png') as ImageSourcePropType,
  download: require('../../../../assets/illustrations/library/download.png') as ImageSourcePropType,
  // Reuse the existing raster files without importing another feature's implementation.
  conversation:
    require('../../../../assets/illustrations/home/conversation.png') as ImageSourcePropType,
  planet: require('../../../../assets/illustrations/home/planet.png') as ImageSourcePropType,
  'browser-import':
    require('../../../../assets/illustrations/home/browser-import.png') as ImageSourcePropType,
} as const;
export type LibraryArtworkName = keyof typeof libraryArtwork;
