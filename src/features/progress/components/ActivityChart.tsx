import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText, colors, radius, spacing } from '@/design-system';
import type { studyActivity } from '@/domain/review/study-activity';
import { useTranslation } from '@/shared/i18n';

export function ActivityChart({ data }: { data: ReturnType<typeof studyActivity> }) {
  const { t, formatNumber, formatDate } = useTranslation();
  const maximum = Math.max(1, ...data.map((day) => day.total));
  const month = data.length > 7;
  return (
    <View style={styles.surface}>
      <AppText variant="h4" accessibilityRole="header">
        {t('progress.cardActivity', { value: data.length })}
      </AppText>
      <AppText variant="bodySmall" tone="secondary">
        {t('progress.chartBody')}
      </AppText>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.green]} />
          <AppText variant="caption">{t('learning.remembered')}</AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.orange]} />
          <AppText variant="caption">{t('learning.again')}</AppText>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={month}
        contentContainerStyle={[styles.chart, !month && styles.week]}
      >
        {data.map((day) => (
          <View
            key={day.timestamp}
            accessible
            accessibilityLabel={t('progress.chartDay', {
              date: formatDate(day.timestamp),
              remembered: formatNumber(day.remembered),
              again: formatNumber(day.again),
            })}
            style={[styles.column, month ? styles.monthColumn : styles.weekColumn]}
          >
            <AppText variant="caption">{formatNumber(day.total)}</AppText>
            <View style={styles.track}>
              {day.total ? (
                <View style={[styles.bar, { height: `${(day.total / maximum) * 100}%` }]}>
                  {day.again ? <View style={[styles.orange, { flex: day.again }]} /> : null}
                  {day.remembered ? (
                    <View style={[styles.green, { flex: day.remembered }]} />
                  ) : null}
                </View>
              ) : (
                <View style={styles.zero} />
              )}
            </View>
            <AppText variant="caption" tone="secondary">
              {formatDate(day.timestamp, month ? { day: 'numeric' } : { weekday: 'short' })}
            </AppText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  surface: {
    padding: spacing.xl,
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
    gap: spacing.lg,
  },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  legendItem: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: radius.pill },
  chart: { flexDirection: 'row', gap: spacing.xs, paddingVertical: spacing.sm },
  week: { flexGrow: 1 },
  column: { alignItems: 'center', gap: spacing.sm },
  weekColumn: { flex: 1, minWidth: 20 },
  monthColumn: { width: 32 },
  track: { height: 140, width: '75%', justifyContent: 'flex-end' },
  bar: {
    width: '100%',
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
    overflow: 'hidden',
  },
  zero: { height: 2, backgroundColor: colors.border.default },
  green: { backgroundColor: colors.explore.green },
  orange: { backgroundColor: colors.explore.primary },
});
