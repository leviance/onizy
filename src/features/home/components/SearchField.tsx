import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Icon, IconButton, colors, fonts, radius, spacing } from '@/design-system';
import { useTranslation } from '@/shared/i18n';

export function SearchField({
  value,
  onChange,
  onFilter,
}: {
  value: string;
  onChange: (value: string) => void;
  onFilter: () => void;
}) {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.field, focused && styles.focused]}>
      <Icon name="search" size={21} color={colors.text.secondary} />
      <TextInput
        value={value}
        onChangeText={onChange}
        accessibilityLabel={t('home.search')}
        placeholder={t('home.search')}
        placeholderTextColor={colors.text.secondary}
        autoCorrect={false}
        returnKeyType="search"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.input}
      />
      {value ? (
        <IconButton icon="close" label={t('common.clear')} onPress={() => onChange('')} />
      ) : null}
      <IconButton icon="filter" label={t('home.filters')} onPress={onFilter} />
    </View>
  );
}
const styles = StyleSheet.create({
  field: {
    minHeight: 56,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface.subtle,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  focused: { borderColor: colors.brand.deep },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    color: colors.text.primary,
    fontFamily: fonts.medium,
    fontSize: 15,
    paddingVertical: spacing.sm,
    outlineWidth: 0,
  },
});
