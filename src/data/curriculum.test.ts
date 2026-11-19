import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_QUESTIONS,
  ACTIVE_CHAPTERS,
  RESERVED_TOPIC_SLOTS,
  S1_CHAPTER_10,
  S1_CH10_QUESTIONS,
  S2_CHAPTER_3,
  S2_CH3_QUESTIONS,
  getChapterById,
  getChapterForSection,
  getQuestionsForChapter,
} from './curriculum';
import { checkStepAnswer, parseEquation, parseExpression } from '../engine/mathEngine';

test('S.1 Chapter 10 and S.2 Chapter 3 have separate sections, questions, and reserved topic slots', () => {
  assert.equal(ACTIVE_CHAPTERS.length, 2);
  assert.equal(S1_CHAPTER_10.title, 'Manipulation of Simple Polynomials');
  assert.equal(S1_CHAPTER_10.sections.length, 4);
  assert.equal(S1_CH10_QUESTIONS.length, 161);
  assert.equal(S2_CHAPTER_3.title, 'Algebraic Fractions and Formulas');
  assert.equal(S2_CHAPTER_3.sections.length, 3);
  assert.equal(S1_CH10_QUESTIONS.length + S2_CH3_QUESTIONS.length, ALL_QUESTIONS.length);
  assert.equal(getChapterById('s1-ch10').id, 's1-ch10');
  assert.equal(getChapterForSection('s1c10_sec1').id, 's1-ch10');
  assert.equal(getChapterForSection('sec1').id, 's2-ch3');
  assert.equal(getQuestionsForChapter('s1-ch10').length, 161);
  assert.ok(RESERVED_TOPIC_SLOTS.length >= 2);
});

test('every question and every similar variant parses and passes every step in sequence', () => {
  for (const q of ALL_QUESTIONS) {
    const variants = [q, ...q.sims];
    variants.forEach((variant, vIdx) => {
      const label = `${q.id} (${vIdx === 0 ? 'main' : `sim ${vIdx}`})`;
      if (q.mode === 'change') {
        assert.ok(variant.steps.length === 1, `${label}: change mode should have 1 step`);
        assert.ok(variant.steps[0].changeAnswer, `${label}: missing changeAnswer`);
        return;
      }

      if (q.mode === 'expression') {
        assert.doesNotThrow(() => parseExpression(variant.promptEq), `${label} prompt parse failed`);
      } else {
        assert.doesNotThrow(() => parseEquation(variant.promptEq), `${label} prompt parse failed`);
      }

      let prevLine = variant.promptEq;
      variant.steps.forEach((step, sIdx) => {
        if (q.mode === 'expression') {
          assert.doesNotThrow(() => parseExpression(step.line), `${label} step ${sIdx + 1} parse failed: ${step.line}`);
        } else {
          assert.doesNotThrow(() => parseEquation(step.line), `${label} step ${sIdx + 1} parse failed: ${step.line}`);
        }

        const res = checkStepAnswer({
          input: step.line,
          mode: q.mode,
          steps: variant.steps,
          fromIndex: sIdx,
          maxAhead: 2,
          previousLine: prevLine,
          targetVar: variant.targetVar || q.targetVar,
          givenValues: variant.givenValues || q.givenValues,
        });
        assert.equal(
          res.ok,
          true,
          `${label} step ${sIdx + 1} ("${step.line}" after "${prevLine}") failed check: ${res.message}`,
        );
        prevLine = step.line;
      });
    });
  }
});
