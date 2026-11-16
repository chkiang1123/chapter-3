import assert from 'node:assert/strict';
import test from 'node:test';
import { getMistakeQuestionIds, type AttemptRecord } from './storage';

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

test('getMistakeQuestionIds collects unique questions with wrongMoves or wrongLines in curriculum order', () => {
  const results = [
    makeAttempt({ id: '1', questionId: 's3_q105', sectionId: 'sec3', wrongMoves: 0, wrongLines: 2 }),
    makeAttempt({ id: '2', questionId: 's1_q2', wrongMoves: 0, wrongLines: 0 }),
    makeAttempt({ id: '3', questionId: 's1_q1', wrongMoves: 1, wrongLines: 0 }),
    makeAttempt({ id: '4', questionId: 's1_q1', wrongMoves: 0, wrongLines: 1 }),
  ];
  const orderedIds = ['s1_q1', 's1_q2', 's2_q85', 's3_q105'];
  assert.deepEqual(getMistakeQuestionIds(results, orderedIds), ['s1_q1', 's3_q105']);
});
