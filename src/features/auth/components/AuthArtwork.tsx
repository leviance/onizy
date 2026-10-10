import { Image, StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { colors, spacing } from '@/design-system';

import { authAssets } from '../assets';
import type { AuthMode } from '../model/form';

function Star({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${size / 100})`}>
      <Path d="M0-50C8-15 15-8 50 0 15 8 8 15 0 50-8 15-15 8-50 0-15-8-8-15 0-50Z" fill={color} />
    </G>
  );
}

export function AuthArtwork({
  mode,
  height,
  topInset = 0,
}: {
  mode: AuthMode;
  height: number;
  topInset?: number;
}) {
  const mascotSize = height - spacing.md;
  const artworkHeight = mascotSize + Math.max(topInset, spacing.md);
  return (
    <View
      style={[styles.hero, { height: artworkHeight }]}
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      aria-hidden
    >
      <Svg width="100%" height="100%" viewBox="0 0 390 210" preserveAspectRatio="none">
        <Path d="M-20 96 98-24h75L-20 169Z" fill={colors.accent.sunny} />
        <Path d="m-10 130 150-157" stroke={colors.accent.tangerine} strokeWidth={1.4} />
        <Path
          d="M270-30c-7 80 65 36 70 99s38 31 79 76"
          fill="none"
          stroke={colors.accent.tangerine}
          strokeWidth={53}
        />
        <Path
          d="M270-30c-7 80 65 36 70 99s38 31 79 76"
          fill="none"
          stroke={colors.brand.deep}
          strokeWidth={1}
        />
        <Path
          d="M-12 198c18-30 31 9 50-24"
          fill="none"
          stroke={colors.accent.sunny}
          strokeWidth={13}
          strokeLinecap="round"
        />
        <Path
          d="M340 167c17-26 24 26 55 8"
          fill="none"
          stroke={colors.accent.lime}
          strokeWidth={13}
          strokeLinecap="round"
        />
        <Star x={182} y={27} size={17} color={colors.accent.sunny} />
        <Star x={85} y={117} size={24} color={colors.accent.tangerine} />
        <Star x={111} y={174} size={20} color={colors.accent.sunny} />
        <Star x={315} y={142} size={17} color={colors.accent.sunny} />
        <Star x={307} y={195} size={22} color={colors.accent.tangerine} />
      </Svg>
      <Image
        source={authAssets[mode]}
        resizeMode="contain"
        fadeDuration={0}
        style={[styles.mascot, { width: mascotSize, height: mascotSize }]}
      />
    </View>
  );
}

export function AuthFooterDecoration() {
  return (
    <View
      style={styles.footerArt}
      aria-hidden
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width="100%" height="100%" viewBox="0 0 390 240" preserveAspectRatio="xMidYMax slice">
        <Path
          d="M431 117c-82 21-99 78-105 150"
          stroke={colors.accent.lime}
          strokeWidth={49}
          fill="none"
        />
        <Path
          d="M431 117c-82 21-99 78-105 150"
          stroke={colors.accent.ink}
          strokeWidth={1.4}
          fill="none"
        />
        <Star x={25} y={211} size={27} color={colors.accent.tangerine} />
        <Star x={373} y={67} size={18} color={colors.accent.sunny} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', justifyContent: 'flex-end', width: '100%' },
  mascot: { position: 'absolute', bottom: 0 },
  footerArt: { position: 'absolute', bottom: 0, width: '100%', height: 240 },
});
