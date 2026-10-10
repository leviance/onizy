import { useState } from 'react';
import {
  AccessibilityInfo,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, colors, fonts, layout, radius, spacing } from '@/design-system';
import { useTranslation } from '@/shared/i18n';

import { AuthArtwork, AuthFooterDecoration } from '../components/AuthArtwork';
import { AuthButton } from '../components/AuthButton';
import { AuthFields } from '../components/AuthFields';
import { AuthIcon } from '../components/AuthIcon';
import { AuthNotice } from '../components/AuthNotice';
import type { AuthNoticeType } from '../components/AuthNotice';
import { useAuthForm } from '../hooks/useAuthForm';
import { canSignInWithDevelopmentAccount } from '../model/development-account';
import { hasValidPassword } from '../model/form';
import type { AuthField, AuthValues } from '../model/form';

export type AuthScreenProps = {
  onSwitchMode: () => void;
  onExplore: () => void;
};
type Props = AuthScreenProps &
  ({ mode: 'login'; onDevelopmentSignIn: () => void } | { mode: 'register' });

export function AuthScreen(props: Props) {
  const { t } = useTranslation();
  const { mode, onSwitchMode, onExplore } = props;
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { values, errors, update, submit } = useAuthForm(mode);
  const [notice, setNotice] = useState<AuthNoticeType | null>(null);
  const [focusRequest, setFocusRequest] = useState<{ field: AuthField; revision: number } | null>(
    null,
  );
  const registering = mode === 'register';
  const frameWidth = Math.min(width - insets.left - insets.right, 520);
  const heroHeight = Math.max(144, Math.min(188, height * 0.2));
  const passwordValid = hasValidPassword(values.password);

  function handleSubmit() {
    const nextErrors = submit();
    const firstError = Object.values(nextErrors)[0];
    if (firstError) {
      const firstField = Object.keys(nextErrors)[0] as keyof AuthValues;
      if (firstField !== 'accepted')
        setFocusRequest((current) => ({
          field: firstField,
          revision: (current?.revision ?? 0) + 1,
        }));
      AccessibilityInfo.announceForAccessibility(t(firstError));
      return;
    }
    Keyboard.dismiss();
    if (
      __DEV__ &&
      props.mode === 'login' &&
      canSignInWithDevelopmentAccount(mode, values, __DEV__)
    ) {
      props.onDevelopmentSignIn();
      return;
    }
    setNotice(mode);
  }

  function explore() {
    setNotice(null);
    Keyboard.dismiss();
    onExplore();
  }

  const legalLinks = (
    <View style={styles.legalLinks}>
      <Pressable
        onPress={() => setNotice('terms')}
        accessibilityRole="link"
        style={styles.legalLink}
      >
        <AppText style={styles.legalText}>{t('auth.terms')}</AppText>
      </Pressable>
      <AppText tone="secondary" style={styles.legalJoin}>
        {t('auth.and')}
      </AppText>
      <Pressable
        onPress={() => setNotice('privacy')}
        accessibilityRole="link"
        style={styles.legalLink}
      >
        <AppText style={styles.legalText}>{t('auth.privacy')}</AppText>
      </Pressable>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'web' ? 'none' : 'on-drag'}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={styles.scroll}
      >
        <View
          style={[
            styles.frame,
            {
              width: frameWidth,
              minHeight: height,
              paddingBottom: Math.max(insets.bottom, spacing.lg),
            },
          ]}
        >
          <AuthFooterDecoration />
          <AuthArtwork mode={mode} height={heroHeight} topInset={insets.top} />
          <View style={styles.intro}>
            <AppText
              accessibilityRole="header"
              style={[
                styles.title,
                { fontSize: frameWidth < 360 ? 28 : 32, lineHeight: frameWidth < 360 ? 34 : 39 },
              ]}
            >
              {t(registering ? 'auth.registerTitle' : 'auth.loginTitle')}
            </AppText>
            <AppText tone="secondary" style={styles.description}>
              {t(registering ? 'auth.registerDescription' : 'auth.loginDescription')}
            </AppText>
          </View>
          <View
            style={[styles.card, { marginHorizontal: frameWidth < 360 ? spacing.lg : spacing.xl }]}
          >
            <AuthFields
              mode={mode}
              values={values}
              errors={errors}
              update={update}
              onSubmit={handleSubmit}
              focusRequest={focusRequest}
            />
            {registering ? (
              <>
                <View style={styles.passwordHint}>
                  <View style={[styles.hintIcon, passwordValid && styles.validIcon]}>
                    <AuthIcon
                      name="check"
                      size={16}
                      color={passwordValid ? colors.text.inverse : colors.text.secondary}
                    />
                  </View>
                  <AppText style={[styles.hintText, passwordValid && styles.validText]}>
                    {t('auth.passwordHint')}
                  </AppText>
                </View>
                <View>
                  <View style={styles.consentRow}>
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: values.accepted }}
                      aria-checked={values.accepted}
                      accessibilityLabel={t('auth.consentLabel')}
                      onPress={() => update('accepted', !values.accepted)}
                      style={styles.checkboxTarget}
                      testID="auth-consent"
                    >
                      <View style={[styles.checkbox, values.accepted && styles.checked]}>
                        {values.accepted ? (
                          <AuthIcon name="check" size={18} color={colors.text.inverse} />
                        ) : null}
                      </View>
                    </Pressable>
                    <View style={styles.consentText}>
                      <AppText style={styles.hintText}>{t('auth.consentPrefix')}</AppText>
                      {legalLinks}
                    </View>
                  </View>
                  {errors.accepted ? (
                    <AppText accessibilityLiveRegion="polite" style={styles.error}>
                      {t(errors.accepted)}
                    </AppText>
                  ) : null}
                </View>
              </>
            ) : (
              <Pressable
                onPress={() => setNotice('recovery')}
                accessibilityRole="button"
                style={styles.forgot}
                testID="auth-forgot-password"
              >
                <AppText style={styles.linkText}>{t('auth.forgotPassword')}</AppText>
              </Pressable>
            )}
            <View style={styles.actions}>
              {__DEV__ && !registering ? (
                <AppText tone="secondary" style={styles.accountHint} testID="auth-development-hint">
                  {t('auth.developmentAccount')}
                </AppText>
              ) : null}
              <AuthButton
                label={t(registering ? 'auth.createAccount' : 'auth.signIn')}
                onPress={handleSubmit}
                testID="auth-submit"
              />
              <AuthButton
                variant="secondary"
                label={t(registering ? 'auth.alreadyRegistered' : 'auth.createAccount')}
                onPress={() => {
                  Keyboard.dismiss();
                  onSwitchMode();
                }}
                testID="auth-switch-mode"
              />
            </View>
            <View style={styles.divider}>
              <View style={styles.line} />
              <AppText tone="secondary" style={styles.dividerText}>
                {t('auth.or')}
              </AppText>
              <View style={styles.line} />
            </View>
            <View style={styles.actions}>
              <AuthButton
                provider="google"
                label={t('auth.google')}
                onPress={() => setNotice('google')}
                testID="auth-google"
              />
              <AuthButton
                provider="apple"
                label={t('auth.apple')}
                onPress={() => setNotice('apple')}
                testID="auth-apple"
              />
            </View>
            {registering ? (
              <AppText tone="secondary" style={styles.accountHint}>
                {t('auth.accountHint')}
              </AppText>
            ) : null}
          </View>
          <View style={styles.footer}>
            {!registering ? (
              <>
                <AppText tone="secondary" style={styles.footerCopy}>
                  {t('auth.continueAgreement')}
                </AppText>
                {legalLinks}
                <Pressable
                  onPress={explore}
                  accessibilityRole="button"
                  style={styles.explore}
                  testID="auth-explore"
                >
                  <AppText style={styles.linkText}>{t('auth.explore')}</AppText>
                </Pressable>
              </>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <AuthNotice type={notice} onClose={() => setNotice(null)} onExplore={explore} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface.onboarding },
  scroll: { alignItems: 'center', flexGrow: 1 },
  frame: { overflow: 'hidden' },
  intro: {
    paddingHorizontal: spacing['2xl'],
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  title: { fontFamily: fonts.black, letterSpacing: -0.9, textAlign: 'center' },
  description: { fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 360 },
  card: {
    backgroundColor: colors.surface.card,
    padding: spacing.lg,
    borderRadius: radius.card,
    gap: spacing.md,
  },
  actions: { gap: spacing.sm },
  forgot: { minHeight: layout.minTouchTarget, alignSelf: 'flex-end', justifyContent: 'center' },
  linkText: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 21, color: colors.brand.deep },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.border.default },
  dividerText: { fontSize: 13, lineHeight: 20 },
  passwordHint: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  hintIcon: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.surface.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validIcon: { backgroundColor: colors.feedback.success.text },
  hintText: { flex: 1, fontSize: 13, lineHeight: 20, color: colors.text.secondary },
  validText: { color: colors.feedback.success.text },
  consentRow: { flexDirection: 'row', gap: spacing.xs, alignItems: 'flex-start' },
  checkboxTarget: {
    width: layout.minTouchTarget,
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 23,
    height: 23,
    borderWidth: 1.5,
    borderColor: colors.text.secondary,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: { backgroundColor: colors.brand.deep, borderColor: colors.brand.deep },
  consentText: { flex: 1, paddingTop: spacing.sm },
  legalLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalLink: { minHeight: layout.minTouchTarget, justifyContent: 'center' },
  legalText: {
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 18,
    textDecorationLine: 'underline',
  },
  legalJoin: { fontSize: 12, lineHeight: 18 },
  error: { color: colors.feedback.error.text, fontSize: 12, lineHeight: 18 },
  accountHint: { fontSize: 12, lineHeight: 18, textAlign: 'center', paddingHorizontal: spacing.sm },
  footer: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.lg, alignItems: 'center' },
  footerCopy: { fontSize: 12, lineHeight: 18, textAlign: 'center' },
  explore: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
});
