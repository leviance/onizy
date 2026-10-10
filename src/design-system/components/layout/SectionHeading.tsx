import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useTranslation } from '@/shared/i18n';

import { colors, spacing } from '../../tokens';
import { AppText } from '../AppText';
import { Button } from '../Button';

export type SectionHeadingProps = {
  title: string;
  onViewAll?: () => void;
  accent?: 'green' | 'orange' | 'yellow';
  decorate?: boolean;
};
export function SectionHeading({
  title,
  onViewAll,
  accent = 'green',
  decorate = true,
}: SectionHeadingProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      <View style={styles.title}>
        <AppText variant="h3" accessibilityRole="header" style={styles.text}>
          {title}
        </AppText>
        {decorate ? (
          <Svg width={28} height={16} viewBox="0 0 28 16" aria-hidden>
            <Path
              d="M3 13C10-6 16 24 25 3"
              fill="none"
              stroke={colors.topic[accent].accent}
              strokeWidth={5}
              strokeLinecap="round"
            />
          </Svg>
        ) : null}
      </View>
      {onViewAll ? (
        <Button
          variant="link"
          label={t('common.viewAll')}
          accessibilityLabel={`${t('common.viewAll')}: ${title}`}
          onPress={onViewAll}
          trailingIcon="chevron"
          style={styles.action}
        />
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 },
  text: { fontSize: 21, lineHeight: 28, flexShrink: 1 },
  action: { paddingHorizontal: spacing.xs, minHeight: 44 },
});
