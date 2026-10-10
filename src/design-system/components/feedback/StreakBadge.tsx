import { StyleSheet, View } from 'react-native';

import { useTranslation } from '@/shared/i18n';

import { isBlockingStatus } from '../../model/state';
import type { ComponentStateProps } from '../../model/state';
import { colors, radius, spacing } from '../../tokens';
import { AppText } from '../AppText';
import { Icon } from '../Icon';
import { IllustratedIcon } from '../IllustratedIcon';
import { StateView } from './StateView';

export type StreakBadgeProps = ComponentStateProps & { days: number; prominent?: boolean };
export function StreakBadge({
  days,
  prominent = false,
  status = 'default',
  onRetry,
}: StreakBadgeProps) {
  const { formatText, t } = useTranslation();
  if (isBlockingStatus(status)) return <StateView status={status} onAction={onRetry} />;
  const count = Number.isFinite(days) ? Math.max(0, Math.floor(days)) : 0;
  return (
    <View style={[styles.badge, prominent && styles.prominent]}>
      {prominent && status !== 'complete' ? (
        <IllustratedIcon name="flame" size={24} />
      ) : (
        <Icon
          name={status === 'complete' ? 'check' : 'flame'}
          size={prominent ? 22 : 18}
          color={prominent ? colors.text.primary : colors.feedback.warning.text}
        />
      )}
      <AppText
        variant={prominent ? 'label' : 'bodySmall'}
        style={[styles.text, prominent && { color: colors.text.primary }]}
      >
        {prominent ? t('home.streak') : formatText('home.days', { count })}
      </AppText>
      {status === 'complete' ? <AppText variant="bodySmall">{t('common.complete')}</AppText> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.feedback.warning.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  prominent: { backgroundColor: 'transparent', paddingHorizontal: 0, paddingVertical: 0 },
  text: { color: colors.feedback.warning.text },
});
