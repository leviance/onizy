import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LocaleStorage } from '@/shared/i18n';

const key = 'onizy.preferences.language.v1';
/** Preferences only: study data and account credentials are not stored here. */
export const localeStorage: LocaleStorage = {
  read: () => AsyncStorage.getItem(key),
  write: (value) => AsyncStorage.setItem(key, value),
};
