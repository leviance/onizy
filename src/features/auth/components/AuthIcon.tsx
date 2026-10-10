import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/design-system';

export type AuthIconName =
  'mail' | 'lock' | 'user' | 'phone' | 'shield' | 'eye' | 'eye-off' | 'arrow' | 'check' | 'close';

export function AuthIcon({
  name,
  size = 22,
  color = colors.text.secondary,
}: {
  name: AuthIconName;
  size?: number;
  color?: string;
}) {
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
      {name === 'mail' && (
        <>
          <Rect x={3} y={5} width={18} height={14} rx={3} />
          <Path d="m4 7 8 6 8-6" />
        </>
      )}
      {name === 'lock' && (
        <>
          <Rect x={5} y={10} width={14} height={11} rx={3} />
          <Path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
        </>
      )}
      {name === 'user' && (
        <>
          <Circle cx={12} cy={7} r={4} />
          <Path d="M5 21v-3a7 7 0 0 1 14 0v3Z" />
        </>
      )}
      {name === 'phone' && (
        <Path d="M7 3 4 4c-3 4 2 12 6 15s8 3 10 0l1-3-5-3-2 2c-3-1-5-3-6-6l2-2Z" />
      )}
      {name === 'shield' && (
        <>
          <Path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" />
          <Path d="m8 12 3 3 5-6" />
        </>
      )}
      {(name === 'eye' || name === 'eye-off') && (
        <>
          <Path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
          <Circle cx={12} cy={12} r={3} />
          {name === 'eye-off' && <Path d="m3 3 18 18" />}
        </>
      )}
      {name === 'arrow' && <Path d="M4 12h16m-7-7 7 7-7 7" />}
      {name === 'check' && <Path d="m5 12 4 4L19 6" />}
      {name === 'close' && <Path d="m6 6 12 12M6 18 18 6" />}
    </Svg>
  );
}

export function ProviderIcon({ provider }: { provider: 'google' | 'apple' }) {
  if (provider === 'apple') {
    return (
      <Svg width={24} height={26} viewBox="0 0 24 26" aria-hidden>
        <Path
          fill={colors.text.primary}
          d="M16.3 4.2c1-1.2 1.7-2.8 1.6-4.2-1.5.1-3.1 1-4.1 2.1-1 1.1-1.8 2.7-1.6 4.1 1.6.1 3.1-.8 4.1-2Zm4.8 15.5c-.7 1.6-1.1 2.3-2 3.7-1.3 1.8-3.1 4-5.2 2.2-1.3-.9-2.5-1-4.1 0-2 1.3-3.6-.1-5-2-2.7-3.8-4.4-9.6-2.2-13.4 1.6-2.7 4.3-3.1 6.1-2.4 1.5.6 2.5.7 3.9 0 2.8-1.3 5.4-.8 7 1.3-4.5 2.5-3.8 7.6 1.5 10.6Z"
        />
      </Svg>
    );
  }
  return (
    <Svg width={24} height={24} viewBox="0 0 48 48" aria-hidden>
      <Path
        fill="#FFC107"
        d="M43.6 20H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.2l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-4Z"
      />
      <Path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.2l5.7-5.7C34.1 6.1 29.3 4 24 4 16.2 4 9.5 8.4 6.3 14.7Z"
      />
      <Path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.6 5.1C9.3 39.5 16.1 44 24 44Z"
      />
      <Path
        fill="#1976D2"
        d="M43.6 20H24v8h11.3a12 12 0 0 1-4 5.5l6.2 5.2C41.5 35 44 29.8 44 24c0-1.3-.1-2.7-.4-4Z"
      />
    </Svg>
  );
}
