import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Onizy',
  slug: 'onizy',
  version: '0.1.0',
  scheme: 'onizy',
  icon: './assets/app-icons/app-icon.png',
  platforms: process.env.ONIZY_WEB_PREVIEW === '1' ? ['android', 'ios', 'web'] : ['android', 'ios'],
  userInterfaceStyle: 'light',
  backgroundColor: '#F7F6F0',
  ios: {
    supportsTablet: true,
  },
  web: {
    favicon: './assets/brand/logos/app-logo.png',
  },
  plugins: ['expo-router', 'expo-font', ['expo-localization', { supportedLocales: ['en', 'vi'] }]],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
