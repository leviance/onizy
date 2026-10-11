import { useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import {
  AppText,
  Button,
  Screen,
  SegmentedControl,
  StateView,
  colors,
  radius,
  spacing,
} from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import type { FeedbackTiming, SessionConfig, StudyMode } from '@/domain/review/learning-session';
import { useTranslation } from '@/shared/i18n';
import { SessionHeader } from './SessionHeader';
import { StudyIcon } from './StudyIcon';

export function SessionSetup({
  deck,
  mode,
  targets,
  onStart,
  onExit,
}: {
  deck: LearningDeck;
  mode: StudyMode;
  targets?: readonly string[] | undefined;
  onStart: (config: SessionConfig) => void;
  onExit: () => void;
}) {
  const { t, formatNumber } = useTranslation();
  const [selectedMode, setMode] = useState(mode);
  const [requestedLimit, setLimit] = useState(20);
  const [shuffle, setShuffle] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackTiming>('immediate');
  const [advanced, setAdvanced] = useState(false);
  const total = (selectedMode === 'quiz' ? deck.questions : deck.cards).filter(
    (item) => !targets || targets.includes(item.id),
  ).length;
  const limit = Math.min(requestedLimit, total);
  const counts = [
    ...new Set([5, 10, 20, total].filter((count) => count > 0 && count <= total)),
  ].sort((a, b) => a - b);
  return (
    <Screen includeTopInset>
      <SessionHeader title={t('session.startTitle')} onBack={onExit} />
      <View style={styles.deck}>
        <View style={styles.cover}>
          <StudyIcon name="flashcards-vocabulary/flashcard" />
        </View>
        <View style={styles.grow}>
          <AppText variant="h4">{deck.title}</AppText>
          <AppText variant="bodySmall" tone="secondary">
            {t(selectedMode === 'quiz' ? 'common.questions' : 'common.cards', { count: total })} ·{' '}
            {deck.subject}
          </AppText>
        </View>
      </View>
      {!targets && mode !== 'review' ? (
        <SegmentedControl
          label={t('study.mode')}
          value={selectedMode}
          onChange={(value) => setMode(value as StudyMode)}
          options={[
            { value: 'flashcard', label: t('learning.cards'), disabled: !deck.cards.length },
            { value: 'quiz', label: t('learning.quiz'), disabled: !deck.questions.length },
          ]}
        />
      ) : null}
      {total ? (
        <>
          <View style={styles.surface}>
            <View style={styles.heading}>
              <StudyIcon name="quiz/quiz" />
              <AppText variant="h4" style={styles.grow}>
                {t('learning.count')}
              </AppText>
            </View>
            <AppText variant="bodySmall" tone="secondary">
              {t('session.sizeBody')}
            </AppText>
            <SegmentedControl
              label={t('learning.count')}
              value={String(limit)}
              onChange={(value) => setLimit(Number(value))}
              options={counts.map((count) => ({
                value: String(count),
                label:
                  count === total
                    ? t('learning.all') + ' (' + formatNumber(count) + ')'
                    : formatNumber(count),
              }))}
            />
          </View>
          {selectedMode === 'quiz' ? (
            <View style={styles.surface}>
              <View style={styles.heading}>
                <StudyIcon name="statistics-achievements/stats" />
                <AppText variant="h4" style={styles.grow}>
                  {t('learning.feedback')}
                </AppText>
              </View>
              <AppText variant="bodySmall" tone="secondary">
                {t('session.feedbackBody')}
              </AppText>
              <View
                accessibilityRole="radiogroup"
                accessibilityLabel={t('learning.feedback')}
                style={styles.options}
              >
                {(['immediate', 'after-submit'] as const).map((value) => (
                  <Pressable
                    key={value}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: value === feedback }}
                    aria-checked={value === feedback}
                    onPress={() => setFeedback(value)}
                    style={[styles.feedback, value === feedback && styles.selected]}
                  >
                    <View style={[styles.radio, value === feedback && styles.radioSelected]}>
                      {value === feedback ? <View style={styles.dot} /> : null}
                    </View>
                    <View style={styles.grow}>
                      <AppText variant="label">
                        {t(value === 'immediate' ? 'learning.immediate' : 'learning.afterSubmit')}
                      </AppText>
                      <AppText variant="bodySmall" tone="secondary">
                        {t(
                          value === 'immediate'
                            ? 'learning.immediateBody'
                            : 'learning.afterSubmitBody',
                        )}
                      </AppText>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <AppText variant="bodySmall" tone="secondary">
              {t('learning.tapHint')}
            </AppText>
          )}
          <View style={styles.surface}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: advanced }}
              onPress={() => setAdvanced(!advanced)}
              style={styles.heading}
            >
              <StudyIcon name="navigation-system/filter" />
              <AppText variant="label" style={styles.grow}>
                {t('session.advanced')}
              </AppText>
              <StudyIcon
                name={advanced ? 'navigation-system/collapse' : 'navigation-system/forward'}
              />
            </Pressable>
            {advanced ? (
              <View style={styles.heading}>
                <StudyIcon name="flashcards-vocabulary/shuffle" />
                <View style={styles.grow}>
                  <AppText variant="label">{t('learning.shuffle')}</AppText>
                  <AppText variant="bodySmall" tone="secondary">
                    {t('session.shuffleBody')}
                  </AppText>
                </View>
                <Switch
                  value={shuffle}
                  onValueChange={setShuffle}
                  accessibilityLabel={t('learning.shuffle')}
                  trackColor={{ false: colors.surface.disabled, true: colors.topic.green.accent }}
                  thumbColor={colors.surface.card}
                />
              </View>
            ) : null}
          </View>
          <Button
            label={t(selectedMode === 'quiz' ? 'session.startQuiz' : 'session.startCards')}
            variant="tinted"
            trailingIcon="arrow"
            onPress={() => onStart({ mode: selectedMode, limit, shuffle, feedback })}
          />
        </>
      ) : (
        <StateView
          status="empty"
          message={t('learning.emptyContent')}
          actionLabel={t('session.backDeck')}
          onAction={onExit}
        />
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  deck: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
  },
  cover: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand.soft,
    borderRadius: radius.md,
  },
  grow: { flex: 1, minWidth: 0, gap: spacing.sm },
  surface: {
    padding: spacing.xl,
    gap: spacing.lg,
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
  },
  heading: { flexDirection: 'row', gap: spacing.md, alignItems: 'center', minHeight: 44 },
  options: { gap: spacing.md },
  feedback: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.lg,
  },
  selected: { backgroundColor: colors.brand.soft, borderColor: colors.brand.primary },
  radio: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.brand.primary },
  dot: { width: 12, height: 12, backgroundColor: colors.brand.primary, borderRadius: radius.pill },
});
