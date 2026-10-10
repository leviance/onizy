import { en } from './locales/en.ts';
import { vi } from './locales/vi.ts';

/** Register each language once; detection, resources and the picker use this registry. */
export const locales = {
  vi: { nativeName: 'Tiếng Việt', tag: 'vi-VN', messages: vi },
  en: { nativeName: 'English', tag: 'en-US', messages: en },
} as const;
export type Locale = keyof typeof locales;
export type { TranslationKey } from './locales/en.ts';
export const defaultLocale: Locale = 'vi';

export function supportedLocale(value: unknown): Locale | null {
  if (typeof value !== 'string') return null;
  const language = value.trim().toLowerCase().replace(/_/g, '-').split('-')[0];
  return language && Object.hasOwn(locales, language) ? (language as Locale) : null;
}

export function resolveLocale(tags: readonly string[]): Locale {
  for (const tag of tags) {
    const locale = supportedLocale(tag);
    if (locale) return locale;
  }
  return defaultLocale;
}
