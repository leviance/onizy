import { StyleSheet, View } from 'react-native';
import {
  AppText,
  Card,
  IconButton,
  SegmentedControl,
  TextField,
  colors,
  spacing,
} from '@/design-system';
import { useTranslation } from '@/shared/i18n';
import type { QuestionDraft } from '../model/deck-draft';

export function QuestionDraftEditor({
  question,
  number,
  onChange,
  onRemove,
}: {
  question: QuestionDraft;
  number: number;
  onChange: (patch: Partial<QuestionDraft>) => void;
  onRemove: () => void;
}) {
  const { formatText, t } = useTranslation();
  return (
    <Card style={styles.card}>
      <View style={styles.heading}>
        <AppText variant="label" style={{ flex: 1 }}>
          {formatText('learning.questionCard', { value: number })}
        </AppText>
        <IconButton icon="close" label={t('learning.remove')} onPress={onRemove} />
      </View>
      <TextField
        label={t('learning.question')}
        value={question.question}
        multiline
        onChangeText={(value) => onChange({ question: value })}
      />
      {question.choices.map((choice, position) => (
        <TextField
          key={position}
          label={`${t('learning.answer')} ${String.fromCharCode(65 + position)}`}
          value={choice}
          multiline
          onChangeText={(value) =>
            onChange({
              choices: question.choices.map((item, index) => (index === position ? value : item)),
            })
          }
        />
      ))}
      <SegmentedControl
        label={t('learning.correctChoice')}
        value={String(question.correctIndex)}
        onChange={(value) => onChange({ correctIndex: Number(value) })}
        options={question.choices.map((_, position) => ({
          value: String(position),
          label: String.fromCharCode(65 + position),
        }))}
      />
      <TextField
        label={t('learning.explanation')}
        value={question.explanation}
        multiline
        onChangeText={(explanation) => onChange({ explanation })}
      />
    </Card>
  );
}
const styles = StyleSheet.create({
  card: { borderColor: colors.border.subtle, borderWidth: 1 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
