import { balanceMove, makeStep } from './stepHelpers';
import type { QuestionItem, QuestionLevel, QuestionVariant } from './types';

function s2(
  num: string,
  level: QuestionLevel,
  topicTag: string,
  promptEq: string,
  givenValues: Record<string, string>,
  targetVar: string,
  steps: QuestionVariant['steps'],
  sims: QuestionVariant[],
  opts?: { sourceTag?: string; promptText?: string },
): QuestionItem {
  const givenStr = Object.entries(givenValues)
    .map(([k, v]) => `${k} = ${v}`)
    .join(', ');
  return {
    id: `s2-q${num}`,
    numberLabel: `Q${num}`,
    sectionId: 'sec2',
    level,
    mode: 'substitution',
    topicTag,
    sourceTag: opts?.sourceTag,
    promptEq,
    promptText: opts?.promptText || `If ${givenStr}, find the value of ${targetVar}.`,
    givenValues,
    targetVar,
    steps,
    sims,
  };
}

export const SECTION_2_QUESTIONS: QuestionItem[] = [
  // ── Level 1: Q85–93 ──
  s2(
    '85',
    'Level 1',
    'Direct substitution',
    'm = 2n^2 + 3',
    { n: '5' },
    'm',
    [
      makeStep('substitute', 'Substitute n = 5 into the formula', 'm = 2(5)^2 + 3'),
      makeStep('combine', 'Evaluate 2(25) + 3', 'm = 53'),
    ],
    [
      {
        promptEq: 'm = 3n^2 + 4',
        givenValues: { n: '4' },
        targetVar: 'm',
        promptText: 'If n = 4, find the value of m.',
        steps: [
          makeStep('substitute', 'Substitute n = 4 into the formula', 'm = 3(4)^2 + 4'),
          makeStep('combine', 'Evaluate 3(16) + 4', 'm = 52'),
        ],
      },
      {
        promptEq: 'y = 2x^2 - 5',
        givenValues: { x: '3' },
        targetVar: 'y',
        promptText: 'If x = 3, find the value of y.',
        steps: [
          makeStep('substitute', 'Substitute x = 3 into the formula', 'y = 2(3)^2 - 5'),
          makeStep('combine', 'Evaluate 2(9) − 5', 'y = 13'),
        ],
      },
    ],
  ),
  s2(
    '86',
    'Level 1',
    'Direct substitution with negatives',
    's = 3r + 4t',
    { r: '2', t: '-1' },
    's',
    [
      makeStep('substitute', 'Substitute r = 2 and t = −1', 's = 3(2) + 4(-1)'),
      makeStep('combine', 'Evaluate 6 − 4', 's = 2'),
    ],
    [
      {
        promptEq: 's = 5r + 2t',
        givenValues: { r: '3', t: '-4' },
        targetVar: 's',
        promptText: 'If r = 3 and t = −4, find the value of s.',
        steps: [
          makeStep('substitute', 'Substitute r = 3 and t = −4', 's = 5(3) + 2(-4)'),
          makeStep('combine', 'Evaluate 15 − 8', 's = 7'),
        ],
      },
      {
        promptEq: 'p = 4a + 3b',
        givenValues: { a: '-2', b: '5' },
        targetVar: 'p',
        promptText: 'If a = −2 and b = 5, find the value of p.',
        steps: [
          makeStep('substitute', 'Substitute a = −2 and b = 5', 'p = 4(-2) + 3(5)'),
          makeStep('combine', 'Evaluate −8 + 15', 'p = 7'),
        ],
      },
    ],
  ),
  s2(
    '87',
    'Level 1',
    'Three-variable substitution',
    'T = 5a - bc',
    { a: '-3', b: '2', c: '5' },
    'T',
    [
      makeStep('substitute', 'Substitute a = −3, b = 2 and c = 5', 'T = 5(-3) - (2)(5)'),
      makeStep('combine', 'Evaluate −15 − 10', 'T = -25'),
    ],
    [
      {
        promptEq: 'T = 4a - bc',
        givenValues: { a: '-2', b: '3', c: '4' },
        targetVar: 'T',
        promptText: 'If a = −2, b = 3 and c = 4, find the value of T.',
        steps: [
          makeStep('substitute', 'Substitute a = −2, b = 3 and c = 4', 'T = 4(-2) - (3)(4)'),
          makeStep('combine', 'Evaluate −8 − 12', 'T = -20'),
        ],
      },
      {
        promptEq: 'W = 3x - yz',
        givenValues: { x: '4', y: '-2', z: '5' },
        targetVar: 'W',
        promptText: 'If x = 4, y = −2 and z = 5, find the value of W.',
        steps: [
          makeStep('substitute', 'Substitute x = 4, y = −2 and z = 5', 'W = 3(4) - (-2)(5)'),
          makeStep('combine', 'Evaluate 12 + 10', 'W = 22'),
        ],
      },
    ],
  ),
  s2(
    '88',
    'Level 1',
    'Finding an unknown after substitution',
    'y = 4x + 3',
    { y: '15' },
    'x',
    [
      makeStep('substitute', 'Substitute y = 15 into the formula', '15 = 4x + 3'),
      balanceMove('sub', '3', '12 = 4x'),
      balanceMove('div', '4', 'x = 3'),
    ],
    [
      {
        promptEq: 'y = 5x + 2',
        givenValues: { y: '22' },
        targetVar: 'x',
        promptText: 'If y = 22, find the value of x.',
        steps: [
          makeStep('substitute', 'Substitute y = 22', '22 = 5x + 2'),
          balanceMove('sub', '2', '20 = 5x'),
          balanceMove('div', '5', 'x = 4'),
        ],
      },
      {
        promptEq: 'm = 3k - 4',
        givenValues: { m: '11' },
        targetVar: 'k',
        promptText: 'If m = 11, find the value of k.',
        steps: [
          makeStep('substitute', 'Substitute m = 11', '11 = 3k - 4'),
          balanceMove('add', '4', '15 = 3k'),
          balanceMove('div', '3', 'k = 5'),
        ],
      },
    ],
  ),
  s2(
    '89',
    'Level 1',
    'Finding an unknown with negative value',
    'x - 3y = 10',
    { x: '-2' },
    'y',
    [
      makeStep('substitute', 'Substitute x = −2 into the formula', '-2 - 3y = 10'),
      balanceMove('add', '2', '-3y = 12'),
      balanceMove('div', '-3', 'y = -4'),
    ],
    [
      {
        promptEq: 'x - 4y = 15',
        givenValues: { x: '-5' },
        targetVar: 'y',
        promptText: 'If x = −5, find the value of y.',
        steps: [
          makeStep('substitute', 'Substitute x = −5', '-5 - 4y = 15'),
          balanceMove('add', '5', '-4y = 20'),
          balanceMove('div', '-4', 'y = -5'),
        ],
      },
      {
        promptEq: '2a - 5b = 18',
        givenValues: { a: '-1' },
        targetVar: 'b',
        promptText: 'If a = −1, find the value of b.',
        steps: [
          makeStep('substitute', 'Substitute a = −1', '2(-1) - 5b = 18'),
          balanceMove('add', '2', '-5b = 20'),
          balanceMove('div', '-5', 'b = -4'),
        ],
      },
    ],
  ),
  s2(
    '90',
    'Level 1',
    'Formula with fraction',
    'm = (a - b)/2',
    { m: '9', b: '3' },
    'a',
    [
      makeStep('substitute', 'Substitute m = 9 and b = 3', '9 = (a - 3)/2'),
      balanceMove('mul', '2', '18 = a - 3'),
      balanceMove('add', '3', 'a = 21'),
    ],
    [
      {
        promptEq: 'm = (a - b)/3',
        givenValues: { m: '5', b: '4' },
        targetVar: 'a',
        promptText: 'If m = 5 and b = 4, find the value of a.',
        steps: [
          makeStep('substitute', 'Substitute m = 5 and b = 4', '5 = (a - 4)/3'),
          balanceMove('mul', '3', '15 = a - 4'),
          balanceMove('add', '4', 'a = 19'),
        ],
      },
      {
        promptEq: 'k = (p + q)/4',
        givenValues: { k: '6', q: '5' },
        targetVar: 'p',
        promptText: 'If k = 6 and q = 5, find the value of p.',
        steps: [
          makeStep('substitute', 'Substitute k = 6 and q = 5', '6 = (p + 5)/4'),
          balanceMove('mul', '4', '24 = p + 5'),
          balanceMove('sub', '5', 'p = 19'),
        ],
      },
    ],
  ),
  s2(
    '91',
    'Level 1',
    'Formula with square term',
    'E = 3mv^2',
    { E: '72', v: '2' },
    'm',
    [
      makeStep('substitute', 'Substitute E = 72 and v = 2', '72 = 3m(2)^2'),
      makeStep('combine', 'Simplify 3m(4) = 12m', '72 = 12m'),
      balanceMove('div', '12', 'm = 6'),
    ],
    [
      {
        promptEq: 'E = 2mv^2',
        givenValues: { E: '90', v: '3' },
        targetVar: 'm',
        promptText: 'If E = 90 and v = 3, find the value of m.',
        steps: [
          makeStep('substitute', 'Substitute E = 90 and v = 3', '90 = 2m(3)^2'),
          makeStep('combine', 'Simplify 2m(9) = 18m', '90 = 18m'),
          balanceMove('div', '18', 'm = 5'),
        ],
      },
      {
        promptEq: 'E = 4mv^2',
        givenValues: { E: '112', v: '2' },
        targetVar: 'm',
        promptText: 'If E = 112 and v = 2, find the value of m.',
        steps: [
          makeStep('substitute', 'Substitute E = 112 and v = 2', '112 = 4m(2)^2'),
          makeStep('combine', 'Simplify 4m(4) = 16m', '112 = 16m'),
          balanceMove('div', '16', 'm = 7'),
        ],
      },
    ],
    { sourceTag: '~TSA 2019' },
  ),
  s2(
    '92',
    'Level 1',
    'Substitution with fraction input',
    'S = a/(1 - r)',
    { S: '24', r: '1/3' },
    'a',
    [
      makeStep('substitute', 'Substitute S = 24 and r = 1/3', '24 = a/(1 - 1/3)'),
      makeStep('combine', 'Simplify 1 − 1/3 = 2/3', '24 = a/(2/3)'),
      balanceMove('mul', '2/3', 'a = 16'),
    ],
    [
      {
        promptEq: 'S = a/(1 - r)',
        givenValues: { S: '20', r: '1/4' },
        targetVar: 'a',
        promptText: 'If S = 20 and r = 1/4, find the value of a.',
        steps: [
          makeStep('substitute', 'Substitute S = 20 and r = 1/4', '20 = a/(1 - 1/4)'),
          makeStep('combine', 'Simplify 1 − 1/4 = 3/4', '20 = a/(3/4)'),
          balanceMove('mul', '3/4', 'a = 15'),
        ],
      },
      {
        promptEq: 'S = a/(1 - r)',
        givenValues: { S: '18', r: '1/2' },
        targetVar: 'a',
        promptText: 'If S = 18 and r = 1/2, find the value of a.',
        steps: [
          makeStep('substitute', 'Substitute S = 18 and r = 1/2', '18 = a/(1 - 1/2)'),
          makeStep('combine', 'Simplify 1 − 1/2 = 1/2', '18 = a/(1/2)'),
          balanceMove('mul', '1/2', 'a = 9'),
        ],
      },
    ],
  ),
  s2(
    '93',
    'Level 1',
    'Formula with bracket',
    'x = y(2y - z)',
    { x: '32', y: '4' },
    'z',
    [
      makeStep('substitute', 'Substitute x = 32 and y = 4', '32 = 4(2(4) - z)'),
      makeStep('combine', 'Simplify inside the bracket', '32 = 4(8 - z)'),
      balanceMove('div', '4', '8 = 8 - z'),
      balanceMove('add', 'z − 8', 'z = 0', 'Subtract 8 from both sides to get −z = 0, so z = 0.'),
    ],
    [
      {
        promptEq: 'x = y(2y - z)',
        givenValues: { x: '27', y: '3' },
        targetVar: 'z',
        promptText: 'If x = 27 and y = 3, find the value of z.',
        steps: [
          makeStep('substitute', 'Substitute x = 27 and y = 3', '27 = 3(2(3) - z)'),
          balanceMove('div', '3', '9 = 6 - z'),
          balanceMove('add', 'z − 9', 'z = -3'),
        ],
      },
      {
        promptEq: 'x = y(3y - z)',
        givenValues: { x: '20', y: '2' },
        targetVar: 'z',
        promptText: 'If x = 20 and y = 2, find the value of z.',
        steps: [
          makeStep('substitute', 'Substitute x = 20 and y = 2', '20 = 2(3(2) - z)'),
          balanceMove('div', '2', '10 = 6 - z'),
          balanceMove('add', 'z − 10', 'z = -4'),
        ],
      },
    ],
  ),

  // ── Level 2: Q94–100 ──
  s2(
    '94',
    'Level 2',
    'Trapezium area formula',
    'A = ((x + y)h)/2',
    { A: '48', x: '5', h: '8' },
    'y',
    [
      makeStep('substitute', 'Substitute A = 48, x = 5 and h = 8', '48 = ((5 + y)(8))/2'),
      makeStep('combine', 'Simplify 8/2 = 4', '48 = 4(5 + y)'),
      balanceMove('div', '4', '12 = 5 + y'),
      balanceMove('sub', '5', 'y = 7'),
    ],
    [
      {
        promptEq: 'A = ((x + y)h)/2',
        givenValues: { A: '36', x: '4', h: '6' },
        targetVar: 'y',
        promptText: 'If A = 36, x = 4 and h = 6, find the value of y.',
        steps: [
          makeStep('substitute', 'Substitute A = 36, x = 4 and h = 6', '36 = ((4 + y)(6))/2'),
          makeStep('combine', 'Simplify 6/2 = 3', '36 = 3(4 + y)'),
          balanceMove('div', '3', '12 = 4 + y'),
          balanceMove('sub', '4', 'y = 8'),
        ],
      },
      {
        promptEq: 'A = ((x + y)h)/2',
        givenValues: { A: '50', x: '6', h: '10' },
        targetVar: 'y',
        promptText: 'If A = 50, x = 6 and h = 10, find the value of y.',
        steps: [
          makeStep('substitute', 'Substitute A = 50, x = 6 and h = 10', '50 = ((6 + y)(10))/2'),
          makeStep('combine', 'Simplify 10/2 = 5', '50 = 5(6 + y)'),
          balanceMove('div', '5', '10 = 6 + y'),
          balanceMove('sub', '6', 'y = 4'),
        ],
      },
    ],
  ),
  s2(
    '95',
    'Level 2',
    'Discriminant formula',
    'D = b^2 - 4ac',
    { D: '60', b: '6', a: '-2' },
    'c',
    [
      makeStep('substitute', 'Substitute D = 60, b = 6 and a = −2', '60 = (6)^2 - 4(-2)c'),
      makeStep('combine', 'Evaluate 6² = 36 and −4(−2)c = 8c', '60 = 36 + 8c'),
      balanceMove('sub', '36', '24 = 8c'),
      balanceMove('div', '8', 'c = 3'),
    ],
    [
      {
        promptEq: 'D = b^2 - 4ac',
        givenValues: { D: '49', b: '5', a: '-3' },
        targetVar: 'c',
        promptText: 'If D = 49, b = 5 and a = −3, find the value of c.',
        steps: [
          makeStep('substitute', 'Substitute D = 49, b = 5 and a = −3', '49 = (5)^2 - 4(-3)c'),
          makeStep('combine', 'Simplify 25 + 12c', '49 = 25 + 12c'),
          balanceMove('sub', '25', '24 = 12c'),
          balanceMove('div', '12', 'c = 2'),
        ],
      },
      {
        promptEq: 'D = b^2 - 4ac',
        givenValues: { D: '28', b: '8', a: '3' },
        targetVar: 'c',
        promptText: 'If D = 28, b = 8 and a = 3, find the value of c.',
        steps: [
          makeStep('substitute', 'Substitute D = 28, b = 8 and a = 3', '28 = (8)^2 - 4(3)c'),
          makeStep('combine', 'Simplify 64 − 12c', '28 = 64 - 12c'),
          balanceMove('sub', '64', '-36 = -12c'),
          balanceMove('div', '-12', 'c = 3'),
        ],
      },
    ],
    { sourceTag: '~TSA 2021' },
  ),
  s2(
    '96',
    'Level 2',
    'Kinematics formula',
    's = ut + (1/2)at^2',
    { s: '-30', u: '5', t: '3' },
    'a',
    [
      makeStep('substitute', 'Substitute s = −30, u = 5 and t = 3', '-30 = (5)(3) + (1/2)a(3)^2'),
      makeStep('combine', 'Evaluate 15 + (9/2)a', '-30 = 15 + (9/2)a'),
      balanceMove('sub', '15', '-45 = (9/2)a'),
      balanceMove('mul', '2/9', 'a = -10'),
    ],
    [
      {
        promptEq: 's = ut + (1/2)at^2',
        givenValues: { s: '28', u: '4', t: '2' },
        targetVar: 'a',
        promptText: 'If s = 28, u = 4 and t = 2, find the value of a.',
        steps: [
          makeStep('substitute', 'Substitute s = 28, u = 4 and t = 2', '28 = (4)(2) + (1/2)a(2)^2'),
          makeStep('combine', 'Evaluate 8 + 2a', '28 = 8 + 2a'),
          balanceMove('sub', '8', '20 = 2a'),
          balanceMove('div', '2', 'a = 10'),
        ],
      },
      {
        promptEq: 's = ut + (1/2)at^2',
        givenValues: { s: '-12', u: '3', t: '4' },
        targetVar: 'a',
        promptText: 'If s = −12, u = 3 and t = 4, find the value of a.',
        steps: [
          makeStep('substitute', 'Substitute s = −12, u = 3 and t = 4', '-12 = (3)(4) + (1/2)a(4)^2'),
          makeStep('combine', 'Evaluate 12 + 8a', '-12 = 12 + 8a'),
          balanceMove('sub', '12', '-24 = 8a'),
          balanceMove('div', '8', 'a = -3'),
        ],
      },
    ],
  ),
  s2(
    '97',
    'Level 2',
    'Arithmetic series formula',
    'S = (n/2)[2a + (n - 1)d]',
    { S: '-155', a: '-2', n: '10' },
    'd',
    [
      makeStep('substitute', 'Substitute S = −155, a = −2 and n = 10', '-155 = (10/2)[2(-2) + (10 - 1)d]'),
      makeStep('combine', 'Simplify 10/2 = 5 and inside brackets', '-155 = 5(-4 + 9d)'),
      balanceMove('div', '5', '-31 = -4 + 9d'),
      balanceMove('add', '4', '-27 = 9d'),
      balanceMove('div', '9', 'd = -3'),
    ],
    [
      {
        promptEq: 'S = (n/2)[2a + (n - 1)d]',
        givenValues: { S: '110', a: '3', n: '10' },
        targetVar: 'd',
        promptText: 'If S = 110, a = 3 and n = 10, find the value of d.',
        steps: [
          makeStep('substitute', 'Substitute S = 110, a = 3 and n = 10', '110 = (10/2)[2(3) + (10 - 1)d]'),
          makeStep('combine', 'Simplify 5(6 + 9d)', '110 = 5(6 + 9d)'),
          balanceMove('div', '5', '22 = 6 + 9d'),
          balanceMove('sub', '6', '16 = 9d'),
          balanceMove('div', '9', 'd = 16/9'),
        ],
      },
      {
        promptEq: 'S = (n/2)[2a + (n - 1)d]',
        givenValues: { S: '96', a: '2', n: '8' },
        targetVar: 'd',
        promptText: 'If S = 96, a = 2 and n = 8, find the value of d.',
        steps: [
          makeStep('substitute', 'Substitute S = 96, a = 2 and n = 8', '96 = (8/2)[2(2) + (8 - 1)d]'),
          makeStep('combine', 'Simplify 4(4 + 7d)', '96 = 4(4 + 7d)'),
          balanceMove('div', '4', '24 = 4 + 7d'),
          balanceMove('sub', '4', '20 = 7d'),
          balanceMove('div', '7', 'd = 20/7'),
        ],
      },
    ],
  ),
  s2(
    '98',
    'Level 2',
    'Unknown in numerator and denominator',
    'T = (a(m + 1))/m',
    { T: '16', a: '12' },
    'm',
    [
      makeStep('substitute', 'Substitute T = 16 and a = 12', '16 = (12(m + 1))/m'),
      balanceMove('mul', 'm', '16m = 12(m + 1)'),
      makeStep('expand', 'Expand the right side', '16m = 12m + 12'),
      balanceMove('sub', '12m', '4m = 12'),
      balanceMove('div', '4', 'm = 3'),
    ],
    [
      {
        promptEq: 'T = (a(m + 1))/m',
        givenValues: { T: '15', a: '10' },
        targetVar: 'm',
        promptText: 'If T = 15 and a = 10, find the value of m.',
        steps: [
          makeStep('substitute', 'Substitute T = 15 and a = 10', '15 = (10(m + 1))/m'),
          balanceMove('mul', 'm', '15m = 10m + 10'),
          balanceMove('sub', '10m', '5m = 10'),
          balanceMove('div', '5', 'm = 2'),
        ],
      },
      {
        promptEq: 'T = (a(m + 1))/m',
        givenValues: { T: '18', a: '15' },
        targetVar: 'm',
        promptText: 'If T = 18 and a = 15, find the value of m.',
        steps: [
          makeStep('substitute', 'Substitute T = 18 and a = 15', '18 = (15(m + 1))/m'),
          balanceMove('mul', 'm', '18m = 15m + 15'),
          balanceMove('sub', '15m', '3m = 15'),
          balanceMove('div', '3', 'm = 5'),
        ],
      },
    ],
  ),
  s2(
    '99',
    'Level 2',
    'Surface area formula',
    'P = 2(ab + ac + bc)',
    { P: '-14', a: '-3', c: '4' },
    'b',
    [
      makeStep('substitute', 'Substitute P = −14, a = −3 and c = 4', '-14 = 2((-3)b + (-3)(4) + b(4))'),
      balanceMove('div', '2', '-7 = -3b - 12 + 4b'),
      makeStep('combine', 'Combine like terms on the right side', '-7 = b - 12'),
      balanceMove('add', '12', 'b = 5'),
    ],
    [
      {
        promptEq: 'P = 2(ab + ac + bc)',
        givenValues: { P: '26', a: '2', c: '3' },
        targetVar: 'b',
        promptText: 'If P = 26, a = 2 and c = 3, find the value of b.',
        steps: [
          makeStep('substitute', 'Substitute P = 26, a = 2 and c = 3', '26 = 2(2b + 6 + 3b)'),
          balanceMove('div', '2', '13 = 5b + 6'),
          balanceMove('sub', '6', '7 = 5b'),
          balanceMove('div', '5', 'b = 7/5'),
        ],
      },
      {
        promptEq: 'P = 2(ab + ac + bc)',
        givenValues: { P: '24', a: '1', c: '5' },
        targetVar: 'b',
        promptText: 'If P = 24, a = 1 and c = 5, find the value of b.',
        steps: [
          makeStep('substitute', 'Substitute P = 24, a = 1 and c = 5', '24 = 2(b + 5 + 5b)'),
          balanceMove('div', '2', '12 = 6b + 5'),
          balanceMove('sub', '5', '7 = 6b'),
          balanceMove('div', '6', 'b = 7/6'),
        ],
      },
    ],
  ),
  s2(
    '100',
    'Level 2',
    'Unknown in numerator and denominator',
    'x = (a + br)/(1 + r)',
    { x: '9', a: '-3', b: '5' },
    'r',
    [
      makeStep('substitute', 'Substitute x = 9, a = −3 and b = 5', '9 = (-3 + 5r)/(1 + r)'),
      balanceMove('mul', '(1 + r)', '9(1 + r) = -3 + 5r'),
      makeStep('expand', 'Expand the left side', '9 + 9r = -3 + 5r'),
      balanceMove('sub', '5r', '9 + 4r = -3'),
      balanceMove('sub', '9', '4r = -12'),
      balanceMove('div', '4', 'r = -3'),
    ],
    [
      {
        promptEq: 'x = (a + br)/(1 + r)',
        givenValues: { x: '6', a: '-2', b: '4' },
        targetVar: 'r',
        promptText: 'If x = 6, a = −2 and b = 4, find the value of r.',
        steps: [
          makeStep('substitute', 'Substitute x = 6, a = −2 and b = 4', '6 = (-2 + 4r)/(1 + r)'),
          balanceMove('mul', '(1 + r)', '6 + 6r = -2 + 4r'),
          balanceMove('sub', '4r', '6 + 2r = -2'),
          balanceMove('sub', '6', '2r = -8'),
          balanceMove('div', '2', 'r = -4'),
        ],
      },
      {
        promptEq: 'x = (a + br)/(1 + r)',
        givenValues: { x: '7', a: '1', b: '4' },
        targetVar: 'r',
        promptText: 'If x = 7, a = 1 and b = 4, find the value of r.',
        steps: [
          makeStep('substitute', 'Substitute x = 7, a = 1 and b = 4', '7 = (1 + 4r)/(1 + r)'),
          balanceMove('mul', '(1 + r)', '7 + 7r = 1 + 4r'),
          balanceMove('sub', '4r', '7 + 3r = 1'),
          balanceMove('sub', '7', '3r = -6'),
          balanceMove('div', '3', 'r = -2'),
        ],
      },
    ],
    { sourceTag: '~TSA 2021' },
  ),

  // ── MCQ: Q101–104 ──
  s2(
    '101',
    'MCQ',
    'Multiple Choice · Substitution',
    'x = 10/(y - 2)',
    { x: '-5' },
    'y',
    [
      makeStep('substitute', 'Substitute x = −5 into the formula', '-5 = 10/(y - 2)'),
      balanceMove('mul', '(y − 2)', '-5(y - 2) = 10'),
      balanceMove('div', '-5', 'y - 2 = -2'),
      makeStep('mcq', 'Solve for y and choose A, B, C, or D', 'y = 0', {
        mcqOptions: [
          { label: 'A', text: '−4' },
          { label: 'B', text: '0' },
          { label: 'C', text: '4' },
          { label: 'D', text: '17' },
        ],
        correctMcq: 'B',
      }),
    ],
    [
      {
        promptEq: 'x = 12/(y - 3)',
        givenValues: { x: '-4' },
        targetVar: 'y',
        promptText: 'Find the value of y if x = −4.',
        steps: [
          makeStep('substitute', 'Substitute x = −4', '-4 = 12/(y - 3)'),
          balanceMove('mul', '(y − 3)', '-4(y - 3) = 12'),
          balanceMove('div', '-4', 'y - 3 = -3'),
          balanceMove('add', '3', 'y = 0'),
        ],
      },
    ],
  ),
  s2(
    '102',
    'MCQ',
    'Multiple Choice · Substitution',
    'x = (n - 2m)/(n^2)',
    { x: '7', n: '3' },
    'm',
    [
      makeStep('substitute', 'Substitute x = 7 and n = 3', '7 = (3 - 2m)/((3)^2)'),
      balanceMove('mul', '9', '63 = 3 - 2m'),
      balanceMove('sub', '3', '60 = -2m'),
      makeStep('mcq', 'Solve for m and choose A, B, C, or D', 'm = -30', {
        mcqOptions: [
          { label: 'A', text: '−30' },
          { label: 'B', text: '−19.5' },
          { label: 'C', text: '41' },
          { label: 'D', text: '62' },
        ],
        correctMcq: 'A',
      }),
    ],
    [
      {
        promptEq: 'x = (n - 2m)/(n^2)',
        givenValues: { x: '5', n: '2' },
        targetVar: 'm',
        promptText: 'Find the value of m if x = 5 and n = 2.',
        steps: [
          makeStep('substitute', 'Substitute x = 5 and n = 2', '5 = (2 - 2m)/4'),
          balanceMove('mul', '4', '20 = 2 - 2m'),
          balanceMove('sub', '2', '18 = -2m'),
          balanceMove('div', '-2', 'm = -9'),
        ],
      },
    ],
  ),
  s2(
    '103',
    'MCQ',
    'Multiple Choice · Reciprocal formula',
    '1/x = 1/y - 1/z',
    { x: '3', y: '4' },
    'z',
    [
      makeStep('substitute', 'Substitute x = 3 and y = 4', '1/3 = 1/4 - 1/z'),
      balanceMove('sub', '1/4', '1/12 = -1/z'),
      makeStep('mcq', 'Find z and choose A, B, C, or D', 'z = -12', {
        mcqOptions: [
          { label: 'A', text: '−1/12' },
          { label: 'B', text: '1/12' },
          { label: 'C', text: '−12' },
          { label: 'D', text: '12' },
        ],
        correctMcq: 'C',
      }),
    ],
    [
      {
        promptEq: '1/x = 1/y - 1/z',
        givenValues: { x: '2', y: '3' },
        targetVar: 'z',
        promptText: 'Find the value of z if x = 2 and y = 3.',
        steps: [
          makeStep('substitute', 'Substitute x = 2 and y = 3', '1/2 = 1/3 - 1/z'),
          balanceMove('sub', '1/3', '1/6 = -1/z'),
          makeStep('combine', 'Take reciprocals and negate', 'z = -6'),
        ],
      },
    ],
  ),
  s2(
    '104',
    'MCQ',
    'Multiple Choice · Linear substitution',
    '2a - 3b = 3(a - 2b) + 11',
    { b: '3' },
    'a',
    [
      makeStep('substitute', 'Substitute b = 3 into the formula', '2a - 3(3) = 3(a - 2(3)) + 11'),
      makeStep('expand', 'Simplify and expand the right side', '2a - 9 = 3a - 18 + 11'),
      makeStep('combine', 'Combine constants on the right side', '2a - 9 = 3a - 7'),
      makeStep('mcq', 'Solve for a and choose A, B, C, or D', 'a = -2', {
        mcqOptions: [
          { label: 'A', text: '−2' },
          { label: 'B', text: '2' },
          { label: 'C', text: '−4' },
          { label: 'D', text: '4' },
        ],
        correctMcq: 'A',
      }),
    ],
    [
      {
        promptEq: '2a - 3b = 3(a - 2b) + 7',
        givenValues: { b: '2' },
        targetVar: 'a',
        promptText: 'Find the value of a if b = 2.',
        steps: [
          makeStep('substitute', 'Substitute b = 2', '2a - 6 = 3(a - 4) + 7'),
          makeStep('combine', 'Expand and simplify', '2a - 6 = 3a - 5'),
          balanceMove('sub', '2a', '-6 = a - 5'),
          balanceMove('add', '5', 'a = -1'),
        ],
      },
    ],
  ),
];
