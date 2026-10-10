import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { colors } from '../tokens';

export type IllustratedIconName =
  | 'book'
  | 'atom'
  | 'history'
  | 'code'
  | 'calculator'
  | 'globe'
  | 'decks'
  | 'target'
  | 'chart'
  | 'home'
  | 'flame';
export type IllustratedIconProps = { name: IllustratedIconName; size?: number; color?: string };
const palette: Record<IllustratedIconName, string> = {
  book: colors.topic.yellow.accent,
  atom: colors.topic.pink.accent,
  history: colors.topic.blue.accent,
  code: colors.topic.mint.accent,
  calculator: colors.topic.purple.accent,
  globe: colors.topic.orange.accent,
  decks: colors.topic.green.accent,
  target: colors.explore.primary,
  chart: colors.topic.blue.accent,
  home: colors.explore.primary,
  flame: colors.explore.sunny,
};

/** Filled artwork for Explore surfaces; controls keep the simpler Icon glyphs. */
export function IllustratedIcon({ name, size = 32, color }: IllustratedIconProps) {
  const fill = color ?? palette[name];
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {name === 'book' ? (
        <>
          <Path d="M3 7c5-2 9-1 13 1 4-2 8-3 13-1v22c-5-2-9-1-13 1-4-2-8-3-13-1Z" fill={fill} />
          <Path
            d="M6 5c4-1 7 0 10 2 3-2 6-3 10-2v20c-4-1-7 0-10 2-3-2-6-3-10-2Z"
            fill={colors.surface.card}
            stroke={fill}
            strokeWidth={1.5}
          />
          <Path d="M16 7v20" stroke={fill} strokeWidth={1.5} />
        </>
      ) : null}
      {name === 'atom' ? (
        <G stroke={fill} strokeWidth={2.1}>
          <Ellipse cx={16} cy={16} rx={5} ry={14} />
          <G transform="rotate(60 16 16)">
            <Ellipse cx={16} cy={16} rx={5} ry={14} />
          </G>
          <G transform="rotate(120 16 16)">
            <Ellipse cx={16} cy={16} rx={5} ry={14} />
          </G>
          <Circle cx={16} cy={16} r={3} fill={fill} />
        </G>
      ) : null}
      {name === 'history' ? (
        <>
          <Path d="m2 10 14-8 14 8Z" fill={fill} />
          <Path d="M5 12h22M3 29h26" stroke={fill} strokeWidth={3} />
          <Path d="M8 14v11m8-11v11m8-11v11" stroke={fill} strokeWidth={4} />
          <Path d="M6 27h20" stroke={fill} strokeWidth={3} />
        </>
      ) : null}
      {name === 'code' ? (
        <>
          <Rect x={2} y={4} width={28} height={24} rx={7} fill={fill} />
          <Path d="m11 10-6 6 6 6m10-12 6 6-6 6" stroke={colors.surface.card} strokeWidth={3} />
          <Path d="m18 10-4 12" stroke={colors.surface.card} strokeWidth={1.5} />
        </>
      ) : null}
      {name === 'calculator' ? (
        <>
          <Rect x={6} y={1} width={20} height={30} rx={5} fill={fill} />
          <Rect x={9} y={5} width={14} height={6} rx={1.5} fill={colors.surface.card} />
          {[14, 20, 26].flatMap((y) =>
            [10, 16, 22].map((x) => (
              <Rect
                key={`${x}-${y}`}
                x={x - 1.5}
                y={y}
                width={3}
                height={3}
                rx={0.7}
                fill={colors.surface.card}
              />
            )),
          )}
        </>
      ) : null}
      {name === 'globe' ? (
        <>
          <Circle cx={16} cy={13} r={10} fill={fill} />
          <Path d="m9 5 4 2-2 3 4 3-1 4-4-1-2-4m15-6-3 2 2 4-3 3 3 3" fill={colors.surface.card} />
          <Path d="M28 12a12 12 0 0 1-18 11M17 25v4m-6 1h12" stroke={fill} strokeWidth={2.5} />
        </>
      ) : null}
      {name === 'decks' ? (
        <>
          <Rect x={3} y={7} width={20} height={24} rx={4} fill={fill} opacity={0.5} />
          <Rect x={8} y={2} width={21} height={26} rx={4} fill={fill} />
          <Rect x={13} y={8} width={11} height={13} rx={2} fill={colors.surface.card} />
          <Path d="M17 11h3v7h-3Z" fill={fill} />
        </>
      ) : null}
      {name === 'target' ? (
        <>
          <Circle cx={15} cy={17} r={13} fill={fill} />
          <Circle cx={15} cy={17} r={9} fill={colors.surface.card} />
          <Circle cx={15} cy={17} r={6} fill={fill} />
          <Circle cx={15} cy={17} r={2.5} fill={colors.surface.card} />
          <Path d="m15 17 12-12m-6 0 6-3-1 6Z" stroke={fill} strokeWidth={2.5} fill={fill} />
        </>
      ) : null}
      {name === 'chart' ? (
        <>
          <Rect x={2} y={19} width={7} height={11} rx={3} fill={fill} />
          <Rect x={12} y={11} width={7} height={19} rx={3} fill={fill} />
          <Rect x={22} y={2} width={7} height={28} rx={3} fill={fill} />
        </>
      ) : null}
      {name === 'home' ? (
        <>
          <Path d="m2 13 14-11 14 11-3 3v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V16Z" fill={fill} />
          <Rect x={12} y={19} width={8} height={11} rx={2} fill={colors.text.primary} />
          <Path d="m7 13 9-7 9 7" stroke={colors.surface.card} strokeWidth={1.5} opacity={0.5} />
        </>
      ) : null}
      {name === 'flame' ? (
        <>
          <Path
            d="M17 1c2 7 12 9 12 18a13 13 0 1 1-26 0c0-5 3-9 7-12-1 5 2 7 4 8 3-4 3-9 3-14Z"
            fill={fill}
          />
          <Path
            d="M17 13c0 5 6 7 6 11a7 7 0 0 1-14 0c0-4 3-7 4-9 0 3 2 4 4 5Z"
            fill={colors.surface.card}
          />
        </>
      ) : null}
    </Svg>
  );
}
