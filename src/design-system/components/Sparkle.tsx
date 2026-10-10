import Svg, { Path } from 'react-native-svg';

import { colors } from '../tokens';

export type SparkleProps = { size?: number; color?: string };
export function Sparkle({ size = 20, color = colors.accent.sunny }: SparkleProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <Path
        d="M12 0C14 8 16 10 24 12c-8 2-10 4-12 12C10 16 8 14 0 12 8 10 10 8 12 0Z"
        fill={color}
      />
    </Svg>
  );
}
