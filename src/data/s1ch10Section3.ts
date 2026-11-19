import { makeStep } from './stepHelpers';
import type { OrderRule, QuestionItem, QuestionLevel, QuestionVariant } from './types';

function sec3Item(
  num: string,
  level: QuestionLevel,
  topicTag: string,
  promptEq: string,
  steps: QuestionVariant['steps'],
  sims: QuestionVariant[],
  opts?: { sourceTag?: string; promptText?: string },
): QuestionItem {
  return {
    id: `s1c10-s3-q${num}`,
    numberLabel: `Q${num}`,
    chapterId: 's1-ch10',
    sectionId: 's1c10_sec3',
    level,
    mode: 'expression',
    topicTag,
    sourceTag: opts?.sourceTag,
    promptEq,
    promptText: opts?.promptText || 'Simplify the expression:',
    steps,
    sims,
  };
}

const ascX: OrderRule = { direction: 'asc', variable: 'x' };
const descY: OrderRule = { direction: 'desc', variable: 'y' };

export const S1_CH10_SECTION_3_QUESTIONS: QuestionItem[] = [
  // ── Level 1: Q67–Q75 ──
  sec3Item(
    '67a',
    'Level 1',
    'Adding linear polynomials',
    '(7a + 6) + (5a - 6)',
    [
      makeStep('expand', 'Remove brackets', '7a + 6 + 5a - 6', { hint: 'The + sign before the second bracket keeps every sign inside unchanged.' }),
      makeStep('combine', 'Collect like terms', '12a', { requireExpanded: true, hint: '7a + 5a = 12a, and +6 − 6 = 0.' }),
    ],
    [
      {
        promptEq: '(6a + 4) + (3a - 4)',
        steps: [
          makeStep('expand', 'Remove brackets', '6a + 4 + 3a - 4'),
          makeStep('combine', 'Collect like terms', '9a', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(8x + 5) + (4x - 5)',
        steps: [
          makeStep('expand', 'Remove brackets', '8x + 5 + 4x - 5'),
          makeStep('combine', 'Collect like terms', '12x', { requireExpanded: true }),
        ],
      },
    ],
    { sourceTag: '~TSA 2016' },
  ),
  sec3Item(
    '67b',
    'Level 1',
    'Subtracting linear polynomials',
    '(8a + 9) - (3 + 2a)',
    [
      makeStep('expand', 'Remove brackets (flip signs inside the subtracted bracket)', '8a + 9 - 3 - 2a', { hint: '−(3 + 2a) = −3 − 2a.' }),
      makeStep('combine', 'Collect like terms', '6a + 6', { requireExpanded: true, hint: '8a − 2a = 6a, and 9 − 3 = 6.' }),
    ],
    [
      {
        promptEq: '(9a + 7) - (4 + 3a)',
        steps: [
          makeStep('expand', 'Remove brackets', '9a + 7 - 4 - 3a'),
          makeStep('combine', 'Collect like terms', '6a + 3', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(10y + 8) - (5 + 4y)',
        steps: [
          makeStep('expand', 'Remove brackets', '10y + 8 - 5 - 4y'),
          makeStep('combine', 'Collect like terms', '6y + 3', { requireExpanded: true }),
        ],
      },
    ],
    { sourceTag: '~TSA 2023' },
  ),
  sec3Item(
    '68a',
    'Level 1',
    'Adding two-variable polynomials',
    '(g + 5h) + (4g - 10h)',
    [
      makeStep('expand', 'Remove brackets', 'g + 5h + 4g - 10h'),
      makeStep('combine', 'Collect like terms', '5g - 5h', { requireExpanded: true, hint: 'g + 4g = 5g, and 5h − 10h = −5h.' }),
    ],
    [
      {
        promptEq: '(2g + 7h) + (3g - 11h)',
        steps: [
          makeStep('expand', 'Remove brackets', '2g + 7h + 3g - 11h'),
          makeStep('combine', 'Collect like terms', '5g - 4h', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(3a + 4b) + (5a - 9b)',
        steps: [
          makeStep('expand', 'Remove brackets', '3a + 4b + 5a - 9b'),
          makeStep('combine', 'Collect like terms', '8a - 5b', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec3Item(
    '68b',
    'Level 1',
    'Subtracting two-variable polynomials',
    '(5p - 7q) - (6p - 8q)',
    [
      makeStep('expand', 'Remove brackets (flip signs after −)', '5p - 7q - 6p + 8q', { hint: '−(6p − 8q) = −6p + 8q.' }),
      makeStep('combine', 'Collect like terms', '-p + q', { requireExpanded: true, hint: '5p − 6p = −p, and −7q + 8q = +q.' }),
    ],
    [
      {
        promptEq: '(4p - 5q) - (7p - 9q)',
        steps: [
          makeStep('expand', 'Remove brackets', '4p - 5q - 7p + 9q'),
          makeStep('combine', 'Collect like terms', '-3p + 4q', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(6x - 3y) - (8x - 7y)',
        steps: [
          makeStep('expand', 'Remove brackets', '6x - 3y - 8x + 7y'),
          makeStep('combine', 'Collect like terms', '-2x + 4y', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec3Item(
    '69a',
    'Level 1',
    'Adding quadratic polynomials',
    '(-8m^2 - 5m) + (-3m^2 + m)',
    [
      makeStep('expand', 'Remove brackets', '-8m^2 - 5m - 3m^2 + m'),
      makeStep('combine', 'Collect like terms', '-11m^2 - 4m', { requireExpanded: true, hint: '−8m^2 − 3m^2 = −11m^2, and −5m + m = −4m.' }),
    ],
    [
      {
        promptEq: '(-6m^2 - 4m) + (-2m^2 + m)',
        steps: [
          makeStep('expand', 'Remove brackets', '-6m^2 - 4m - 2m^2 + m'),
          makeStep('combine', 'Collect like terms', '-8m^2 - 3m', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(-5k^2 - 7k) + (-4k^2 + 3k)',
        steps: [
          makeStep('expand', 'Remove brackets', '-5k^2 - 7k - 4k^2 + 3k'),
          makeStep('combine', 'Collect like terms', '-9k^2 - 4k', { requireExpanded: true }),
        ],
      },
    ],
    { sourceTag: '~TSA 2015' },
  ),
  sec3Item(
    '69b',
    'Level 1',
    'Subtracting quadratic polynomials',
    '(2n^2 + 5n) - (-4n^2 - n)',
    [
      makeStep('expand', 'Remove brackets (flip signs after −)', '2n^2 + 5n + 4n^2 + n', { hint: '−(−4n^2 − n) = +4n^2 + n.' }),
      makeStep('combine', 'Collect like terms', '6n^2 + 6n', { requireExpanded: true, hint: '2n^2 + 4n^2 = 6n^2, and 5n + n = 6n.' }),
    ],
    [
      {
        promptEq: '(3n^2 + 4n) - (-2n^2 - n)',
        steps: [
          makeStep('expand', 'Remove brackets', '3n^2 + 4n + 2n^2 + n'),
          makeStep('combine', 'Collect like terms', '5n^2 + 5n', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(5x^2 + 2x) - (-3x^2 - 4x)',
        steps: [
          makeStep('expand', 'Remove brackets', '5x^2 + 2x + 3x^2 + 4x'),
          makeStep('combine', 'Collect like terms', '8x^2 + 6x', { requireExpanded: true }),
        ],
      },
    ],
    { sourceTag: '~TSA 2015' },
  ),
  sec3Item(
    '70a',
    'Level 1',
    'Adding two-variable quadratics',
    '(u^2 + 8v^2) + (3u^2 - 6v^2)',
    [
      makeStep('expand', 'Remove brackets', 'u^2 + 8v^2 + 3u^2 - 6v^2'),
      makeStep('combine', 'Collect like terms', '4u^2 + 2v^2', { requireExpanded: true, hint: 'u^2 + 3u^2 = 4u^2, and 8v^2 − 6v^2 = 2v^2.' }),
    ],
    [
      {
        promptEq: '(2u^2 + 7v^2) + (4u^2 - 5v^2)',
        steps: [
          makeStep('expand', 'Remove brackets', '2u^2 + 7v^2 + 4u^2 - 5v^2'),
          makeStep('combine', 'Collect like terms', '6u^2 + 2v^2', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(a^2 + 9b^2) + (2a^2 - 4b^2)',
        steps: [
          makeStep('expand', 'Remove brackets', 'a^2 + 9b^2 + 2a^2 - 4b^2'),
          makeStep('combine', 'Collect like terms', '3a^2 + 5b^2', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec3Item(
    '70b',
    'Level 1',
    'Subtracting two-variable quadratics',
    '(3x^2 - 7y^2) - (-3x^2 - 8y^2)',
    [
      makeStep('expand', 'Remove brackets (flip signs after −)', '3x^2 - 7y^2 + 3x^2 + 8y^2', { hint: '−(−3x^2 − 8y^2) = +3x^2 + 8y^2.' }),
      makeStep('combine', 'Collect like terms', '6x^2 + y^2', { requireExpanded: true, hint: '3x^2 + 3x^2 = 6x^2, and −7y^2 + 8y^2 = y^2.' }),
    ],
    [
      {
        promptEq: '(4x^2 - 5y^2) - (-2x^2 - 6y^2)',
        steps: [
          makeStep('expand', 'Remove brackets', '4x^2 - 5y^2 + 2x^2 + 6y^2'),
          makeStep('combine', 'Collect like terms', '6x^2 + y^2', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(5p^2 - 9q^2) - (-4p^2 - 11q^2)',
        steps: [
          makeStep('expand', 'Remove brackets', '5p^2 - 9q^2 + 4p^2 + 11q^2'),
          makeStep('combine', 'Collect like terms', '9p^2 + 2q^2', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec3Item(
    '71a',
    'Level 1',
    'Adding trinomials and binomials',
    '(2a + b + 5) + (3b - 6)',
    [
      makeStep('expand', 'Remove brackets', '2a + b + 5 + 3b - 6'),
      makeStep('combine', 'Collect like terms', '2a + 4b - 1', { requireExpanded: true, hint: 'b + 3b = 4b, and 5 − 6 = −1.' }),
    ],
    [
      {
        promptEq: '(3a + b + 4) + (2b - 7)',
        steps: [
          makeStep('expand', 'Remove brackets', '3a + b + 4 + 2b - 7'),
          makeStep('combine', 'Collect like terms', '3a + 3b - 3', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(4x + y + 6) + (3y - 8)',
        steps: [
          makeStep('expand', 'Remove brackets', '4x + y + 6 + 3y - 8'),
          makeStep('combine', 'Collect like terms', '4x + 4y - 2', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec3Item(
    '71b',
    'Level 1',
    'Subtracting trinomials and binomials',
    '(2c - 3d + 4) - (4c - 5)',
    [
      makeStep('expand', 'Remove brackets (flip signs after −)', '2c - 3d + 4 - 4c + 5', { hint: '−(4c − 5) = −4c + 5.' }),
      makeStep('combine', 'Collect like terms', '-2c - 3d + 9', { requireExpanded: true, hint: '2c − 4c = −2c, and 4 + 5 = 9.' }),
    ],
    [
      {
        promptEq: '(3c - 2d + 5) - (5c - 4)',
        steps: [
          makeStep('expand', 'Remove brackets', '3c - 2d + 5 - 5c + 4'),
          makeStep('combine', 'Collect like terms', '-2c - 2d + 9', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(4m - 5n + 2) - (6m - 7)',
        steps: [
          makeStep('expand', 'Remove brackets', '4m - 5n + 2 - 6m + 7'),
          makeStep('combine', 'Collect like terms', '-2m - 5n + 9', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec3Item(
    '72a',
    'Level 1',
    'Adding multivariable trinomials',
    '(6m - 8n - 11) + (2m - 9n + 13)',
    [
      makeStep('expand', 'Remove brackets', '6m - 8n - 11 + 2m - 9n + 13'),
      makeStep('combine', 'Collect like terms', '8m - 17n + 2', { requireExpanded: true, hint: '6m + 2m = 8m, −8n − 9n = −17n, −11 + 13 = +2.' }),
    ],
    [
      {
        promptEq: '(5m - 4n - 9) + (3m - 7n + 12)',
        steps: [
          makeStep('expand', 'Remove brackets', '5m - 4n - 9 + 3m - 7n + 12'),
          makeStep('combine', 'Collect like terms', '8m - 11n + 3', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(4a - 6b - 8) + (5a - 5b + 11)',
        steps: [
          makeStep('expand', 'Remove brackets', '4a - 6b - 8 + 5a - 5b + 11'),
          makeStep('combine', 'Collect like terms', '9a - 11b + 3', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec3Item(
    '72b',
    'Level 1',
    'Subtracting multivariable trinomials',
    '(4p + 10q - 5) - (-7q + 10 - 2p)',
    [
      makeStep('expand', 'Remove brackets (flip all signs inside the second bracket)', '4p + 10q - 5 + 7q - 10 + 2p', { hint: '−(−7q + 10 − 2p) = +7q − 10 + 2p.' }),
      makeStep('combine', 'Collect like terms', '6p + 17q - 15', { requireExpanded: true, hint: '4p + 2p = 6p, 10q + 7q = 17q, −5 − 10 = −15.' }),
    ],
    [
      {
        promptEq: '(3p + 8q - 4) - (-5q + 9 - 4p)',
        steps: [
          makeStep('expand', 'Remove brackets', '3p + 8q - 4 + 5q - 9 + 4p'),
          makeStep('combine', 'Collect like terms', '7p + 13q - 13', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(5x + 6y - 3) - (-4y + 7 - 3x)',
        steps: [
          makeStep('expand', 'Remove brackets', '5x + 6y - 3 + 4y - 7 + 3x'),
          makeStep('combine', 'Collect like terms', '8x + 10y - 10', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec3Item(
    '73a',
    'Level 1',
    'Adding quadratics & linear binomials',
    '(5u^2 + 13u - 4) + (-4u + 2)',
    [
      makeStep('expand', 'Remove brackets', '5u^2 + 13u - 4 - 4u + 2'),
      makeStep('combine', 'Collect like terms', '5u^2 + 9u - 2', { requireExpanded: true, hint: '13u − 4u = 9u, and −4 + 2 = −2.' }),
    ],
    [
      {
        promptEq: '(4u^2 + 11u - 6) + (-3u + 5)',
        steps: [
          makeStep('expand', 'Remove brackets', '4u^2 + 11u - 6 - 3u + 5'),
          makeStep('combine', 'Collect like terms', '4u^2 + 8u - 1', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(3x^2 + 9x - 7) + (-5x + 4)',
        steps: [
          makeStep('expand', 'Remove brackets', '3x^2 + 9x - 7 - 5x + 4'),
          makeStep('combine', 'Collect like terms', '3x^2 + 4x - 3', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec3Item(
    '73b',
    'Level 1',
    'Subtracting quadratics',
    '(15v^2 - 8v - 16) - (-4v^2 - 13)',
    [
      makeStep('expand', 'Remove brackets (flip signs after −)', '15v^2 - 8v - 16 + 4v^2 + 13', { hint: '−(−4v^2 − 13) = +4v^2 + 13.' }),
      makeStep('combine', 'Collect like terms', '19v^2 - 8v - 3', { requireExpanded: true, hint: '15v^2 + 4v^2 = 19v^2, −16 + 13 = −3.' }),
    ],
    [
      {
        promptEq: '(12v^2 - 6v - 14) - (-5v^2 - 10)',
        steps: [
          makeStep('expand', 'Remove brackets', '12v^2 - 6v - 14 + 5v^2 + 10'),
          makeStep('combine', 'Collect like terms', '17v^2 - 6v - 4', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(10y^2 - 5y - 11) - (-3y^2 - 8)',
        steps: [
          makeStep('expand', 'Remove brackets', '10y^2 - 5y - 11 + 3y^2 + 8'),
          makeStep('combine', 'Collect like terms', '13y^2 - 5y - 3', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec3Item(
    '74a',
    'Level 1',
    'Adding unordered quadratic trinomials',
    '(9x^2 - 8 + 10x) + (-2 - 11x^2 + 16x)',
    [
      makeStep('expand', 'Remove brackets', '9x^2 - 8 + 10x - 2 - 11x^2 + 16x'),
      makeStep('combine', 'Collect like terms', '-2x^2 + 26x - 10', { requireExpanded: true, hint: '9x^2 − 11x^2 = −2x^2, 10x + 16x = 26x, −8 − 2 = −10.' }),
    ],
    [
      {
        promptEq: '(7x^2 - 6 + 8x) + (-3 - 10x^2 + 12x)',
        steps: [
          makeStep('expand', 'Remove brackets', '7x^2 - 6 + 8x - 3 - 10x^2 + 12x'),
          makeStep('combine', 'Collect like terms', '-3x^2 + 20x - 9', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(6a^2 - 5 + 9a) + (-4 - 8a^2 + 11a)',
        steps: [
          makeStep('expand', 'Remove brackets', '6a^2 - 5 + 9a - 4 - 8a^2 + 11a'),
          makeStep('combine', 'Collect like terms', '-2a^2 + 20a - 9', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec3Item(
    '74b',
    'Level 1',
    'Subtracting unordered quadratic trinomials',
    '(-10 - 7y + 12y^2) - (-8y + 5y^2 - 13)',
    [
      makeStep('expand', 'Remove brackets (flip all signs inside the second bracket)', '-10 - 7y + 12y^2 + 8y - 5y^2 + 13', { hint: '−(−8y + 5y^2 − 13) = +8y − 5y^2 + 13.' }),
      makeStep('combine', 'Collect like terms', '7y^2 + y + 3', { requireExpanded: true, hint: '12y^2 − 5y^2 = 7y^2, −7y + 8y = y, −10 + 13 = 3.' }),
    ],
    [
      {
        promptEq: '(-8 - 5y + 10y^2) - (-6y + 4y^2 - 11)',
        steps: [
          makeStep('expand', 'Remove brackets', '-8 - 5y + 10y^2 + 6y - 4y^2 + 11'),
          makeStep('combine', 'Collect like terms', '6y^2 + y + 3', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(-9 - 4m + 11m^2) - (-7m + 6m^2 - 12)',
        steps: [
          makeStep('expand', 'Remove brackets', '-9 - 4m + 11m^2 + 7m - 6m^2 + 12'),
          makeStep('combine', 'Collect like terms', '5m^2 + 3m + 3', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec3Item(
    '75a',
    'Level 1',
    'Adding & subtracting three brackets',
    '(8a - 1) + (2a + 7) - (4 + a)',
    [
      makeStep('expand', 'Remove all three brackets carefully', '8a - 1 + 2a + 7 - 4 - a', { hint: '−(4 + a) becomes −4 − a.' }),
      makeStep('combine', 'Collect like terms', '9a + 2', { requireExpanded: true, hint: '8a + 2a − a = 9a, and −1 + 7 − 4 = +2.' }),
    ],
    [
      {
        promptEq: '(6a - 3) + (3a + 8) - (2 + a)',
        steps: [
          makeStep('expand', 'Remove brackets', '6a - 3 + 3a + 8 - 2 - a'),
          makeStep('combine', 'Collect like terms', '8a + 3', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(7x - 2) + (4x + 5) - (1 + 2x)',
        steps: [
          makeStep('expand', 'Remove brackets', '7x - 2 + 4x + 5 - 1 - 2x'),
          makeStep('combine', 'Collect like terms', '9x + 2', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec3Item(
    '75b',
    'Level 1',
    'Subtracting three brackets',
    '(2m - 3n) - (6m + 14n) - (-7n + 5m)',
    [
      makeStep('expand', 'Remove all three brackets (flip signs in both subtracted brackets)', '2m - 3n - 6m - 14n + 7n - 5m', { hint: '−(6m + 14n) = −6m − 14n, and −(−7n + 5m) = +7n − 5m.' }),
      makeStep('combine', 'Collect like terms', '-9m - 10n', { requireExpanded: true, hint: 'm: 2 − 6 − 5 = −9; n: −3 − 14 + 7 = −10.' }),
    ],
    [
      {
        promptEq: '(3m - 4n) - (5m + 10n) - (-6n + 4m)',
        steps: [
          makeStep('expand', 'Remove brackets', '3m - 4n - 5m - 10n + 6n - 4m'),
          makeStep('combine', 'Collect like terms', '-6m - 8n', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(4p - 2q) - (7p + 9q) - (-5q + 3p)',
        steps: [
          makeStep('expand', 'Remove brackets', '4p - 2q - 7p - 9q + 5q - 3p'),
          makeStep('combine', 'Collect like terms', '-6p - 6q', { requireExpanded: true }),
        ],
      },
    ],
  ),

  // ── Level 2: Ascending Powers of x (Q76–Q81) ──
  sec3Item(
    '76',
    'Level 2',
    'Polynomial addition (ascending x)',
    '(14 - 6x^2) + (7x^2 - 12x - 3)',
    [
      makeStep('expand', 'Remove brackets', '14 - 6x^2 + 7x^2 - 12x - 3'),
      makeStep('combine', 'Collect like terms in ascending powers of x', '11 - 12x + x^2', { requireExpanded: true, orderRule: ascX, hint: 'Constant: 14 − 3 = 11; x: −12x; x^2: −6x^2 + 7x^2 = x^2.' }),
    ],
    [
      {
        promptEq: '(12 - 5x^2) + (8x^2 - 9x - 4)',
        steps: [
          makeStep('expand', 'Remove brackets', '12 - 5x^2 + 8x^2 - 9x - 4'),
          makeStep('combine', 'Collect like terms in ascending powers of x', '8 - 9x + 3x^2', { requireExpanded: true, orderRule: ascX }),
        ],
      },
      {
        promptEq: '(15 - 4x^2) + (6x^2 - 7x - 5)',
        steps: [
          makeStep('expand', 'Remove brackets', '15 - 4x^2 + 6x^2 - 7x - 5'),
          makeStep('combine', 'Collect like terms in ascending powers of x', '10 - 7x + 2x^2', { requireExpanded: true, orderRule: ascX }),
        ],
      },
    ],
    { promptText: 'Simplify and arrange the terms in ascending powers of x:' },
  ),
  sec3Item(
    '77',
    'Level 2',
    'Polynomial subtraction (ascending x)',
    '(6x - 9x^2 + 10) - (-8x - 13x^2)',
    [
      makeStep('expand', 'Remove brackets (flip signs after −)', '6x - 9x^2 + 10 + 8x + 13x^2'),
      makeStep('combine', 'Collect like terms in ascending powers of x', '10 + 14x + 4x^2', { requireExpanded: true, orderRule: ascX, hint: 'Constant: 10; x: 6x + 8x = 14x; x^2: −9x^2 + 13x^2 = 4x^2.' }),
    ],
    [
      {
        promptEq: '(5x - 7x^2 + 8) - (-6x - 10x^2)',
        steps: [
          makeStep('expand', 'Remove brackets', '5x - 7x^2 + 8 + 6x + 10x^2'),
          makeStep('combine', 'Collect like terms in ascending powers of x', '8 + 11x + 3x^2', { requireExpanded: true, orderRule: ascX }),
        ],
      },
      {
        promptEq: '(4x - 8x^2 + 12) - (-5x - 11x^2)',
        steps: [
          makeStep('expand', 'Remove brackets', '4x - 8x^2 + 12 + 5x + 11x^2'),
          makeStep('combine', 'Collect like terms in ascending powers of x', '12 + 9x + 3x^2', { requireExpanded: true, orderRule: ascX }),
        ],
      },
    ],
    { promptText: 'Simplify and arrange the terms in ascending powers of x:' },
  ),
  sec3Item(
    '78',
    'Level 2',
    'Cubic polynomial addition (ascending x)',
    '(9x - x^3 - 8) + (6x^2 - 5x^3 - 4x)',
    [
      makeStep('expand', 'Remove brackets', '9x - x^3 - 8 + 6x^2 - 5x^3 - 4x'),
      makeStep('combine', 'Collect like terms in ascending powers of x', '-8 + 5x + 6x^2 - 6x^3', { requireExpanded: true, orderRule: ascX, hint: 'Constant: −8; x: 9x − 4x = 5x; x^2: +6x^2; x^3: −x^3 − 5x^3 = −6x^3.' }),
    ],
    [
      {
        promptEq: '(7x - x^3 - 5) + (4x^2 - 3x^3 - 2x)',
        steps: [
          makeStep('expand', 'Remove brackets', '7x - x^3 - 5 + 4x^2 - 3x^3 - 2x'),
          makeStep('combine', 'Collect like terms in ascending powers of x', '-5 + 5x + 4x^2 - 4x^3', { requireExpanded: true, orderRule: ascX }),
        ],
      },
      {
        promptEq: '(8x - 2x^3 - 6) + (5x^2 - 4x^3 - 3x)',
        steps: [
          makeStep('expand', 'Remove brackets', '8x - 2x^3 - 6 + 5x^2 - 4x^3 - 3x'),
          makeStep('combine', 'Collect like terms in ascending powers of x', '-6 + 5x + 5x^2 - 6x^3', { requireExpanded: true, orderRule: ascX }),
        ],
      },
    ],
    { promptText: 'Simplify and arrange the terms in ascending powers of x:' },
  ),
  sec3Item(
    '79',
    'Level 2',
    'Cubic polynomial subtraction (ascending x)',
    '(2x + 3x^2 - 7x^3 + 15) - (9 - 4x^2 - 15x)',
    [
      makeStep('expand', 'Remove brackets (flip signs after −)', '2x + 3x^2 - 7x^3 + 15 - 9 + 4x^2 + 15x'),
      makeStep('combine', 'Collect like terms in ascending powers of x', '6 + 17x + 7x^2 - 7x^3', { requireExpanded: true, orderRule: ascX, hint: 'Constant: 15 − 9 = 6; x: 2x + 15x = 17x; x^2: 3x^2 + 4x^2 = 7x^2; x^3: −7x^3.' }),
    ],
    [
      {
        promptEq: '(3x + 2x^2 - 5x^3 + 12) - (7 - 3x^2 - 10x)',
        steps: [
          makeStep('expand', 'Remove brackets', '3x + 2x^2 - 5x^3 + 12 - 7 + 3x^2 + 10x'),
          makeStep('combine', 'Collect like terms in ascending powers of x', '5 + 13x + 5x^2 - 5x^3', { requireExpanded: true, orderRule: ascX }),
        ],
      },
      {
        promptEq: '(4x + 5x^2 - 6x^3 + 14) - (8 - 2x^2 - 9x)',
        steps: [
          makeStep('expand', 'Remove brackets', '4x + 5x^2 - 6x^3 + 14 - 8 + 2x^2 + 9x'),
          makeStep('combine', 'Collect like terms in ascending powers of x', '6 + 13x + 7x^2 - 6x^3', { requireExpanded: true, orderRule: ascX }),
        ],
      },
    ],
    { promptText: 'Simplify and arrange the terms in ascending powers of x:' },
  ),
  sec3Item(
    '80',
    'Level 2',
    'Three-bracket subtraction (ascending x)',
    '(7 - x^2) - (2x - 3x^2) - (-8 - 6x)',
    [
      makeStep('expand', 'Remove all brackets carefully', '7 - x^2 - 2x + 3x^2 + 8 + 6x', { hint: '−(2x − 3x^2) = −2x + 3x^2; −(−8 − 6x) = +8 + 6x.' }),
      makeStep('combine', 'Collect like terms in ascending powers of x', '15 + 4x + 2x^2', { requireExpanded: true, orderRule: ascX, hint: 'Constant: 7 + 8 = 15; x: −2x + 6x = 4x; x^2: −x^2 + 3x^2 = 2x^2.' }),
    ],
    [
      {
        promptEq: '(5 - x^2) - (3x - 4x^2) - (-6 - 7x)',
        steps: [
          makeStep('expand', 'Remove brackets', '5 - x^2 - 3x + 4x^2 + 6 + 7x'),
          makeStep('combine', 'Collect like terms in ascending powers of x', '11 + 4x + 3x^2', { requireExpanded: true, orderRule: ascX }),
        ],
      },
      {
        promptEq: '(9 - 2x^2) - (4x - 5x^2) - (-4 - 9x)',
        steps: [
          makeStep('expand', 'Remove brackets', '9 - 2x^2 - 4x + 5x^2 + 4 + 9x'),
          makeStep('combine', 'Collect like terms in ascending powers of x', '13 + 5x + 3x^2', { requireExpanded: true, orderRule: ascX }),
        ],
      },
    ],
    { promptText: 'Simplify and arrange the terms in ascending powers of x:' },
  ),
  sec3Item(
    '81',
    'Level 2',
    'Three-bracket mixed ops (ascending x)',
    '(5 - 2x^2 - 6x) - (-5 + 4x - 3x^2) + (6x - 1)',
    [
      makeStep('expand', 'Remove all three brackets', '5 - 2x^2 - 6x + 5 - 4x + 3x^2 + 6x - 1', { hint: 'Watch the middle bracket: −(−5 + 4x − 3x^2) = +5 − 4x + 3x^2.' }),
      makeStep('combine', 'Collect like terms in ascending powers of x', '9 - 4x + x^2', { requireExpanded: true, orderRule: ascX, hint: 'Constant: 5 + 5 − 1 = 9; x: −6x − 4x + 6x = −4x; x^2: −2x^2 + 3x^2 = x^2.' }),
    ],
    [
      {
        promptEq: '(4 - x^2 - 5x) - (-3 + 2x - 4x^2) + (4x - 2)',
        steps: [
          makeStep('expand', 'Remove brackets', '4 - x^2 - 5x + 3 - 2x + 4x^2 + 4x - 2'),
          makeStep('combine', 'Collect like terms in ascending powers of x', '5 - 3x + 3x^2', { requireExpanded: true, orderRule: ascX }),
        ],
      },
      {
        promptEq: '(6 - 3x^2 - 4x) - (-2 + 5x - 6x^2) + (7x - 3)',
        steps: [
          makeStep('expand', 'Remove brackets', '6 - 3x^2 - 4x + 2 - 5x + 6x^2 + 7x - 3'),
          makeStep('combine', 'Collect like terms in ascending powers of x', '5 - 2x + 3x^2', { requireExpanded: true, orderRule: ascX }),
        ],
      },
    ],
    { promptText: 'Simplify and arrange the terms in ascending powers of x:' },
  ),

  // ── Level 2: Descending Powers of y (Q82–Q87) ──
  sec3Item(
    '82',
    'Level 2',
    'Polynomial addition (descending y)',
    '(4y^2 - 1) + (9y - 11y^2 + 8)',
    [
      makeStep('expand', 'Remove brackets', '4y^2 - 1 + 9y - 11y^2 + 8'),
      makeStep('combine', 'Collect like terms in descending powers of y', '-7y^2 + 9y + 7', { requireExpanded: true, orderRule: descY, hint: 'y^2: 4 − 11 = −7; y: +9y; constant: −1 + 8 = 7.' }),
    ],
    [
      {
        promptEq: '(3y^2 - 2) + (7y - 8y^2 + 9)',
        steps: [
          makeStep('expand', 'Remove brackets', '3y^2 - 2 + 7y - 8y^2 + 9'),
          makeStep('combine', 'Collect like terms in descending powers of y', '-5y^2 + 7y + 7', { requireExpanded: true, orderRule: descY }),
        ],
      },
      {
        promptEq: '(5y^2 - 4) + (6y - 9y^2 + 10)',
        steps: [
          makeStep('expand', 'Remove brackets', '5y^2 - 4 + 6y - 9y^2 + 10'),
          makeStep('combine', 'Collect like terms in descending powers of y', '-4y^2 + 6y + 6', { requireExpanded: true, orderRule: descY }),
        ],
      },
    ],
    { promptText: 'Simplify and arrange the terms in descending powers of y:' },
  ),
  sec3Item(
    '83',
    'Level 2',
    'Polynomial subtraction (descending y)',
    '(-7y + 19y^2 - 20) - (13y + 9y^2)',
    [
      makeStep('expand', 'Remove brackets (flip signs after −)', '-7y + 19y^2 - 20 - 13y - 9y^2'),
      makeStep('combine', 'Collect like terms in descending powers of y', '10y^2 - 20y - 20', { requireExpanded: true, orderRule: descY, hint: 'y^2: 19 − 9 = 10; y: −7 − 13 = −20; constant: −20.' }),
    ],
    [
      {
        promptEq: '(-5y + 15y^2 - 12) - (9y + 7y^2)',
        steps: [
          makeStep('expand', 'Remove brackets', '-5y + 15y^2 - 12 - 9y - 7y^2'),
          makeStep('combine', 'Collect like terms in descending powers of y', '8y^2 - 14y - 12', { requireExpanded: true, orderRule: descY }),
        ],
      },
      {
        promptEq: '(-4y + 14y^2 - 10) - (11y + 6y^2)',
        steps: [
          makeStep('expand', 'Remove brackets', '-4y + 14y^2 - 10 - 11y - 6y^2'),
          makeStep('combine', 'Collect like terms in descending powers of y', '8y^2 - 15y - 10', { requireExpanded: true, orderRule: descY }),
        ],
      },
    ],
    { promptText: 'Simplify and arrange the terms in descending powers of y:' },
  ),
  sec3Item(
    '84',
    'Level 2',
    'Cubic polynomial addition (descending y)',
    '(3y - 2y^2 - 4y^3) + (9y^2 - 7y^3 - 8y)',
    [
      makeStep('expand', 'Remove brackets', '3y - 2y^2 - 4y^3 + 9y^2 - 7y^3 - 8y'),
      makeStep('combine', 'Collect like terms in descending powers of y', '-11y^3 + 7y^2 - 5y', { requireExpanded: true, orderRule: descY, hint: 'y^3: −4 − 7 = −11; y^2: −2 + 9 = 7; y: 3 − 8 = −5.' }),
    ],
    [
      {
        promptEq: '(5y - 3y^2 - 2y^3) + (8y^2 - 6y^3 - 9y)',
        steps: [
          makeStep('expand', 'Remove brackets', '5y - 3y^2 - 2y^3 + 8y^2 - 6y^3 - 9y'),
          makeStep('combine', 'Collect like terms in descending powers of y', '-8y^3 + 5y^2 - 4y', { requireExpanded: true, orderRule: descY }),
        ],
      },
      {
        promptEq: '(4y - 5y^2 - 3y^3) + (11y^2 - 4y^3 - 7y)',
        steps: [
          makeStep('expand', 'Remove brackets', '4y - 5y^2 - 3y^3 + 11y^2 - 4y^3 - 7y'),
          makeStep('combine', 'Collect like terms in descending powers of y', '-7y^3 + 6y^2 - 3y', { requireExpanded: true, orderRule: descY }),
        ],
      },
    ],
    { promptText: 'Simplify and arrange the terms in descending powers of y:' },
  ),
  sec3Item(
    '85',
    'Level 2',
    'Cubic polynomial subtraction (descending y)',
    '(14y^2 - 5y^3 + 2y - 7) - (11 + 5y^2 - 17y)',
    [
      makeStep('expand', 'Remove brackets (flip signs after −)', '14y^2 - 5y^3 + 2y - 7 - 11 - 5y^2 + 17y'),
      makeStep('combine', 'Collect like terms in descending powers of y', '-5y^3 + 9y^2 + 19y - 18', { requireExpanded: true, orderRule: descY, hint: 'y^3: −5; y^2: 14 − 5 = 9; y: 2 + 17 = 19; constant: −7 − 11 = −18.' }),
    ],
    [
      {
        promptEq: '(10y^2 - 3y^3 + 4y - 5) - (8 + 4y^2 - 12y)',
        steps: [
          makeStep('expand', 'Remove brackets', '10y^2 - 3y^3 + 4y - 5 - 8 - 4y^2 + 12y'),
          makeStep('combine', 'Collect like terms in descending powers of y', '-3y^3 + 6y^2 + 16y - 13', { requireExpanded: true, orderRule: descY }),
        ],
      },
      {
        promptEq: '(12y^2 - 4y^3 + 3y - 6) - (9 + 6y^2 - 11y)',
        steps: [
          makeStep('expand', 'Remove brackets', '12y^2 - 4y^3 + 3y - 6 - 9 - 6y^2 + 11y'),
          makeStep('combine', 'Collect like terms in descending powers of y', '-4y^3 + 6y^2 + 14y - 15', { requireExpanded: true, orderRule: descY }),
        ],
      },
    ],
    { promptText: 'Simplify and arrange the terms in descending powers of y:' },
  ),
  sec3Item(
    '86',
    'Level 2',
    'Three-bracket addition (descending y)',
    '(2y^2 - 6) + (7y - y^2) + (-8y - 5)',
    [
      makeStep('expand', 'Remove all three brackets', '2y^2 - 6 + 7y - y^2 - 8y - 5'),
      makeStep('combine', 'Collect like terms in descending powers of y', 'y^2 - y - 11', { requireExpanded: true, orderRule: descY, hint: 'y^2: 2 − 1 = 1; y: 7 − 8 = −1; constant: −6 − 5 = −11.' }),
    ],
    [
      {
        promptEq: '(3y^2 - 4) + (5y - y^2) + (-7y - 6)',
        steps: [
          makeStep('expand', 'Remove brackets', '3y^2 - 4 + 5y - y^2 - 7y - 6'),
          makeStep('combine', 'Collect like terms in descending powers of y', '2y^2 - 2y - 10', { requireExpanded: true, orderRule: descY }),
        ],
      },
      {
        promptEq: '(4y^2 - 7) + (6y - 2y^2) + (-9y - 3)',
        steps: [
          makeStep('expand', 'Remove brackets', '4y^2 - 7 + 6y - 2y^2 - 9y - 3'),
          makeStep('combine', 'Collect like terms in descending powers of y', '2y^2 - 3y - 10', { requireExpanded: true, orderRule: descY }),
        ],
      },
    ],
    { promptText: 'Simplify and arrange the terms in descending powers of y:' },
  ),
  sec3Item(
    '87',
    'Level 2',
    'Three-bracket subtraction (descending y)',
    '(-2 - 4y^2 + 6y) - (-9 + 7y - 5y^2) - (5y - 10)',
    [
      makeStep('expand', 'Remove all three brackets carefully', '-2 - 4y^2 + 6y + 9 - 7y + 5y^2 - 5y + 10', { hint: '−(−9 + 7y − 5y^2) = +9 − 7y + 5y^2, and −(5y − 10) = −5y + 10.' }),
      makeStep('combine', 'Collect like terms in descending powers of y', 'y^2 - 6y + 17', { requireExpanded: true, orderRule: descY, hint: 'y^2: −4 + 5 = 1; y: 6 − 7 − 5 = −6; constant: −2 + 9 + 10 = 17.' }),
    ],
    [
      {
        promptEq: '(-3 - 2y^2 + 5y) - (-7 + 6y - 4y^2) - (4y - 8)',
        steps: [
          makeStep('expand', 'Remove brackets', '-3 - 2y^2 + 5y + 7 - 6y + 4y^2 - 4y + 8'),
          makeStep('combine', 'Collect like terms in descending powers of y', '2y^2 - 5y + 12', { requireExpanded: true, orderRule: descY }),
        ],
      },
      {
        promptEq: '(-1 - 3y^2 + 7y) - (-8 + 5y - 6y^2) - (6y - 9)',
        steps: [
          makeStep('expand', 'Remove brackets', '-1 - 3y^2 + 7y + 8 - 5y + 6y^2 - 6y + 9'),
          makeStep('combine', 'Collect like terms in descending powers of y', '3y^2 - 4y + 16', { requireExpanded: true, orderRule: descY }),
        ],
      },
    ],
    { promptText: 'Simplify and arrange the terms in descending powers of y:' },
  ),
];
