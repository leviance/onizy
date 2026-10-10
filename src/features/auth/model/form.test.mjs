import assert from 'node:assert/strict';
import test from 'node:test';

import { emptyAuthValues, hasValidPassword, validateAuthForm } from './form.ts';

const account = {
  ...emptyAuthValues,
  name: 'Nguyễn An',
  email: 'an@example.com',
  password: 'HọcVui123',
  confirmPassword: 'HọcVui123',
  accepted: true,
};

test('login accepts email and formatted phone without enforcing registration password rules', () => {
  for (const identifier of [' an@example.com ', '+84 (912) 345-678', '0912 345 678']) {
    assert.deepEqual(
      validateAuthForm('login', { ...emptyAuthValues, identifier, password: 'old' }),
      {},
    );
  }
});

test('login rejects empty credentials and malformed identifiers', () => {
  assert.deepEqual(validateAuthForm('login', emptyAuthValues), {
    identifier: 'auth.error.identifierRequired',
    password: 'auth.error.passwordRequired',
  });
  for (const identifier of ['an@', '123', 'phone12345678'])
    assert.equal(
      validateAuthForm('login', { ...emptyAuthValues, identifier }).identifier,
      'auth.error.identifierInvalid',
    );
});

test('registration accepts optional phone, surrounding whitespace and Unicode letters', () => {
  assert.deepEqual(
    validateAuthForm('register', {
      ...account,
      name: ' Nguyễn An ',
      email: ' an@example.com ',
      phone: '',
    }),
    {},
  );
  assert.deepEqual(validateAuthForm('register', { ...account, phone: '+84 912 345 678' }), {});
  assert.equal(hasValidPassword('ễễễễễễễ1'), true);
});

test('registration requires name, email, strong password, confirmation and consent', () => {
  assert.deepEqual(Object.keys(validateAuthForm('register', emptyAuthValues)), [
    'name',
    'email',
    'password',
    'confirmPassword',
    'accepted',
  ]);
  assert.equal(
    validateAuthForm('register', { ...account, name: '  ' }).name,
    'auth.error.nameRequired',
  );
  assert.equal(
    validateAuthForm('register', { ...account, email: 'an@' }).email,
    'auth.error.emailInvalid',
  );
  assert.equal(
    validateAuthForm('register', { ...account, phone: 'abcdefgh' }).phone,
    'auth.error.phoneInvalid',
  );
  for (const password of ['short1', 'abcdefgh', '12345678'])
    assert.equal(
      validateAuthForm('register', { ...account, password }).password,
      'auth.error.passwordInvalid',
    );
  assert.equal(
    validateAuthForm('register', { ...account, confirmPassword: 'different' }).confirmPassword,
    'auth.error.confirmMismatch',
  );
  assert.equal(
    validateAuthForm('register', { ...account, accepted: false }).accepted,
    'auth.error.consentRequired',
  );
});
