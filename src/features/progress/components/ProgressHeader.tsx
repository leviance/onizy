import { StyleSheet, View } from 'react-native';
import { AppText, IconButton, spacing } from '@/design-system';
import { useTranslation } from '@/shared/i18n';

export function ProgressHeader({ title, onBack }: { title: string; onBack: () => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <IconButton icon="back" label={t('common.back')} onPress={onBack} />
      <AppText variant="h3" accessibilityRole="header" style={styles.title}>
        {title}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { flex: 1, minWidth: 0 },
});
