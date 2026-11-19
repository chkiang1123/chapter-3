import { makeStep } from './stepHelpers';
import type { OrderRule, QuestionItem, QuestionLevel, QuestionVariant } from './types';

function sec4Item(
  num: string,
  level: QuestionLevel,
  topicTag: string,
  promptEq: string,
  steps: QuestionVariant['steps'],
  sims: QuestionVariant[],
  opts?: { sourceTag?: string; promptText?: string },
): QuestionItem {
  return {
    id: `s1c10-s4-q${num}`,
    numberLabel: `Q${num}`,
    chapterId: 's1-ch10',
    sectionId: 's1c10_sec4',
    level,
    mode: 'expression',
    topicTag,
    sourceTag: opts?.sourceTag,
    promptEq,
    promptText: opts?.promptText || 'Expand the expression:',
    steps,
    sims,
  };
}

const descX: OrderRule = { direction: 'desc', variable: 'x' };

export const S1_CH10_SECTION_4_QUESTIONS: QuestionItem[] = [
  // ── Level 1: Monomial × Polynomial (Q102–Q109) ──
  sec4Item(
    '102a',
    'Level 1',
    'Constant × binomial',
    '7(4a - 6)',
    [makeStep('expand', 'Multiply 7 by each term inside the bracket', '28a - 42', { requireExpanded: true, hint: '7 × 4a = 28a and 7 × (−6) = −42.' })],
    [
      { promptEq: '6(5a - 4)', steps: [makeStep('expand', 'Multiply 6 by each term', '30a - 24', { requireExpanded: true })] },
      { promptEq: '8(3x - 5)', steps: [makeStep('expand', 'Multiply 8 by each term', '24x - 40', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '102b',
    'Level 1',
    'Constant × binomial',
    '8(a + 5b)',
    [makeStep('expand', 'Multiply 8 by each term inside the bracket', '8a + 40b', { requireExpanded: true, hint: '8 × a = 8a and 8 × 5b = 40b.' })],
    [
      { promptEq: '7(a + 4b)', steps: [makeStep('expand', 'Multiply 7 by each term', '7a + 28b', { requireExpanded: true })] },
      { promptEq: '9(x + 3y)', steps: [makeStep('expand', 'Multiply 9 by each term', '9x + 27y', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '103a',
    'Level 1',
    'Negative constant × binomial',
    '-2(-7m + 9n)',
    [makeStep('expand', 'Multiply −2 by each term inside the bracket', '14m - 18n', { requireExpanded: true, hint: '(−2)(−7m) = +14m and (−2)(9n) = −18n.' })],
    [
      { promptEq: '-3(-5m + 8n)', steps: [makeStep('expand', 'Multiply −3 by each term', '15m - 24n', { requireExpanded: true })] },
      { promptEq: '-4(-6p + 7q)', steps: [makeStep('expand', 'Multiply −4 by each term', '24p - 28q', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '103b',
    'Level 1',
    'Binomial × negative constant',
    '(4h - 9k)(-3)',
    [makeStep('expand', 'Multiply each term inside the bracket by −3', '-12h + 27k', { requireExpanded: true, hint: '4h × (−3) = −12h and (−9k) × (−3) = +27k.' })],
    [
      { promptEq: '(5h - 7k)(-4)', steps: [makeStep('expand', 'Multiply each term by −4', '-20h + 28k', { requireExpanded: true })] },
      { promptEq: '(3a - 8b)(-5)', steps: [makeStep('expand', 'Multiply each term by −5', '-15a + 40b', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '104a',
    'Level 1',
    'Monomial × binomial',
    '2u(5u - 3)',
    [makeStep('expand', 'Multiply 2u by each term inside the bracket', '10u^2 - 6u', { requireExpanded: true, hint: '2u × 5u = 10u^2 and 2u × (−3) = −6u.' })],
    [
      { promptEq: '3u(4u - 5)', steps: [makeStep('expand', 'Multiply 3u by each term', '12u^2 - 15u', { requireExpanded: true })] },
      { promptEq: '4x(3x - 2)', steps: [makeStep('expand', 'Multiply 4x by each term', '12x^2 - 8x', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '104b',
    'Level 1',
    'Binomial × negative variable',
    '(-7 + 9v)(-v)',
    [makeStep('expand', 'Multiply each term inside the bracket by −v', '7v - 9v^2', { requireExpanded: true, hint: '(−7)(−v) = +7v and (9v)(−v) = −9v^2.' })],
    [
      { promptEq: '(-5 + 8v)(-v)', steps: [makeStep('expand', 'Multiply each term by −v', '5v - 8v^2', { requireExpanded: true })] },
      { promptEq: '(-4 + 6y)(-y)', steps: [makeStep('expand', 'Multiply each term by −y', '4y - 6y^2', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '105a',
    'Level 1',
    'Two-variable monomial × binomial',
    '5g(6g - 7h)',
    [makeStep('expand', 'Multiply 5g by each term inside the bracket', '30g^2 - 35gh', { requireExpanded: true, hint: '5g × 6g = 30g^2 and 5g × (−7h) = −35gh.' })],
    [
      { promptEq: '4g(5g - 6h)', steps: [makeStep('expand', 'Multiply 4g by each term', '20g^2 - 24gh', { requireExpanded: true })] },
      { promptEq: '3a(7a - 4b)', steps: [makeStep('expand', 'Multiply 3a by each term', '21a^2 - 12ab', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '105b',
    'Level 1',
    'Two-variable binomial × monomial',
    '(6r - 7s)(-2s)',
    [makeStep('expand', 'Multiply each term inside the bracket by −2s', '-12rs + 14s^2', { requireExpanded: true, hint: '6r × (−2s) = −12rs and (−7s)(−2s) = +14s^2.' })],
    [
      { promptEq: '(5r - 4s)(-3s)', steps: [makeStep('expand', 'Multiply each term by −3s', '-15rs + 12s^2', { requireExpanded: true })] },
      { promptEq: '(4p - 9q)(-2q)', steps: [makeStep('expand', 'Multiply each term by −2q', '-8pq + 18q^2', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '106a',
    'Level 1',
    'Higher-degree monomial × binomial',
    '4x(3x^2 + 2)',
    [makeStep('expand', 'Multiply 4x by each term inside the bracket', '12x^3 + 8x', { requireExpanded: true, hint: '4x × 3x^2 = 12x^3 and 4x × 2 = 8x.' })],
    [
      { promptEq: '3x(5x^2 + 4)', steps: [makeStep('expand', 'Multiply 3x by each term', '15x^3 + 12x', { requireExpanded: true })] },
      { promptEq: '5a(2a^2 + 3)', steps: [makeStep('expand', 'Multiply 5a by each term', '10a^3 + 15a', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '106b',
    'Level 1',
    'Higher-degree binomial × monomial',
    '(-8y^2 - 5)(9y)',
    [makeStep('expand', 'Multiply each term inside the bracket by 9y', '-72y^3 - 45y', { requireExpanded: true, hint: '(−8y^2)(9y) = −72y^3 and (−5)(9y) = −45y.' })],
    [
      { promptEq: '(-6y^2 - 4)(7y)', steps: [makeStep('expand', 'Multiply each term by 7y', '-42y^3 - 28y', { requireExpanded: true })] },
      { promptEq: '(-7m^2 - 3)(5m)', steps: [makeStep('expand', 'Multiply each term by 5m', '-35m^3 - 15m', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '107a',
    'Level 1',
    'Quadratic monomial × binomial',
    '2m^2(2m - 1)',
    [makeStep('expand', 'Multiply 2m^2 by each term inside the bracket', '4m^3 - 2m^2', { requireExpanded: true, hint: '2m^2 × 2m = 4m^3 and 2m^2 × (−1) = −2m^2.' })],
    [
      { promptEq: '3m^2(4m - 1)', steps: [makeStep('expand', 'Multiply 3m^2 by each term', '12m^3 - 3m^2', { requireExpanded: true })] },
      { promptEq: '5k^2(2k - 3)', steps: [makeStep('expand', 'Multiply 5k^2 by each term', '10k^3 - 15k^2', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '107b',
    'Level 1',
    'Binomial × negative quadratic monomial',
    '(-1 + 3n)(-6n^2)',
    [makeStep('expand', 'Multiply each term inside the bracket by −6n^2', '6n^2 - 18n^3', { requireExpanded: true, hint: '(−1)(−6n^2) = +6n^2 and (3n)(−6n^2) = −18n^3.' })],
    [
      { promptEq: '(-1 + 4n)(-5n^2)', steps: [makeStep('expand', 'Multiply each term by −5n^2', '5n^2 - 20n^3', { requireExpanded: true })] },
      { promptEq: '(-2 + 5p)(-3p^2)', steps: [makeStep('expand', 'Multiply each term by −3p^2', '6p^2 - 15p^3', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '108a',
    'Level 1',
    'Monomial × trinomial',
    '4b(6 - a + 2b)',
    [makeStep('expand', 'Multiply 4b by all three terms inside the bracket', '24b - 4ab + 8b^2', { requireExpanded: true, hint: '4b × 6 = 24b, 4b × (−a) = −4ab, 4b × 2b = 8b^2.' })],
    [
      { promptEq: '3b(5 - a + 4b)', steps: [makeStep('expand', 'Multiply 3b by all three terms', '15b - 3ab + 12b^2', { requireExpanded: true })] },
      { promptEq: '5y(4 - x + 3y)', steps: [makeStep('expand', 'Multiply 5y by all three terms', '20y - 5xy + 15y^2', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '108b',
    'Level 1',
    'Trinomial × negative monomial',
    '(4 + 7x - y)(-5x)',
    [makeStep('expand', 'Multiply all three terms inside the bracket by −5x', '-20x - 35x^2 + 5xy', { requireExpanded: true, hint: '4(−5x) = −20x, 7x(−5x) = −35x^2, (−y)(−5x) = +5xy.' })],
    [
      { promptEq: '(3 + 5x - y)(-4x)', steps: [makeStep('expand', 'Multiply all three terms by −4x', '-12x - 20x^2 + 4xy', { requireExpanded: true })] },
      { promptEq: '(6 + 4a - b)(-3a)', steps: [makeStep('expand', 'Multiply all three terms by −3a', '-18a - 12a^2 + 3ab', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '109a',
    'Level 1',
    'Monomial × quadratic trinomial',
    '5a(2a^2 + 3a - 5)',
    [makeStep('expand', 'Multiply 5a by all three terms inside the bracket', '10a^3 + 15a^2 - 25a', { requireExpanded: true, hint: '5a(2a^2) = 10a^3, 5a(3a) = 15a^2, 5a(−5) = −25a.' })],
    [
      { promptEq: '4a(3a^2 + 2a - 6)', steps: [makeStep('expand', 'Multiply 4a by all three terms', '12a^3 + 8a^2 - 24a', { requireExpanded: true })] },
      { promptEq: '3x(4x^2 + 5x - 2)', steps: [makeStep('expand', 'Multiply 3x by all three terms', '12x^3 + 15x^2 - 6x', { requireExpanded: true })] },
    ],
  ),
  sec4Item(
    '109b',
    'Level 1',
    'Quadratic trinomial × negative monomial',
    '(5 - 4b + 3b^2)(-2b)',
    [makeStep('expand', 'Multiply all three terms inside the bracket by −2b', '-10b + 8b^2 - 6b^3', { requireExpanded: true, hint: '5(−2b) = −10b, (−4b)(−2b) = +8b^2, 3b^2(−2b) = −6b^3.' })],
    [
      { promptEq: '(4 - 5b + 2b^2)(-3b)', steps: [makeStep('expand', 'Multiply all three terms by −3b', '-12b + 15b^2 - 6b^3', { requireExpanded: true })] },
      { promptEq: '(6 - 3x + 4x^2)(-2x)', steps: [makeStep('expand', 'Multiply all three terms by −2x', '-12x + 6x^2 - 8x^3', { requireExpanded: true })] },
    ],
  ),

  // ── Level 2: Expand and Simplify (Q110–Q122) ──
  sec4Item(
    '110a',
    'Level 2',
    'Expanding & simplifying two products',
    'a(4a - 3) + 2a(a - 1)',
    [
      makeStep('expand', 'Expand both brackets', '4a^2 - 3a + 2a^2 - 2a', { hint: 'a(4a − 3) = 4a^2 − 3a and 2a(a − 1) = 2a^2 − 2a.' }),
      makeStep('combine', 'Collect like terms', '6a^2 - 5a', { requireExpanded: true, hint: '4a^2 + 2a^2 = 6a^2, and −3a − 2a = −5a.' }),
    ],
    [
      {
        promptEq: 'a(5a - 2) + 3a(a - 1)',
        steps: [
          makeStep('expand', 'Expand both brackets', '5a^2 - 2a + 3a^2 - 3a'),
          makeStep('combine', 'Collect like terms', '8a^2 - 5a', { requireExpanded: true }),
        ],
      },
      {
        promptEq: 'x(3x - 4) + 2x(x - 3)',
        steps: [
          makeStep('expand', 'Expand both brackets', '3x^2 - 4x + 2x^2 - 6x'),
          makeStep('combine', 'Collect like terms', '5x^2 - 10x', { requireExpanded: true }),
        ],
      },
    ],
    { promptText: 'Expand and simplify the expression:' },
  ),
  sec4Item(
    '110b',
    'Level 2',
    'Expanding & simplifying with subtraction',
    '2b(10 + 3b) - b(4 - 7b)',
    [
      makeStep('expand', 'Expand both brackets (watch the −b sign)', '20b + 6b^2 - 4b + 7b^2', { hint: '−b(4 − 7b) = −4b + 7b^2.' }),
      makeStep('combine', 'Collect like terms', '13b^2 + 16b', { requireExpanded: true, hint: '6b^2 + 7b^2 = 13b^2, and 20b − 4b = 16b.' }),
    ],
    [
      {
        promptEq: '3b(6 + 2b) - b(5 - 4b)',
        steps: [
          makeStep('expand', 'Expand both brackets', '18b + 6b^2 - 5b + 4b^2'),
          makeStep('combine', 'Collect like terms', '10b^2 + 13b', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '2y(8 + 4y) - y(3 - 5y)',
        steps: [
          makeStep('expand', 'Expand both brackets', '16y + 8y^2 - 3y + 5y^2'),
          makeStep('combine', 'Collect like terms', '13y^2 + 13y', { requireExpanded: true }),
        ],
      },
    ],
    { promptText: 'Expand and simplify the expression:' },
  ),
  sec4Item(
    '111a',
    'Level 2',
    'Expanding & simplifying two products',
    '7x(1 + 5x) + 3x(5x + 7)',
    [
      makeStep('expand', 'Expand both brackets', '7x + 35x^2 + 15x^2 + 21x'),
      makeStep('combine', 'Collect like terms', '50x^2 + 28x', { requireExpanded: true, hint: '35x^2 + 15x^2 = 50x^2, and 7x + 21x = 28x.' }),
    ],
    [
      {
        promptEq: '4x(2 + 3x) + 5x(2x + 3)',
        steps: [
          makeStep('expand', 'Expand both brackets', '8x + 12x^2 + 10x^2 + 15x'),
          makeStep('combine', 'Collect like terms', '22x^2 + 23x', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '6m(1 + 2m) + 4m(3m + 5)',
        steps: [
          makeStep('expand', 'Expand both brackets', '6m + 12m^2 + 12m^2 + 20m'),
          makeStep('combine', 'Collect like terms', '24m^2 + 26m', { requireExpanded: true }),
        ],
      },
    ],
    { promptText: 'Expand and simplify the expression:' },
  ),
  sec4Item(
    '111b',
    'Level 2',
    'Expanding & simplifying negative products',
    '-8y(y - 6) - 2y(6y + 5)',
    [
      makeStep('expand', 'Expand both brackets carefully', '-8y^2 + 48y - 12y^2 - 10y', { hint: '−8y(y − 6) = −8y^2 + 48y; −2y(6y + 5) = −12y^2 − 10y.' }),
      makeStep('combine', 'Collect like terms', '-20y^2 + 38y', { requireExpanded: true, hint: '−8y^2 − 12y^2 = −20y^2, and 48y − 10y = 38y.' }),
    ],
    [
      {
        promptEq: '-5y(y - 4) - 3y(4y + 2)',
        steps: [
          makeStep('expand', 'Expand both brackets', '-5y^2 + 20y - 12y^2 - 6y'),
          makeStep('combine', 'Collect like terms', '-17y^2 + 14y', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '-6k(k - 5) - 4k(2k + 3)',
        steps: [
          makeStep('expand', 'Expand both brackets', '-6k^2 + 30k - 8k^2 - 12k'),
          makeStep('combine', 'Collect like terms', '-14k^2 + 18k', { requireExpanded: true }),
        ],
      },
    ],
    { promptText: 'Expand and simplify the expression:' },
  ),
  sec4Item(
    '112a',
    'Level 2',
    'Expanding & simplifying mixed products',
    '3w(5w - 2) + 10(2w + 3w^2)',
    [
      makeStep('expand', 'Expand both brackets', '15w^2 - 6w + 20w + 30w^2'),
      makeStep('combine', 'Collect like terms', '45w^2 + 14w', { requireExpanded: true, hint: '15w^2 + 30w^2 = 45w^2, and −6w + 20w = 14w.' }),
    ],
    [
      {
        promptEq: '2w(4w - 3) + 5(3w + 2w^2)',
        steps: [
          makeStep('expand', 'Expand both brackets', '8w^2 - 6w + 15w + 10w^2'),
          makeStep('combine', 'Collect like terms', '18w^2 + 9w', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '4a(3a - 1) + 6(2a + 5a^2)',
        steps: [
          makeStep('expand', 'Expand both brackets', '12a^2 - 4a + 12a + 30a^2'),
          makeStep('combine', 'Collect like terms', '42a^2 + 8a', { requireExpanded: true }),
        ],
      },
    ],
    { promptText: 'Expand and simplify the expression:' },
  ),
  sec4Item(
    '112b',
    'Level 2',
    'Expanding & simplifying mixed subtraction',
    '9u(5 - 4u) - 7(8u - 3u^2)',
    [
      makeStep('expand', 'Expand both brackets (watch −7 × −3u^2)', '45u - 36u^2 - 56u + 21u^2', { hint: '−7(8u − 3u^2) = −56u + 21u^2.' }),
      makeStep('combine', 'Collect like terms', '-15u^2 - 11u', { requireExpanded: true, hint: '−36u^2 + 21u^2 = −15u^2, and 45u − 56u = −11u.' }),
    ],
    [
      {
        promptEq: '6u(4 - 3u) - 5(7u - 2u^2)',
        steps: [
          makeStep('expand', 'Expand both brackets', '24u - 18u^2 - 35u + 10u^2'),
          makeStep('combine', 'Collect like terms', '-8u^2 - 11u', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '8p(3 - 5p) - 4(9p - 6p^2)',
        steps: [
          makeStep('expand', 'Expand both brackets', '24p - 40p^2 - 36p + 24p^2'),
          makeStep('combine', 'Collect like terms', '-16p^2 - 12p', { requireExpanded: true }),
        ],
      },
    ],
    { promptText: 'Expand and simplify the expression:' },
  ),
  sec4Item(
    '113a',
    'Level 2',
    'Product of two binomials',
    '(e + 2)(e + 6)',
    [
      makeStep('expand', 'Multiply every term in the first bracket by the second', 'e^2 + 6e + 2e + 12'),
      makeStep('combine', 'Combine like terms', 'e^2 + 8e + 12', { requireExpanded: true, hint: '6e + 2e = 8e.' }),
    ],
    [
      {
        promptEq: '(e + 3)(e + 5)',
        steps: [
          makeStep('expand', 'Multiply binomials', 'e^2 + 5e + 3e + 15'),
          makeStep('combine', 'Combine like terms', 'e^2 + 8e + 15', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(x + 4)(x + 7)',
        steps: [
          makeStep('expand', 'Multiply binomials', 'x^2 + 7x + 4x + 28'),
          makeStep('combine', 'Combine like terms', 'x^2 + 11x + 28', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '113b',
    'Level 2',
    'Product of two binomials',
    '(g - 7)(g - 8)',
    [
      makeStep('expand', 'Multiply every term in the first bracket by the second', 'g^2 - 8g - 7g + 56'),
      makeStep('combine', 'Combine like terms', 'g^2 - 15g + 56', { requireExpanded: true, hint: '−8g − 7g = −15g and (−7)(−8) = +56.' }),
    ],
    [
      {
        promptEq: '(g - 4)(g - 9)',
        steps: [
          makeStep('expand', 'Multiply binomials', 'g^2 - 9g - 4g + 36'),
          makeStep('combine', 'Combine like terms', 'g^2 - 13g + 36', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(y - 5)(y - 6)',
        steps: [
          makeStep('expand', 'Multiply binomials', 'y^2 - 6y - 5y + 30'),
          makeStep('combine', 'Combine like terms', 'y^2 - 11y + 30', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '114a',
    'Level 2',
    'Product of general linear binomials',
    '(3h - 4)(4h + 2)',
    [
      makeStep('expand', 'Expand the product of the two brackets', '12h^2 + 6h - 16h - 8'),
      makeStep('combine', 'Combine like terms', '12h^2 - 10h - 8', { requireExpanded: true, hint: '6h − 16h = −10h.' }),
    ],
    [
      {
        promptEq: '(2h - 3)(5h + 4)',
        steps: [
          makeStep('expand', 'Expand brackets', '10h^2 + 8h - 15h - 12'),
          makeStep('combine', 'Combine like terms', '10h^2 - 7h - 12', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(4a - 5)(2a + 3)',
        steps: [
          makeStep('expand', 'Expand brackets', '8a^2 + 12a - 10a - 15'),
          makeStep('combine', 'Combine like terms', '8a^2 + 2a - 15', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '114b',
    'Level 2',
    'Product of general linear binomials',
    '(8k + 9)(5k - 3)',
    [
      makeStep('expand', 'Expand the product of the two brackets', '40k^2 - 24k + 45k - 27'),
      makeStep('combine', 'Combine like terms', '40k^2 + 21k - 27', { requireExpanded: true, hint: '−24k + 45k = +21k.' }),
    ],
    [
      {
        promptEq: '(6k + 7)(3k - 2)',
        steps: [
          makeStep('expand', 'Expand brackets', '18k^2 - 12k + 21k - 14'),
          makeStep('combine', 'Combine like terms', '18k^2 + 9k - 14', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(5m + 4)(4m - 3)',
        steps: [
          makeStep('expand', 'Expand brackets', '20m^2 - 15m + 16m - 12'),
          makeStep('combine', 'Combine like terms', '20m^2 + m - 12', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '115a',
    'Level 2',
    'Binomials with reversed linear order',
    '(2n + 1)(2 - 3n)',
    [
      makeStep('expand', 'Expand the product of the two brackets', '4n - 6n^2 + 2 - 3n'),
      makeStep('combine', 'Combine like terms', '-6n^2 + n + 2', { requireExpanded: true, hint: '4n − 3n = n, giving −6n^2 + n + 2.' }),
    ],
    [
      {
        promptEq: '(3n + 1)(4 - 2n)',
        steps: [
          makeStep('expand', 'Expand brackets', '12n - 6n^2 + 4 - 2n'),
          makeStep('combine', 'Combine like terms', '-6n^2 + 10n + 4', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(2x + 3)(5 - 4x)',
        steps: [
          makeStep('expand', 'Expand brackets', '10x - 8x^2 + 15 - 12x'),
          makeStep('combine', 'Combine like terms', '-8x^2 - 2x + 15', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '115b',
    'Level 2',
    'Binomials with reversed linear order',
    '(1 - 2m)(4 - 7m)',
    [
      makeStep('expand', 'Expand the product of the two brackets', '4 - 7m - 8m + 14m^2'),
      makeStep('combine', 'Combine like terms', '14m^2 - 15m + 4', { requireExpanded: true, hint: '−7m − 8m = −15m and (−2m)(−7m) = +14m^2.' }),
    ],
    [
      {
        promptEq: '(1 - 3m)(5 - 4m)',
        steps: [
          makeStep('expand', 'Expand brackets', '5 - 4m - 15m + 12m^2'),
          makeStep('combine', 'Combine like terms', '12m^2 - 19m + 5', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(2 - 5a)(3 - 2a)',
        steps: [
          makeStep('expand', 'Expand brackets', '6 - 4a - 15a + 10a^2'),
          makeStep('combine', 'Combine like terms', '10a^2 - 19a + 6', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '116a',
    'Level 2',
    'Two-variable binomial product',
    '(3a - 5b)(2a - 3b)',
    [
      makeStep('expand', 'Expand the product of the two brackets', '6a^2 - 9ab - 10ab + 15b^2'),
      makeStep('combine', 'Combine like terms', '6a^2 - 19ab + 15b^2', { requireExpanded: true, hint: '−9ab − 10ab = −19ab.' }),
    ],
    [
      {
        promptEq: '(2a - 3b)(4a - 5b)',
        steps: [
          makeStep('expand', 'Expand brackets', '8a^2 - 10ab - 12ab + 15b^2'),
          makeStep('combine', 'Combine like terms', '8a^2 - 22ab + 15b^2', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(4x - y)(3x - 2y)',
        steps: [
          makeStep('expand', 'Expand brackets', '12x^2 - 8xy - 3xy + 2y^2'),
          makeStep('combine', 'Combine like terms', '12x^2 - 11xy + 2y^2', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '116b',
    'Level 2',
    'Two-variable binomial product',
    '(9p + 4q)(5p - 2q)',
    [
      makeStep('expand', 'Expand the product of the two brackets', '45p^2 - 18pq + 20pq - 8q^2'),
      makeStep('combine', 'Combine like terms', '45p^2 + 2pq - 8q^2', { requireExpanded: true, hint: '−18pq + 20pq = +2pq.' }),
    ],
    [
      {
        promptEq: '(7p + 3q)(4p - 2q)',
        steps: [
          makeStep('expand', 'Expand brackets', '28p^2 - 14pq + 12pq - 6q^2'),
          makeStep('combine', 'Combine like terms', '28p^2 - 2pq - 6q^2', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(6x + 5y)(3x - 2y)',
        steps: [
          makeStep('expand', 'Expand brackets', '18x^2 - 12xy + 15xy - 10y^2'),
          makeStep('combine', 'Combine like terms', '18x^2 + 3xy - 10y^2', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '117a',
    'Level 2',
    'Square of a binomial',
    '(2a + 5)^2',
    [
      makeStep('expand', 'Rewrite as (2a + 5)(2a + 5) and expand', '4a^2 + 10a + 10a + 25', { hint: 'Remember (A + B)^2 = (A + B)(A + B), not just A^2 + B^2!' }),
      makeStep('combine', 'Combine like terms', '4a^2 + 20a + 25', { requireExpanded: true, hint: '10a + 10a = 20a.' }),
    ],
    [
      {
        promptEq: '(3a + 4)^2',
        steps: [
          makeStep('expand', 'Expand (3a + 4)(3a + 4)', '9a^2 + 12a + 12a + 16'),
          makeStep('combine', 'Combine like terms', '9a^2 + 24a + 16', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(5x + 2)^2',
        steps: [
          makeStep('expand', 'Expand (5x + 2)(5x + 2)', '25x^2 + 10x + 10x + 4'),
          makeStep('combine', 'Combine like terms', '25x^2 + 20x + 4', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '117b',
    'Level 2',
    'Square of a binomial',
    '(3 - 4b)^2',
    [
      makeStep('expand', 'Rewrite as (3 − 4b)(3 − 4b) and expand', '9 - 12b - 12b + 16b^2'),
      makeStep('combine', 'Combine like terms', '16b^2 - 24b + 9', { requireExpanded: true, hint: '−12b − 12b = −24b and (−4b)^2 = +16b^2.' }),
    ],
    [
      {
        promptEq: '(2 - 5b)^2',
        steps: [
          makeStep('expand', 'Expand (2 − 5b)(2 − 5b)', '4 - 10b - 10b + 25b^2'),
          makeStep('combine', 'Combine like terms', '25b^2 - 20b + 4', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(4 - 3y)^2',
        steps: [
          makeStep('expand', 'Expand (4 − 3y)(4 − 3y)', '16 - 12y - 12y + 9y^2'),
          makeStep('combine', 'Combine like terms', '9y^2 - 24y + 16', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '118a',
    'Level 2',
    'Square of a two-variable binomial',
    '(3g - 7h)^2',
    [
      makeStep('expand', 'Expand (3g − 7h)(3g − 7h)', '9g^2 - 21gh - 21gh + 49h^2'),
      makeStep('combine', 'Combine like terms', '9g^2 - 42gh + 49h^2', { requireExpanded: true, hint: '−21gh − 21gh = −42gh.' }),
    ],
    [
      {
        promptEq: '(2g - 5h)^2',
        steps: [
          makeStep('expand', 'Expand (2g − 5h)(2g − 5h)', '4g^2 - 10gh - 10gh + 25h^2'),
          makeStep('combine', 'Combine like terms', '4g^2 - 20gh + 25h^2', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(4a - 3b)^2',
        steps: [
          makeStep('expand', 'Expand (4a − 3b)(4a − 3b)', '16a^2 - 12ab - 12ab + 9b^2'),
          makeStep('combine', 'Combine like terms', '16a^2 - 24ab + 9b^2', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '118b',
    'Level 2',
    'Square of a two-variable binomial',
    '(-5x + 2y)^2',
    [
      makeStep('expand', 'Expand (−5x + 2y)(−5x + 2y)', '25x^2 - 10xy - 10xy + 4y^2'),
      makeStep('combine', 'Combine like terms', '25x^2 - 20xy + 4y^2', { requireExpanded: true, hint: '(−5x)(2y) = −10xy, doubled to −20xy.' }),
    ],
    [
      {
        promptEq: '(-4x + 3y)^2',
        steps: [
          makeStep('expand', 'Expand (−4x + 3y)(−4x + 3y)', '16x^2 - 12xy - 12xy + 9y^2'),
          makeStep('combine', 'Combine like terms', '16x^2 - 24xy + 9y^2', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(-3m + 5n)^2',
        steps: [
          makeStep('expand', 'Expand (−3m + 5n)(−3m + 5n)', '9m^2 - 15mn - 15mn + 25n^2'),
          makeStep('combine', 'Combine like terms', '9m^2 - 30mn + 25n^2', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '119a',
    'Level 2',
    'Negative sign × binomial product',
    '-(2 - 7p)(p + 1)',
    [
      makeStep('expand', 'Expand the two brackets inside −( ... )', '-(2 - 5p - 7p^2)', { hint: '(2 − 7p)(p + 1) = 2p + 2 − 7p^2 − 7p = 2 − 5p − 7p^2.' }),
      makeStep('combine', 'Distribute the minus sign and simplify', '7p^2 + 5p - 2', { requireExpanded: true, hint: '−(2 − 5p − 7p^2) = 7p^2 + 5p − 2.' }),
    ],
    [
      {
        promptEq: '-(3 - 5p)(p + 2)',
        steps: [
          makeStep('expand', 'Expand the brackets inside −( ... )', '-(6 + p - 5p^2)'),
          makeStep('combine', 'Distribute the minus sign', '5p^2 - p - 6', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '-(1 - 4x)(x + 3)',
        steps: [
          makeStep('expand', 'Expand the brackets inside −( ... )', '-(3 - 11x - 4x^2)'),
          makeStep('combine', 'Distribute the minus sign', '4x^2 + 11x - 3', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '119b',
    'Level 2',
    'Constant × binomial product',
    '5(7q + 9)(4q - 3)',
    [
      makeStep('expand', 'Expand the two binomial brackets first', '5(28q^2 + 15q - 27)', { hint: '28q^2 − 21q + 36q − 27 = 28q^2 + 15q − 27.' }),
      makeStep('combine', 'Multiply every term by 5', '140q^2 + 75q - 135', { requireExpanded: true, hint: '5×28 = 140, 5×15 = 75, 5×(−27) = −135.' }),
    ],
    [
      {
        promptEq: '3(5q + 4)(2q - 1)',
        steps: [
          makeStep('expand', 'Expand the two binomials first', '3(10q^2 + 3q - 4)'),
          makeStep('combine', 'Multiply every term by 3', '30q^2 + 9q - 12', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '4(3a + 5)(2a - 3)',
        steps: [
          makeStep('expand', 'Expand the two binomials first', '4(6a^2 + a - 15)'),
          makeStep('combine', 'Multiply every term by 4', '24a^2 + 4a - 60', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '120a',
    'Level 2',
    'Binomial × quadratic trinomial',
    '(2a + 1)(4a^2 + a - 5)',
    [
      makeStep('expand', 'Multiply 2a and 1 across the trinomial', '8a^3 + 2a^2 - 10a + 4a^2 + a - 5'),
      makeStep('combine', 'Combine like terms', '8a^3 + 6a^2 - 9a - 5', { requireExpanded: true, hint: 'a^2: 2 + 4 = 6; a: −10 + 1 = −9.' }),
    ],
    [
      {
        promptEq: '(3a + 1)(2a^2 + a - 4)',
        steps: [
          makeStep('expand', 'Expand product', '6a^3 + 3a^2 - 12a + 2a^2 + a - 4'),
          makeStep('combine', 'Combine like terms', '6a^3 + 5a^2 - 11a - 4', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(2x + 3)(x^2 + 2x - 1)',
        steps: [
          makeStep('expand', 'Expand product', '2x^3 + 4x^2 - 2x + 3x^2 + 6x - 3'),
          makeStep('combine', 'Combine like terms', '2x^3 + 7x^2 + 4x - 3', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '120b',
    'Level 2',
    'Quadratic trinomial × binomial',
    '(5b^2 - 3b - 6)(b + 1)',
    [
      makeStep('expand', 'Multiply every term in the trinomial by b and by 1', '5b^3 + 5b^2 - 3b^2 - 3b - 6b - 6'),
      makeStep('combine', 'Combine like terms', '5b^3 + 2b^2 - 9b - 6', { requireExpanded: true, hint: 'b^2: 5 − 3 = 2; b: −3 − 6 = −9.' }),
    ],
    [
      {
        promptEq: '(4b^2 - 2b - 5)(b + 1)',
        steps: [
          makeStep('expand', 'Expand product', '4b^3 + 4b^2 - 2b^2 - 2b - 5b - 5'),
          makeStep('combine', 'Combine like terms', '4b^3 + 2b^2 - 7b - 5', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(3y^2 - 4y - 2)(y + 2)',
        steps: [
          makeStep('expand', 'Expand product', '3y^3 + 6y^2 - 4y^2 - 8y - 2y - 4'),
          makeStep('combine', 'Combine like terms', '3y^3 + 2y^2 - 10y - 4', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '121a',
    'Level 2',
    'Degree-4 polynomial expansion',
    '(9x^2 - 5x)(-5x^2 + 10x - 1)',
    [
      makeStep('expand', 'Multiply 9x^2 and −5x across the trinomial', '-45x^4 + 90x^3 - 9x^2 + 25x^3 - 50x^2 + 5x'),
      makeStep('combine', 'Combine like terms', '-45x^4 + 115x^3 - 59x^2 + 5x', { requireExpanded: true, hint: 'x^3: 90 + 25 = 115; x^2: −9 − 50 = −59.' }),
    ],
    [
      {
        promptEq: '(4x^2 - 3x)(-2x^2 + 5x - 1)',
        steps: [
          makeStep('expand', 'Expand product', '-8x^4 + 20x^3 - 4x^2 + 6x^3 - 15x^2 + 3x'),
          makeStep('combine', 'Combine like terms', '-8x^4 + 26x^3 - 19x^2 + 3x', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(3a^2 - 2a)(-4a^2 + 3a - 2)',
        steps: [
          makeStep('expand', 'Expand product', '-12a^4 + 9a^3 - 6a^2 + 8a^3 - 6a^2 + 4a'),
          makeStep('combine', 'Combine like terms', '-12a^4 + 17a^3 - 12a^2 + 4a', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '121b',
    'Level 2',
    'Cancelling terms in expansion',
    '(x^2 + 4x + 8)(2x - x^2)',
    [
      makeStep('expand', 'Multiply each term of the trinomial by 2x and −x^2', '2x^3 - x^4 + 8x^2 - 4x^3 + 16x - 8x^2'),
      makeStep('combine', 'Combine like terms (note 8x^2 − 8x^2 cancels!)', '-x^4 - 2x^3 + 16x', { requireExpanded: true, hint: 'x^3: 2 − 4 = −2; x^2: 8 − 8 = 0.' }),
    ],
    [
      {
        promptEq: '(x^2 + 3x + 9)(3x - x^2)',
        steps: [
          makeStep('expand', 'Expand product', '3x^3 - x^4 + 9x^2 - 3x^3 + 27x - 9x^2'),
          makeStep('combine', 'Combine like terms', '-x^4 + 27x', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(y^2 + 2y + 4)(2y - y^2)',
        steps: [
          makeStep('expand', 'Expand product', '2y^3 - y^4 + 4y^2 - 2y^3 + 8y - 4y^2'),
          makeStep('combine', 'Combine like terms', '-y^4 + 8y', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '122a',
    'Level 2',
    'Two-variable cubic expansion',
    '(2h - k)(4h^2 + hk - k^2)',
    [
      makeStep('expand', 'Multiply 2h and −k across the trinomial', '8h^3 + 2h^2k - 2hk^2 - 4h^2k - hk^2 + k^3'),
      makeStep('combine', 'Combine like terms', '8h^3 - 2h^2k - 3hk^2 + k^3', { requireExpanded: true, hint: 'h^2k: 2 − 4 = −2; hk^2: −2 − 1 = −3.' }),
    ],
    [
      {
        promptEq: '(3h - k)(2h^2 + hk - k^2)',
        steps: [
          makeStep('expand', 'Expand product', '6h^3 + 3h^2k - 3hk^2 - 2h^2k - hk^2 + k^3'),
          makeStep('combine', 'Combine like terms', '6h^3 + h^2k - 4hk^2 + k^3', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(2a - b)(3a^2 + 2ab - b^2)',
        steps: [
          makeStep('expand', 'Expand product', '6a^3 + 4a^2b - 2ab^2 - 3a^2b - 2ab^2 + b^3'),
          makeStep('combine', 'Combine like terms', '6a^3 + a^2b - 4ab^2 + b^3', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec4Item(
    '122b',
    'Level 2',
    'Two-variable cubic expansion',
    '(3p^2 + pq - 2q^2)(p - q)',
    [
      makeStep('expand', 'Multiply each term in the trinomial by p and −q', '3p^3 - 3p^2q + p^2q - pq^2 - 2pq^2 + 2q^3'),
      makeStep('combine', 'Combine like terms', '3p^3 - 2p^2q - 3pq^2 + 2q^3', { requireExpanded: true, hint: 'p^2q: −3 + 1 = −2; pq^2: −1 − 2 = −3.' }),
    ],
    [
      {
        promptEq: '(2p^2 + pq - 3q^2)(p - q)',
        steps: [
          makeStep('expand', 'Expand product', '2p^3 - 2p^2q + p^2q - pq^2 - 3pq^2 + 3q^3'),
          makeStep('combine', 'Combine like terms', '2p^3 - p^2q - 4pq^2 + 3q^3', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(4x^2 + xy - 2y^2)(x - y)',
        steps: [
          makeStep('expand', 'Expand product', '4x^3 - 4x^2y + x^2y - xy^2 - 2xy^2 + 2y^3'),
          makeStep('combine', 'Combine like terms', '4x^3 - 3x^2y - 3xy^2 + 2y^3', { requireExpanded: true }),
        ],
      },
    ],
  ),

  // ── Level 3: Expand, Simplify & Descending Powers of x (Q123–Q124) ──
  sec4Item(
    '123',
    'Level 3',
    'Mixed product difference (descending x)',
    'x(9x - 8) - (x + 1)(6x - 5)',
    [
      makeStep('expand', 'Expand x(9x − 8) and −(x + 1)(6x − 5) carefully', '9x^2 - 8x - 6x^2 - x + 5', { hint: '(x + 1)(6x − 5) = 6x^2 + x − 5, so subtracting it gives −6x^2 − x + 5.' }),
      makeStep('combine', 'Combine like terms in descending powers of x', '3x^2 - 9x + 5', { requireExpanded: true, orderRule: descX, hint: 'x^2: 9 − 6 = 3; x: −8 − 1 = −9; constant: +5.' }),
    ],
    [
      {
        promptEq: 'x(8x - 5) - (x + 2)(5x - 3)',
        steps: [
          makeStep('expand', 'Expand both parts carefully', '8x^2 - 5x - 5x^2 - 7x + 6'),
          makeStep('combine', 'Combine like terms in descending powers of x', '3x^2 - 12x + 6', { requireExpanded: true, orderRule: descX }),
        ],
      },
      {
        promptEq: 'x(7x - 4) - (x + 1)(4x - 7)',
        steps: [
          makeStep('expand', 'Expand both parts carefully', '7x^2 - 4x - 4x^2 + 3x + 7'),
          makeStep('combine', 'Combine like terms in descending powers of x', '3x^2 - x + 7', { requireExpanded: true, orderRule: descX }),
        ],
      },
    ],
    { promptText: 'Expand, simplify, and arrange the terms in descending powers of x:' },
  ),
  sec4Item(
    '124',
    'Level 3',
    'Difference of squares sum (descending x)',
    '(7 - x)(7 + x) + (8x - 7)(7 + 8x)',
    [
      makeStep('expand', 'Expand both products', '49 - x^2 + 64x^2 - 49', { hint: '(7 − x)(7 + x) = 49 − x^2 and (8x − 7)(8x + 7) = 64x^2 − 49.' }),
      makeStep('combine', 'Combine like terms (49 − 49 cancels!)', '63x^2', { requireExpanded: true, orderRule: descX, hint: '−x^2 + 64x^2 = 63x^2 and 49 − 49 = 0.' }),
    ],
    [
      {
        promptEq: '(5 - x)(5 + x) + (6x - 5)(5 + 6x)',
        steps: [
          makeStep('expand', 'Expand both products', '25 - x^2 + 36x^2 - 25'),
          makeStep('combine', 'Combine like terms', '35x^2', { requireExpanded: true, orderRule: descX }),
        ],
      },
      {
        promptEq: '(4 - x)(4 + x) + (5x - 4)(4 + 5x)',
        steps: [
          makeStep('expand', 'Expand both products', '16 - x^2 + 25x^2 - 16'),
          makeStep('combine', 'Combine like terms', '24x^2', { requireExpanded: true, orderRule: descX }),
        ],
      },
    ],
    { promptText: 'Expand, simplify, and arrange the terms in descending powers of x:' },
  ),

  // ── Multiple Choice Questions: Q125–Q126 ──
  sec4Item(
    '125',
    'MCQ',
    'Polynomial expansion MCQ',
    '(7a^2 - 2a + 13) - 2(a^2 - 7a + 1)',
    [
      makeStep('mcq', 'Expand −2(a^2 − 7a + 1) and collect like terms', '5a^2 + 12a + 11', {
        hint: '7a^2 − 2a + 13 − 2a^2 + 14a − 2 = 5a^2 + 12a + 11.',
        wrongMoves: ['Forget to multiply −7a by −2', 'Multiply only the first term inside the bracket by −2'],
        mcqOptions: [
          { label: 'A', text: '5a^2 - 9a + 14' },
          { label: 'B', text: '5a^2 + 12a + 11' },
          { label: 'C', text: '5a^2 - 16a + 11' },
          { label: 'D', text: '6a^2 + 5a - 12' },
        ],
        correctMcq: 'B',
      }),
    ],
    [
      {
        promptEq: '(6a^2 - 3a + 10) - 2(a^2 - 5a + 2)',
        steps: [
          makeStep('mcq', 'Expand −2(a^2 − 5a + 2) and collect like terms', '4a^2 + 7a + 6', {
            mcqOptions: [
              { label: 'A', text: '4a^2 - 13a + 6' },
              { label: 'B', text: '4a^2 + 7a + 6' },
              { label: 'C', text: '4a^2 + 7a + 14' },
              { label: 'D', text: '5a^2 + 2a + 8' },
            ],
            correctMcq: 'B',
          }),
        ],
      },
    ],
    { promptText: 'Expand and simplify, then choose the correct option:' },
  ),
  sec4Item(
    '126',
    'MCQ',
    'HKDSE polynomial product MCQ',
    '(s + 1)(s^2 + s - 1)',
    [
      makeStep('mcq', 'Multiply s and 1 across (s^2 + s − 1) and combine like terms', 's^3 + 2s^2 - 1', {
        hint: '(s^3 + s^2 − s) + (s^2 + s − 1) = s^3 + 2s^2 − 1 (the −s and +s cancel!).',
        wrongMoves: ['Keep only s^3 − 1 without cross-terms', 'Add s and −s as −2s instead of 0'],
        mcqOptions: [
          { label: 'A', text: 's^3 - 1' },
          { label: 'B', text: 's^3 + 2s^2 - 1' },
          { label: 'C', text: 's^3 + s^2 - s - 1' },
          { label: 'D', text: 's^3 + 3s^2 - s - 1' },
        ],
        correctMcq: 'B',
      }),
    ],
    [
      {
        promptEq: '(t + 1)(t^2 + 2t - 1)',
        steps: [
          makeStep('mcq', 'Multiply t and 1 across (t^2 + 2t − 1) and combine', 't^3 + 3t^2 + t - 1', {
            mcqOptions: [
              { label: 'A', text: 't^3 + 2t^2 - 1' },
              { label: 'B', text: 't^3 + 3t^2 + t - 1' },
              { label: 'C', text: 't^3 + 3t^2 - t - 1' },
              { label: 'D', text: 't^3 + 2t^2 + t - 1' },
            ],
            correctMcq: 'B',
          }),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2015 (II) Q1', promptText: 'Expand and simplify, then choose the correct option:' },
  ),
];
