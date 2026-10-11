import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  AppText,
  Icon,
  IconButton,
  Screen,
  TextField,
  SegmentedControl,
  StateView,
  colors,
  radius,
  spacing,
} from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import type { ReviewSchedule, SessionRecord } from '@/domain/review/learning-session';
import { practiceContent } from '@/domain/review/practice-content';
import { normalizeSearch } from '@/shared/utils/search';
import { useCurrentTime } from '@/shared/hooks/useCurrentTime';
import { useTranslation } from '@/shared/i18n';
import { ProgressHeader } from '../components/ProgressHeader';
import { ProgressIcon } from '../components/ProgressIcon';

export function PracticeScreen({
  decks,
  records,
  schedules,
  onBack,
  onStudy,
}: {
  decks: readonly LearningDeck[];
  records: readonly SessionRecord[];
  schedules: Readonly<Record<string, ReviewSchedule>>;
  onBack: () => void;
  onStudy: (deck: string, mode: 'flashcard' | 'quiz', ids: readonly string[]) => void;
}) {
  const { t, formatDate } = useTranslation();
  const [mode, setMode] = useState<'flashcard' | 'quiz'>('flashcard');
  const [query, setQuery] = useState('');
  const now = useCurrentTime();
  const terms = normalizeSearch(query).split(' ').filter(Boolean);
  const rows = practiceContent(decks, records, schedules, now).filter(
    (row) =>
      row.mode === mode &&
      terms.every((term) =>
        normalizeSearch(row.title + ' ' + row.detail + ' ' + row.deckTitle).includes(term),
      ),
  );
  return (
    <Screen includeTopInset>
      <ProgressHeader title={t('learning.needsPractice')} onBack={onBack} />
      <AppText tone="secondary">{t('progress.practiceBody')}</AppText>
      <SegmentedControl
        label={t('learning.needsPractice')}
        value={mode}
        onChange={(value) => setMode(value as 'flashcard' | 'quiz')}
        options={[
          { value: 'flashcard', label: t('learning.cards') },
          { value: 'quiz', label: t('learning.quiz') },
        ]}
      />
      <TextField
        label={t('progress.practiceSearch')}
        placeholder={t('progress.practiceSearch')}
        value={query}
        onChangeText={setQuery}
        leadingIcon={<Icon name="search" color={colors.text.secondary} />}
        trailingAction={
          query ? (
            <IconButton icon="close" label={t('common.clear')} onPress={() => setQuery('')} />
          ) : undefined
        }
        autoCorrect={false}
        returnKeyType="search"
      />
      {rows.map((row) => (
        <Pressable
          key={row.deckId + ':' + row.id}
          accessibilityRole="button"
          onPress={() => onStudy(row.deckId, row.mode, [row.id])}
          style={styles.card}
        >
          <View style={styles.grow}>
            <AppText variant="h4">{row.title}</AppText>
            <AppText variant="bodySmall" tone="secondary">
              {row.deckTitle}
            </AppText>
            <View style={styles.meta}>
              <View style={styles.dot} />
              <AppText variant="caption" tone="secondary">
                {t('learning.again')} · {formatDate(row.timestamp)}
              </AppText>
            </View>
          </View>
          <ProgressIcon name="navigation-system/forward" />
        </Pressable>
      ))}
      {!rows.length ? (
        <StateView
          status={query ? 'empty' : 'complete'}
          title={t(query ? 'deck.noResults' : 'learning.practiceDone')}
          message={t(query ? 'deck.noResultsBody' : 'progress.practiceEmpty')}
        />
      ) : null}
    </Screen>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface.card,
    padding: spacing.xl,
    borderRadius: radius.card,
  },
  grow: { flex: 1, minWidth: 0, gap: spacing.md },
  meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.feedback.error.text,
  },
});
