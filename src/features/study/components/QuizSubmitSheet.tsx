import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Button, colors, radius, spacing } from '@/design-system';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { useTranslation } from '@/shared/i18n';
import { StudyIcon } from './StudyIcon';

export function QuizSubmitSheet({
  visible,
  answered,
  total,
  onSubmit,
  onClose,
}: {
  visible: boolean;
  answered: number;
  total: number;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const remaining = Math.max(0, total - answered);
  return (
    <Modal
      visible={visible}
      transparent
      animationType={reducedMotion ? 'none' : 'slide'}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} accessible={false} onPress={onClose} />
        <View
          style={styles.sheet}
          accessibilityViewIsModal
          accessibilityLabel={t('learning.submitTitle')}
        >
          <View style={styles.handle} />
          <ScrollView
            contentContainerStyle={[
              styles.content,
              { paddingBottom: Math.max(spacing.xl, insets.bottom) },
            ]}
          >
            <AppText variant="h3" accessibilityRole="header">
              {t('learning.submitTitle')}
            </AppText>
            <AppText tone="secondary">{t('learning.submitBody', { answered, total })}</AppText>
            <View style={styles.counts}>
              <View style={[styles.count, styles.answered]}>
                <StudyIcon name="quiz/selected" />
                <AppText variant="bodySmall">
                  {t('session.answeredCount', { count: answered })}
                </AppText>
              </View>
              <View style={styles.count}>
                <StudyIcon name="quiz/unselected" />
                <AppText variant="bodySmall">
                  {t('session.unansweredCount', { count: remaining })}
                </AppText>
              </View>
            </View>
            {remaining ? (
              <View style={styles.notice}>
                <StudyIcon name="navigation-system/warning" />
                <AppText variant="bodySmall" style={styles.noticeText}>
                  {t('session.unansweredWarning')}
                </AppText>
              </View>
            ) : null}
            <Button label={t('learning.submit')} variant="tinted" onPress={onSubmit} />
            <Button label={t('learning.continueQuiz')} variant="soft" onPress={onClose} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.overlay,
  },
  sheet: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '90%',
    backgroundColor: colors.surface.card,
    borderTopLeftRadius: radius.modal,
    borderTopRightRadius: radius.modal,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border.default,
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  content: { padding: spacing['2xl'], gap: spacing.lg },
  counts: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  count: {
    flexGrow: 1,
    flexBasis: 120,
    backgroundColor: colors.surface.subtle,
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  answered: { backgroundColor: colors.brand.soft },
  notice: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.feedback.warning.background,
    borderRadius: radius.sm,
  },
  noticeText: { flex: 1, color: colors.feedback.warning.text },
});
