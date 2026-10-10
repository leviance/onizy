import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { PressableProps } from 'react-native';

import { colors, layout, radius } from '../tokens';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export type IconButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  icon: IconName;
  label: string;
  badge?: boolean;
};
export function IconButton({
  icon,
  label,
  badge = false,
  onFocus,
  onBlur,
  ...props
}: IconButtonProps) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={label}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      style={({ pressed }) => [
        styles.button,
        (focused || pressed) && styles.active,
        props.disabled && styles.disabled,
      ]}
    >
      <Icon name={icon} />
      {badge ? <View style={styles.badge} /> : null}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    minWidth: layout.minTouchTarget,
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surface.card,
    borderWidth: 2,
    borderColor: colors.border.subtle,
  },
  active: { borderColor: colors.brand.deep, backgroundColor: colors.brand.soft },
  disabled: { opacity: 0.5 },
  badge: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.tangerine,
    position: 'absolute',
    right: 8,
    top: 7,
  },
});
