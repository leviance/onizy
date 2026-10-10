import { StyleSheet, View } from 'react-native';

import { useTranslation } from '@/shared/i18n';

import { progressRatio } from '../../model/state';
import type { ComponentStateProps } from '../../model/state';
import { colors, radius, spacing } from '../../tokens';
import { AppText } from '../AppText';
import { StateView } from './StateView';

export type ProgressBarProps = ComponentStateProps & {
  value: number;
  total?: number;
  label?: string;
  showLabel?: boolean;
  tone?: 'green' | 'yellow' | 'orange';
  loading?: boolean;
  appearance?: 'default' | 'expressive' | 'onBrand';
};
export function ProgressBar({
  value,
  total = 100,
  label,
  showLabel = true,
  tone = 'green',
  loading = false,
  status = 'default',
  onRetry,
  appearance = 'default',
}: ProgressBarProps) {
  const { t, formatPercent } = useTranslation();
  const displayLabel = label ?? t('common.progress');
  if (status === 'empty' || status === 'error')
    return <StateView status={status} onAction={onRetry} />;
  const busy = loading || status === 'loading';
  const ratio = status === 'complete' ? 1 : progressRatio(value, total);
  const percent = Math.round(ratio * 100);
  return (
    <View style={styles.container}>
      {showLabel ? (
        <View style={styles.labels}>
          <AppText variant="bodySmall" style={styles.label}>
            {displayLabel}
          </AppText>
          <AppText variant="bodySmall">
            {busy ? t('common.loading') : formatPercent(percent)}
          </AppText>
        </View>
      ) : null}
      <View
        style={[
          styles.track,
          appearance === 'onBrand' && { backgroundColor: colors.explore.heroTrack },
        ]}
        accessibilityRole="progressbar"
        accessibilityLabel={displayLabel}
        accessibilityValue={
          busy ? { text: t('common.loading') } : { min: 0, max: 100, now: percent }
        }
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={busy ? undefined : percent}
        accessibilityState={{ busy }}
        aria-busy={busy}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${busy ? 0 : percent}%`,
              backgroundColor:
                appearance === 'onBrand'
                  ? colors.explore.sunny
                  : appearance === 'expressive' && tone === 'green'
                    ? colors.explore.green
                    : colors.topic[tone].accent,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  labels: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  label: { flex: 1 },
  track: {
    height: 8,
    backgroundColor: colors.surface.disabled,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radius.pill },
});
