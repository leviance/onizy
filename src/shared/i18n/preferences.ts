import { defaultLocale, resolveLocale, supportedLocale } from './resources.ts';
import type { Locale } from './resources.ts';

export type LanguagePreference = Locale | 'system';
export type LocaleStorage = {
  read: () => Promise<string | null>;
  write: (value: LanguagePreference) => Promise<void>;
};
type Snapshot = {
  locale: Locale;
  preference: LanguagePreference;
  ready: boolean;
  saving: boolean;
  error: boolean;
};

export function createLanguageStore(storage: LocaleStorage, tags: readonly string[]) {
  let deviceLocale = resolveLocale(tags);
  let state: Snapshot = {
    locale: deviceLocale,
    preference: 'system',
    ready: false,
    saving: false,
    error: false,
  };
  let revision = 0;
  let initialized: Promise<void> | undefined;
  let pending = Promise.resolve();
  const listeners = new Set<() => void>();
  const publish = (next: Snapshot) => {
    state = next;
    listeners.forEach((listener) => listener());
  };
  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    initialize() {
      if (!initialized) {
        const initialRevision = revision;
        initialized = storage
          .read()
          .then((saved) => {
            if (revision !== initialRevision) return;
            const preference = supportedLocale(saved) ?? 'system';
            publish({
              ...state,
              preference,
              locale: preference === 'system' ? deviceLocale : preference,
              ready: true,
            });
          })
          .catch(() => {
            if (revision === initialRevision) publish({ ...state, ready: true, error: true });
          });
      }
      return initialized;
    },
    setDeviceLocales(nextTags: readonly string[]) {
      deviceLocale = resolveLocale(nextTags);
      if (state.preference === 'system' && deviceLocale !== state.locale)
        publish({ ...state, locale: deviceLocale });
    },
    select(preference: LanguagePreference) {
      const safePreference =
        preference === 'system' ? 'system' : (supportedLocale(preference) ?? defaultLocale);
      const selectedRevision = ++revision;
      publish({
        ...state,
        preference: safePreference,
        locale: safePreference === 'system' ? deviceLocale : safePreference,
        ready: true,
        saving: true,
        error: false,
      });
      pending = pending
        .then(() => storage.write(safePreference))
        .then(() => {
          if (revision === selectedRevision) publish({ ...state, saving: false });
        })
        .catch(() => {
          if (revision === selectedRevision) publish({ ...state, saving: false, error: true });
        });
      return pending;
    },
  };
}
