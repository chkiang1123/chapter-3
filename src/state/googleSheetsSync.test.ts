import assert from 'node:assert/strict';
import test from 'node:test';
import type { CloudStudentSummary } from './firebaseSync';
import {
  SHEET_TABS,
  buildGoogleSheetTabsData,
  parseSpreadsheetId,
} from './googleSheetsSync';
import type { AttemptRecord } from './storage';

test('parseSpreadsheetId extracts ID from Google Sheets URLs and raw IDs', () => {
  assert.equal(
    parseSpreadsheetId('https://docs.google.com/spreadsheets/d/1AbCDefGhIjKlMnOpQrStUvWxYz123456/edit#gid=0'),
    '1AbCDefGhIjKlMnOpQrStUvWxYz123456',
  );
  assert.equal(parseSpreadsheetId('1AbCDefGhIjKlMnOpQrStUvWxYz123456'), '1AbCDefGhIjKlMnOpQrStUvWxYz123456');
  assert.equal(parseSpreadsheetId('not-a-valid'), '');
});

test('buildGoogleSheetTabsData produces 4 structured tabs separating S.1 Ch.10 and S.2 Ch.3', () => {
  const students: CloudStudentSummary[] = [
    {
      uid: 'u1',
      name: 'Chan Siu Ming',
      cls: '1A',
      classNo: 2,
      email: '1a.2@skhbbss.edu.hk',
      score: 180,
      scoreS1C10: 150,
      scoreS2C3: 30,
      doneCount: 9,
      doneCountS1C10: 7,
      doneCountS2C3: 2,
      extraDone: 1,
      wrongAttempts: 2,
      hintsUsed: 1,
      completedIdsSec1: ['s1_q1', 's1_q2'],
      completedIdsSec2: [],
      completedIdsSec3: [],
      completedIdsS1C10Sec1: ['s1c10-s1-q1a', 's1c10-s1-q1b', 's1c10-s1-q2a'],
      completedIdsS1C10Sec2: ['s1c10-s2-q41a', 's1c10-s2-q41b'],
      completedIdsS1C10Sec3: ['s1c10-s3-q67a'],
      completedIdsS1C10Sec4: ['s1c10-s4-q102a'],
      updatedAtIso: '2026-11-18T12:00:00.000Z',
    },
  ];
  const attempts: AttemptRecord[] = [
    {
      id: 'att1',
      timestamp: '2026-11-18T12:00:00.000Z',
      studentEmail: '1a.2@skhbbss.edu.hk',
      studentName: 'Chan Siu Ming',
      studentCls: '1A',
      studentClassNo: 2,
      chapterId: 's1-ch10',
      sectionId: 's1c10_sec1',
      questionId: 's1c10-s1-q1a',
      questionLabel: 'Q1(a)',
      type: 'Main',
      promptEq: 'a^2 * a^6',
      points: 10,
      maxPoints: 10,
      wrongMoves: 0,
      wrongLines: 0,
      hints: 0,
      skipped: 0,
      seconds: 9,
      wrongInputs: [],
    },
  ];

  const tabs = buildGoogleSheetTabsData(students, attempts);
  assert.equal(tabs.length, 4);
  assert.deepEqual(
    tabs.map((t) => t.tabName),
    [SHEET_TABS.SUMMARIES, SHEET_TABS.S1_PROGRESS, SHEET_TABS.S2_PROGRESS, SHEET_TABS.ATTEMPTS],
  );
  assert.equal(tabs[0].rows.length, 2); // header + 1 student
  assert.equal(tabs[1].rows[1][4], 3); // Sec 1 Index Laws count
  assert.equal(tabs[2].rows[1][4], 2); // S.2 Sec 1 Fractions count
  assert.equal(tabs[3].rows[1][1], 'S.1 Ch.10');
});
