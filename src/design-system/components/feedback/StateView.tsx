import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTranslation } from '@/shared/i18n';

import { borderWidth, colors, radius, spacing } from '../../tokens';
import { AppText } from '../AppText';
import { Button } from '../Button';
import { Icon } from '../Icon';

export type StateViewProps = {
  status: 'loading' | 'empty' | 'error' | 'complete';
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: (() => void) | undefined;
};
export function StateView({ status, title, message, actionLabel, onAction }: StateViewProps) {
  const { t } = useTranslation();
  const tone =
    status === 'error'
      ? colors.feedback.error
      : status === 'complete'
        ? colors.feedback.success
        : colors.feedback.info;
  const body =
    message ??
    (status === 'empty'
      ? t('common.emptyBody')
      : status === 'error'
        ? t('common.errorBody')
        : undefined);
  return (
    <View
      style={styles.card}
      accessibilityLiveRegion="polite"
      accessibilityState={{ busy: status === 'loading' }}
      aria-busy={status === 'loading'}
      aria-live="polite"
    >
      <View style={[styles.symbol, { backgroundColor: tone.background }]}>
        {status === 'loading' ? (
          <ActivityIndicator color={tone.text} />
        ) : (
          <Icon
            name={status === 'error' ? 'alert' : status === 'complete' ? 'check' : 'decks'}
            color={tone.text}
          />
        )}
      </View>
      <AppText variant="h3" style={styles.centered}>
        {title ?? t(`common.${status}`)}
      </AppText>
      {body ? (
        <AppText tone="secondary" style={styles.centered}>
          {body}
        </AppText>
      ) : null}
      {onAction && status !== 'loading' ? (
        <Button variant="secondary" label={actionLabel ?? t('common.retry')} onPress={onAction} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing['2xl'],
    gap: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface.card,
    borderWidth: borderWidth.subtle,
    borderColor: colors.border.subtle,
    alignItems: 'center',
  },
  symbol: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: { textAlign: 'center' },
});
