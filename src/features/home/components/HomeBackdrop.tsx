import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/design-system';

export function HomeBackdrop() {
  return (
    <>
      <View style={styles.top} pointerEvents="none" aria-hidden>
        <Svg width="100%" height={200} viewBox="0 0 390 200" preserveAspectRatio="none" aria-hidden>
          <Path
            d="M-18 64C42 47 4 5 65-19"
            fill="none"
            stroke={colors.accent.sunny}
            strokeWidth={30}
          />
          <Path
            d="M275-26c0 59 57 10 64 63"
            fill="none"
            stroke={colors.explore.primary}
            strokeWidth={28}
          />
          <Path
            d="M275-26c0 59 57 10 64 63"
            fill="none"
            stroke={colors.brand.deep}
            strokeWidth={1.3}
            opacity={0.55}
          />
          <Path
            d="M365-12c20 33 22-7 42 12"
            fill="none"
            stroke={colors.accent.sunny}
            strokeWidth={14}
            strokeLinecap="round"
          />
          <Path
            d="M377 122c15-20 22 20 38 0"
            fill="none"
            stroke={colors.explore.green}
            strokeWidth={14}
            strokeLinecap="round"
          />
          <Path d="M12 102q2 7 9 9-7 2-9 9-2-7-9-9 7-2 9-9Z" fill={colors.explore.primary} />
          <Path d="M370 180q2 7 9 9-7 2-9 9-2-7-9-9 7-2 9-9Z" fill={colors.accent.sunny} />
        </Svg>
      </View>
      <View style={styles.bottom} pointerEvents="none" aria-hidden>
        <Svg width="100%" height={160} viewBox="0 0 390 160" preserveAspectRatio="none" aria-hidden>
          <Path d="M-28 86c59 58 24 2 128 83H-28Z" fill={colors.explore.green} />
          <Path
            d="M-30 88c54 62 65 25 138 88"
            stroke={colors.topic.mint.foreground}
            strokeWidth={1.5}
          />
          <Path
            d="M-13 45c34-17 23 42 56 45"
            stroke={colors.accent.sunny}
            strokeWidth={18}
            strokeLinecap="round"
          />
          <Path d="m323 174 91-90v90Z" fill={colors.accent.sunny} />
        </Svg>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  top: { position: 'absolute', top: 0, left: 0, right: 0, height: 200 },
  bottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 160 },
});
