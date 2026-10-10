import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { I18nextProvider, useTranslation as useI18nextTranslation } from 'react-i18next';

import { createFormatters, createI18n, translate } from './engine';
import type { TranslationValues } from './engine';
import { createLanguageStore } from './preferences';
import type { LocaleStorage } from './preferences';
import type { TranslationKey } from './resources';

const LanguageContext = createContext<ReturnType<typeof createLanguageStore> | null>(null);

export function I18nProvider({
  children,
  deviceLocales,
  storage,
  loading,
}: PropsWithChildren<{
  deviceLocales: readonly string[];
  storage: LocaleStorage;
  loading: ReactNode;
}>) {
  const [store] = useState(() => createLanguageStore(storage, deviceLocales));
  const [instance] = useState(() => createI18n(store.getSnapshot().locale));
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const tags = deviceLocales.join(',');
  useEffect(() => {
    void store.initialize();
  }, [store]);
  useEffect(() => {
    store.setDeviceLocales(tags.split(','));
  }, [store, tags]);
  useEffect(() => {
    void instance.changeLanguage(state.locale);
  }, [instance, state.locale]);
  return (
    <LanguageContext.Provider value={store}>
      <I18nextProvider i18n={instance}>{state.ready ? children : loading}</I18nextProvider>
    </LanguageContext.Provider>
  );
}

/** Every rendered UI consumer subscribes; changing language never remounts study or forms. */
export function useTranslation() {
  const store = useContext(LanguageContext);
  if (!store) throw new Error('I18nProvider is required.');
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const { i18n } = useI18nextTranslation(undefined, { lng: state.locale, useSuspense: false });
  return useMemo(() => {
    const formatters = createFormatters(state.locale);
    const t = (key: TranslationKey, values?: TranslationValues) =>
      translate(i18n, state.locale, key, values);
    return { ...state, ...formatters, t, formatText: t, setLanguage: store.select };
  }, [i18n, state, store]);
}
