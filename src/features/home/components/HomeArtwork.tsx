import { Image } from 'react-native';

import { homeArtwork } from '../assets';
import type { HomeArtworkName } from '../assets';

export function HomeArtwork({ name, size }: { name: HomeArtworkName; size: number }) {
  return (
    <Image
      source={homeArtwork[name]}
      style={{ width: size, height: size }}
      resizeMode="contain"
      fadeDuration={0}
      accessible={false}
    />
  );
}
