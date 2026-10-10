import { StyleSheet, View } from 'react-native';
import { AppText, Icon, IconButton, colors, spacing } from '@/design-system';
import { useTranslation } from '@/shared/i18n';

export function SessionHeader({
  title,
  subtitle,
  onBack,
  time,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  time?: string;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <IconButton icon="close" label={t('common.back')} onPress={onBack} />
      <View style={styles.title}>
        <AppText variant="h3" accessibilityRole="header">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="bodySmall" tone="secondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {time ? (
        <View style={styles.time}>
          <Icon name="clock" size={16} color={colors.brand.deep} />
          <AppText variant="caption">{time}</AppText>
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { flex: 1, gap: spacing.xs },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface.card,
    borderRadius: 999,
    padding: spacing.sm,
  },
});
