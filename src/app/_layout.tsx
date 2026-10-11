import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppProviders } from '@/application/providers/AppProviders';
import { colors, fonts } from '@/design-system';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface.canvas },
          headerTintColor: colors.text.primary,
          headerTitleStyle: { fontFamily: fonts.extraBold },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.surface.canvas },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ title: 'Onizy', headerShown: false }} />
        <Stack.Screen name="library" options={{ headerShown: false }} />
        <Stack.Screen name="deck" options={{ headerShown: false }} />
        <Stack.Screen name="create-deck" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="study" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="review" options={{ headerShown: false }} />
        <Stack.Screen name="progress" options={{ headerShown: false }} />
        <Stack.Screen name="history" options={{ headerShown: false }} />
        <Stack.Screen name="practice" options={{ headerShown: false }} />
      </Stack>
    </AppProviders>
  );
}
