import { View } from 'react-native';
import {
  AppText,
  Button,
  Card,
  IconButton,
  IllustratedIcon,
  Screen,
  SectionHeading,
  StateView,
  colors,
  spacing,
} from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import type { StudyMode } from '@/domain/review/learning-session';
import { useTranslation } from '@/shared/i18n';

export function DeckScreen({
  deck,
  onStart,
  onBack,
}: {
  deck: LearningDeck | undefined;
  onStart: (mode: StudyMode) => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  if (!deck)
    return (
      <Screen includeTopInset>
        <StateView
          status="error"
          title={t('learning.missingDeck')}
          actionLabel={t('learning.backLibrary')}
          onAction={onBack}
        />
      </Screen>
    );
  return (
    <Screen includeTopInset>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <IconButton icon="back" label={t('common.back')} onPress={onBack} />
        <AppText variant="h3">{t('learning.deckDetails')}</AppText>
      </View>
      <Card style={{ borderColor: colors.border.subtle, borderWidth: 1 }}>
        <IllustratedIcon name="book" size={48} />
        <AppText variant="h2" accessibilityRole="header">
          {deck.title}
        </AppText>
        <AppText tone="secondary">{deck.subject}</AppText>
        <AppText variant="bodySmall">
          {t('common.cards', { count: deck.cards.length })} ·{' '}
          {t('common.questions', { count: deck.questions.length })}
        </AppText>
      </Card>
      <Button
        label={t('learning.startCards')}
        variant="tinted"
        leadingIcon="book"
        disabled={!deck.cards.length}
        onPress={() => onStart('flashcard')}
      />
      <Button
        label={t('learning.startQuiz')}
        variant="soft"
        leadingIcon="target"
        disabled={!deck.questions.length}
        onPress={() => onStart('quiz')}
      />
      <SectionHeading title={t('learning.content')} decorate={false} />
      {deck.cards.map((card) => (
        <Card key={card.id} style={{ borderWidth: 1, borderColor: colors.border.subtle }}>
          <AppText variant="label">{card.front}</AppText>
          <AppText tone="secondary">{card.back}</AppText>
        </Card>
      ))}
      {deck.questions.length ? (
        <AppText variant="bodySmall" tone="secondary">
          {t('common.questions', { count: deck.questions.length })}
        </AppText>
      ) : null}
    </Screen>
  );
}
