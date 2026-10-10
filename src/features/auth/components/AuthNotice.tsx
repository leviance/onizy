import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText, colors, layout, radius, spacing } from '@/design-system';
import { useTranslation } from '@/shared/i18n';
import type { TranslationKey } from '@/shared/i18n';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

import { AuthButton } from './AuthButton';
import { AuthIcon } from './AuthIcon';

export type AuthNoticeType =
  'login' | 'register' | 'google' | 'apple' | 'recovery' | 'terms' | 'privacy';
const noticeKeys: Record<AuthNoticeType, { title: TranslationKey; body: TranslationKey }> = {
  login: { title: 'auth.notice.loginTitle', body: 'auth.notice.accountBody' },
  register: { title: 'auth.notice.registerTitle', body: 'auth.notice.accountBody' },
  google: { title: 'auth.notice.googleTitle', body: 'auth.notice.accountBody' },
  apple: { title: 'auth.notice.appleTitle', body: 'auth.notice.accountBody' },
  recovery: { title: 'auth.notice.recoveryTitle', body: 'auth.notice.recoveryBody' },
  terms: { title: 'auth.terms', body: 'auth.notice.termsBody' },
  privacy: { title: 'auth.privacy', body: 'auth.notice.privacyBody' },
};

export function AuthNotice({
  type,
  onClose,
  onExplore,
}: {
  type: AuthNoticeType | null;
  onClose: () => void;
  onExplore: () => void;
}) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  if (!type) return null;
  const copy = noticeKeys[type];
  const canExplore = ['login', 'register', 'google', 'apple'].includes(type);
  return (
    <Modal
      transparent
      animationType={reducedMotion ? 'none' : 'fade'}
      visible
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessible={false} />
        <View style={styles.dialog} accessibilityViewIsModal accessibilityLabel={t(copy.title)}>
          <View style={styles.heading}>
            <AppText variant="h3" accessibilityRole="header" style={styles.title}>
              {t(copy.title)}
            </AppText>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t('auth.close')}
              style={styles.close}
            >
              <AuthIcon name="close" />
            </Pressable>
          </View>
          <AppText tone="secondary">{t(copy.body)}</AppText>
          <AuthButton
            label={t(canExplore ? 'auth.explore' : 'auth.understood')}
            onPress={canExplore ? onExplore : onClose}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: 'rgba(17, 17, 17, 0.35)',
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    padding: spacing['2xl'],
    borderRadius: radius.card,
    backgroundColor: colors.surface.card,
    gap: spacing.lg,
  },
  heading: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  title: { flex: 1 },
  close: {
    width: layout.minTouchTarget,
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
