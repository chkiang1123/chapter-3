import assert from 'node:assert/strict';
import test from 'node:test';
import {
  EMAIL_MAX_LENGTH,
  MAX_SEC1_DONE,
  MAX_WRONG_INPUTS,
  NAME_MAX_LENGTH,
  clampClass,
  clampClassNo,
  clampStringArray,
  clampText,
  isPrimaryTeacherEmail,
  isValidEmailAddress,
  normalizeEmail,
  sanitizeAttemptDocId,
} from './firebaseSchemaConstants';

test('primary teacher email matching is case-insensitive and trimmed', () => {
  assert.equal(isPrimaryTeacherEmail('chkiang@skhbbss.edu.hk'), true);
  assert.equal(isPrimaryTeacherEmail('  CHKIANG@SKHBBSS.EDU.HK '), true);
  assert.equal(isPrimaryTeacherEmail('student@skhbbss.edu.hk'), false);
  assert.equal(isPrimaryTeacherEmail(null), false);
});

test('email validator rejects malformed or oversized addresses', () => {
  assert.equal(isValidEmailAddress('teacher@skhbbss.edu.hk'), true);
  assert.equal(isValidEmailAddress('not-an-email'), false);
  assert.equal(isValidEmailAddress('a@b'), false);
  const longEmail = `${'a'.repeat(EMAIL_MAX_LENGTH)}@skhbbss.edu.hk`;
  assert.equal(isValidEmailAddress(longEmail), false);
  assert.equal(normalizeEmail('  Foo.Bar@SKHBBSS.EDU.HK '), 'foo.bar@skhbbss.edu.hk');
});

test('payload sanitizers enforce blueprint bounds and valid IDs', () => {
  assert.equal(clampText('   ', NAME_MAX_LENGTH, 'Fallback'), 'Fallback');
  assert.equal(clampText('A'.repeat(200), NAME_MAX_LENGTH).length, NAME_MAX_LENGTH);
  assert.equal(clampClass('2C'), '2C');
  assert.equal(clampClass('9Z'), '2A');
  assert.equal(clampClassNo(0), 1);
  assert.equal(clampClassNo(99), 45);
  assert.equal(clampStringArray(Array(200).fill('x'), MAX_SEC1_DONE, 40).length, MAX_SEC1_DONE);
  assert.equal(clampStringArray(Array(60).fill('y'), MAX_WRONG_INPUTS, 120).length, MAX_WRONG_INPUTS);
  assert.match(sanitizeAttemptDocId('att/123:weird!id'), /^[a-zA-Z0-9_\-]+$/);
});
