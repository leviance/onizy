import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeSearch } from './search.ts';

test('Vietnamese query matches accented, decomposed and mixed-case titles', () => {
  assert.equal(normalizeSearch('  TiẾng Anh  '), 'tieng anh');
  assert.equal(normalizeSearch('Địa lý'), 'dia ly');
  assert.equal(normalizeSearch('Thiên văn'.normalize('NFD')), 'thien van');
});
