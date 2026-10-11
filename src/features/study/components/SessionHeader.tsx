import { StyleSheet, View } from 'react-native';
import { AppText, Icon, IconButton, colors, spacing } from '@/design-system';
import { useTranslation } from '@/shared/i18n';

export function SessionHeader({
  title,
  subtitle,
  onBack,
  time,
  counter,
  close = false,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  time?: string;
  counter?: string;
  close?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <IconButton
        icon={close ? 'close' : 'back'}
        label={t(close ? 'common.close' : 'common.back')}
        onPress={onBack}
      />
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
      {time || counter ? (
        <View style={styles.time}>
          {time ? <Icon name="clock" size={16} color={colors.brand.deep} /> : null}
          <AppText variant="caption">{counter ?? time}</AppText>
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { flex: 1, minWidth: 0, gap: spacing.xs },
  time: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexShrink: 1 },
});
