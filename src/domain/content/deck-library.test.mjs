import assert from 'node:assert/strict';
import test from 'node:test';
import { libraryEntries, selectLibraryEntries, updateDeckPreference } from './deck-library.ts';

const decks = [
  {
    id: 'english',
    title: 'Từ vựng TOEIC',
    subject: 'Tiếng Anh',
    cards: [{ id: 'c1' }, { id: 'c2' }],
    questions: [],
    sample: true,
  },
  {
    id: 'biology',
    title: 'Sinh học',
    subject: 'Khoa học',
    cards: [{ id: 'c3' }],
    questions: [],
    sample: true,
  },
  {
    id: 'custom',
    title: 'Định luật 10',
    subject: 'Vật lý',
    cards: [],
    questions: [],
    sample: false,
  },
];
const preferences = { english: { favorite: true, folder: 'exam' } };
const schedules = {
  c1: { decision: 'remembered', reviewedAt: 0, dueAt: 200 },
  c2: { decision: 'again', reviewedAt: 0, dueAt: 100 },
  c3: { decision: 'remembered', reviewedAt: 0, dueAt: 200 },
};
const records = [
  { deckId: 'english', finishedAt: 80 },
  { deckId: 'biology', finishedAt: 90 },
  { deckId: 'biology', finishedAt: 70 },
];
const entries = () => libraryEntries(decks, schedules, records, preferences, 100);
const select = (patch = {}) =>
  selectLibraryEntries(entries(), {
    query: '',
    filter: 'all',
    sort: 'newest',
    folder: null,
    locale: 'vi',
    folderLabel: (folder) => (folder === 'exam' ? 'Luyện thi' : 'Cá nhân'),
    ...patch,
  }).map((entry) => entry.deck.id);

test('library uses real schedules and the latest completed session regardless of arrival order', () => {
  const result = entries();
  assert.deepEqual(result[0].dueIds, ['c2']);
  assert.equal(result[0].progress, 50);
  assert.equal(result[1].progress, 100);
  assert.equal(result[1].lastStudied, 90);
  assert.equal(result[2].lastStudied, null);
  assert.deepEqual(select({ filter: 'due' }), ['english']);
  assert.deepEqual(select({ filter: 'recent' }), ['biology', 'english']);
});

test('search combines unaccented title, subject and localized folder words with filters', () => {
  assert.deepEqual(
    select({ query: 'tu vung tieng anh luyen thi', filter: 'favorites', folder: 'exam' }),
    ['english'],
  );
  assert.deepEqual(select({ query: 'dinh luat' }), ['custom']);
  assert.deepEqual(select({ query: 'sinh hoc', folder: 'exam' }), []);
  assert.deepEqual(select({ filter: 'downloaded' }), []);
});

test('sorts by creation order, localized title or progress without changing the input', () => {
  const source = entries();
  const snapshot = JSON.stringify(source);
  assert.deepEqual(select(), ['custom', 'biology', 'english']);
  assert.deepEqual(select({ sort: 'alphabetical' }), ['custom', 'biology', 'english']);
  assert.deepEqual(select({ sort: 'progress' }), ['biology', 'english', 'custom']);
  selectLibraryEntries(source, {
    query: '',
    filter: 'all',
    sort: 'progress',
    folder: null,
    locale: 'en',
    folderLabel: (folder) => folder,
  });
  assert.equal(JSON.stringify(source), snapshot);
});

test('favorite and folder changes preserve each other and reject unknown decks', () => {
  const moved = updateDeckPreference(decks, preferences, 'english', { folder: 'vocabulary' });
  assert.equal(moved.english.favorite, true);
  const unfavorited = updateDeckPreference(decks, moved, 'english', { favorite: false });
  assert.equal(unfavorited.english.folder, 'vocabulary');
  assert.deepEqual(
    selectLibraryEntries(libraryEntries(decks, schedules, records, unfavorited, 100), {
      query: '',
      filter: 'favorites',
      sort: 'newest',
      folder: null,
      locale: 'vi',
      folderLabel: (folder) => folder,
    }),
    [],
  );
  assert.equal(
    updateDeckPreference(decks, preferences, 'missing', { favorite: true }),
    preferences,
  );
  assert.equal(
    updateDeckPreference(decks, preferences, 'english', { folder: 'invalid' }),
    preferences,
  );
  assert.equal(preferences.english.folder, 'exam');
});
