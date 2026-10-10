export const colors = {
  brand: {
    primary: '#F8672B',
    hover: '#ED581C',
    pressed: '#D94A10',
    soft: '#FFF0E5',
    deep: '#B53A0A',
  },
  surface: {
    canvas: '#F7F6F0',
    card: '#FFFFFF',
    warm: '#FFF9F2',
    subtle: '#F1F0EA',
    disabled: '#EBEAE5',
    onboarding: '#FCFBF6',
  },
  text: {
    primary: '#111111',
    secondary: '#575650',
    tertiary: '#76746F',
    inverse: '#FFFFFF',
  },
  border: { strong: '#111111', default: '#DAD9D3', subtle: '#EDECE6' },
  feedback: {
    success: { text: '#176A3A', background: '#E7FFEE' },
    error: { text: '#B42328', background: '#FFF0EE' },
    warning: { text: '#855400', background: '#FFF2C8' },
    info: { text: '#2452A8', background: '#EAF2FF' },
  },
  accent: {
    sunny: '#FFB51B',
    sunnySoft: '#FFF2C8',
    lime: '#19F768',
    limeSoft: '#E7FFEE',
    ink: '#111111',
    tangerine: '#FF5C23',
    inactiveDot: '#D3D2D1',
  },
  explore: {
    canvas: '#FFFDF6',
    primary: '#FF531F',
    heroGlow: '#FF9833',
    heroTrack: '#FFC3A5',
    sunny: '#FFD21C',
    green: '#00DB68',
  },
  topic: {
    yellow: {
      background: '#FFF3CD',
      highlight: '#FFE895',
      foreground: '#805100',
      accent: '#FFB51B',
    },
    green: {
      background: '#DFFBDC',
      highlight: '#BDF5AF',
      foreground: '#176A3A',
      accent: '#13C957',
    },
    mint: { background: '#DDF9EF', highlight: '#BFF5E8', foreground: '#09684F', accent: '#00B98A' },
    pink: { background: '#FDE7ED', highlight: '#FFD2E0', foreground: '#A92B50', accent: '#F34672' },
    blue: { background: '#E4F2FF', highlight: '#CAE6FF', foreground: '#2452A8', accent: '#248CFF' },
    purple: {
      background: '#EFE5FC',
      highlight: '#E1D1FF',
      foreground: '#65319E',
      accent: '#8750DB',
    },
    orange: {
      background: '#FFE9DC',
      highlight: '#FFD7BF',
      foreground: '#B53A0A',
      accent: '#FF6B28',
    },
  },
  overlay: 'rgba(17, 17, 17, 0.35)',
} as const;

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  card: 28,
  hero: 32,
  modal: 32,
  pill: 999,
} as const;

export const fonts = {
  regular: 'Nunito_400Regular',
  medium: 'Nunito_500Medium',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

export const typography = {
  display: { fontFamily: fonts.black, fontSize: 44, lineHeight: 48 },
  h1: { fontFamily: fonts.black, fontSize: 36, lineHeight: 40 },
  h2: { fontFamily: fonts.black, fontSize: 28, lineHeight: 34 },
  h3: { fontFamily: fonts.extraBold, fontSize: 22, lineHeight: 28 },
  h4: { fontFamily: fonts.extraBold, fontSize: 18, lineHeight: 24 },
  bodyLg: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 26 },
  body: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24 },
  bodySmall: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 21 },
  caption: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 18 },
  button: { fontFamily: fonts.extraBold, fontSize: 16, lineHeight: 20 },
  label: { fontFamily: fonts.extraBold, fontSize: 16, lineHeight: 20 },
  number: { fontFamily: fonts.black, fontSize: 32, lineHeight: 38 },
  studyTerm: { fontFamily: fonts.black, fontSize: 26, lineHeight: 36 },
  studyQuestion: { fontFamily: fonts.extraBold, fontSize: 22, lineHeight: 32 },
} as const;

/** Wider type scale is opt-in for Explore; Focus keeps its reading sizes. */
export const wideTypography = {
  ...typography,
  display: { ...typography.display, fontSize: 64, lineHeight: 68 },
  h1: { ...typography.h1, fontSize: 48, lineHeight: 54 },
  h2: { ...typography.h2, fontSize: 36, lineHeight: 42 },
  h3: { ...typography.h3, fontSize: 26, lineHeight: 32 },
  h4: { ...typography.h4, fontSize: 20, lineHeight: 26 },
  bodyLg: { ...typography.bodyLg, fontSize: 18, lineHeight: 28 },
  number: { ...typography.number, fontSize: 40, lineHeight: 46 },
} as const;

export const borderWidth = { subtle: 1, default: 1.5, strong: 2, illustrative: 3 } as const;
export const elevation = {
  soft: '0 4px 14px rgba(17,17,17,0.06)',
  floating: '0 10px 30px rgba(17,17,17,0.13)',
  pop: '0 6px 0 rgba(17,17,17,0.9)',
  overlay: '0 18px 52px rgba(17,17,17,0.18)',
} as const;
export const motion = {
  fast: 120,
  normal: 200,
  slow: 320,
  flip: 420,
  celebrate: 800,
  easing: [0.2, 0.8, 0.2, 1],
} as const;
export const interaction = {
  focusRing: { outlineColor: colors.brand.deep, outlineWidth: 3, outlineOffset: 3 },
  pressedOpacity: 0.8,
  disabledOpacity: 0.45,
} as const;

export const layout = {
  minTouchTarget: 44,
  buttonHeight: 52,
  studyMaxWidth: 820,
  contentMaxWidth: 1200,
  homeMaxWidth: 960,
  compactBreakpoint: 360,
  tabletBreakpoint: 768,
  navigationHeight: 76,
} as const;

export type TopicTone = keyof typeof colors.topic;
export type TextVariant = keyof typeof typography;
