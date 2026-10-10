import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTranslation } from '@/shared/i18n';

import type { ComponentStateProps } from '../../model/state';
import { isBlockingStatus } from '../../model/state';
import { borderWidth, colors, elevation, radius, spacing } from '../../tokens';
import type { TopicTone } from '../../tokens';
import { AppText } from '../AppText';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ProgressBar } from '../feedback/ProgressBar';
import { StateView } from '../feedback/StateView';

export type DeckCardProps = ComponentStateProps & {
  title: string;
  subject: string;
  cardCount: number;
  dueCount?: number;
  progress?: number;
  artwork?: ReactNode;
  headerAccessory?: ReactNode;
  tone?: TopicTone;
  compact?: boolean;
  appearance?: 'default' | 'expressive';
  onOpen?: () => void;
};

export function DeckCard({
  title,
  subject,
  cardCount,
  dueCount = 0,
  progress = 0,
  artwork,
  headerAccessory,
  tone = 'yellow',
  compact = false,
  appearance = 'default',
  status = 'default',
  onOpen,
  onRetry,
}: DeckCardProps) {
  const { formatText, t } = useTranslation();
  if (isBlockingStatus(status)) return <StateView status={status} onAction={onRetry} />;
  const palette = colors.topic[tone];
  const expressive = appearance === 'expressive';
  return (
    <View style={[styles.card, expressive && styles.expressive, compact && styles.compact]}>
      <View style={styles.heading}>
        <View
          style={[
            styles.artwork,
            { backgroundColor: expressive ? palette.highlight : palette.background },
            compact && styles.smallArtwork,
          ]}
          aria-hidden
        >
          {artwork ?? <Icon name="book" size={32} color={palette.accent} />}
        </View>
        <View style={styles.content}>
          <AppText variant="label" accessibilityRole="header">
            {title}
          </AppText>
          <View style={styles.metadata}>
            <Icon name="decks" size={15} color={colors.text.secondary} />
            <AppText variant="bodySmall" tone="secondary">
              {formatText('common.cards', { count: cardCount })}
            </AppText>
          </View>
          {!compact ? (
            <AppText
              variant="bodySmall"
              style={[
                { color: palette.foreground },
                expressive && styles.subject,
                expressive && { backgroundColor: palette.background },
              ]}
            >
              {subject}
            </AppText>
          ) : null}
        </View>
        {headerAccessory ? <View style={styles.headerAccessory}>{headerAccessory}</View> : null}
      </View>
      {compact && status === 'complete' ? (
        <View style={styles.due}>
          <Icon name="check" size={16} color={colors.feedback.success.text} />
          <AppText variant="bodySmall" style={{ color: colors.feedback.success.text }}>
            {t('common.complete')}
          </AppText>
        </View>
      ) : null}
      {!compact ? (
        <>
          <ProgressBar
            value={status === 'complete' ? 100 : progress}
            label={t('common.progress')}
            appearance={expressive ? 'expressive' : 'default'}
          />
          <View style={styles.footer}>
            <View style={styles.due}>
              <Icon
                name={status === 'complete' ? 'check' : 'clock'}
                size={16}
                color={status === 'complete' ? colors.feedback.success.text : colors.brand.deep}
              />
              <AppText variant="bodySmall" style={styles.dueText}>
                {status === 'complete'
                  ? t('common.complete')
                  : formatText('common.reviewDue', { count: dueCount })}
              </AppText>
            </View>
            {onOpen ? (
              <Button
                label={t('common.reviewNow')}
                accessibilityLabel={`${t('common.reviewNow')}: ${title}`}
                variant={expressive ? 'tinted' : 'soft'}
                trailingIcon="chevron"
                onPress={onOpen}
              />
            ) : null}
          </View>
        </>
      ) : onOpen ? (
        <Button
          label={t('common.reviewNow')}
          accessibilityLabel={`${t('common.reviewNow')}: ${title}`}
          variant={expressive ? 'tinted' : 'soft'}
          trailingIcon="chevron"
          onPress={onOpen}
        />
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    backgroundColor: colors.surface.card,
    borderWidth: borderWidth.subtle,
    borderColor: colors.border.subtle,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  compact: { padding: spacing.lg },
  expressive: { borderColor: 'transparent', boxShadow: elevation.soft },
  subject: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  heading: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  artwork: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallArtwork: { width: 52, height: 52, borderRadius: radius.md },
  content: { flex: 1, minWidth: 0, gap: spacing.xs },
  headerAccessory: { alignSelf: 'flex-start', flexShrink: 0 },
  metadata: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  due: { flexDirection: 'row', flexShrink: 1, gap: spacing.xs, alignItems: 'center' },
  dueText: { color: colors.brand.deep, flexShrink: 1 },
});
