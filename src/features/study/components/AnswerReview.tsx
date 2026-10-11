import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AppText,
  QuizQuestion,
  Screen,
  SegmentedControl,
  StateView,
  colors,
  radius,
  spacing,
} from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import type { SessionRecord } from '@/domain/review/learning-session';
import { quizResult } from '@/domain/review/learning-session';
import { useTranslation } from '@/shared/i18n';
import { SessionHeader } from './SessionHeader';

export function AnswerReview({
  deck,
  record,
  onBack,
}: {
  deck: LearningDeck;
  record: SessionRecord;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const result = quizResult(deck, record.itemIds, record.answers);
  const ids =
    filter === 'missed'
      ? result.incorrect
      : filter === 'marked'
        ? record.itemIds.filter((id) => record.markedQuestionIds?.includes(id))
        : record.itemIds;
  return (
    <Screen includeTopInset>
      <SessionHeader title={t('learning.answers')} subtitle={deck.title} onBack={onBack} />
      <SegmentedControl
        label={t('learning.answers')}
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: t('learning.all') },
          {
            value: 'missed',
            label: t('session.incorrectFilter', { value: result.incorrect.length }),
          },
          ...(record.markedQuestionIds?.length
            ? [{ value: 'marked', label: t('quiz.marked') }]
            : []),
        ]}
      />
      {ids.map((id) => {
        const question = deck.questions.find((item) => item.id === id);
        return question ? (
          <View key={id} style={styles.question}>
            <View style={styles.heading}>
              <AppText variant="caption">
                {t('learning.questionIndex', {
                  value: record.itemIds.indexOf(id) + 1,
                  total: record.itemIds.length,
                })}
              </AppText>
              <AppText
                variant="caption"
                style={record.answers[id] === question.correctId ? styles.correct : styles.missed}
              >
                {t(
                  !record.answers[id]
                    ? 'learning.unanswered'
                    : record.answers[id] === question.correctId
                      ? 'study.correct'
                      : 'study.incorrect',
                )}
              </AppText>
            </View>
            <QuizQuestion
              {...question}
              selectedId={record.answers[id] ?? null}
              submitted
              showSubmitButton={false}
              onSelect={() => {}}
              onSubmit={() => {}}
            />
          </View>
        ) : null;
      })}
      {!ids.length ? <StateView status="complete" title={t('learning.perfect')} /> : null}
    </Screen>
  );
}
const styles = StyleSheet.create({
  question: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  correct: { color: colors.feedback.success.text },
  missed: { color: colors.feedback.error.text },
});
