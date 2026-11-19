import { makeStep } from './stepHelpers';
import type { OrderRule, QuestionItem, QuestionLevel, QuestionVariant } from './types';

function sec2Item(
  num: string,
  level: QuestionLevel,
  topicTag: string,
  promptEq: string,
  steps: QuestionVariant['steps'],
  sims: QuestionVariant[],
  opts?: { promptText?: string },
): QuestionItem {
  return {
    id: `s1c10-s2-q${num}`,
    numberLabel: `Q${num}`,
    chapterId: 's1-ch10',
    sectionId: 's1c10_sec2',
    level,
    mode: 'expression',
    topicTag,
    promptEq,
    promptText: opts?.promptText || 'Simplify the polynomial:',
    steps,
    sims,
  };
}

const ascAny: OrderRule = { direction: 'asc', variable: 'any' };
const descAny: OrderRule = { direction: 'desc', variable: 'any' };
const ascX: OrderRule = { direction: 'asc', variable: 'x' };
const descY: OrderRule = { direction: 'desc', variable: 'y' };

export const S1_CH10_SECTION_2_QUESTIONS: QuestionItem[] = [
  // ── Level 1: Ascending Powers of Variables (Q41–Q43) ──
  sec2Item(
    '41a',
    'Level 1',
    'Simplifying & ascending order',
    '7m + 3 - 8m',
    [makeStep('combine', 'Combine like terms and arrange in ascending powers of m', '3 - m', { requireExpanded: true, orderRule: ascAny, hint: 'Constant 3 goes first (power 0), then 7m − 8m = −m (power 1).' })],
    [
      { promptEq: '5m + 4 - 9m', steps: [makeStep('combine', 'Combine like terms in ascending powers', '4 - 4m', { requireExpanded: true, orderRule: ascAny })] },
      { promptEq: '6k + 2 - 7k', steps: [makeStep('combine', 'Combine like terms in ascending powers', '2 - k', { requireExpanded: true, orderRule: ascAny })] },
    ],
    { promptText: 'Simplify and arrange the terms in ascending powers of the variable:' },
  ),
  sec2Item(
    '41b',
    'Level 1',
    'Simplifying & ascending order',
    '6n^2 - 3n - 2n^2',
    [makeStep('combine', 'Combine n^2 terms and arrange in ascending powers of n', '-3n + 4n^2', { requireExpanded: true, orderRule: ascAny, hint: '−3n comes first (power 1), then (6 − 2)n^2 = 4n^2 (power 2).' })],
    [
      { promptEq: '8n^2 - 5n - 3n^2', steps: [makeStep('combine', 'Combine like terms in ascending powers', '-5n + 5n^2', { requireExpanded: true, orderRule: ascAny })] },
      { promptEq: '7x^2 - 4x - 5x^2', steps: [makeStep('combine', 'Combine like terms in ascending powers', '-4x + 2x^2', { requireExpanded: true, orderRule: ascAny })] },
    ],
    { promptText: 'Simplify and arrange the terms in ascending powers of the variable:' },
  ),
  sec2Item(
    '42a',
    'Level 1',
    'Simplifying & ascending order',
    '5p - 6 - 12p + 13',
    [makeStep('combine', 'Combine constants & p terms in ascending powers of p', '7 - 7p', { requireExpanded: true, orderRule: ascAny, hint: 'Constants: −6 + 13 = 7. p terms: 5p − 12p = −7p.' })],
    [
      { promptEq: '4p - 9 - 10p + 15', steps: [makeStep('combine', 'Combine like terms in ascending powers', '6 - 6p', { requireExpanded: true, orderRule: ascAny })] },
      { promptEq: '3a - 5 - 8a + 11', steps: [makeStep('combine', 'Combine like terms in ascending powers', '6 - 5a', { requireExpanded: true, orderRule: ascAny })] },
    ],
    { promptText: 'Simplify and arrange the terms in ascending powers of the variable:' },
  ),
  sec2Item(
    '42b',
    'Level 1',
    'Simplifying & ascending order',
    '7q^2 - 2q + 4q - 10q^2',
    [makeStep('combine', 'Combine like terms and arrange in ascending powers of q', '2q - 3q^2', { requireExpanded: true, orderRule: ascAny, hint: 'q terms: −2q + 4q = 2q; q^2 terms: 7q^2 − 10q^2 = −3q^2.' })],
    [
      { promptEq: '5q^2 - 3q + 7q - 9q^2', steps: [makeStep('combine', 'Combine like terms in ascending powers', '4q - 4q^2', { requireExpanded: true, orderRule: ascAny })] },
      { promptEq: '4y^2 - 6y + 9y - 7y^2', steps: [makeStep('combine', 'Combine like terms in ascending powers', '3y - 3y^2', { requireExpanded: true, orderRule: ascAny })] },
    ],
    { promptText: 'Simplify and arrange the terms in ascending powers of the variable:' },
  ),
  sec2Item(
    '43a',
    'Level 1',
    'Simplifying & ascending order',
    '3u - 7 + 11u^2 + 6u - 14u^2',
    [makeStep('combine', 'Combine like terms and arrange in ascending powers of u', '-7 + 9u - 3u^2', { requireExpanded: true, orderRule: ascAny, hint: 'Constant: −7; u: 3u + 6u = 9u; u^2: 11u^2 − 14u^2 = −3u^2.' })],
    [
      { promptEq: '4u - 5 + 9u^2 + 2u - 12u^2', steps: [makeStep('combine', 'Combine like terms in ascending powers', '-5 + 6u - 3u^2', { requireExpanded: true, orderRule: ascAny })] },
      { promptEq: '2x - 8 + 7x^2 + 5x - 10x^2', steps: [makeStep('combine', 'Combine like terms in ascending powers', '-8 + 7x - 3x^2', { requireExpanded: true, orderRule: ascAny })] },
    ],
    { promptText: 'Simplify and arrange the terms in ascending powers of the variable:' },
  ),
  sec2Item(
    '43b',
    'Level 1',
    'Simplifying & ascending order',
    '12v + 3v^2 - 17 - 10v - 15 - 19v^2',
    [makeStep('combine', 'Combine like terms and arrange in ascending powers of v', '-32 + 2v - 16v^2', { requireExpanded: true, orderRule: ascAny, hint: 'Constants: −17 − 15 = −32; v: 12v − 10v = 2v; v^2: 3v^2 − 19v^2 = −16v^2.' })],
    [
      { promptEq: '9v + 4v^2 - 11 - 6v - 8 - 14v^2', steps: [makeStep('combine', 'Combine like terms in ascending powers', '-19 + 3v - 10v^2', { requireExpanded: true, orderRule: ascAny })] },
      { promptEq: '15t + 2t^2 - 9 - 11t - 6 - 10t^2', steps: [makeStep('combine', 'Combine like terms in ascending powers', '-15 + 4t - 8t^2', { requireExpanded: true, orderRule: ascAny })] },
    ],
    { promptText: 'Simplify and arrange the terms in ascending powers of the variable:' },
  ),

  // ── Level 1: Descending Powers of Variables (Q44–Q46) ──
  sec2Item(
    '44a',
    'Level 1',
    'Simplifying & descending order',
    '-9 + 6a + 8a',
    [makeStep('combine', 'Combine a terms and arrange in descending powers of a', '14a - 9', { requireExpanded: true, orderRule: descAny, hint: '6a + 8a = 14a goes first, followed by constant −9.' })],
    [
      { promptEq: '-5 + 4a + 9a', steps: [makeStep('combine', 'Combine like terms in descending powers', '13a - 5', { requireExpanded: true, orderRule: descAny })] },
      { promptEq: '-12 + 7m + 5m', steps: [makeStep('combine', 'Combine like terms in descending powers', '12m - 12', { requireExpanded: true, orderRule: descAny })] },
    ],
    { promptText: 'Simplify and arrange the terms in descending powers of the variable:' },
  ),
  sec2Item(
    '44b',
    'Level 1',
    'Simplifying & descending order',
    '4a - 12a^2 - 5a^2',
    [makeStep('combine', 'Combine a^2 terms and arrange in descending powers of a', '-17a^2 + 4a', { requireExpanded: true, orderRule: descAny, hint: '−12a^2 − 5a^2 = −17a^2 (power 2) before +4a (power 1).' })],
    [
      { promptEq: '7a - 9a^2 - 6a^2', steps: [makeStep('combine', 'Combine like terms in descending powers', '-15a^2 + 7a', { requireExpanded: true, orderRule: descAny })] },
      { promptEq: '5b - 8b^2 - 4b^2', steps: [makeStep('combine', 'Combine like terms in descending powers', '-12b^2 + 5b', { requireExpanded: true, orderRule: descAny })] },
    ],
    { promptText: 'Simplify and arrange the terms in descending powers of the variable:' },
  ),
  sec2Item(
    '45a',
    'Level 1',
    'Simplifying & descending order',
    '-7 - 9g + 13g - 1',
    [makeStep('combine', 'Combine like terms and arrange in descending powers of g', '4g - 8', { requireExpanded: true, orderRule: descAny, hint: '−9g + 13g = 4g; constants −7 − 1 = −8.' })],
    [
      { promptEq: '-4 - 7g + 12g - 3', steps: [makeStep('combine', 'Combine like terms in descending powers', '5g - 7', { requireExpanded: true, orderRule: descAny })] },
      { promptEq: '-6 - 5h + 11h - 2', steps: [makeStep('combine', 'Combine like terms in descending powers', '6h - 8', { requireExpanded: true, orderRule: descAny })] },
    ],
    { promptText: 'Simplify and arrange the terms in descending powers of the variable:' },
  ),
  sec2Item(
    '45b',
    'Level 1',
    'Simplifying & descending order',
    '10 - 2h^2 + 9h^2 - 4',
    [makeStep('combine', 'Combine like terms and arrange in descending powers of h', '7h^2 + 6', { requireExpanded: true, orderRule: descAny, hint: '−2h^2 + 9h^2 = 7h^2; constants 10 − 4 = 6.' })],
    [
      { promptEq: '12 - 3h^2 + 8h^2 - 5', steps: [makeStep('combine', 'Combine like terms in descending powers', '5h^2 + 7', { requireExpanded: true, orderRule: descAny })] },
      { promptEq: '9 - 4x^2 + 11x^2 - 2', steps: [makeStep('combine', 'Combine like terms in descending powers', '7x^2 + 7', { requireExpanded: true, orderRule: descAny })] },
    ],
    { promptText: 'Simplify and arrange the terms in descending powers of the variable:' },
  ),
  sec2Item(
    '46a',
    'Level 1',
    'Simplifying & descending order',
    '16x + 15 + 6x^2 - 12x^2 - 21x',
    [makeStep('combine', 'Combine like terms and arrange in descending powers of x', '-6x^2 - 5x + 15', { requireExpanded: true, orderRule: descAny, hint: 'x^2: 6 − 12 = −6; x: 16 − 21 = −5; constant: +15.' })],
    [
      { promptEq: '12x + 9 + 5x^2 - 9x^2 - 18x', steps: [makeStep('combine', 'Combine like terms in descending powers', '-4x^2 - 6x + 9', { requireExpanded: true, orderRule: descAny })] },
      { promptEq: '10y + 7 + 4y^2 - 11y^2 - 14y', steps: [makeStep('combine', 'Combine like terms in descending powers', '-7y^2 - 4y + 7', { requireExpanded: true, orderRule: descAny })] },
    ],
    { promptText: 'Simplify and arrange the terms in descending powers of the variable:' },
  ),
  sec2Item(
    '46b',
    'Level 1',
    'Simplifying & descending order',
    '3 - 2y^2 + 7y - 9y + 13 + 5y^2',
    [makeStep('combine', 'Combine like terms and arrange in descending powers of y', '3y^2 - 2y + 16', { requireExpanded: true, orderRule: descAny, hint: 'y^2: −2 + 5 = 3; y: 7 − 9 = −2; constant: 3 + 13 = 16.' })],
    [
      { promptEq: '5 - 3y^2 + 6y - 10y + 9 + 7y^2', steps: [makeStep('combine', 'Combine like terms in descending powers', '4y^2 - 4y + 14', { requireExpanded: true, orderRule: descAny })] },
      { promptEq: '4 - 4p^2 + 8p - 11p + 12 + 9p^2', steps: [makeStep('combine', 'Combine like terms in descending powers', '5p^2 - 3p + 16', { requireExpanded: true, orderRule: descAny })] },
    ],
    { promptText: 'Simplify and arrange the terms in descending powers of the variable:' },
  ),

  // ── Level 2: Multi-variable Like Terms & Ordered Polynomials (Q50–Q56) ──
  sec2Item(
    '50',
    'Level 2',
    'Combining multivariable like terms',
    '8ab - 9a - 11ba + 12a',
    [makeStep('combine', 'Recognize ab = ba and combine like terms', '-3ab + 3a', { requireExpanded: true, hint: '8ab − 11ab = −3ab, and −9a + 12a = 3a.' })],
    [
      { promptEq: '6ab - 7a - 10ba + 11a', steps: [makeStep('combine', 'Combine like terms', '-4ab + 4a', { requireExpanded: true })] },
      { promptEq: '9xy - 5x - 13yx + 12x', steps: [makeStep('combine', 'Combine like terms', '-4xy + 7x', { requireExpanded: true })] },
    ],
  ),
  sec2Item(
    '51',
    'Level 2',
    'Combining multivariable like terms',
    '12ab + 15ac - 18ba - 9ca',
    [makeStep('combine', 'Combine ab/ba terms and ac/ca terms', '-6ab + 6ac', { requireExpanded: true, hint: '12ab − 18ab = −6ab, and 15ac − 9ac = 6ac.' })],
    [
      { promptEq: '10ab + 14ac - 15ba - 8ca', steps: [makeStep('combine', 'Combine like terms', '-5ab + 6ac', { requireExpanded: true })] },
      { promptEq: '11pq + 16pr - 19qp - 7rp', steps: [makeStep('combine', 'Combine like terms', '-8pq + 9pr', { requireExpanded: true })] },
    ],
  ),
  sec2Item(
    '52',
    'Level 2',
    'Combining multivariable like terms',
    '-2p^2q^2 + 8pq - 12q^2p^2 + 12qp',
    [makeStep('combine', 'Recognize p^2q^2 = q^2p^2 and pq = qp, then combine', '-14p^2q^2 + 20pq', { requireExpanded: true, hint: '−2p^2q^2 − 12p^2q^2 = −14p^2q^2, and 8pq + 12pq = 20pq.' })],
    [
      { promptEq: '-4p^2q^2 + 7pq - 9q^2p^2 + 11qp', steps: [makeStep('combine', 'Combine like terms', '-13p^2q^2 + 18pq', { requireExpanded: true })] },
      { promptEq: '-3a^2b^2 + 5ab - 8b^2a^2 + 9ba', steps: [makeStep('combine', 'Combine like terms', '-11a^2b^2 + 14ab', { requireExpanded: true })] },
    ],
  ),
  sec2Item(
    '53',
    'Level 2',
    'Ascending powers of x',
    '5x - 6x^4 + 7x^3 - 8x - 9x^4 + 10x^5 - 13x^3',
    [makeStep('combine', 'Combine like terms and arrange in ascending powers of x', '-3x - 6x^3 - 15x^4 + 10x^5', { requireExpanded: true, orderRule: ascX, hint: 'x: 5 − 8 = −3; x^3: 7 − 13 = −6; x^4: −6 − 9 = −15; x^5: +10.' })],
    [
      { promptEq: '4x - 5x^4 + 8x^3 - 9x - 7x^4 + 6x^5 - 11x^3', steps: [makeStep('combine', 'Combine like terms in ascending powers of x', '-5x - 3x^3 - 12x^4 + 6x^5', { requireExpanded: true, orderRule: ascX })] },
      { promptEq: '7x - 4x^4 + 6x^3 - 10x - 8x^4 + 9x^5 - 10x^3', steps: [makeStep('combine', 'Combine like terms in ascending powers of x', '-3x - 4x^3 - 12x^4 + 9x^5', { requireExpanded: true, orderRule: ascX })] },
    ],
    { promptText: 'Simplify and arrange the terms in ascending powers of x:' },
  ),
  sec2Item(
    '54',
    'Level 2',
    'Ascending powers of x',
    '9x^3y - 12x^2y^2 + 13 + 14yx^3 + 2y^2x^2 - 2x',
    [makeStep('combine', 'Combine like terms and order by ascending power of x', '13 - 2x - 10x^2y^2 + 23x^3y', { requireExpanded: true, orderRule: ascX, hint: 'Order by degree in x: 13 (x^0), −2x (x^1), −10x^2y^2 (x^2), +23x^3y (x^3).' })],
    [
      { promptEq: '6x^3y - 9x^2y^2 + 11 + 8yx^3 + 3y^2x^2 - 4x', steps: [makeStep('combine', 'Combine like terms in ascending powers of x', '11 - 4x - 6x^2y^2 + 14x^3y', { requireExpanded: true, orderRule: ascX })] },
      { promptEq: '7x^3y - 11x^2y^2 + 5 + 9yx^3 + 4y^2x^2 - 3x', steps: [makeStep('combine', 'Combine like terms in ascending powers of x', '5 - 3x - 7x^2y^2 + 16x^3y', { requireExpanded: true, orderRule: ascX })] },
    ],
    { promptText: 'Simplify and arrange the terms in ascending powers of x:' },
  ),
  sec2Item(
    '55',
    'Level 2',
    'Descending powers of y',
    '15 + 6y^2 - 12y^2 + 16y^3 - 21 + 10y^3 - 2y^4',
    [makeStep('combine', 'Combine like terms and arrange in descending powers of y', '-2y^4 + 26y^3 - 6y^2 - 6', { requireExpanded: true, orderRule: descY, hint: 'y^4: −2y^4; y^3: 16 + 10 = 26; y^2: 6 − 12 = −6; constant: 15 − 21 = −6.' })],
    [
      { promptEq: '12 + 5y^2 - 9y^2 + 11y^3 - 17 + 7y^3 - 3y^4', steps: [makeStep('combine', 'Combine like terms in descending powers of y', '-3y^4 + 18y^3 - 4y^2 - 5', { requireExpanded: true, orderRule: descY })] },
      { promptEq: '9 + 4y^2 - 10y^2 + 14y^3 - 16 + 8y^3 - 5y^4', steps: [makeStep('combine', 'Combine like terms in descending powers of y', '-5y^4 + 22y^3 - 6y^2 - 7', { requireExpanded: true, orderRule: descY })] },
    ],
    { promptText: 'Simplify and arrange the terms in descending powers of y:' },
  ),
  sec2Item(
    '56',
    'Level 2',
    'Descending powers of y',
    '6y^2 - p^3y + py^3 - 12y^2 - 8yp^3 - 4y^3p',
    [makeStep('combine', 'Combine like terms and arrange in descending powers of y', '-3py^3 - 6y^2 - 9p^3y', { requireExpanded: true, orderRule: descY, hint: 'Order by degree in y: (py^3 − 4py^3) = −3py^3 (y^3), (6y^2 − 12y^2) = −6y^2 (y^2), (−p^3y − 8p^3y) = −9p^3y (y^1).' })],
    [
      { promptEq: '5y^2 - 2p^3y + 3py^3 - 11y^2 - 5yp^3 - 7y^3p', steps: [makeStep('combine', 'Combine like terms in descending powers of y', '-4py^3 - 6y^2 - 7p^3y', { requireExpanded: true, orderRule: descY })] },
      { promptEq: '8y^2 - 3p^3y + 2py^3 - 13y^2 - 6yp^3 - 5y^3p', steps: [makeStep('combine', 'Combine like terms in descending powers of y', '-3py^3 - 5y^2 - 9p^3y', { requireExpanded: true, orderRule: descY })] },
    ],
    { promptText: 'Simplify and arrange the terms in descending powers of y:' },
  ),
];
