import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

import { colors } from '../tokens';

export type IconName =
  | 'home'
  | 'decks'
  | 'plus'
  | 'review'
  | 'user'
  | 'bell'
  | 'search'
  | 'filter'
  | 'arrow'
  | 'chevron'
  | 'back'
  | 'close'
  | 'play'
  | 'clock'
  | 'check'
  | 'flame'
  | 'book'
  | 'atom'
  | 'history'
  | 'code'
  | 'calculator'
  | 'globe'
  | 'bulb'
  | 'target'
  | 'chart'
  | 'more'
  | 'flip'
  | 'alert';

const paths: Partial<Record<IconName, string>> = {
  home: 'M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
  decks: 'm3 8 9-5 9 5-9 5Zm0 5 9 5 9-5M3 18l9 5 9-5',
  user: 'M5 21v-3a7 7 0 0 1 14 0v3ZM12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4',
  arrow: 'M4 12h16m-7-7 7 7-7 7',
  chevron: 'm9 5 7 7-7 7',
  back: 'm14 5-7 7 7 7M7 12h13',
  close: 'm6 6 12 12M6 18 18 6',
  plus: 'M12 4v16M4 12h16',
  check: 'm5 12 4 4L19 6',
  review: 'M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5m-4 8a8 8 0 0 0 14 3l3-3m0 5v-5h-5',
  flame: 'M13 2c1 7 7 7 7 13a8 8 0 1 1-16 0c0-3 2-6 4-8 0 3 2 4 3 5 2-3 2-7 2-10Z',
  book: 'M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15',
  history: 'm2 8 10-5 10 5ZM4 21h16M6 10v8m6-8v8m6-8v8',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',
  globe: 'M3 12h18M12 2c6 5 6 15 0 20-6-5-6-15 0-20Z',
  bulb: 'M9 18h6m-5 3h4M8 15a7 7 0 1 1 8 0l-1 3H9Z',
  target: 'M20 12a8 8 0 1 1-8-8m0 4a4 4 0 1 0 4 4m-4 0 9-9m-4 0h4v4',
  flip: 'M4 7h14m-4-4 4 4-4 4M20 17H6m4-4-4 4 4 4',
  alert: 'm12 3 10 18H2Zm0 6v5m0 3v1',
};

export type IconProps = { name: IconName; size?: number; color?: string };

export function Icon({ name, size = 24, color = colors.text.primary }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name] ? <Path d={paths[name]} /> : null}
      {name === 'search' ? (
        <>
          <Circle cx={10.5} cy={10.5} r={7} />
          <Line x1={16} y1={16} x2={21} y2={21} />
        </>
      ) : null}
      {name === 'clock' ? (
        <>
          <Circle cx={12} cy={12} r={9} />
          <Polyline points="12,6 12,12 16,14" />
        </>
      ) : null}
      {name === 'filter' ? (
        <>
          <Path d="M3 6h18M3 12h18M3 18h18" />
          <Circle cx={8} cy={6} r={2} fill={colors.surface.card} />
          <Circle cx={16} cy={12} r={2} fill={colors.surface.card} />
          <Circle cx={9} cy={18} r={2} fill={colors.surface.card} />
        </>
      ) : null}
      {name === 'play' ? <Path d="m8 4 12 8-12 8Z" fill={color} strokeWidth={1} /> : null}
      {name === 'atom' ? (
        <>
          <Circle cx={12} cy={12} r={2} fill={color} />
          <Path d="M12 2c7 0 7 20 0 20S5 2 12 2Zm-9 5c3-6 21 4 18 10S0 13 3 7Zm18 0C18 1 0 11 3 17s21-4 18-10Z" />
        </>
      ) : null}
      {name === 'globe' ? <Circle cx={12} cy={12} r={10} /> : null}
      {name === 'calculator' ? (
        <>
          <Rect x={5} y={2} width={14} height={20} rx={3} />
          <Path d="M8 6h8M8 11h1m6 0h1m-8 4h1m6 0h1m-8 4h1m6 0h1" />
        </>
      ) : null}
      {name === 'chart' ? (
        <>
          <Rect x={3} y={14} width={4} height={7} rx={1} fill={color} />
          <Rect x={10} y={9} width={4} height={12} rx={1} fill={color} />
          <Rect x={17} y={3} width={4} height={18} rx={1} fill={color} />
        </>
      ) : null}
      {name === 'more' ? (
        <>
          <Circle cx={4} cy={12} r={1} fill={color} />
          <Circle cx={12} cy={12} r={1} fill={color} />
          <Circle cx={20} cy={12} r={1} fill={color} />
        </>
      ) : null}
    </Svg>
  );
}
