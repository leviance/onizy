import { Image } from 'react-native';

import { brandAssets } from '../assets/brand';
import type { BrandVariant } from '../assets/brand';

export type BrandArtworkProps = {
  variant: BrandVariant;
  width: number;
  accessibilityLabel?: string;
};

export function BrandArtwork({ variant, width, accessibilityLabel }: BrandArtworkProps) {
  const asset = brandAssets[variant];
  const meaningful = Boolean(accessibilityLabel);

  return (
    <Image
      source={asset.source}
      style={{ width, height: (width * asset.height) / asset.width, maxWidth: '100%' }}
      resizeMode="contain"
      fadeDuration={0}
      accessible={meaningful}
      accessibilityRole={meaningful ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={!meaningful}
      importantForAccessibility={meaningful ? 'yes' : 'no-hide-descendants'}
      testID={`brand-${variant}`}
    />
  );
}
