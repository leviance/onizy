import { Image } from 'react-native';
import { generatedIconAssets } from '@/design-system';
import type { GeneratedIconName } from '@/design-system';

export function ProgressIcon({ name }: { name: GeneratedIconName }) {
  return (
    <Image
      source={generatedIconAssets[name]}
      style={{ width: 24, height: 24 }}
      fadeDuration={0}
      accessible={false}
    />
  );
}
