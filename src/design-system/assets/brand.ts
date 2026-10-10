import type { ImageSourcePropType } from 'react-native';

type BrandAsset = {
  source: ImageSourcePropType;
  width: number;
  height: number;
};

export const brandAssets = {
  logo: {
    source: require('../../../assets/brand/logos/app-logo.png'),
    width: 96,
    height: 96,
  },
  logotype: {
    source: require('../../../assets/brand/logos/logotype.png'),
    width: 320,
    height: 160,
  },
  mascot: {
    source: require('../../../assets/brand/mascots/book-walking.png'),
    width: 96,
    height: 98,
  },
} satisfies Record<string, BrandAsset>;

export type BrandVariant = keyof typeof brandAssets;
