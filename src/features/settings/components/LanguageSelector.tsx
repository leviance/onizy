import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Icon, colors, interaction, radius, spacing } from '@/design-system';
import { locales, useTranslation } from '@/shared/i18n';
import type { LanguagePreference, Locale } from '@/shared/i18n';

export function LanguageSelector() {
  const { t, preference, setLanguage, error, saving } = useTranslation();
  const options: { value: LanguagePreference; label: string }[] = [
    { value: 'system', label: t('i18n.system') },
    ...Object.entries(locales).map(([value, definition]) => ({
      value: value as Locale,
      label: definition.nativeName,
    })),
  ];
  return (
    <View style={{ gap: spacing.sm }}>
      <AppText variant="h4">{t('i18n.language')}</AppText>
      <AppText tone="secondary" variant="bodySmall">
        {t('i18n.description')}
      </AppText>
      <View
        style={styles.options}
        accessibilityRole="radiogroup"
        accessibilityLabel={t('i18n.language')}
      >
        {options.map(({ value, label }) => (
          <Pressable
            key={value}
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityState={{ checked: value === preference }}
            aria-checked={value === preference}
            onPress={() => {
              void setLanguage(value);
            }}
            style={({ pressed }) => [
              styles.option,
              value === preference && styles.selected,
              pressed && { opacity: interaction.pressedOpacity },
            ]}
          >
            <AppText variant="label">{label}</AppText>
            {value === preference ? (
              <Icon name="check" size={20} color={colors.brand.deep} />
            ) : null}
          </Pressable>
        ))}
      </View>
      <AppText
        variant="caption"
        tone="secondary"
        style={error ? { color: colors.feedback.error.text } : undefined}
        accessibilityLiveRegion="polite"
      >
        {t(error ? 'i18n.saveError' : saving ? 'i18n.saving' : 'i18n.saved')}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  options: { gap: spacing.sm },
  option: {
    minHeight: 48,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.lg,
    backgroundColor: colors.surface.card,
  },
  selected: { borderColor: colors.brand.deep, backgroundColor: colors.brand.soft },
});
