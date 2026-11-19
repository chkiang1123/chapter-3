import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const rulesText = fs.readFileSync('firestore.rules', 'utf8');
const blueprint = JSON.parse(fs.readFileSync('firebase-blueprint.json', 'utf8'));

test('firestore.rules includes default-deny safety net and verified-email gate', () => {
  assert.match(rulesText, /rules_version\s*=\s*'2';/);
  assert.match(rulesText, /match \/\{document=\*\*\} \{\s*allow read, write: if false;/);
  assert.match(rulesText, /request\.auth\.token\.email_verified == true/);
  assert.match(rulesText, /chkiang@skhbbss\.edu\.hk/);
});

test('every blueprint collection has a matching rules block and validation helper', () => {
  const paths = Object.keys(blueprint.firestore);
  assert.ok(paths.includes('/students/{studentUid}'));
  assert.ok(paths.includes('/students/{studentUid}/attempts/{attemptId}'));
  assert.ok(paths.includes('/leaderboard/{studentUid}'));
  assert.ok(paths.includes('/teacherAllowlist/{teacherEmail}'));

  assert.match(rulesText, /function isValidStudentSummary/);
  assert.match(rulesText, /function isValidStudentAttempt/);
  assert.match(rulesText, /function isValidLeaderboardEntry/);
  assert.match(rulesText, /function isValidTeacherAllowlist/);
});

test('rules enforce PII isolation, temporal integrity, and strict key guards', () => {
  // No blanket isSignedIn list/read
  assert.doesNotMatch(rulesText, /allow\s+(read|list)\s*:\s*if\s+isSignedIn\(\)\s*;/);
  // Temporal integrity checks
  assert.match(rulesText, /incoming\(\)\.createdAt == request\.time/);
  assert.match(rulesText, /incoming\(\)\.updatedAt == request\.time/);
  // Leaderboard does not allow email field
  const lbEntity = blueprint.entities.LeaderboardEntry;
  assert.equal('email' in lbEntity.properties, false);
  // Primary teacher cannot be deleted
  assert.match(rulesText, /teacherEmail != 'chkiang@skhbbss\.edu\.hk'/);
  // Both S.1 and S.2 classes and S.1 Ch.10 sections are supported
  assert.match(rulesText, /'1A', '1B', '1C', '1D', '1E', '2A', '2B', '2C', '2D', '2E'/);
  assert.match(rulesText, /'s1c10_sec1', 's1c10_sec2', 's1c10_sec3', 's1c10_sec4'/);
});

