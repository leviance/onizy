import { Image } from 'react-native';
import { libraryArtwork } from '../assets';
import type { LibraryArtworkName } from '../assets';

export function LibraryArtwork({
  name,
  size,
  tintColor,
}: {
  name: LibraryArtworkName;
  size: number;
  tintColor?: string;
}) {
  return (
    <Image
      source={libraryArtwork[name]}
      resizeMode="contain"
      accessible={false}
      aria-hidden
      style={{ width: size, height: size, tintColor }}
      fadeDuration={0}
    />
  );
}
