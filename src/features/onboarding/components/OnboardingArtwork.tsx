import { Image, StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { colors } from '@/design-system';

import { onboardingAssets } from '../assets';

// The four-point stars and ribbons stay vector-sharp at every viewport size.
function Star({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${size / 100})`}>
      <Path
        d="M0 -50 C8 -15 15 -8 50 0 C15 8 8 15 0 50 C-8 15 -15 8 -50 0 C-15 -8 -8 -15 0 -50Z"
        fill={color}
      />
    </G>
  );
}

export function OnboardingArtwork({ height }: { height: number }) {
  return (
    <View
      style={[styles.artwork, { height }]}
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width="100%" height="100%" viewBox="0 0 941 1040" preserveAspectRatio="none">
        <Path d="M-25 275 L254 -20 H435 L-25 462Z" fill={colors.accent.sunny} />
        <Path d="M-15 367 L348 -22" stroke={colors.accent.tangerine} strokeWidth={3} />
        <Path
          d="M604 -55 C587 99 749 23 770 170 S864 241 985 333"
          stroke={colors.accent.tangerine}
          strokeWidth={145}
          fill="none"
        />
        <Path
          d="M604 -55 C587 99 749 23 770 170 S864 241 985 333"
          stroke={colors.brand.deep}
          strokeWidth={2}
          opacity={0.65}
          fill="none"
        />
        <Star x={398} y={170} size={42} color={colors.accent.sunny} />
        <Star x={323} y={271} size={55} color={colors.accent.tangerine} />
        <Star x={767} y={391} size={44} color={colors.accent.sunny} />
        <Star x={834} y={505} size={74} color={colors.accent.tangerine} />
        <Star x={146} y={557} size={66} color={colors.accent.sunny} />
        <Star x={255} y={689} size={74} color={colors.accent.tangerine} />
        <Star x={874} y={625} size={38} color={colors.accent.sunny} />
        <Star x={691} y={731} size={41} color={colors.accent.sunny} />
        <Star x={139} y={796} size={60} color={colors.accent.tangerine} />
        <Path
          d="M-20 875 C69 836 62 971 151 903"
          stroke={colors.accent.sunny}
          strokeWidth={51}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M827 803 C877 732 894 853 952 816"
          stroke={colors.accent.lime}
          strokeWidth={34}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M220 350 L205 313 Q201 307 217 304 Q223 302 224 311 L230 348 Q229 354 220 350Z M200 369 L177 352 Q173 348 181 342 Q185 337 190 345 L206 363 Q209 369 200 369Z"
          fill={colors.accent.sunny}
        />
      </Svg>
      <Image
        source={onboardingAssets.book}
        style={styles.mascot}
        resizeMode="contain"
        fadeDuration={0}
      />
    </View>
  );
}

export function FooterDecoration({ scale }: { scale: number }) {
  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg style={styles.footerArc} width={225} height={245} viewBox="0 0 225 245">
        <Path
          d="M251 20 C133 35 62 131 57 270"
          stroke={colors.accent.lime}
          strokeWidth={65}
          fill="none"
        />
        <Path
          d="M251 20 C133 35 62 131 57 270"
          stroke={colors.accent.ink}
          strokeWidth={1.5}
          fill="none"
        />
      </Svg>
      <Svg
        style={[styles.footerStars, { top: 18 * scale, right: -8 * scale }]}
        width={90 * scale}
        height={104 * scale}
        viewBox="0 0 90 104"
      >
        <Star x={35} y={23} size={30} color={colors.accent.tangerine} />
        <Star x={57} y={68} size={17} color={colors.accent.sunny} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  artwork: { width: '100%' },
  mascot: {
    position: 'absolute',
    left: '14%',
    top: '19%',
    width: '76%',
    height: '84%',
  },
  footerArc: { position: 'absolute', bottom: -87, right: -104 },
  footerStars: { position: 'absolute' },
});
