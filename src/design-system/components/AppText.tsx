import { StyleSheet, Text } from 'react-native';
import type { TextProps } from 'react-native';

import { colors, typography, wideTypography } from '../tokens';
import type { TextVariant } from '../tokens';

export type AppTextProps = TextProps & {
  variant?: TextVariant;
  tone?: keyof typeof colors.text;
  scale?: 'mobile' | 'wide';
};

export function AppText({
  variant = 'body',
  tone = 'primary',
  scale = 'mobile',
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        scale === 'wide' ? wideStyles[variant] : styles[variant],
        { color: colors.text[tone] },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create(typography);
const wideStyles = StyleSheet.create(wideTypography);
