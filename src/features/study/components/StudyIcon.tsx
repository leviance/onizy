import { Image } from 'react-native';
import { generatedIconAssets } from '@/design-system';
import type { GeneratedIconName } from '@/design-system';

export function StudyIcon({ name }: { name: GeneratedIconName }) {
  return (
    <Image
      source={generatedIconAssets[name]}
      style={{ width: 24, height: 24 }}
      resizeMode="contain"
      fadeDuration={0}
      accessible={false}
      aria-hidden
    />
  );
}
