import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildLeaderboards,
  createDefaultState,
  getChapterProgress,
  getMistakeQuestionIds,
  getStorageKeyForUser,
  parseStoredAppState,
  type AttemptRecord,
} from './storage';

function makeAttempt(overrides: Partial<AttemptRecord>): AttemptRecord {
  return {
    id: 'att-1',
    timestamp: '2026-11-16T07:00:00.000Z',
    studentEmail: '2a.1.chan@school.edu.hk',
    studentName: 'Chan Tai Man',
    studentCls: '2A',
    studentClassNo: 1,
    sectionId: 'sec1',
    questionId: 's1_q1',
    questionLabel: 'Q1',
    type: 'Main',
    promptEq: '3/(21x)',
    points: 10,
    maxPoints: 10,
    wrongMoves: 0,
    wrongLines: 0,
    hints: 0,
    skipped: 0,
    seconds: 12,
    wrongInputs: [],
    ...overrides,
  };
}

test('getMistakeQuestionIds returns empty array when no mistakes exist', () => {
  const results = [
    makeAttempt({ id: '1', questionId: 's1_q1', wrongMoves: 0, wrongLines: 0 }),
    makeAttempt({ id: '2', questionId: 's2_q85', sectionId: 'sec2', wrongMoves: 0, wrongLines: 0 }),
  ];
  assert.deepEqual(getMistakeQuestionIds(results, ['s1_q1', 's2_q85']), []);
});

test('getMistakeQuestionIds collects unique questions with wrongMoves or wrongLines in curriculum order and filters by chapter', () => {
  const results = [
    makeAttempt({ id: '1', questionId: 's3_q105', sectionId: 'sec3', wrongMoves: 0, wrongLines: 2 }),
    makeAttempt({ id: '2', questionId: 's1_q2', wrongMoves: 0, wrongLines: 0 }),
    makeAttempt({ id: '3', questionId: 's1_q1', wrongMoves: 1, wrongLines: 0 }),
    makeAttempt({ id: '4', questionId: 's1c10-s1-q1a', sectionId: 's1c10_sec1', wrongMoves: 1, wrongLines: 0 }),
  ];
  assert.deepEqual(getMistakeQuestionIds(results, ['s1_q1', 's1_q2', 's3_q105'], 's2-ch3'), ['s1_q1', 's3_q105']);
  assert.deepEqual(getMistakeQuestionIds(results, ['s1c10-s1-q1a'], 's1-ch10'), ['s1c10-s1-q1a']);
});

test('getChapterProgress and buildLeaderboards separate S.1 Ch.10 and S.2 Ch.3 cleanly', () => {
  const st = createDefaultState();
  st.profile = { name: 'Lee Siu Ming', cls: '1A', classNo: 5, email: 'lee@skhbbss.edu.hk' };
  st.sections.s1c10_sec1.completedIds = ['s1c10-s1-q1a', 's1c10-s1-q1b'];
  st.sections.sec1.completedIds = ['s1_q1'];
  st.scoreByChapter = { 's1-ch10': 250, 's2-ch3': 90 };
  st.score = 340;

  const s1Prog = getChapterProgress(st, 's1-ch10');
  const s2Prog = getChapterProgress(st, 's2-ch3');
  assert.equal(s1Prog.doneCount, 2);
  assert.equal(s1Prog.score, 250);
  assert.equal(s2Prog.doneCount, 1);
  assert.equal(s2Prog.score, 90);

  const s1Board = buildLeaderboards(st, '1A', undefined, 's1-ch10');
  const s2Board = buildLeaderboards(st, '2A', undefined, 's2-ch3');
  assert.ok(s1Board.formTop.every((r) => r.cls.startsWith('1')));
  assert.ok(s2Board.formTop.filter((r) => !r.isMe).every((r) => r.cls.startsWith('2')));
  assert.ok(s1Board.classTop.some((r) => r.isMe && r.score === 250));
  assert.ok(s2Board.formTop.some((r) => r.isMe && r.score === 90));
});

test('getStorageKeyForUser isolates signed-in users from guests and from each other', () => {
  assert.equal(getStorageKeyForUser(null), 'balance_quest_guest_v1');
  assert.equal(getStorageKeyForUser(''), 'balance_quest_guest_v1');
  assert.equal(getStorageKeyForUser('uid_alice'), 'balance_quest_user_uid_alice');
  assert.equal(getStorageKeyForUser('uid_bob'), 'balance_quest_user_uid_bob');
  assert.notEqual(getStorageKeyForUser('uid_alice'), getStorageKeyForUser('uid_bob'));
  assert.equal(parseStoredAppState(null).profile, null);
});

