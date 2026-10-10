import { StyleSheet, View } from 'react-native';
import { AppText, Card, IconButton, TextField, colors, spacing } from '@/design-system';
import { useTranslation } from '@/shared/i18n';
import type { CardDraft } from '../model/deck-draft';

export function CardDraftEditor({
  card,
  number,
  onChange,
  onRemove,
}: {
  card: CardDraft;
  number: number;
  onChange: (patch: Partial<CardDraft>) => void;
  onRemove: () => void;
}) {
  const { formatText, t } = useTranslation();
  return (
    <Card style={styles.card}>
      <View style={styles.heading}>
        <AppText variant="label" style={{ flex: 1 }}>
          {formatText('learning.cardNumber', { value: number })}
        </AppText>
        <IconButton icon="close" label={t('learning.remove')} onPress={onRemove} />
      </View>
      <TextField
        label={t('learning.front')}
        value={card.front}
        multiline
        onChangeText={(front) => onChange({ front })}
      />
      <TextField
        label={t('learning.back')}
        value={card.back}
        multiline
        onChangeText={(back) => onChange({ back })}
      />
    </Card>
  );
}
const styles = StyleSheet.create({
  card: { borderColor: colors.border.subtle, borderWidth: 1 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
