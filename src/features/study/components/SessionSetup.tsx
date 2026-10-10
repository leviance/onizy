import { useState } from 'react';
import { View } from 'react-native';
import {
  AppText,
  Button,
  Card,
  Screen,
  SegmentedControl,
  StateView,
  colors,
  spacing,
} from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import type { SessionConfig, StudyMode } from '@/domain/review/learning-session';
import { useTranslation } from '@/shared/i18n';
import { SessionHeader } from './SessionHeader';

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
  const total = (mode === 'quiz' ? deck.questions : deck.cards).filter(
    (item) => !targets || targets.includes(item.id),
  ).length;
  const [limit, setLimit] = useState(String(total));
  const [order, setOrder] = useState('original');
  const [feedback, setFeedback] = useState('immediate');
  const counts = [
    ...new Set([1, 5, 10, 20, total].filter((count) => count > 0 && count <= total)),
  ].sort((a, b) => a - b);
  return (
    <Screen includeTopInset>
      <SessionHeader title={t('learning.setup')} subtitle={deck.title} onBack={onExit} />
      <AppText tone="secondary">{t('learning.setupBody')}</AppText>
      {total ? (
        <>
          <Card style={{ borderWidth: 1, borderColor: colors.border.subtle }}>
            <AppText variant="h3">
              {t(
                mode === 'quiz'
                  ? 'learning.quiz'
                  : mode === 'review'
                    ? 'learning.review'
                    : 'learning.flashcard',
              )}
            </AppText>
            <AppText tone="secondary">
              {t(mode === 'quiz' ? 'common.questions' : 'common.cards', { count: total })}
            </AppText>
          </Card>
          <SegmentedControl
            label={t('learning.count')}
            value={limit}
            onChange={setLimit}
            options={counts.map((count) => ({
              value: String(count),
              label:
                count === total
                  ? `${t('learning.all')} (${formatNumber(count)})`
                  : formatNumber(count),
            }))}
          />
          <SegmentedControl
            label={t('learning.order')}
            value={order}
            onChange={setOrder}
            options={[
              { value: 'original', label: t('learning.original') },
              { value: 'shuffle', label: t('learning.shuffle') },
            ]}
          />
          {mode === 'quiz' ? (
            <View style={{ gap: spacing.md }}>
              <SegmentedControl
                label={t('learning.feedback')}
                value={feedback}
                onChange={setFeedback}
                options={[
                  { value: 'immediate', label: t('learning.immediate') },
                  { value: 'after-submit', label: t('learning.afterSubmit') },
                ]}
              />
              <AppText variant="bodySmall" tone="secondary">
                {t(
                  feedback === 'immediate' ? 'learning.immediateBody' : 'learning.afterSubmitBody',
                )}
              </AppText>
            </View>
          ) : (
            <AppText variant="bodySmall" tone="secondary">
              {t('learning.tapHint')}
            </AppText>
          )}
          <Button
            label={t('learning.start')}
            variant="tinted"
            trailingIcon="arrow"
            onPress={() =>
              onStart({
                mode,
                limit: Number(limit),
                shuffle: order === 'shuffle',
                feedback: feedback === 'immediate' ? 'immediate' : 'after-submit',
              })
            }
          />
        </>
      ) : (
        <StateView
          status="empty"
          message={t('learning.emptyContent')}
          actionLabel={t('learning.backLibrary')}
          onAction={onExit}
        />
      )}
    </Screen>
  );
}
