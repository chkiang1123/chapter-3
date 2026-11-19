import test from 'node:test';
import assert from 'node:assert/strict';
import {
  areEquationsEquivalentWithTarget,
  areExpressionsEquivalent,
  checkStepAnswer,
  parseEquation,
  parseExpression,
  renderMathToHtml,
} from './mathEngine';
import { makeStep } from '../data/stepHelpers';

test('parses case-sensitive variables and exponents cleanly', () => {
  const eq = parseEquation('(Py + C)/Q = 2y');
  assert.ok(eq.left);
  assert.ok(eq.right);
  const expr = parseExpression('15rs^5/(10r^3s^4)');
  assert.ok(expr);
});

test('checks multivariable algebraic fraction equivalence accurately', () => {
  const a = parseExpression('(4a^6)/(8a^3)');
  const b = parseExpression('a^3/2');
  const c = parseExpression('0.5a^3');
  assert.equal(areExpressionsEquivalent(a, b), true);
  assert.equal(areExpressionsEquivalent(a, c), true);

  const wrong = parseExpression('a^2/2');
  assert.equal(areExpressionsEquivalent(a, wrong), false);
});

test('accepts equivalent sign rearrangements in Section 1 & Section 3', () => {
  // (-1 - 5x)/(1 - 2x) === (5x + 1)/(2x - 1)
  assert.equal(
    areExpressionsEquivalent(
      parseExpression('(-1-5x)/(1-2x)'),
      parseExpression('(5x+1)/(2x-1)'),
    ),
    true,
  );

  // Subject change equivalence: x = (6 - 7y)/5 vs x = (-7y + 6)/5 vs (6 - 7y)/5 = x
  const targetRhs = parseExpression('(6 - 7y)/5');
  assert.equal(areEquationsEquivalentWithTarget(parseEquation('x = (-7y + 6)/5'), 'x', targetRhs), true);
  assert.equal(areEquationsEquivalentWithTarget(parseEquation('(6 - 7y)/5 = x'), 'x', targetRhs), true);
  // Tautology x = x or 0 = 0 must be rejected
  assert.equal(areEquationsEquivalentWithTarget(parseEquation('x = x'), 'x', targetRhs), false);
});

test('checkStepAnswer rejects unsimplified expressions and copied lines in Section 1', () => {
  const steps = [makeStep('simplify', 'Divide by 3', '1/(7x)')];
  const sameLine = checkStepAnswer({
    input: '3/(21x)',
    mode: 'expression',
    steps,
    fromIndex: 0,
    previousLine: '3/(21x)',
  });
  assert.equal(sameLine.ok, false);

  const unreduced = checkStepAnswer({
    input: '2/(14x)',
    mode: 'expression',
    steps,
    fromIndex: 0,
    previousLine: '3/(21x)',
  });
  assert.equal(unreduced.ok, false);

  const valid = checkStepAnswer({
    input: '1/(7x)',
    mode: 'expression',
    steps,
    fromIndex: 0,
    previousLine: '3/(21x)',
  });
  assert.equal(valid.ok, true);
  assert.equal(valid.index, 0);
});

test('checkStepAnswer requires subject isolation on final step in Section 3', () => {
  const steps = [
    makeStep('sub', 'Subtract x from both sides', '2y = 7 - x', { kind: 'balance' }),
    makeStep('div', 'Divide both sides by 2', 'y = (7 - x)/2', { kind: 'balance' }),
  ];

  // Trying to submit 2y = 7 - x when step 1 is already done should fail final isolation
  const notIsolated = checkStepAnswer({
    input: '2y = 7 - x',
    mode: 'subject',
    steps,
    fromIndex: 1,
    previousLine: '2y = 7 - x',
    targetVar: 'y',
  });
  assert.equal(notIsolated.ok, false);

  const isolated = checkStepAnswer({
    input: 'y = (-x + 7)/2',
    mode: 'subject',
    steps,
    fromIndex: 1,
    previousLine: '2y = 7 - x',
    targetVar: 'y',
  });
  assert.equal(isolated.ok, true);
});

test('renders stacked fractions and superscript exponents cleanly', () => {
  const html = renderMathToHtml('(4a^6)/(8a^3)');
  assert.ok(html.includes('class="frac"'));
  assert.ok(html.includes('<sup class="math-sup">6</sup>'));
});

test('enforces complete expansion, index combination, and ascending/descending polynomial order when configured', () => {
  const indexSteps = [makeStep('simplify', 'Add indices', 'a^8', { requireExpanded: true })];
  const uncombinedMul = checkStepAnswer({
    input: 'a^2*a^6',
    mode: 'expression',
    steps: indexSteps,
    fromIndex: 0,
    previousLine: 'a^2*a^6',
  });
  assert.equal(uncombinedMul.ok, false);

  const combinedMul = checkStepAnswer({
    input: 'a^8',
    mode: 'expression',
    steps: indexSteps,
    fromIndex: 0,
    previousLine: 'a^2*a^6',
  });
  assert.equal(combinedMul.ok, true);

  const expandAscSteps = [
    makeStep('expand', 'Expand brackets', 'e^2 + 6e + 2e + 12', { requireExpanded: true }),
    makeStep('combine', 'Collect like terms', '12 + 8e + e^2', {
      requireExpanded: true,
      orderRule: { direction: 'asc', variable: 'e' },
    }),
  ];

  // Unexpanded bracket must fail step 1 even if mathematically equivalent
  const stillBracketed = checkStepAnswer({
    input: '(e+2)(e+6)',
    mode: 'expression',
    steps: expandAscSteps,
    fromIndex: 0,
    previousLine: '(e+2)(e+6)',
  });
  assert.equal(stillBracketed.ok, false);

  // Wrong descending order on step 2 must fail ascending rule
  const wrongOrder = checkStepAnswer({
    input: 'e^2 + 8e + 12',
    mode: 'expression',
    steps: expandAscSteps,
    fromIndex: 1,
    previousLine: 'e^2 + 6e + 2e + 12',
  });
  assert.equal(wrongOrder.ok, false);

  const correctAsc = checkStepAnswer({
    input: '12 + 8e + e^2',
    mode: 'expression',
    steps: expandAscSteps,
    fromIndex: 1,
    previousLine: 'e^2 + 6e + 2e + 12',
  });
  assert.equal(correctAsc.ok, true);
});

