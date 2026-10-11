import { useState } from 'react';
import { Image, Pressable, StyleSheet, Switch, View } from 'react-native';
import {
  AppText,
  BrandArtwork,
  Button,
  SegmentedControl,
  StateView,
  colors,
  elevation,
  radius,
  spacing,
  useResponsiveLayout,
} from '@/design-system';
import type { FeedbackTiming } from '@/domain/review/learning-session';
import { useTranslation } from '@/shared/i18n';
import { quizArtwork } from '../assets';
import { QuizIconButton } from './QuizIconButton';
import { QuizScaffold } from './QuizScaffold';
import { StudyIcon } from './StudyIcon';

export function QuizSetup({
  title,
  limit,
  counts,
  total,
  shuffle,
  feedback,
  canSwitchMode,
  onLimit,
  onShuffle,
  onFeedback,
  onCards,
  onStart,
  onExit,
}: {
  title: string;
  limit: number;
  counts: readonly number[];
  total: number;
  shuffle: boolean;
  feedback: FeedbackTiming;
  canSwitchMode: boolean;
  onLimit: (value: number) => void;
  onShuffle: (value: boolean) => void;
  onFeedback: (value: FeedbackTiming) => void;
  onCards: () => void;
  onStart: () => void;
  onExit: () => void;
}) {
  const { t, formatNumber } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { height } = useResponsiveLayout();
  const artworkHeight = height >= 1024 ? 187 : height >= 900 ? 140 : height >= 740 ? 112 : 96;
  return (
    <QuizScaffold
      intro
      header={
        <View style={styles.top}>
          <QuizIconButton
            name="navigation-system/back"
            label={t('session.backDeck')}
            onPress={onExit}
          />
          <View style={styles.brand}>
            <BrandArtwork variant="logo" width={20} />
            <AppText variant="label">{t('app.name')}</AppText>
          </View>
          <View style={styles.balance} />
        </View>
      }
      footer={
        <Button
          label={t('session.startQuiz')}
          variant="tinted"
          trailingIcon="arrow"
          style={styles.start}
          disabled={!total}
          onPress={onStart}
        />
      }
    >
      <View style={styles.intro}>
        <Image
          source={quizArtwork.intro}
          style={[styles.artwork, { width: (artworkHeight * 280) / 187, height: artworkHeight }]}
          resizeMode="contain"
          fadeDuration={0}
          accessible={false}
          aria-hidden
        />
        <AppText variant="h2" accessibilityRole="header" style={styles.center}>
          {t('quiz.startTitle')}
        </AppText>
        <AppText variant="bodyLg" tone="secondary" style={styles.center}>
          {title}
        </AppText>
      </View>
      {total ? (
        <>
          <View style={styles.summary}>
            <Pressable
              style={styles.summaryRow}
              accessibilityRole="button"
              accessibilityLabel={t('quiz.changeCount')}
              accessibilityState={{ expanded: settingsOpen }}
              onPress={() => setSettingsOpen(!settingsOpen)}
            >
              <StudyIcon name="quiz/quiz" />
              <View style={styles.grow}>
                <AppText variant="label">{t('common.questions', { count: limit })}</AppText>
                <AppText variant="bodySmall" tone="secondary">
                  {t('quiz.countBody')}
                </AppText>
              </View>
              <StudyIcon
                name={settingsOpen ? 'navigation-system/collapse' : 'navigation-system/forward'}
              />
            </Pressable>
            <View style={styles.summaryRow}>
              <StudyIcon name="quiz/timer" />
              <View style={styles.grow}>
                <AppText variant="label">
                  {t('quiz.estimatedMinutes', { value: Math.max(1, Math.ceil(limit / 2)) })}
                </AppText>
                <AppText variant="bodySmall" tone="secondary">
                  {t('quiz.estimatedBody')}
                </AppText>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <StudyIcon name="statistics-achievements/stats" />
              <View style={styles.grow}>
                <AppText variant="label">{t('study.choose')}</AppText>
                <AppText variant="bodySmall" tone="secondary">
                  {t('quiz.typeBody')}
                </AppText>
              </View>
            </View>
          </View>
          {settingsOpen ? (
            <View style={styles.settings}>
              <SegmentedControl
                label={t('learning.count')}
                value={String(limit)}
                onChange={(value) => onLimit(Number(value))}
                options={counts.map((value) => ({
                  value: String(value),
                  label:
                    value === total
                      ? t('learning.all') + ' (' + formatNumber(value) + ')'
                      : formatNumber(value),
                }))}
              />
              <View style={styles.summaryRow}>
                <View style={styles.grow}>
                  <AppText variant="label">{t('learning.shuffle')}</AppText>
                  <AppText variant="bodySmall" tone="secondary">
                    {t('session.shuffleBody')}
                  </AppText>
                </View>
                <Switch
                  value={shuffle}
                  onValueChange={onShuffle}
                  accessibilityLabel={t('learning.shuffle')}
                  trackColor={{ false: colors.surface.disabled, true: colors.explore.primary }}
                  thumbColor={colors.surface.card}
                />
              </View>
              {canSwitchMode ? (
                <Button label={t('learning.startCards')} variant="link" onPress={onCards} />
              ) : null}
            </View>
          ) : null}
          <AppText variant="h4" accessibilityRole="header">
            {t('quiz.feedbackTitle')}
          </AppText>
          <View
            style={styles.options}
            accessibilityRole="radiogroup"
            accessibilityLabel={t('learning.feedback')}
          >
            {(['immediate', 'after-submit'] as const).map((value) => (
              <Pressable
                key={value}
                accessibilityRole="radio"
                accessibilityState={{ checked: value === feedback }}
                aria-checked={value === feedback}
                onPress={() => onFeedback(value)}
                style={[styles.option, value === feedback && styles.selected]}
              >
                <View style={[styles.radio, value === feedback && styles.radioSelected]}>
                  {value === feedback ? <View style={styles.dot} /> : null}
                </View>
                <View style={styles.grow}>
                  <AppText variant="label">
                    {t(value === 'immediate' ? 'quiz.immediate' : 'learning.afterSubmit')}
                  </AppText>
                  <AppText variant="bodySmall" tone="secondary">
                    {t(value === 'immediate' ? 'quiz.immediateBody' : 'quiz.afterSubmitBody')}
                  </AppText>
                </View>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <StateView
          status="empty"
          message={t('learning.emptyContent')}
          actionLabel={t('session.backDeck')}
          onAction={onExit}
        />
      )}
    </QuizScaffold>
  );
}
const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface.card,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    boxShadow: elevation.soft,
  },
  balance: { width: 52 },
  intro: { alignItems: 'center', gap: spacing.sm, paddingBottom: spacing.xs },
  artwork: { width: 280, height: 187, maxWidth: '100%' },
  center: { textAlign: 'center' },
  grow: { flex: 1, minWidth: 0, gap: spacing.xs },
  summary: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.sm,
    boxShadow: elevation.soft,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', minHeight: 44, gap: spacing.lg },
  settings: {
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
  },
  options: { gap: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: radius.lg,
    boxShadow: elevation.soft,
  },
  selected: { backgroundColor: colors.brand.soft, borderColor: colors.explore.primary },
  radio: {
    width: 24,
    height: 24,
    marginTop: 2,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.text.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.explore.primary },
  dot: {
    width: 14,
    height: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.explore.primary,
  },
  start: { borderRadius: radius.lg, minHeight: 60 },
});
