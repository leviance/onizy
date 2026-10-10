import { useEffect, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import {
  AppText,
  Button,
  Dialog,
  IconButton,
  Screen,
  SegmentedControl,
  TextField,
  colors,
  spacing,
} from '@/design-system';
import type { LearningDeck } from '@/domain/content/learning';
import { useTranslation } from '@/shared/i18n';
import { CardDraftEditor } from '../components/CardDraftEditor';
import { QuestionDraftEditor } from '../components/QuestionDraftEditor';
import { useDeckDraft } from '../hooks/useDeckDraft';

export function CreateDeckScreen({
  onSave,
  onBack,
}: {
  onSave: (deck: LearningDeck) => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const { draft, dispatch, invalid, dirty, save } = useDeckDraft(onSave);
  const [tab, setTab] = useState('cards');
  const [exitOpen, setExitOpen] = useState(false);
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!dirty) return false;
      setExitOpen(true);
      return true;
    });
    return () => subscription.remove();
  }, [dirty]);
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen includeTopInset>
        <View style={styles.header}>
          <IconButton
            icon="back"
            label={t('common.back')}
            onPress={() => (dirty ? setExitOpen(true) : onBack())}
          />
          <AppText variant="h3">{t('learning.newDeck')}</AppText>
        </View>
        <AppText tone="secondary">{t('learning.createBody')}</AppText>
        <TextField
          label={t('learning.name')}
          value={draft.title}
          onChangeText={(value) => dispatch({ type: 'title', value })}
        />
        <TextField
          label={t('learning.subject')}
          value={draft.subject}
          onChangeText={(value) => dispatch({ type: 'subject', value })}
        />
        <SegmentedControl
          label={t('learning.content')}
          value={tab}
          onChange={setTab}
          options={[
            { value: 'cards', label: t('learning.cards') },
            { value: 'questions', label: t('learning.questions') },
          ]}
        />
        {tab === 'cards' ? (
          <>
            {draft.cards.map((card, index) => (
              <CardDraftEditor
                key={card.rowId}
                card={card}
                number={index + 1}
                onChange={(patch) => dispatch({ type: 'update-card', rowId: card.rowId, patch })}
                onRemove={() => dispatch({ type: 'remove-card', rowId: card.rowId })}
              />
            ))}
            <Button
              label={t('learning.addCard')}
              variant="soft"
              leadingIcon="plus"
              onPress={() => dispatch({ type: 'add-card' })}
            />
          </>
        ) : (
          <>
            {draft.questions.map((question, index) => (
              <QuestionDraftEditor
                key={question.rowId}
                question={question}
                number={index + 1}
                onChange={(patch) =>
                  dispatch({ type: 'update-question', rowId: question.rowId, patch })
                }
                onRemove={() => dispatch({ type: 'remove-question', rowId: question.rowId })}
              />
            ))}
            <Button
              label={t('learning.addQuestion')}
              variant="soft"
              leadingIcon="plus"
              onPress={() => dispatch({ type: 'add-question' })}
            />
          </>
        )}
        {invalid ? (
          <AppText accessibilityLiveRegion="polite" style={{ color: colors.feedback.error.text }}>
            {t('learning.invalidDeck')}
          </AppText>
        ) : null}
        <Button label={t('learning.save')} variant="tinted" onPress={save} />
        <AppText variant="caption" tone="secondary">
          {t('learning.sessionOnly')}
        </AppText>
        <Dialog
          visible={exitOpen}
          title={t('learning.discardTitle')}
          message={t('learning.discardBody')}
          onClose={() => setExitOpen(false)}
        >
          <Button
            label={t('learning.continueEditing')}
            variant="tinted"
            onPress={() => setExitOpen(false)}
          />
          <Button label={t('learning.discard')} variant="ghost" onPress={onBack} />
        </Dialog>
      </Screen>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
