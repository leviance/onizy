import { createInstance } from 'i18next';
import { defaultLocale, locales } from './resources.ts';
import type { Locale, TranslationKey } from './resources.ts';

export type TranslationValues = Readonly<Record<string, string | number>>;

export function createI18n(locale: Locale = defaultLocale) {
  const instance = createInstance();
  void instance.init({
    lng: locale,
    fallbackLng: defaultLocale,
    supportedLngs: Object.keys(locales),
    resources: Object.fromEntries(
      Object.entries(locales).map(([key, definition]) => [
        key,
        { translation: definition.messages },
      ]),
    ),
    initAsync: false,
    keySeparator: false,
    interpolation: { escapeValue: false },
  });
  return instance;
}

export function createFormatters(locale: Locale) {
  const tag = locales[locale].tag;
  const formatNumber = (value: number) => new Intl.NumberFormat(tag).format(value);
  return {
    formatNumber,
    formatPercent: (value: number) =>
      new Intl.NumberFormat(tag, { style: 'percent', maximumFractionDigits: 0 }).format(
        value / 100,
      ),
    formatDate: (value: number, options?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(tag, options).format(value),
    formatDateTime: (value: number) =>
      new Intl.DateTimeFormat(tag, { dateStyle: 'medium', timeStyle: 'short' }).format(value),
    translateValues: (values: TranslationValues) =>
      Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          typeof value === 'number' ? formatNumber(value) : value,
        ]),
      ),
  };
}

/** Keep count numeric for plural selection; format the interpolated value separately. */
export function translate(
  instance: ReturnType<typeof createI18n>,
  locale: Locale,
  key: TranslationKey,
  values: TranslationValues = {},
): string {
  const { count, ...other } = values;
  return instance.t(key, {
    ...createFormatters(locale).translateValues(other),
    ...(typeof count === 'number'
      ? { count, formattedCount: createFormatters(locale).formatNumber(count) }
      : {}),
    lng: locale,
  });
}
