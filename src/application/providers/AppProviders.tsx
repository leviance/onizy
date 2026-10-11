import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_500Medium } from '@expo-google-fonts/nunito/500Medium';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import { Nunito_900Black } from '@expo-google-fonts/nunito/900Black';
import { useFonts } from 'expo-font';
import { useLocales } from 'expo-localization';
import type { PropsWithChildren } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BrandArtwork, colors, spacing } from '@/design-system';
import { localeStorage } from '@/infrastructure/storage/locale-storage';
import { I18nProvider } from '@/shared/i18n';
import { SpeechContext } from '@/shared/speech/context';
import { speechService } from '@/infrastructure/speech/expo-speech';

import { LearningProvider } from './LearningProvider';

export function AppProviders({ children }: PropsWithChildren) {
  const deviceLocales = useLocales().map((locale) => locale.languageTag);
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  if (fontError) {
    throw fontError;
  }

  const loading = (
    <View style={styles.loading}>
      <BrandArtwork variant="logo" width={96} accessibilityLabel={'Onizy'} />
      <ActivityIndicator size="small" color={colors.brand.primary} />
    </View>
  );
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <I18nProvider storage={localeStorage} deviceLocales={deviceLocales} loading={loading}>
          {fontsLoaded ? (
            <SpeechContext.Provider value={speechService}>
              <LearningProvider>{children}</LearningProvider>
            </SpeechContext.Provider>
          ) : (
            loading
          )}
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.canvas,
    gap: spacing.lg,
  },
});
