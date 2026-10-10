import assert from 'node:assert/strict';
import test from 'node:test';

import { canSignInWithDevelopmentAccount, createInitialAuthValues } from './development-account.ts';
import { emptyAuthValues, validateAuthForm } from './form.ts';

test('development login starts with valid test credentials and accepts them', () => {
  const values = createInitialAuthValues('login', true);
  assert.equal(values.identifier, 'dev@onizy.test');
  assert.equal(values.password, 'OnizyDev123!');
  assert.deepEqual(validateAuthForm('login', values), {});
  assert.equal(canSignInWithDevelopmentAccount('login', values, true), true);
  assert.equal(
    canSignInWithDevelopmentAccount('login', { ...values, identifier: ' DEV@ONIZY.TEST ' }, true),
    true,
  );
});

test('release never prefills or accepts the test account, including manually entered credentials', () => {
  assert.deepEqual(createInitialAuthValues('login', false), emptyAuthValues);
  assert.deepEqual(createInitialAuthValues('register', false), emptyAuthValues);
  assert.equal(
    canSignInWithDevelopmentAccount('login', createInitialAuthValues('login', true), false),
    false,
  );
});

test('development registration remains empty and cannot use the test login shortcut', () => {
  assert.deepEqual(createInitialAuthValues('register', true), emptyAuthValues);
  assert.equal(
    canSignInWithDevelopmentAccount('register', createInitialAuthValues('login', true), true),
    false,
  );
});

test('incorrect credentials cannot enter through the development account', () => {
  const values = createInitialAuthValues('login', true);
  for (const override of [
    { identifier: 'other@onizy.test' },
    { identifier: '' },
    { password: '' },
    { password: 'onizydev123!' },
    { password: `${values.password} ` },
  ]) {
    assert.equal(canSignInWithDevelopmentAccount('login', { ...values, ...override }, true), false);
  }
});

test('each form owns its initial values without mutating the test account or empty form', () => {
  const values = createInitialAuthValues('login', true);
  values.identifier = 'changed@onizy.test';
  values.password = 'changed';
  assert.equal(createInitialAuthValues('login', true).identifier, 'dev@onizy.test');
  assert.equal(createInitialAuthValues('login', true).password, 'OnizyDev123!');
  assert.deepEqual(createInitialAuthValues('login', false), emptyAuthValues);
});
