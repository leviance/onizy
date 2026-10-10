import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@/design-system';

export function LibraryBackdrop() {
  return (
    <>
      <View style={styles.top} pointerEvents="none" aria-hidden>
        <Svg width="100%" height={180} viewBox="0 0 390 180" preserveAspectRatio="none" aria-hidden>
          <Path
            d="M-18 42C30 32 13 5 57-15"
            stroke={colors.accent.sunny}
            strokeWidth={24}
            fill="none"
          />
          <Path
            d="M273-20c0 48 43 7 48 42"
            stroke={colors.explore.primary}
            strokeWidth={22}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M273-20c0 48 43 7 48 42"
            stroke={colors.brand.deep}
            strokeWidth={1}
            opacity={0.5}
            fill="none"
          />
          <Path
            d="M344-8c18 31 27-3 43 6"
            stroke={colors.accent.sunny}
            strokeWidth={12}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M377 96c15-22 22 19 38 1"
            stroke={colors.explore.green}
            strokeWidth={12}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </View>
      <View style={styles.bottom} pointerEvents="none" aria-hidden>
        <Svg width="100%" height={150} viewBox="0 0 390 150" preserveAspectRatio="none" aria-hidden>
          <Path d="M-28 72c62 62 25 10 130 93H-28Z" fill={colors.explore.green} />
          <Path
            d="M-25 76c55 54 63 31 121 80"
            stroke={colors.topic.mint.foreground}
            strokeWidth={1.4}
            fill="none"
          />
          <Path
            d="M-14 30c35-12 20 44 54 45"
            stroke={colors.accent.sunny}
            strokeWidth={16}
            strokeLinecap="round"
            fill="none"
          />
          <Path d="m318 164 91-85v85Z" fill={colors.accent.sunny} />
        </Svg>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  top: { position: 'absolute', top: 0, left: 0, right: 0 },
  bottom: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});
