import assert from 'node:assert/strict';
import test from 'node:test';
import { createI18n, createFormatters, translate } from './engine.ts';
import { createLanguageStore } from './preferences.ts';
import { locales, resolveLocale } from './resources.ts';

const placeholders = (text) => [...text.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort();

test('registered languages include complete keys, matching placeholders and required plurals', () => {
  const reference = locales.en.messages;
  const pluralBases = Object.keys(reference)
    .filter((key) => key.endsWith('_other'))
    .map((key) => key.slice(0, -6));
  for (const [locale, { messages, tag }] of Object.entries(locales)) {
    for (const [key, value] of Object.entries(reference)) {
      assert.ok(messages[key]?.trim(), `${locale}: missing ${key}`);
      assert.deepEqual(placeholders(messages[key]), placeholders(value), `${locale}: ${key}`);
    }
    for (const key of Object.keys(messages)) {
      if (key in reference) continue;
      const base = pluralBases.find((base) =>
        ['zero', 'one', 'two', 'few', 'many', 'other'].some(
          (category) => key === `${base}_${category}`,
        ),
      );
      assert.ok(base, `${locale}: unexpected key ${key}`);
      assert.ok(messages[key]?.trim(), `${locale}: empty ${key}`);
      assert.deepEqual(
        placeholders(messages[key]),
        placeholders(reference[`${base}_other`]),
        `${locale}: ${key}`,
      );
    }
    for (const base of pluralBases) {
      for (const category of new Intl.PluralRules(tag).resolvedOptions().pluralCategories) {
        assert.ok(
          messages[`${base}_${category}`]?.trim(),
          `${locale}: missing ${base}_${category}`,
        );
      }
    }
  }
});

test('regional tags and ordered device languages resolve with Vietnamese fallback', () => {
  assert.equal(resolveLocale(['fr-FR', 'en-GB']), 'en');
  assert.equal(resolveLocale(['VI_vn', 'en-US']), 'vi');
  assert.equal(resolveLocale(['unsupported']), 'vi');
  assert.equal(resolveLocale([]), 'vi');
});

test('translations support singular, plural, interpolation and localized numbers', () => {
  const engine = createI18n();
  assert.equal(translate(engine, 'en', 'auth.signIn'), 'Sign in');
  assert.equal(translate(engine, 'vi', 'auth.signIn'), 'Đăng nhập');
  assert.equal(translate(engine, 'en', 'common.cards', { count: 1 }), '1 card');
  assert.equal(translate(engine, 'en', 'common.cards', { count: 2 }), '2 cards');
  assert.equal(translate(engine, 'en', 'home.days', { count: 1 }), '1 day');
  assert.equal(translate(engine, 'vi', 'common.cards', { count: 1000 }), '1.000 thẻ');
  assert.equal(
    translate(engine, 'en', 'learning.yourAnswer', { answer: '<correct> & safe' }),
    'Your answer: <correct> & safe',
  );
  const stamp = Date.UTC(2026, 9, 9);
  assert.notEqual(
    createFormatters('vi').formatDate(stamp),
    createFormatters('en').formatDate(stamp),
  );
  assert.equal(createFormatters('en').formatNumber(1200), '1,200');
  assert.equal(createFormatters('vi').formatNumber(1200), '1.200');
});

test('explicit choice restores, follows device only in system mode and survives restart', async () => {
  let saved = 'en';
  const storage = {
    read: async () => saved,
    write: async (value) => {
      saved = value;
    },
  };
  const store = createLanguageStore(storage, ['vi-VN']);
  await store.initialize();
  assert.equal(store.getSnapshot().locale, 'en');
  store.setDeviceLocales(['vi-VN']);
  assert.equal(store.getSnapshot().locale, 'en');
  await store.select('vi');
  const restored = createLanguageStore(storage, ['en-US']);
  await restored.initialize();
  assert.equal(restored.getSnapshot().locale, 'vi');
  await restored.select('system');
  assert.equal(restored.getSnapshot().locale, 'en');
  restored.setDeviceLocales(['vi-VN']);
  assert.equal(restored.getSnapshot().locale, 'vi');
});

test('slow hydration cannot override a selection and rapid writes preserve final preference', async () => {
  let resolveRead;
  let saved = null;
  const writes = [];
  const store = createLanguageStore(
    {
      read: () =>
        new Promise((resolve) => {
          resolveRead = resolve;
        }),
      write: async (value) => {
        writes.push(value);
        saved = value;
      },
    },
    ['en-US'],
  );
  const hydration = store.initialize();
  let notifications = 0;
  const unsubscribe = store.subscribe(() => {
    notifications++;
  });
  const first = store.select('vi');
  const second = store.select('en');
  resolveRead('vi');
  await Promise.all([hydration, first, second]);
  assert.deepEqual(writes, ['vi', 'en']);
  assert.equal(saved, 'en');
  assert.equal(store.getSnapshot().locale, 'en');
  assert.equal(store.getSnapshot().saving, false);
  assert.ok(notifications >= 3);
  unsubscribe();
});

test('unavailable storage does not block the app or lose current selection, retry recovers', async () => {
  let fail = true;
  const store = createLanguageStore(
    {
      read: async () => {
        throw new Error('Unavailable');
      },
      write: async () => {
        if (fail) throw new Error('Unavailable');
      },
    },
    ['en'],
  );
  await store.initialize();
  assert.equal(store.getSnapshot().ready, true);
  await store.select('vi');
  assert.equal(store.getSnapshot().locale, 'vi');
  assert.equal(store.getSnapshot().error, true);
  fail = false;
  await store.select('vi');
  assert.equal(store.getSnapshot().error, false);
  assert.equal(store.getSnapshot().saving, false);
});
