import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { useTranslation } from '@/shared/i18n';

import { colors, radius, spacing } from '../tokens';
import { AppText } from './AppText';
import { Button } from './Button';
import { IconButton } from './IconButton';

export type DialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  children?: ReactNode;
  onClose: () => void;
};
export function Dialog({ visible, title, message, children, onClose }: DialogProps) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  return (
    <Modal
      transparent
      visible={visible}
      animationType={reducedMotion ? 'none' : 'fade'}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessible={false} />
        <View style={styles.dialog} accessibilityViewIsModal accessibilityLabel={title}>
          <View style={styles.header}>
            <AppText variant="h3" accessibilityRole="header" style={styles.title}>
              {title}
            </AppText>
            <IconButton icon="close" label={t('common.close')} onPress={onClose} />
          </View>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {message ? <AppText tone="secondary">{message}</AppText> : null}
            {children}
          </ScrollView>
          <Button variant="secondary" label={t('common.close')} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay,
  },
  dialog: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '85%',
    backgroundColor: colors.surface.card,
    borderRadius: radius.modal,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  header: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  title: { flex: 1 },
  content: { gap: spacing.lg, paddingVertical: spacing.xs },
});
