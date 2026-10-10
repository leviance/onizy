import { useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import {
  AppText,
  Icon,
  IconButton,
  colors,
  fonts,
  interaction,
  radius,
  spacing,
} from '@/design-system';
import { useTranslation } from '@/shared/i18n';
import type { LibraryFilter, LibrarySort } from '@/domain/content/deck-library';
import { LibraryArtwork } from './LibraryArtwork';

export function LibraryChip({
  label,
  selected,
  outlined = false,
  icon,
  onPress,
}: {
  label: string;
  selected: boolean;
  outlined?: boolean;
  icon?: ReactNode;
  onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        styles.chip,
        selected && (outlined ? styles.sortSelected : styles.selected),
        focused && interaction.focusRing,
        pressed && styles.pressed,
      ]}
    >
      {icon}
      <AppText
        variant="bodySmall"
        style={{
          color: selected
            ? outlined
              ? colors.brand.deep
              : colors.text.inverse
            : colors.text.secondary,
          fontFamily: selected ? fonts.extraBold : fonts.semibold,
        }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const filters: readonly LibraryFilter[] = ['all', 'recent', 'favorites', 'due', 'downloaded'];
const sorts: readonly LibrarySort[] = ['newest', 'alphabetical', 'progress'];
export function LibraryControls({
  query,
  onQuery,
  filter,
  onFilter,
  sort,
  onSort,
  onOpenFilters,
}: {
  query: string;
  onQuery: (value: string) => void;
  filter: LibraryFilter;
  onFilter: (value: LibraryFilter) => void;
  sort: LibrarySort;
  onSort: (value: LibrarySort) => void;
  onOpenFilters: () => void;
}) {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.controls}>
      <View style={[styles.search, focused && styles.searchFocused]}>
        <Icon name="search" size={22} color={colors.text.primary} />
        <TextInput
          value={query}
          onChangeText={onQuery}
          accessibilityLabel={t('library.search')}
          placeholder={t('library.search')}
          placeholderTextColor={colors.text.tertiary}
          autoCorrect={false}
          returnKeyType="search"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />
        {query ? (
          <IconButton icon="close" label={t('common.clear')} onPress={() => onQuery('')} />
        ) : null}
        <IconButton icon="filter" label={t('library.filters')} onPress={onOpenFilters} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {filters.map((value) => {
          const color = filter === value ? colors.text.inverse : colors.text.secondary;
          const artwork =
            value === 'favorites'
              ? 'heart'
              : value === 'due'
                ? 'calendar'
                : value === 'downloaded'
                  ? 'download'
                  : null;
          return (
            <LibraryChip
              key={value}
              label={t(`library.filter.${value}`)}
              selected={filter === value}
              onPress={() => onFilter(value)}
              icon={
                artwork ? (
                  <LibraryArtwork name={artwork} size={20} tintColor={color} />
                ) : value === 'recent' ? (
                  <Icon name="clock" size={20} color={color} />
                ) : undefined
              }
            />
          );
        })}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {sorts.map((value) => (
          <LibraryChip
            key={value}
            label={t(`library.sort.${value}`)}
            selected={sort === value}
            outlined
            onPress={() => onSort(value)}
            icon={
              value === 'progress' ? (
                <Icon
                  name="chart"
                  size={18}
                  color={sort === value ? colors.brand.deep : colors.text.secondary}
                />
              ) : value === 'newest' ? (
                <View style={styles.sortArrows}>
                  <View style={styles.up}>
                    <Icon
                      name="arrow"
                      size={16}
                      color={sort === value ? colors.brand.deep : colors.text.secondary}
                    />
                  </View>
                  <View style={styles.down}>
                    <Icon
                      name="arrow"
                      size={16}
                      color={sort === value ? colors.brand.deep : colors.text.secondary}
                    />
                  </View>
                </View>
              ) : undefined
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  controls: { gap: spacing.md },
  search: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface.subtle,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  searchFocused: { borderColor: colors.brand.deep },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
    outlineWidth: 0,
  },
  chips: { gap: spacing.sm, paddingVertical: 2, paddingHorizontal: 2 },
  chip: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface.subtle,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: radius.pill,
  },
  selected: { backgroundColor: colors.explore.primary },
  sortSelected: { backgroundColor: colors.brand.soft, borderColor: colors.topic.orange.highlight },
  pressed: { opacity: interaction.pressedOpacity },
  sortArrows: { flexDirection: 'row', width: 22 },
  up: { transform: [{ rotate: '-90deg' }] },
  down: { marginLeft: -7, transform: [{ rotate: '90deg' }] },
});
