import { makeStep } from './stepHelpers';
import type { QuestionItem, QuestionLevel, QuestionVariant } from './types';

function s1(
  num: string,
  level: QuestionLevel,
  topicTag: string,
  promptEq: string,
  steps: QuestionVariant['steps'],
  sims: QuestionVariant[],
  opts?: { sourceTag?: string; promptText?: string },
): QuestionItem {
  return {
    id: `s1-q${num}`,
    numberLabel: `Q${num}`,
    sectionId: 'sec1',
    level,
    mode: 'expression',
    topicTag,
    sourceTag: opts?.sourceTag,
    promptEq,
    promptText: opts?.promptText || 'Simplify the algebraic fraction / expression:',
    steps,
    sims,
  };
}

export const SECTION_1_QUESTIONS: QuestionItem[] = [
  // ── Level 1: Q1–9 (Reducing Monomial Algebraic Fractions) ──
  s1(
    '1',
    'Level 1',
    'Reducing monomial fractions',
    '3/(21x)',
    [makeStep('simplify', 'Divide numerator and denominator by 3', '1/(7x)', { hint: 'Both 3 and 21 are divisible by 3. Keep x in the denominator.' })],
    [
      { promptEq: '4/(24x)', steps: [makeStep('simplify', 'Divide numerator and denominator by 4', '1/(6x)')] },
      { promptEq: '5/(35y)', steps: [makeStep('simplify', 'Divide numerator and denominator by 5', '1/(7y)')] },
    ],
  ),
  s1(
    '2',
    'Level 1',
    'Reducing monomial fractions',
    '(9xy)/(6xz)',
    [makeStep('simplify', 'Cancel common factor 3x from top and bottom', '(3y)/(2z)', { hint: 'H.C.F. of 9 and 6 is 3, and x appears in both numerator and denominator.' })],
    [
      { promptEq: '(8ab)/(12ac)', steps: [makeStep('simplify', 'Cancel common factor 4a from top and bottom', '(2b)/(3c)')] },
      { promptEq: '(10xy)/(15yz)', steps: [makeStep('simplify', 'Cancel common factor 5y from top and bottom', '(2x)/(3z)')] },
    ],
  ),
  s1(
    '3',
    'Level 1',
    'Reducing monomial fractions',
    '(4a^6)/(8a^3)',
    [makeStep('simplify', 'Divide by 4 and apply index law on a', 'a^3/2', { hint: '4/8 = 1/2, and a^6 ÷ a^3 = a^(6−3) = a^3.' })],
    [
      { promptEq: '(6b^7)/(12b^2)', steps: [makeStep('simplify', 'Divide by 6 and subtract powers of b', 'b^5/2')] },
      { promptEq: '(5m^8)/(15m^5)', steps: [makeStep('simplify', 'Divide by 5 and subtract powers of m', 'm^3/3')] },
    ],
  ),
  s1(
    '4',
    'Level 1',
    'Reducing monomial fractions',
    '(15b^3)/(5b^5)',
    [makeStep('simplify', 'Cancel 5b^3 from numerator and denominator', '3/b^2', { hint: '15 ÷ 5 = 3, and b^5 has 2 more factors of b than b^3.' })],
    [
      { promptEq: '(18x^2)/(6x^5)', steps: [makeStep('simplify', 'Cancel 6x^2 from numerator and denominator', '3/x^3')] },
      { promptEq: '(12k^4)/(4k^7)', steps: [makeStep('simplify', 'Cancel 4k^4 from numerator and denominator', '3/k^3')] },
    ],
  ),
  s1(
    '5',
    'Level 1',
    'Reducing monomial fractions',
    'm^9/(m^7n^8)',
    [makeStep('simplify', 'Cancel m^7 from numerator and denominator', 'm^2/n^8', { hint: 'Subtract powers of m: 9 − 7 = 2. Keep n^8 in the denominator.' })],
    [
      { promptEq: 'p^8/(p^5q^6)', steps: [makeStep('simplify', 'Cancel p^5 from numerator and denominator', 'p^3/q^6')] },
      { promptEq: 'a^10/(a^6b^4)', steps: [makeStep('simplify', 'Cancel a^6 from numerator and denominator', 'a^4/b^4')] },
    ],
  ),
  s1(
    '6',
    'Level 1',
    'Reducing monomial fractions',
    '(15ab^6)/(12a)',
    [makeStep('simplify', 'Cancel common factor 3a', '(5b^6)/4', { hint: '15/12 simplifies to 5/4, and a/a = 1.' })],
    [
      { promptEq: '(14xy^5)/(21x)', steps: [makeStep('simplify', 'Cancel common factor 7x', '(2y^5)/3')] },
      { promptEq: '(18mn^4)/(12m)', steps: [makeStep('simplify', 'Cancel common factor 6m', '(3n^4)/2')] },
    ],
  ),
  s1(
    '7',
    'Level 1',
    'Reducing monomial fractions',
    '(x^8y^6)/(x^5y^7)',
    [makeStep('simplify', 'Cancel x^5y^6 from numerator and denominator', 'x^3/y', { hint: 'x^8 ÷ x^5 = x^3 in the numerator; y^6 ÷ y^7 leaves y in the denominator.' })],
    [
      { promptEq: '(a^7b^4)/(a^4b^6)', steps: [makeStep('simplify', 'Cancel a^4b^4 from numerator and denominator', 'a^3/b^2')] },
      { promptEq: '(m^6n^3)/(m^2n^5)', steps: [makeStep('simplify', 'Cancel m^2n^3 from numerator and denominator', 'm^4/n^2')] },
    ],
  ),
  s1(
    '8',
    'Level 1',
    'Reducing monomial fractions',
    '(9m^2n^3)/(27mn^2)',
    [makeStep('simplify', 'Cancel common factor 9mn^2', '(mn)/3', { hint: '9/27 = 1/3, m^2/m = m, and n^3/n^2 = n.' })],
    [
      { promptEq: '(8a^3b^2)/(24a^2b)', steps: [makeStep('simplify', 'Cancel common factor 8a^2b', '(ab)/3')] },
      { promptEq: '(12x^2y^4)/(36xy^3)', steps: [makeStep('simplify', 'Cancel common factor 12xy^3', '(xy)/3')] },
    ],
  ),
  s1(
    '9',
    'Level 1',
    'Reducing monomial fractions',
    '(15rs^5)/(10r^3s^4)',
    [makeStep('simplify', 'Cancel common factor 5rs^4', '(3s)/(2r^2)', { hint: '15/10 = 3/2, s^5/s^4 = s on top, and r/r^3 = 1/r^2.' })],
    [
      { promptEq: '(12p^2q^5)/(8p^4q^3)', steps: [makeStep('simplify', 'Cancel common factor 4p^2q^3', '(3q^2)/(2p^2)')] },
      { promptEq: '(20xy^6)/(15x^3y^4)', steps: [makeStep('simplify', 'Cancel common factor 5xy^4', '(4y^2)/(3x^2)')] },
    ],
  ),

  // ── Level 1: Q10–18 (Factorizing & Cancelling Common Factors) ──
  s1(
    '10',
    'Level 1',
    'Common factor with brackets',
    '(a(x+5))/(a^3(x+5))',
    [makeStep('cancel', 'Cancel common factor a(x + 5)', '1/a^2', { hint: 'Cancel (x + 5) and divide a by a^3 to leave a^2 in the denominator.' })],
    [
      { promptEq: '(b(y-3))/(b^4(y-3))', steps: [makeStep('cancel', 'Cancel common factor b(y − 3)', '1/b^3')] },
      { promptEq: '(m^2(p+2))/(m^5(p+2))', steps: [makeStep('cancel', 'Cancel common factor m^2(p + 2)', '1/m^3')] },
    ],
  ),
  s1(
    '11',
    'Level 1',
    'Opposite sign binomials',
    '(10(1-k))/(a(k-1))',
    [
      makeStep('factor', 'Rewrite (1 − k) as −(k − 1)', '(-10(k-1))/(a(k-1))', { hint: 'Notice 1 − k = −(k − 1). Taking out −1 makes the brackets identical.' }),
      makeStep('cancel', 'Cancel the common factor (k − 1)', '-10/a'),
    ],
    [
      {
        promptEq: '(8(2-x))/(b(x-2))',
        steps: [
          makeStep('factor', 'Rewrite (2 − x) as −(x − 2)', '(-8(x-2))/(b(x-2))'),
          makeStep('cancel', 'Cancel the common factor (x − 2)', '-8/b'),
        ],
      },
      {
        promptEq: '(12(a-b))/(m(b-a))',
        steps: [
          makeStep('factor', 'Rewrite (a − b) as −(b − a)', '(-12(b-a))/(m(b-a))'),
          makeStep('cancel', 'Cancel the common factor (b − a)', '-12/m'),
        ],
      },
    ],
  ),
  s1(
    '12',
    'Level 1',
    'Factorize denominator',
    '8/(4x+8y)',
    [
      makeStep('factor', 'Factor out 4 in the denominator', '8/(4(x+2y))'),
      makeStep('cancel', 'Divide numerator and denominator by 4', '2/(x+2y)'),
    ],
    [
      {
        promptEq: '12/(6x+9y)',
        steps: [
          makeStep('factor', 'Factor out 3 in the denominator', '12/(3(2x+3y))'),
          makeStep('cancel', 'Divide numerator and denominator by 3', '4/(2x+3y)'),
        ],
      },
      {
        promptEq: '10/(5a-15b)',
        steps: [
          makeStep('factor', 'Factor out 5 in the denominator', '10/(5(a-3b))'),
          makeStep('cancel', 'Divide numerator and denominator by 5', '2/(a-3b)'),
        ],
      },
    ],
  ),
  s1(
    '13',
    'Level 1',
    'Factorize denominator',
    '(3x+2)/(15x+10)',
    [
      makeStep('factor', 'Factor out 5 in the denominator', '(3x+2)/(5(3x+2))'),
      makeStep('cancel', 'Cancel the common factor (3x + 2)', '1/5'),
    ],
    [
      {
        promptEq: '(2x+5)/(8x+20)',
        steps: [
          makeStep('factor', 'Factor out 4 in the denominator', '(2x+5)/(4(2x+5))'),
          makeStep('cancel', 'Cancel the common factor (2x + 5)', '1/4'),
        ],
      },
      {
        promptEq: '(4y-1)/(12y-3)',
        steps: [
          makeStep('factor', 'Factor out 3 in the denominator', '(4y-1)/(3(4y-1))'),
          makeStep('cancel', 'Cancel the common factor (4y − 1)', '1/3'),
        ],
      },
    ],
  ),
  s1(
    '14',
    'Level 1',
    'Factorize denominator',
    '(4p)/(4p+6p^2)',
    [
      makeStep('factor', 'Factor out 2p in the denominator', '(4p)/(2p(2+3p))'),
      makeStep('cancel', 'Cancel the common factor 2p', '2/(2+3p)'),
    ],
    [
      {
        promptEq: '(6x)/(6x+9x^2)',
        steps: [
          makeStep('factor', 'Factor out 3x in the denominator', '(6x)/(3x(2+3x))'),
          makeStep('cancel', 'Cancel the common factor 3x', '2/(2+3x)'),
        ],
      },
      {
        promptEq: '(10m)/(10m-15m^2)',
        steps: [
          makeStep('factor', 'Factor out 5m in the denominator', '(10m)/(5m(2-3m))'),
          makeStep('cancel', 'Cancel the common factor 5m', '2/(2-3m)'),
        ],
      },
    ],
  ),
  s1(
    '15',
    'Level 1',
    'Factorize numerator',
    '(y^2-2y)/(y-2)',
    [
      makeStep('factor', 'Factor out y in the numerator', '(y(y-2))/(y-2)'),
      makeStep('cancel', 'Cancel the common factor (y − 2)', 'y'),
    ],
    [
      {
        promptEq: '(x^2+5x)/(x+5)',
        steps: [
          makeStep('factor', 'Factor out x in the numerator', '(x(x+5))/(x+5)'),
          makeStep('cancel', 'Cancel the common factor (x + 5)', 'x'),
        ],
      },
      {
        promptEq: '(a^2-7a)/(a-7)',
        steps: [
          makeStep('factor', 'Factor out a in the numerator', '(a(a-7))/(a-7)'),
          makeStep('cancel', 'Cancel the common factor (a − 7)', 'a'),
        ],
      },
    ],
  ),
  s1(
    '16',
    'Level 1',
    'Factorize numerator and denominator',
    '(x^2-x)/(3x-3)',
    [
      makeStep('factor', 'Factorize both numerator and denominator', '(x(x-1))/(3(x-1))'),
      makeStep('cancel', 'Cancel the common factor (x − 1)', 'x/3'),
    ],
    [
      {
        promptEq: '(y^2-y)/(5y-5)',
        steps: [
          makeStep('factor', 'Factorize both numerator and denominator', '(y(y-1))/(5(y-1))'),
          makeStep('cancel', 'Cancel the common factor (y − 1)', 'y/5'),
        ],
      },
      {
        promptEq: '(m^2+m)/(4m+4)',
        steps: [
          makeStep('factor', 'Factorize both numerator and denominator', '(m(m+1))/(4(m+1))'),
          makeStep('cancel', 'Cancel the common factor (m + 1)', 'm/4'),
        ],
      },
    ],
  ),
  s1(
    '17',
    'Level 1',
    'Factorize numerator and denominator',
    '(2x+8)/(5x^2+20x)',
    [
      makeStep('factor', 'Factorize both numerator and denominator', '(2(x+4))/(5x(x+4))'),
      makeStep('cancel', 'Cancel the common factor (x + 4)', '2/(5x)'),
    ],
    [
      {
        promptEq: '(3x+12)/(4x^2+16x)',
        steps: [
          makeStep('factor', 'Factorize both numerator and denominator', '(3(x+4))/(4x(x+4))'),
          makeStep('cancel', 'Cancel the common factor (x + 4)', '3/(4x)'),
        ],
      },
      {
        promptEq: '(5y-10)/(3y^2-6y)',
        steps: [
          makeStep('factor', 'Factorize both numerator and denominator', '(5(y-2))/(3y(y-2))'),
          makeStep('cancel', 'Cancel the common factor (y − 2)', '5/(3y)'),
        ],
      },
    ],
  ),
  s1(
    '18',
    'Level 1',
    'Factorize numerator and denominator',
    '(2a-6)/(3ab-9b)',
    [
      makeStep('factor', 'Factorize both numerator and denominator', '(2(a-3))/(3b(a-3))'),
      makeStep('cancel', 'Cancel the common factor (a − 3)', '2/(3b)'),
    ],
    [
      {
        promptEq: '(4p-8)/(5pq-10q)',
        steps: [
          makeStep('factor', 'Factorize both numerator and denominator', '(4(p-2))/(5q(p-2))'),
          makeStep('cancel', 'Cancel the common factor (p − 2)', '4/(5q)'),
        ],
      },
      {
        promptEq: '(3x+12)/(7xy+28y)',
        steps: [
          makeStep('factor', 'Factorize both numerator and denominator', '(3(x+4))/(7y(x+4))'),
          makeStep('cancel', 'Cancel the common factor (x + 4)', '3/(7y)'),
        ],
      },
    ],
  ),

  // ── Level 1: Q19–26 (Multiplication & Division of Monomial Fractions) ──
  s1(
    '19',
    'Level 1',
    'Multiplication of fractions',
    '(4a)*(1/(2a^2))',
    [makeStep('multiply', 'Multiply and cancel common factor 2a', '2/a')],
    [
      { promptEq: '(6x)*(1/(3x^2))', steps: [makeStep('multiply', 'Multiply and cancel common factor 3x', '2/x')] },
      { promptEq: '(9y)*(1/(6y^3))', steps: [makeStep('multiply', 'Multiply and cancel common factor 3y', '3/(2y^2)')] },
    ],
  ),
  s1(
    '20',
    'Level 1',
    'Multiplication of fractions',
    '(x^2/y)*(y^3/x)',
    [makeStep('multiply', 'Multiply fractions and cancel common factors x and y', 'xy^2')],
    [
      { promptEq: '(a^3/b)*(b^4/a)', steps: [makeStep('multiply', 'Multiply and cancel common factors a and b', 'a^2b^3')] },
      { promptEq: '(m^4/n^2)*(n^5/m)', steps: [makeStep('multiply', 'Multiply and cancel common factors m and n^2', 'm^3n^3')] },
    ],
    { sourceTag: '~TSA 2021' },
  ),
  s1(
    '21',
    'Level 1',
    'Multiplication of fractions',
    '(8m^3/n^2)*((3n)/(6m^6))',
    [
      makeStep('multiply', 'Combine into a single fraction', '(24m^3n)/(6m^6n^2)'),
      makeStep('cancel', 'Cancel common factor 6m^3n', '4/(m^3n)'),
    ],
    [
      {
        promptEq: '(9a^2/b^3)*((4b)/(6a^5))',
        steps: [
          makeStep('multiply', 'Combine into a single fraction', '(36a^2b)/(6a^5b^3)'),
          makeStep('cancel', 'Cancel common factor 6a^2b', '6/(a^3b^2)'),
        ],
      },
      {
        promptEq: '(10x^3/y^4)*((3y)/(5x^5))',
        steps: [
          makeStep('multiply', 'Combine into a single fraction', '(30x^3y)/(5x^5y^4)'),
          makeStep('cancel', 'Cancel common factor 5x^3y', '6/(x^2y^3)'),
        ],
      },
    ],
    { sourceTag: '~TSA 2023' },
  ),
  s1(
    '22',
    'Level 1',
    'Multiplication of fractions',
    '((4x^5)/(3y^2))*((6y^4)/(9x^2))',
    [
      makeStep('multiply', 'Combine into a single fraction', '(24x^5y^4)/(27x^2y^2)'),
      makeStep('cancel', 'Cancel common factor 3x^2y^2', '(8x^3y^2)/9'),
    ],
    [
      {
        promptEq: '((5a^4)/(2b^3))*((4b^5)/(15a^2))',
        steps: [
          makeStep('multiply', 'Combine into a single fraction', '(20a^4b^5)/(30a^2b^3)'),
          makeStep('cancel', 'Cancel common factor 10a^2b^3', '(2a^2b^2)/3'),
        ],
      },
      {
        promptEq: '((3m^6)/(4n^2))*((8n^5)/(9m^3))',
        steps: [
          makeStep('multiply', 'Combine into a single fraction', '(24m^6n^5)/(36m^3n^2)'),
          makeStep('cancel', 'Cancel common factor 12m^3n^2', '(2m^3n^3)/3'),
        ],
      },
    ],
    { sourceTag: '~TSA 2023' },
  ),
  s1(
    '23',
    'Level 1',
    'Division of fractions',
    '(m^4/n^7)÷(m/n^3)',
    [
      makeStep('invert', 'Invert the divisor and change ÷ to ×', '(m^4/n^7)*(n^3/m)'),
      makeStep('cancel', 'Cancel common factors m and n^3', 'm^3/n^4'),
    ],
    [
      {
        promptEq: '(x^5/y^6)÷(x^2/y^2)',
        steps: [
          makeStep('invert', 'Invert the divisor and change ÷ to ×', '(x^5/y^6)*(y^2/x^2)'),
          makeStep('cancel', 'Cancel common factors x^2 and y^2', 'x^3/y^4'),
        ],
      },
      {
        promptEq: '(a^6/b^8)÷(a^2/b^3)',
        steps: [
          makeStep('invert', 'Invert the divisor and change ÷ to ×', '(a^6/b^8)*(b^3/a^2)'),
          makeStep('cancel', 'Cancel common factors a^2 and b^3', 'a^4/b^5'),
        ],
      },
    ],
  ),
  s1(
    '24',
    'Level 1',
    'Division of fractions',
    '(r^5/s^3)÷(r^7/s^3)',
    [
      makeStep('invert', 'Invert the divisor and change ÷ to ×', '(r^5/s^3)*(s^3/r^7)'),
      makeStep('cancel', 'Cancel common factors r^5 and s^3', '1/r^2'),
    ],
    [
      {
        promptEq: '(x^4/y^5)÷(x^6/y^5)',
        steps: [
          makeStep('invert', 'Invert the divisor and change ÷ to ×', '(x^4/y^5)*(y^5/x^6)'),
          makeStep('cancel', 'Cancel common factors x^4 and y^5', '1/x^2'),
        ],
      },
      {
        promptEq: '(p^3/q^4)÷(p^6/q^4)',
        steps: [
          makeStep('invert', 'Invert the divisor and change ÷ to ×', '(p^3/q^4)*(q^4/p^6)'),
          makeStep('cancel', 'Cancel common factors p^3 and q^4', '1/p^3'),
        ],
      },
    ],
  ),
  s1(
    '25',
    'Level 1',
    'Division of fractions',
    '(x^2/(10y^3))÷(x/(5y))',
    [
      makeStep('invert', 'Invert the divisor and change ÷ to ×', '(x^2/(10y^3))*((5y)/x)'),
      makeStep('cancel', 'Cancel common factor 5xy', 'x/(2y^2)'),
    ],
    [
      {
        promptEq: '(a^3/(12b^4))÷(a/(4b))',
        steps: [
          makeStep('invert', 'Invert the divisor and change ÷ to ×', '(a^3/(12b^4))*((4b)/a)'),
          makeStep('cancel', 'Cancel common factor 4ab', 'a^2/(3b^3)'),
        ],
      },
      {
        promptEq: '(m^2/(15n^4))÷(m/(3n^2))',
        steps: [
          makeStep('invert', 'Invert the divisor and change ÷ to ×', '(m^2/(15n^4))*((3n^2)/m)'),
          makeStep('cancel', 'Cancel common factor 3mn^2', 'm/(5n^2)'),
        ],
      },
    ],
  ),
  s1(
    '26',
    'Level 1',
    'Division of fractions',
    '((14x^4)/y^2)÷(7/(2xy^3))',
    [
      makeStep('invert', 'Invert the divisor and change ÷ to ×', '((14x^4)/y^2)*((2xy^3)/7)'),
      makeStep('cancel', 'Multiply and cancel 7y^2', '4x^5y'),
    ],
    [
      {
        promptEq: '((12a^3)/b^2)÷(4/(3ab^4))',
        steps: [
          makeStep('invert', 'Invert the divisor and change ÷ to ×', '((12a^3)/b^2)*((3ab^4)/4)'),
          makeStep('cancel', 'Multiply and cancel 4b^2', '9a^4b^2'),
        ],
      },
      {
        promptEq: '((10m^2)/n^3)÷(5/(2mn^4))',
        steps: [
          makeStep('invert', 'Invert the divisor and change ÷ to ×', '((10m^2)/n^3)*((2mn^4)/5)'),
          makeStep('cancel', 'Multiply and cancel 5n^3', '4m^3n'),
        ],
      },
    ],
  ),

  // ── Level 1: Q27–30 (Multiplication & Division with Brackets) ──
  s1(
    '27',
    'Level 1',
    'Multiplying algebraic fractions',
    '((a+3b)/(3a))*(6/(b(a+3b)))',
    [
      makeStep('cancel', 'Cancel common factor (a + 3b) and 3', '2/(ab)', { hint: 'Cancel (a + 3b) across numerator and denominator, and 6/3 = 2.' }),
    ],
    [
      { promptEq: '((x+2y)/(4x))*(8/(y(x+2y)))', steps: [makeStep('cancel', 'Cancel common factor (x + 2y) and 4', '2/(xy)')] },
      { promptEq: '((m-5n)/(5m))*(15/(n(m-5n)))', steps: [makeStep('cancel', 'Cancel common factor (m − 5n) and 5', '3/(mn)')] },
    ],
  ),
  s1(
    '28',
    'Level 1',
    'Multiplying algebraic fractions',
    '((8xy)/(4x(x-y)))*((2(x-y))/(5y^4))',
    [
      makeStep('cancel', 'Cancel (x − y) and 4x first', '(2y)*((2)/(5y^4))'),
      makeStep('simplify', 'Multiply and cancel y', '4/(5y^3)'),
    ],
    [
      {
        promptEq: '((9ab)/(3a(a-b)))*((2(a-b))/(5b^3))',
        steps: [
          makeStep('cancel', 'Cancel (a − b) and 3a first', '(3b)*(2/(5b^3))'),
          makeStep('simplify', 'Multiply and cancel b', '6/(5b^2)'),
        ],
      },
      {
        promptEq: '((6xy)/(2x(x+y)))*((3(x+y))/(7y^3))',
        steps: [
          makeStep('cancel', 'Cancel (x + y) and 2x first', '(3y)*(3/(7y^3))'),
          makeStep('simplify', 'Multiply and cancel y', '9/(7y^2)'),
        ],
      },
    ],
  ),
  s1(
    '29',
    'Level 1',
    'Dividing algebraic fractions',
    '((7x^2)/(y+x))÷((14x^3)/(x+y))',
    [
      makeStep('invert', 'Invert the divisor and change ÷ to ×', '((7x^2)/(y+x))*((x+y)/(14x^3))'),
      makeStep('cancel', 'Cancel (x + y) and 7x^2 (note y + x = x + y)', '1/(2x)'),
    ],
    [
      {
        promptEq: '((5a^3)/(b+a))÷((15a^4)/(a+b))',
        steps: [
          makeStep('invert', 'Invert the divisor and change ÷ to ×', '((5a^3)/(b+a))*((a+b)/(15a^4))'),
          makeStep('cancel', 'Cancel (a + b) and 5a^3', '1/(3a)'),
        ],
      },
      {
        promptEq: '((6m^2)/(n+m))÷((18m^4)/(m+n))',
        steps: [
          makeStep('invert', 'Invert the divisor and change ÷ to ×', '((6m^2)/(n+m))*((m+n)/(18m^4))'),
          makeStep('cancel', 'Cancel (m + n) and 6m^2', '1/(3m^2)'),
        ],
      },
    ],
  ),
  s1(
    '30',
    'Level 1',
    'Dividing with opposite-sign factors',
    '((k-2)/(4k^5))÷((2-k)/(2k^3))',
    [
      makeStep('invert', 'Invert the divisor and change ÷ to ×', '((k-2)/(4k^5))*((2k^3)/(2-k))'),
      makeStep('cancel', 'Cancel 2k^3 and note (k − 2)/(2 − k) = −1', '-1/(2k^2)', { hint: 'Since 2 − k = −(k − 2), cancelling (k − 2) leaves a negative sign.' }),
    ],
    [
      {
        promptEq: '((x-3)/(6x^4))÷((3-x)/(2x^2))',
        steps: [
          makeStep('invert', 'Invert the divisor and change ÷ to ×', '((x-3)/(6x^4))*((2x^2)/(3-x))'),
          makeStep('cancel', 'Cancel 2x^2 and note (x − 3)/(3 − x) = −1', '-1/(3x^2)'),
        ],
      },
      {
        promptEq: '((a-5)/(9a^5))÷((5-a)/(3a^2))',
        steps: [
          makeStep('invert', 'Invert the divisor and change ÷ to ×', '((a-5)/(9a^5))*((3a^2)/(5-a))'),
          makeStep('cancel', 'Cancel 3a^2 and note (a − 5)/(5 − a) = −1', '-1/(3a^3)'),
        ],
      },
    ],
  ),

  // ── Level 1: Q31–42 (Addition & Subtraction of Fractions with Monomial Denominators) ──
  s1(
    '31',
    'Level 1',
    'Same denominator addition',
    '1/y+2/y',
    [makeStep('combine', 'Add the numerators over the common denominator y', '3/y')],
    [
      { promptEq: '2/x+5/x', steps: [makeStep('combine', 'Add the numerators over x', '7/x')] },
      { promptEq: '3/a+4/a', steps: [makeStep('combine', 'Add the numerators over a', '7/a')] },
    ],
  ),
  s1(
    '32',
    'Level 1',
    'Finding L.C.M. of denominators',
    '1/(4x)+2/x',
    [
      makeStep('lcd', 'Convert 2/x to common denominator 4x', '1/(4x)+8/(4x)'),
      makeStep('combine', 'Add the numerators', '9/(4x)'),
    ],
    [
      {
        promptEq: '1/(3x)+2/x',
        steps: [
          makeStep('lcd', 'Convert 2/x to common denominator 3x', '1/(3x)+6/(3x)'),
          makeStep('combine', 'Add the numerators', '7/(3x)'),
        ],
      },
      {
        promptEq: '3/(5y)+1/y',
        steps: [
          makeStep('lcd', 'Convert 1/y to common denominator 5y', '3/(5y)+5/(5y)'),
          makeStep('combine', 'Add the numerators', '8/(5y)'),
        ],
      },
    ],
    { sourceTag: '~TSA 2023' },
  ),
  s1(
    '33',
    'Level 1',
    'Finding L.C.M. of denominators',
    '(4y)/x+y/(3x)',
    [
      makeStep('lcd', 'Convert to common denominator 3x', '(12y)/(3x)+y/(3x)'),
      makeStep('combine', 'Add the numerators', '(13y)/(3x)'),
    ],
    [
      {
        promptEq: '(2y)/x+y/(4x)',
        steps: [
          makeStep('lcd', 'Convert to common denominator 4x', '(8y)/(4x)+y/(4x)'),
          makeStep('combine', 'Add the numerators', '(9y)/(4x)'),
        ],
      },
      {
        promptEq: '(3a)/b+a/(5b)',
        steps: [
          makeStep('lcd', 'Convert to common denominator 5b', '(15a)/(5b)+a/(5b)'),
          makeStep('combine', 'Add the numerators', '(16a)/(5b)'),
        ],
      },
    ],
  ),
  s1(
    '34',
    'Level 1',
    'Different variable denominators',
    '2/x+1/y',
    [
      makeStep('lcd', 'Convert both fractions to common denominator xy', '(2y)/(xy)+x/(xy)'),
      makeStep('combine', 'Combine over xy', '(2y+x)/(xy)'),
    ],
    [
      {
        promptEq: '3/a+1/b',
        steps: [
          makeStep('lcd', 'Convert to common denominator ab', '(3b)/(ab)+a/(ab)'),
          makeStep('combine', 'Combine over ab', '(3b+a)/(ab)'),
        ],
      },
      {
        promptEq: '4/m+3/n',
        steps: [
          makeStep('lcd', 'Convert to common denominator mn', '(4n)/(mn)+(3m)/(mn)'),
          makeStep('combine', 'Combine over mn', '(4n+3m)/(mn)'),
        ],
      },
    ],
  ),
  s1(
    '35',
    'Level 1',
    'Common denominator with products',
    '3/(2m)+5/(mn)',
    [
      makeStep('lcd', 'Convert to L.C.M. denominator 2mn', '(3n)/(2mn)+10/(2mn)'),
      makeStep('combine', 'Combine the numerators', '(3n+10)/(2mn)'),
    ],
    [
      {
        promptEq: '4/(3a)+1/(ab)',
        steps: [
          makeStep('lcd', 'Convert to L.C.M. denominator 3ab', '(4b)/(3ab)+3/(3ab)'),
          makeStep('combine', 'Combine the numerators', '(4b+3)/(3ab)'),
        ],
      },
      {
        promptEq: '5/(2x)+3/(xy)',
        steps: [
          makeStep('lcd', 'Convert to L.C.M. denominator 2xy', '(5y)/(2xy)+6/(2xy)'),
          makeStep('combine', 'Combine the numerators', '(5y+6)/(2xy)'),
        ],
      },
    ],
  ),
  s1(
    '36',
    'Level 1',
    'L.C.M. of two different denominators',
    '2/(3x)+3/(4y)',
    [
      makeStep('lcd', 'Convert to common denominator 12xy', '(8y)/(12xy)+(9x)/(12xy)'),
      makeStep('combine', 'Combine over 12xy', '(8y+9x)/(12xy)'),
    ],
    [
      {
        promptEq: '3/(2x)+1/(5y)',
        steps: [
          makeStep('lcd', 'Convert to common denominator 10xy', '(15y)/(10xy)+(2x)/(10xy)'),
          makeStep('combine', 'Combine over 10xy', '(15y+2x)/(10xy)'),
        ],
      },
      {
        promptEq: '4/(3a)+5/(2b)',
        steps: [
          makeStep('lcd', 'Convert to common denominator 6ab', '(8b)/(6ab)+(15a)/(6ab)'),
          makeStep('combine', 'Combine over 6ab', '(8b+15a)/(6ab)'),
        ],
      },
    ],
  ),
  s1(
    '37',
    'Level 1',
    'Same denominator subtraction',
    '3/(4x)-1/(4x)',
    [
      makeStep('combine', 'Subtract numerators over 4x', '2/(4x)'),
      makeStep('simplify', 'Reduce by dividing top and bottom by 2', '1/(2x)'),
    ],
    [
      {
        promptEq: '5/(6y)-1/(6y)',
        steps: [
          makeStep('combine', 'Subtract numerators over 6y', '4/(6y)'),
          makeStep('simplify', 'Reduce by dividing by 2', '2/(3y)'),
        ],
      },
      {
        promptEq: '7/(10a)-2/(10a)',
        steps: [
          makeStep('combine', 'Subtract numerators over 10a', '5/(10a)'),
          makeStep('simplify', 'Reduce by dividing by 5', '1/(2a)'),
        ],
      },
    ],
  ),
  s1(
    '38',
    'Level 1',
    'Subtracting with L.C.M.',
    '5/(6p)-3/(4p)',
    [
      makeStep('lcd', 'Convert to L.C.M. denominator 12p', '10/(12p)-9/(12p)'),
      makeStep('combine', 'Subtract the numerators', '1/(12p)'),
    ],
    [
      {
        promptEq: '7/(8p)-3/(4p)',
        steps: [
          makeStep('lcd', 'Convert to L.C.M. denominator 8p', '7/(8p)-6/(8p)'),
          makeStep('combine', 'Subtract the numerators', '1/(8p)'),
        ],
      },
      {
        promptEq: '5/(6m)-2/(9m)',
        steps: [
          makeStep('lcd', 'Convert to L.C.M. denominator 18m', '15/(18m)-4/(18m)'),
          makeStep('combine', 'Subtract the numerators', '11/(18m)'),
        ],
      },
    ],
    { sourceTag: '~TSA 2019' },
  ),
  s1(
    '39',
    'Level 1',
    'Subtracting with L.C.M.',
    'n/(4m)-n/(6m)',
    [
      makeStep('lcd', 'Convert to L.C.M. denominator 12m', '(3n)/(12m)-(2n)/(12m)'),
      makeStep('combine', 'Subtract the numerators', 'n/(12m)'),
    ],
    [
      {
        promptEq: 'x/(3y)-x/(5y)',
        steps: [
          makeStep('lcd', 'Convert to L.C.M. denominator 15y', '(5x)/(15y)-(3x)/(15y)'),
          makeStep('combine', 'Subtract the numerators', '(2x)/(15y)'),
        ],
      },
      {
        promptEq: 'a/(2b)-a/(8b)',
        steps: [
          makeStep('lcd', 'Convert to L.C.M. denominator 8b', '(4a)/(8b)-a/(8b)'),
          makeStep('combine', 'Subtract the numerators', '(3a)/(8b)'),
        ],
      },
    ],
  ),
  s1(
    '40',
    'Level 1',
    'Different variable subtraction',
    '3/x-1/y',
    [
      makeStep('lcd', 'Convert to common denominator xy', '(3y)/(xy)-x/(xy)'),
      makeStep('combine', 'Combine over xy', '(3y-x)/(xy)'),
    ],
    [
      {
        promptEq: '5/a-2/b',
        steps: [
          makeStep('lcd', 'Convert to common denominator ab', '(5b)/(ab)-(2a)/(ab)'),
          makeStep('combine', 'Combine over ab', '(5b-2a)/(ab)'),
        ],
      },
      {
        promptEq: '4/p-3/q',
        steps: [
          makeStep('lcd', 'Convert to common denominator pq', '(4q)/(pq)-(3p)/(pq)'),
          makeStep('combine', 'Combine over pq', '(4q-3p)/(pq)'),
        ],
      },
    ],
  ),
  s1(
    '41',
    'Level 1',
    'Subtraction with L.C.M.',
    '4/(3r)-1/(rs)',
    [
      makeStep('lcd', 'Convert to L.C.M. denominator 3rs', '(4s)/(3rs)-3/(3rs)'),
      makeStep('combine', 'Combine over 3rs', '(4s-3)/(3rs)'),
    ],
    [
      {
        promptEq: '5/(2x)-1/(xy)',
        steps: [
          makeStep('lcd', 'Convert to L.C.M. denominator 2xy', '(5y)/(2xy)-2/(2xy)'),
          makeStep('combine', 'Combine over 2xy', '(5y-2)/(2xy)'),
        ],
      },
      {
        promptEq: '3/(4m)-2/(mn)',
        steps: [
          makeStep('lcd', 'Convert to L.C.M. denominator 4mn', '(3n)/(4mn)-8/(4mn)'),
          makeStep('combine', 'Combine over 4mn', '(3n-8)/(4mn)'),
        ],
      },
    ],
  ),
  s1(
    '42',
    'Level 1',
    'Subtraction with L.C.M.',
    '3/(4x)-2/(5y)',
    [
      makeStep('lcd', 'Convert to common denominator 20xy', '(15y)/(20xy)-(8x)/(20xy)'),
      makeStep('combine', 'Combine over 20xy', '(15y-8x)/(20xy)'),
    ],
    [
      {
        promptEq: '2/(3x)-1/(4y)',
        steps: [
          makeStep('lcd', 'Convert to common denominator 12xy', '(8y)/(12xy)-(3x)/(12xy)'),
          makeStep('combine', 'Combine over 12xy', '(8y-3x)/(12xy)'),
        ],
      },
      {
        promptEq: '5/(6a)-1/(2b)',
        steps: [
          makeStep('lcd', 'Convert to common denominator 6ab', '(5b)/(6ab)-(3a)/(6ab)'),
          makeStep('combine', 'Combine over 6ab', '(5b-3a)/(6ab)'),
        ],
      },
    ],
  ),

  // ── Level 1: Q43–48 (Binomial Denominators) ──
  s1(
    '43',
    'Level 1',
    'Binomial common denominator',
    '(2x)/(x+y)+x/(x+y)',
    [makeStep('combine', 'Add numerators over common denominator (x + y)', '(3x)/(x+y)')],
    [
      { promptEq: '(4a)/(a+b)+(2a)/(a+b)', steps: [makeStep('combine', 'Add numerators over (a + b)', '(6a)/(a+b)')] },
      { promptEq: '(3y)/(x-y)+(2y)/(x-y)', steps: [makeStep('combine', 'Add numerators over (x − y)', '(5y)/(x-y)')] },
    ],
  ),
  s1(
    '44',
    'Level 1',
    'Binomial common denominator',
    '(3n)/(m+3n)+n/(3n+m)',
    [makeStep('combine', 'Note m + 3n = 3n + m and add numerators', '(4n)/(m+3n)')],
    [
      { promptEq: '(2x)/(x+y)+(3x)/(y+x)', steps: [makeStep('combine', 'Add numerators over (x + y)', '(5x)/(x+y)')] },
      { promptEq: '(5a)/(a+2b)+a/(2b+a)', steps: [makeStep('combine', 'Add numerators over (a + 2b)', '(6a)/(a+2b)')] },
    ],
  ),
  s1(
    '45',
    'Level 1',
    'L.C.M. with binomial factor',
    '1/(m+3)+2/(3(m+3))',
    [
      makeStep('lcd', 'Convert first fraction to denominator 3(m + 3)', '3/(3(m+3))+2/(3(m+3))'),
      makeStep('combine', 'Add the numerators', '5/(3(m+3))'),
    ],
    [
      {
        promptEq: '2/(x+1)+3/(4(x+1))',
        steps: [
          makeStep('lcd', 'Convert first fraction to denominator 4(x + 1)', '8/(4(x+1))+3/(4(x+1))'),
          makeStep('combine', 'Add the numerators', '11/(4(x+1))'),
        ],
      },
      {
        promptEq: '1/(y-2)+4/(5(y-2))',
        steps: [
          makeStep('lcd', 'Convert first fraction to denominator 5(y − 2)', '5/(5(y-2))+4/(5(y-2))'),
          makeStep('combine', 'Add the numerators', '9/(5(y-2))'),
        ],
      },
    ],
  ),
  s1(
    '46',
    'Level 1',
    'Binomial common denominator',
    'm/(m-1)-1/(m-1)',
    [
      makeStep('combine', 'Subtract numerators over (m − 1)', '(m-1)/(m-1)'),
      makeStep('cancel', 'Cancel identical numerator and denominator', '1'),
    ],
    [
      {
        promptEq: 'x/(x+4)+4/(x+4)',
        steps: [
          makeStep('combine', 'Add numerators over (x + 4)', '(x+4)/(x+4)'),
          makeStep('cancel', 'Cancel identical numerator and denominator', '1'),
        ],
      },
      {
        promptEq: 'a/(a-3)-3/(a-3)',
        steps: [
          makeStep('combine', 'Subtract numerators over (a − 3)', '(a-3)/(a-3)'),
          makeStep('cancel', 'Cancel identical numerator and denominator', '1'),
        ],
      },
    ],
  ),
  s1(
    '47',
    'Level 1',
    'Opposite-sign binomial denominators',
    '(3x)/(x-2y)-(4x)/(2y-x)',
    [
      makeStep('factor', 'Rewrite 2y − x as −(x − 2y), turning − into +', '(3x)/(x-2y)+(4x)/(x-2y)', { hint: 'Since 2y − x = −(x − 2y), subtracting a negative denominator is adding!' }),
      makeStep('combine', 'Add the numerators', '(7x)/(x-2y)'),
    ],
    [
      {
        promptEq: '(5a)/(a-b)-(2a)/(b-a)',
        steps: [
          makeStep('factor', 'Rewrite b − a as −(a − b)', '(5a)/(a-b)+(2a)/(a-b)'),
          makeStep('combine', 'Add the numerators', '(7a)/(a-b)'),
        ],
      },
      {
        promptEq: '(4m)/(m-3n)-(3m)/(3n-m)',
        steps: [
          makeStep('factor', 'Rewrite 3n − m as −(m − 3n)', '(4m)/(m-3n)+(3m)/(m-3n)'),
          makeStep('combine', 'Add the numerators', '(7m)/(m-3n)'),
        ],
      },
    ],
  ),
  s1(
    '48',
    'Level 1',
    'L.C.M. with binomial factor',
    '(5x)/(4(x-2))-x/(x-2)',
    [
      makeStep('lcd', 'Convert second fraction to denominator 4(x − 2)', '(5x)/(4(x-2))-(4x)/(4(x-2))'),
      makeStep('combine', 'Subtract the numerators', 'x/(4(x-2))'),
    ],
    [
      {
        promptEq: '(7y)/(3(y+1))-(2y)/(y+1)',
        steps: [
          makeStep('lcd', 'Convert second fraction to denominator 3(y + 1)', '(7y)/(3(y+1))-(6y)/(3(y+1))'),
          makeStep('combine', 'Subtract the numerators', 'y/(3(y+1))'),
        ],
      },
      {
        promptEq: '(9a)/(5(a-4))-a/(a-4)',
        steps: [
          makeStep('lcd', 'Convert second fraction to denominator 5(a − 4)', '(9a)/(5(a-4))-(5a)/(5(a-4))'),
          makeStep('combine', 'Subtract the numerators', '(4a)/(5(a-4))'),
        ],
      },
    ],
  ),

  // ── Level 2: Q49–56 (Factorizing Polynomials Before Cancelling) ──
  s1(
    '49',
    'Level 2',
    'Factorizing with opposite signs',
    '(m^3-2m^2)/(10m-5m^2)',
    [
      makeStep('factor', 'Factor out m^2 on top and 5m below', '(m^2(m-2))/(5m(2-m))'),
      makeStep('cancel', 'Cancel m and use (m − 2)/(2 − m) = −1', '-m/5'),
    ],
    [
      {
        promptEq: '(x^3-3x^2)/(6x-2x^2)',
        steps: [
          makeStep('factor', 'Factor out x^2 on top and 2x below', '(x^2(x-3))/(2x(3-x))'),
          makeStep('cancel', 'Cancel x and use (x − 3)/(3 − x) = −1', '-x/2'),
        ],
      },
      {
        promptEq: '(a^4-4a^3)/(12a-3a^2)',
        steps: [
          makeStep('factor', 'Factor out a^3 on top and 3a below', '(a^3(a-4))/(3a(4-a))'),
          makeStep('cancel', 'Cancel a and use (a − 4)/(4 − a) = −1', '-a^2/3'),
        ],
      },
    ],
  ),
  s1(
    '50',
    'Level 2',
    'Factoring out common factor',
    '(2+4m+2n)/(p+2pm+pn)',
    [
      makeStep('factor', 'Factor out 2 on top and p below', '(2(1+2m+n))/(p(1+2m+n))'),
      makeStep('cancel', 'Cancel the common factor (1 + 2m + n)', '2/p'),
    ],
    [
      {
        promptEq: '(3+6a+3b)/(x+2xa+xb)',
        steps: [
          makeStep('factor', 'Factor out 3 on top and x below', '(3(1+2a+b))/(x(1+2a+b))'),
          makeStep('cancel', 'Cancel the common factor (1 + 2a + b)', '3/x'),
        ],
      },
      {
        promptEq: '(5+5x-10y)/(k+kx-2ky)',
        steps: [
          makeStep('factor', 'Factor out 5 on top and k below', '(5(1+x-2y))/(k(1+x-2y))'),
          makeStep('cancel', 'Cancel the common factor (1 + x − 2y)', '5/k'),
        ],
      },
    ],
  ),
  s1(
    '51',
    'Level 2',
    'Factoring out negative common factor',
    '(-3x-6z+3y)/(x^3-x^2y+2x^2z)',
    [
      makeStep('factor', 'Factor out −3 on top and x^2 below', '(-3(x-y+2z))/(x^2(x-y+2z))', { hint: 'Notice −3x − 6z + 3y = −3(x − y + 2z), which matches the denominator factor!' }),
      makeStep('cancel', 'Cancel the common factor (x − y + 2z)', '-3/x^2'),
    ],
    [
      {
        promptEq: '(-4a+4b-8c)/(a^3-a^2b+2a^2c)',
        steps: [
          makeStep('factor', 'Factor out −4 on top and a^2 below', '(-4(a-b+2c))/(a^2(a-b+2c))'),
          makeStep('cancel', 'Cancel the common factor (a − b + 2c)', '-4/a^2'),
        ],
      },
      {
        promptEq: '(-5m-10p+5n)/(m^4-m^3n+2m^3p)',
        steps: [
          makeStep('factor', 'Factor out −5 on top and m^3 below', '(-5(m-n+2p))/(m^3(m-n+2p))'),
          makeStep('cancel', 'Cancel the common factor (m − n + 2p)', '-5/m^3'),
        ],
      },
    ],
  ),
  s1(
    '52a',
    'Level 2',
    'Difference of two squares',
    'y^2-36',
    [makeStep('factor', 'Factorize using a² − b² = (a + b)(a − b)', '(y+6)(y-6)', { hint: '36 = 6², so y² − 36 = (y + 6)(y − 6).' })],
    [
      { promptEq: 'x^2-49', steps: [makeStep('factor', 'Factorize using difference of two squares', '(x+7)(x-7)')] },
      { promptEq: 'a^2-25', steps: [makeStep('factor', 'Factorize using difference of two squares', '(a+5)(a-5)')] },
    ],
    { promptText: '52(a) Factorize the expression:' },
  ),
  s1(
    '52b',
    'Level 2',
    'Hence simplify',
    '(y^2-6y)/(y^2-36)',
    [
      makeStep('factor', 'Factorize numerator and use part (a) for denominator', '(y(y-6))/((y+6)(y-6))'),
      makeStep('cancel', 'Cancel the common factor (y − 6)', 'y/(y+6)'),
    ],
    [
      {
        promptEq: '(x^2-7x)/(x^2-49)',
        steps: [
          makeStep('factor', 'Factorize both numerator and denominator', '(x(x-7))/((x+7)(x-7))'),
          makeStep('cancel', 'Cancel the common factor (x − 7)', 'x/(x+7)'),
        ],
      },
      {
        promptEq: '(a^2-5a)/(a^2-25)',
        steps: [
          makeStep('factor', 'Factorize both numerator and denominator', '(a(a-5))/((a+5)(a-5))'),
          makeStep('cancel', 'Cancel the common factor (a − 5)', 'a/(a+5)'),
        ],
      },
    ],
    { promptText: '52(b) Hence, simplify the algebraic fraction:' },
  ),
  s1(
    '53a',
    'Level 2',
    'Factorization by grouping',
    'xy+3y^2-2x-6y',
    [
      makeStep('factor', 'Group in pairs and take out common factors y and −2', 'y(x+3y)-2(x+3y)'),
      makeStep('factor', 'Factor out the common binomial (x + 3y)', '(x+3y)(y-2)'),
    ],
    [
      {
        promptEq: 'ab+2b^2-3a-6b',
        steps: [
          makeStep('factor', 'Group in pairs', 'b(a+2b)-3(a+2b)'),
          makeStep('factor', 'Factor out (a + 2b)', '(a+2b)(b-3)'),
        ],
      },
      {
        promptEq: 'xy+4y^2-5x-20y',
        steps: [
          makeStep('factor', 'Group in pairs', 'y(x+4y)-5(x+4y)'),
          makeStep('factor', 'Factor out (x + 4y)', '(x+4y)(y-5)'),
        ],
      },
    ],
    { promptText: '53(a) Factorize the expression:' },
  ),
  s1(
    '53b',
    'Level 2',
    'Hence simplify',
    '(4y-8)/(xy+3y^2-2x-6y)',
    [
      makeStep('factor', 'Factorize numerator and use part (a) for denominator', '(4(y-2))/((x+3y)(y-2))'),
      makeStep('cancel', 'Cancel the common factor (y − 2)', '4/(x+3y)'),
    ],
    [
      {
        promptEq: '(5b-15)/(ab+2b^2-3a-6b)',
        steps: [
          makeStep('factor', 'Factorize numerator and denominator', '(5(b-3))/((a+2b)(b-3))'),
          makeStep('cancel', 'Cancel the common factor (b − 3)', '5/(a+2b)'),
        ],
      },
      {
        promptEq: '(3y-15)/(xy+4y^2-5x-20y)',
        steps: [
          makeStep('factor', 'Factorize numerator and denominator', '(3(y-5))/((x+4y)(y-5))'),
          makeStep('cancel', 'Cancel the common factor (y − 5)', '3/(x+4y)'),
        ],
      },
    ],
    { promptText: '53(b) Hence, simplify the algebraic fraction:' },
  ),
  s1(
    '54',
    'Level 2',
    'Perfect square trinomial',
    '(x^2+6x+9)/(xy+3y)',
    [
      makeStep('factor', 'Factorize numerator as (x + 3)² and factor out y below', '((x+3)^2)/(y(x+3))'),
      makeStep('cancel', 'Cancel one factor of (x + 3)', '(x+3)/y'),
    ],
    [
      {
        promptEq: '(x^2+4x+4)/(xy+2y)',
        steps: [
          makeStep('factor', 'Factorize numerator and denominator', '((x+2)^2)/(y(x+2))'),
          makeStep('cancel', 'Cancel (x + 2)', '(x+2)/y'),
        ],
      },
      {
        promptEq: '(a^2+10a+25)/(ab+5b)',
        steps: [
          makeStep('factor', 'Factorize numerator and denominator', '((a+5)^2)/(b(a+5))'),
          makeStep('cancel', 'Cancel (a + 5)', '(a+5)/b'),
        ],
      },
    ],
  ),
  s1(
    '55',
    'Level 2',
    'Perfect square trinomial',
    '(4m-8n)/(m^2-4mn+4n^2)',
    [
      makeStep('factor', 'Factorize numerator and denominator', '(4(m-2n))/((m-2n)^2)'),
      makeStep('cancel', 'Cancel one factor of (m − 2n)', '4/(m-2n)'),
    ],
    [
      {
        promptEq: '(3x-9y)/(x^2-6xy+9y^2)',
        steps: [
          makeStep('factor', 'Factorize numerator and denominator', '(3(x-3y))/((x-3y)^2)'),
          makeStep('cancel', 'Cancel (x − 3y)', '3/(x-3y)'),
        ],
      },
      {
        promptEq: '(5a+10b)/(a^2+4ab+4b^2)',
        steps: [
          makeStep('factor', 'Factorize numerator and denominator', '(5(a+2b))/((a+2b)^2)'),
          makeStep('cancel', 'Cancel (a + 2b)', '5/(a+2b)'),
        ],
      },
    ],
  ),
  s1(
    '56',
    'Level 2',
    'Factorization by grouping',
    '(9x+3y)/(3x^2+xy-3x-y)',
    [
      makeStep('factor', 'Factorize numerator and group denominator', '(3(3x+y))/(x(3x+y)-(3x+y))'),
      makeStep('factor', 'Complete factorization of denominator', '(3(3x+y))/((3x+y)(x-1))'),
      makeStep('cancel', 'Cancel (3x + y)', '3/(x-1)'),
    ],
    [
      {
        promptEq: '(4a+2b)/(2a^2+ab-2a-b)',
        steps: [
          makeStep('factor', 'Factorize numerator and denominator', '(2(2a+b))/((2a+b)(a-1))'),
          makeStep('cancel', 'Cancel (2a + b)', '2/(a-1)'),
        ],
      },
      {
        promptEq: '(10x+5y)/(2x^2+xy-2x-y)',
        steps: [
          makeStep('factor', 'Factorize numerator and denominator', '(5(2x+y))/((2x+y)(x-1))'),
          makeStep('cancel', 'Cancel (2x + y)', '5/(x-1)'),
        ],
      },
    ],
  ),

  // ── Level 2: Q57–62 (Multiplying & Dividing After Factorizing) ──
  s1(
    '57',
    'Level 2',
    'Factorize then multiply',
    '(x/(x^3+2x^2))*((x+2)/(2x^2))',
    [
      makeStep('factor', 'Factor out x² in the first denominator', '(x/(x^2(x+2)))*((x+2)/(2x^2))'),
      makeStep('cancel', 'Cancel (x + 2) and x', '1/(2x^3)'),
    ],
    [
      {
        promptEq: '(y/(y^3+3y^2))*((y+3)/(5y^2))',
        steps: [
          makeStep('factor', 'Factor out y² in the first denominator', '(y/(y^2(y+3)))*((y+3)/(5y^2))'),
          makeStep('cancel', 'Cancel (y + 3) and y', '1/(5y^3)'),
        ],
      },
      {
        promptEq: '(a/(a^2+4a))*((a+4)/(3a^2))',
        steps: [
          makeStep('factor', 'Factor out a in the first denominator', '(a/(a(a+4)))*((a+4)/(3a^2))'),
          makeStep('cancel', 'Cancel (a + 4) and a', '1/(3a^2)'),
        ],
      },
    ],
  ),
  s1(
    '58',
    'Level 2',
    'Factorize then multiply',
    '((1+x)/(4y^2-6y))*((2y-3)/(5x+5))',
    [
      makeStep('factor', 'Factorize 4y² − 6y and 5x + 5', '((1+x)/(2y(2y-3)))*((2y-3)/(5(x+1)))'),
      makeStep('cancel', 'Cancel (1 + x) and (2y − 3)', '1/(10y)'),
    ],
    [
      {
        promptEq: '((1+a)/(6b^2-9b))*((2b-3)/(4a+4))',
        steps: [
          makeStep('factor', 'Factorize denominators', '((1+a)/(3b(2b-3)))*((2b-3)/(4(a+1)))'),
          makeStep('cancel', 'Cancel (1 + a) and (2b − 3)', '1/(12b)'),
        ],
      },
      {
        promptEq: '((x+2)/(3y^2-12y))*((y-4)/(5x+10))',
        steps: [
          makeStep('factor', 'Factorize denominators', '((x+2)/(3y(y-4)))*((y-4)/(5(x+2)))'),
          makeStep('cancel', 'Cancel (x + 2) and (y − 4)', '1/(15y)'),
        ],
      },
    ],
  ),
  s1(
    '59',
    'Level 2',
    'Factorize then multiply',
    '((x+y)^2/(y^2-xy))*((x-y)/(2x+2y))',
    [
      makeStep('factor', 'Factorize y² − xy and 2x + 2y', '((x+y)^2/(y(y-x)))*((x-y)/(2(x+y)))'),
      makeStep('cancel', 'Cancel (x + y) and use (x − y)/(y − x) = −1', '-(x+y)/(2y)'),
    ],
    [
      {
        promptEq: '((a+b)^2/(b^2-ab))*((a-b)/(3a+3b))',
        steps: [
          makeStep('factor', 'Factorize denominators', '((a+b)^2/(b(b-a)))*((a-b)/(3(a+b)))'),
          makeStep('cancel', 'Cancel (a + b) and use (a − b)/(b − a) = −1', '-(a+b)/(3b)'),
        ],
      },
      {
        promptEq: '((m+n)^2/(n^2-mn))*((m-n)/(4m+4n))',
        steps: [
          makeStep('factor', 'Factorize denominators', '((m+n)^2/(n(n-m)))*((m-n)/(4(m+n)))'),
          makeStep('cancel', 'Cancel (m + n) and use (m − n)/(n − m) = −1', '-(m+n)/(4n)'),
        ],
      },
    ],
  ),
  s1(
    '60',
    'Level 2',
    'Factorize then divide',
    '((x-5)/(5x^4))÷((3x^2-15x)/(10x^2))',
    [
      makeStep('invert', 'Invert divisor and factorize 3x² − 15x', '((x-5)/(5x^4))*((10x^2)/(3x(x-5)))'),
      makeStep('cancel', 'Cancel (x − 5) and 5x²', '2/(3x^3)'),
    ],
    [
      {
        promptEq: '((x-4)/(4x^3))÷((3x^2-12x)/(8x^2))',
        steps: [
          makeStep('invert', 'Invert divisor and factorize 3x² − 12x', '((x-4)/(4x^3))*((8x^2)/(3x(x-4)))'),
          makeStep('cancel', 'Cancel (x − 4) and 4x²', '2/(3x^2)'),
        ],
      },
      {
        promptEq: '((y-2)/(3y^4))÷((5y^2-10y)/(9y^2))',
        steps: [
          makeStep('invert', 'Invert divisor and factorize 5y² − 10y', '((y-2)/(3y^4))*((9y^2)/(5y(y-2)))'),
          makeStep('cancel', 'Cancel (y − 2) and 3y²', '3/(5y^3)'),
        ],
      },
    ],
  ),
  s1(
    '61',
    'Level 2',
    'Factorize then divide',
    '((x+1)/(4y-2))÷((4x^2+4x)/(1-2y))',
    [
      makeStep('invert', 'Invert divisor and factorize', '((x+1)/(2(2y-1)))*((1-2y)/(4x(x+1)))'),
      makeStep('cancel', 'Cancel (x + 1) and use (1 − 2y)/(2y − 1) = −1', '-1/(8x)'),
    ],
    [
      {
        promptEq: '((a+2)/(6b-2))÷((5a^2+10a)/(1-3b))',
        steps: [
          makeStep('invert', 'Invert divisor and factorize', '((a+2)/(2(3b-1)))*((1-3b)/(5a(a+2)))'),
          makeStep('cancel', 'Cancel (a + 2) and use (1 − 3b)/(3b − 1) = −1', '-1/(10a)'),
        ],
      },
      {
        promptEq: '((m+3)/(4n-6))÷((3m^2+9m)/(3-2n))',
        steps: [
          makeStep('invert', 'Invert divisor and factorize', '((m+3)/(2(2n-3)))*((3-2n)/(3m(m+3)))'),
          makeStep('cancel', 'Cancel (m + 3) and use (3 − 2n)/(2n − 3) = −1', '-1/(6m)'),
        ],
      },
    ],
  ),
  s1(
    '62',
    'Level 2',
    'Factorize then divide',
    '((mn^2+7mn)/(n-m))÷((7+n)/((m-n)^2))',
    [
      makeStep('invert', 'Invert divisor and factor out mn', '((mn(n+7))/(n-m))*(((m-n)^2)/(7+n))'),
      makeStep('cancel', 'Cancel (n + 7) and use (m − n)²/(n − m) = n − m', 'mn(n-m)', { hint: 'Note that (m − n)² = (n − m)², so (m − n)² ÷ (n − m) = n − m.' }),
    ],
    [
      {
        promptEq: '((ab^2+5ab)/(b-a))÷((5+b)/((a-b)^2))',
        steps: [
          makeStep('invert', 'Invert divisor and factor out ab', '((ab(b+5))/(b-a))*(((a-b)^2)/(5+b))'),
          makeStep('cancel', 'Cancel (b + 5) and simplify (a − b)²/(b − a)', 'ab(b-a)'),
        ],
      },
      {
        promptEq: '((xy^2+3xy)/(y-x))÷((3+y)/((x-y)^2))',
        steps: [
          makeStep('invert', 'Invert divisor and factor out xy', '((xy(y+3))/(y-x))*(((x-y)^2)/(3+y))'),
          makeStep('cancel', 'Cancel (y + 3) and simplify (x − y)²/(y − x)', 'xy(y-x)'),
        ],
      },
    ],
  ),

  // ── Level 2: Q63–76 (Addition & Subtraction with Different Binomial Denominators) ──
  s1(
    '63',
    'Level 2',
    'Opposite binomial denominators',
    '(8x)/(x-1)+1/(1-x)',
    [
      makeStep('factor', 'Rewrite 1 − x as −(x − 1)', '(8x)/(x-1)-1/(x-1)'),
      makeStep('combine', 'Subtract numerators over (x − 1)', '(8x-1)/(x-1)'),
    ],
    [
      {
        promptEq: '(5x)/(x-2)+3/(2-x)',
        steps: [
          makeStep('factor', 'Rewrite 2 − x as −(x − 2)', '(5x)/(x-2)-3/(x-2)'),
          makeStep('combine', 'Subtract numerators over (x − 2)', '(5x-3)/(x-2)'),
        ],
      },
      {
        promptEq: '(7y)/(y-4)+2/(4-y)',
        steps: [
          makeStep('factor', 'Rewrite 4 − y as −(y − 4)', '(7y)/(y-4)-2/(y-4)'),
          makeStep('combine', 'Subtract numerators over (y − 4)', '(7y-2)/(y-4)'),
        ],
      },
    ],
  ),
  s1(
    '64',
    'Level 2',
    'Combining two fractions',
    '2/(a-1)+3/a',
    [
      makeStep('lcd', 'Combine over common denominator a(a − 1)', '(2a+3(a-1))/(a(a-1))'),
      makeStep('expand', 'Expand the bracket in the numerator', '(2a+3a-3)/(a(a-1))'),
      makeStep('combine', 'Combine like terms in the numerator', '(5a-3)/(a(a-1))'),
    ],
    [
      {
        promptEq: '3/(x-2)+4/x',
        steps: [
          makeStep('lcd', 'Combine over x(x − 2)', '(3x+4(x-2))/(x(x-2))'),
          makeStep('combine', 'Expand and simplify numerator', '(7x-8)/(x(x-2))'),
        ],
      },
      {
        promptEq: '5/(m+1)+2/m',
        steps: [
          makeStep('lcd', 'Combine over m(m + 1)', '(5m+2(m+1))/(m(m+1))'),
          makeStep('combine', 'Expand and simplify numerator', '(7m+2)/(m(m+1))'),
        ],
      },
    ],
  ),
  s1(
    '65',
    'Level 2',
    'Combining two fractions',
    '5/b+2/(b-3)',
    [
      makeStep('lcd', 'Combine over common denominator b(b − 3)', '(5(b-3)+2b)/(b(b-3))'),
      makeStep('expand', 'Expand the bracket in the numerator', '(5b-15+2b)/(b(b-3))'),
      makeStep('combine', 'Combine like terms in the numerator', '(7b-15)/(b(b-3))'),
    ],
    [
      {
        promptEq: '4/x+3/(x-2)',
        steps: [
          makeStep('lcd', 'Combine over x(x − 2)', '(4(x-2)+3x)/(x(x-2))'),
          makeStep('combine', 'Expand and simplify numerator', '(7x-8)/(x(x-2))'),
        ],
      },
      {
        promptEq: '6/y+5/(y+1)',
        steps: [
          makeStep('lcd', 'Combine over y(y + 1)', '(6(y+1)+5y)/(y(y+1))'),
          makeStep('combine', 'Expand and simplify numerator', '(11y+6)/(y(y+1))'),
        ],
      },
    ],
  ),
  s1(
    '66',
    'Level 2',
    'Adding integer and fraction',
    '1+(2x)/(x+5)',
    [
      makeStep('lcd', 'Write 1 as (x + 5)/(x + 5)', '(x+5)/(x+5)+(2x)/(x+5)'),
      makeStep('combine', 'Combine over (x + 5)', '(3x+5)/(x+5)'),
    ],
    [
      {
        promptEq: '1+(3x)/(x+2)',
        steps: [
          makeStep('lcd', 'Write 1 as (x + 2)/(x + 2)', '(x+2)/(x+2)+(3x)/(x+2)'),
          makeStep('combine', 'Combine over (x + 2)', '(4x+2)/(x+2)'),
        ],
      },
      {
        promptEq: '2+(3y)/(y-1)',
        steps: [
          makeStep('lcd', 'Write 2 over (y − 1)', '(2(y-1)+3y)/(y-1)'),
          makeStep('combine', 'Expand and simplify numerator', '(5y-2)/(y-1)'),
        ],
      },
    ],
  ),
  s1(
    '67',
    'Level 2',
    'HKDSE-style addition of fractions',
    '2/(x-4)+5/(3x+10)',
    [
      makeStep('lcd', 'Combine over (x − 4)(3x + 10)', '(2(3x+10)+5(x-4))/((x-4)(3x+10))'),
      makeStep('expand', 'Expand the brackets in the numerator', '(6x+20+5x-20)/((x-4)(3x+10))'),
      makeStep('combine', 'Combine like terms in the numerator', '(11x)/((x-4)(3x+10))'),
    ],
    [
      {
        promptEq: '3/(x-2)+2/(5x+4)',
        steps: [
          makeStep('lcd', 'Combine over (x − 2)(5x + 4)', '(3(5x+4)+2(x-2))/((x-2)(5x+4))'),
          makeStep('expand', 'Expand numerator', '(15x+12+2x-4)/((x-2)(5x+4))'),
          makeStep('combine', 'Combine like terms', '(17x+8)/((x-2)(5x+4))'),
        ],
      },
      {
        promptEq: '3/(x-5)+5/(2x+3)',
        steps: [
          makeStep('lcd', 'Combine over (x − 5)(2x + 3)', '(3(2x+3)+5(x-5))/((x-5)(2x+3))'),
          makeStep('expand', 'Expand numerator', '(6x+9+5x-25)/((x-5)(2x+3))'),
          makeStep('combine', 'Combine like terms', '(11x-16)/((x-5)(2x+3))'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2022 (I) Q3' },
  ),
  s1(
    '68',
    'Level 2',
    'HKDSE-style addition of fractions',
    '4/(x+8)+2/(5x-4)',
    [
      makeStep('lcd', 'Combine over (x + 8)(5x − 4)', '(4(5x-4)+2(x+8))/((x+8)(5x-4))'),
      makeStep('expand', 'Expand the brackets in the numerator', '(20x-16+2x+16)/((x+8)(5x-4))'),
      makeStep('combine', 'Combine like terms in the numerator', '(22x)/((x+8)(5x-4))'),
    ],
    [
      {
        promptEq: '3/(x+6)+2/(4x-4)',
        steps: [
          makeStep('lcd', 'Combine over (x + 6)(4x − 4)', '(3(4x-4)+2(x+6))/((x+6)(4x-4))'),
          makeStep('combine', 'Expand and simplify numerator', '(14x)/((x+6)(4x-4))'),
        ],
      },
      {
        promptEq: '5/(x+3)+3/(2x-5)',
        steps: [
          makeStep('lcd', 'Combine over (x + 3)(2x − 5)', '(5(2x-5)+3(x+3))/((x+3)(2x-5))'),
          makeStep('combine', 'Expand and simplify numerator', '(13x-16)/((x+3)(2x-5))'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2022 (I) Q3' },
  ),
  s1(
    '69',
    'Level 2',
    'Subtracting algebraic fractions',
    '4/(a-2)-3/a',
    [
      makeStep('lcd', 'Combine over common denominator a(a − 2)', '(4a-3(a-2))/(a(a-2))'),
      makeStep('expand', 'Expand −3(a − 2) carefully', '(4a-3a+6)/(a(a-2))', { hint: 'Watch the sign: −3 × (−2) = +6!' }),
      makeStep('combine', 'Combine like terms in the numerator', '(a+6)/(a(a-2))'),
    ],
    [
      {
        promptEq: '5/(x-3)-2/x',
        steps: [
          makeStep('lcd', 'Combine over x(x − 3)', '(5x-2(x-3))/(x(x-3))'),
          makeStep('expand', 'Expand −2(x − 3)', '(5x-2x+6)/(x(x-3))'),
          makeStep('combine', 'Combine like terms', '(3x+6)/(x(x-3))'),
        ],
      },
      {
        promptEq: '6/(m-1)-4/m',
        steps: [
          makeStep('lcd', 'Combine over m(m − 1)', '(6m-4(m-1))/(m(m-1))'),
          makeStep('expand', 'Expand −4(m − 1)', '(6m-4m+4)/(m(m-1))'),
          makeStep('combine', 'Combine like terms', '(2m+4)/(m(m-1))'),
        ],
      },
    ],
  ),
  s1(
    '70',
    'Level 2',
    'Subtracting algebraic fractions',
    '4/(b-4)-5/(2b)',
    [
      makeStep('lcd', 'Combine over common denominator 2b(b − 4)', '(8b-5(b-4))/(2b(b-4))'),
      makeStep('expand', 'Expand −5(b − 4)', '(8b-5b+20)/(2b(b-4))'),
      makeStep('combine', 'Combine like terms', '(3b+20)/(2b(b-4))'),
    ],
    [
      {
        promptEq: '3/(x-2)-4/(3x)',
        steps: [
          makeStep('lcd', 'Combine over 3x(x − 2)', '(9x-4(x-2))/(3x(x-2))'),
          makeStep('combine', 'Expand and simplify numerator', '(5x+8)/(3x(x-2))'),
        ],
      },
      {
        promptEq: '5/(y-3)-3/(2y)',
        steps: [
          makeStep('lcd', 'Combine over 2y(y − 3)', '(10y-3(y-3))/(2y(y-3))'),
          makeStep('combine', 'Expand and simplify numerator', '(7y+9)/(2y(y-3))'),
        ],
      },
    ],
  ),
  s1(
    '71',
    'Level 2',
    'Subtracting fraction from integer',
    '2-(3+x)/(1-2x)',
    [
      makeStep('lcd', 'Write 2 over (1 − 2x) and subtract numerator in brackets', '(2(1-2x)-(3+x))/(1-2x)'),
      makeStep('expand', 'Expand brackets carefully', '(2-4x-3-x)/(1-2x)', { hint: '−(3 + x) = −3 − x.' }),
      makeStep('combine', 'Combine like terms in the numerator', '(-1-5x)/(1-2x)'),
    ],
    [
      {
        promptEq: '3-(2+x)/(1-x)',
        steps: [
          makeStep('lcd', 'Combine over (1 − x)', '(3(1-x)-(2+x))/(1-x)'),
          makeStep('expand', 'Expand numerator', '(3-3x-2-x)/(1-x)'),
          makeStep('combine', 'Combine like terms', '(1-4x)/(1-x)'),
        ],
      },
      {
        promptEq: '2-(4+y)/(1-3y)',
        steps: [
          makeStep('lcd', 'Combine over (1 − 3y)', '(2(1-3y)-(4+y))/(1-3y)'),
          makeStep('expand', 'Expand numerator', '(2-6y-4-y)/(1-3y)'),
          makeStep('combine', 'Combine like terms', '(-2-7y)/(1-3y)'),
        ],
      },
    ],
  ),
  s1(
    '72',
    'Level 2',
    'Subtracting two binomial fractions',
    '2/(x-2)-1/(x-1)',
    [
      makeStep('lcd', 'Combine over (x − 2)(x − 1)', '(2(x-1)-(x-2))/((x-2)(x-1))'),
      makeStep('expand', 'Expand the numerator', '(2x-2-x+2)/((x-2)(x-1))'),
      makeStep('combine', 'Combine like terms', 'x/((x-2)(x-1))'),
    ],
    [
      {
        promptEq: '3/(x-3)-2/(x-2)',
        steps: [
          makeStep('lcd', 'Combine over (x − 3)(x − 2)', '(3(x-2)-2(x-3))/((x-3)(x-2))'),
          makeStep('expand', 'Expand numerator', '(3x-6-2x+6)/((x-3)(x-2))'),
          makeStep('combine', 'Combine like terms', 'x/((x-3)(x-2))'),
        ],
      },
      {
        promptEq: '4/(y-1)-3/(y-2)',
        steps: [
          makeStep('lcd', 'Combine over (y − 1)(y − 2)', '(4(y-2)-3(y-1))/((y-1)(y-2))'),
          makeStep('expand', 'Expand numerator', '(4y-8-3y+3)/((y-1)(y-2))'),
          makeStep('combine', 'Combine like terms', '(y-5)/((y-1)(y-2))'),
        ],
      },
    ],
  ),
  s1(
    '73',
    'Level 2',
    'HKDSE-style subtraction of fractions',
    '6/(3y-8)-3/(5y-4)',
    [
      makeStep('lcd', 'Combine over (3y − 8)(5y − 4)', '(6(5y-4)-3(3y-8))/((3y-8)(5y-4))'),
      makeStep('expand', 'Expand the brackets in the numerator', '(30y-24-9y+24)/((3y-8)(5y-4))'),
      makeStep('combine', 'Combine like terms', '(21y)/((3y-8)(5y-4))'),
    ],
    [
      {
        promptEq: '4/(2y-5)-2/(3y-1)',
        steps: [
          makeStep('lcd', 'Combine over (2y − 5)(3y − 1)', '(4(3y-1)-2(2y-5))/((2y-5)(3y-1))'),
          makeStep('expand', 'Expand numerator', '(12y-4-4y+10)/((2y-5)(3y-1))'),
          makeStep('combine', 'Combine like terms', '(8y+6)/((2y-5)(3y-1))'),
        ],
      },
      {
        promptEq: '8/(4y-6)-4/(5y-3)',
        steps: [
          makeStep('lcd', 'Combine over (4y − 6)(5y − 3)', '(8(5y-3)-4(4y-6))/((4y-6)(5y-3))'),
          makeStep('expand', 'Expand numerator', '(40y-24-16y+24)/((4y-6)(5y-3))'),
          makeStep('combine', 'Combine like terms', '(24y)/((4y-6)(5y-3))'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2019 (I) Q2' },
  ),
  s1(
    '74',
    'Level 2',
    'HKDSE-style subtraction of fractions',
    '4/(7x-8)-3/(5x-6)',
    [
      makeStep('lcd', 'Combine over (7x − 8)(5x − 6)', '(4(5x-6)-3(7x-8))/((7x-8)(5x-6))'),
      makeStep('expand', 'Expand the brackets in the numerator', '(20x-24-21x+24)/((7x-8)(5x-6))'),
      makeStep('combine', 'Combine like terms', '(-x)/((7x-8)(5x-6))'),
    ],
    [
      {
        promptEq: '5/(4x-6)-3/(6x-9)',
        steps: [
          makeStep('lcd', 'Combine over (4x − 6)(6x − 9)', '(5(6x-9)-3(4x-6))/((4x-6)(6x-9))'),
          makeStep('expand', 'Expand numerator', '(30x-45-12x+18)/((4x-6)(6x-9))'),
          makeStep('combine', 'Combine like terms', '(18x-27)/((4x-6)(6x-9))'),
        ],
      },
      {
        promptEq: '3/(4x-5)-2/(5x-7)',
        steps: [
          makeStep('lcd', 'Combine over (4x − 5)(5x − 7)', '(3(5x-7)-2(4x-5))/((4x-5)(5x-7))'),
          makeStep('expand', 'Expand numerator', '(15x-21-8x+10)/((4x-5)(5x-7))'),
          makeStep('combine', 'Combine like terms', '(7x-11)/((4x-5)(5x-7))'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2019 (I) Q2' },
  ),
  s1(
    '75',
    'Level 2',
    'HKDSE-style subtraction of fractions',
    '4/(8x-7)-2/(4x-3)',
    [
      makeStep('lcd', 'Combine over (8x − 7)(4x − 3)', '(4(4x-3)-2(8x-7))/((8x-7)(4x-3))'),
      makeStep('expand', 'Expand the brackets in the numerator', '(16x-12-16x+14)/((8x-7)(4x-3))'),
      makeStep('combine', 'Combine like terms', '2/((8x-7)(4x-3))'),
    ],
    [
      {
        promptEq: '3/(6x-5)-2/(4x-3)',
        steps: [
          makeStep('lcd', 'Combine over (6x − 5)(4x − 3)', '(3(4x-3)-2(6x-5))/((6x-5)(4x-3))'),
          makeStep('expand', 'Expand numerator', '(12x-9-12x+10)/((6x-5)(4x-3))'),
          makeStep('combine', 'Combine like terms', '1/((6x-5)(4x-3))'),
        ],
      },
      {
        promptEq: '6/(9x-4)-2/(3x-1)',
        steps: [
          makeStep('lcd', 'Combine over (9x − 4)(3x − 1)', '(6(3x-1)-2(9x-4))/((9x-4)(3x-1))'),
          makeStep('expand', 'Expand numerator', '(18x-6-18x+8)/((9x-4)(3x-1))'),
          makeStep('combine', 'Combine like terms', '2/((9x-4)(3x-1))'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2024 (I) Q1' },
  ),
  s1(
    '76',
    'Level 2',
    'HKDSE-style subtraction of fractions',
    '9/(6y-5)-6/(4y-3)',
    [
      makeStep('lcd', 'Combine over (6y − 5)(4y − 3)', '(9(4y-3)-6(6y-5))/((6y-5)(4y-3))'),
      makeStep('expand', 'Expand the brackets in the numerator', '(36y-27-36y+30)/((6y-5)(4y-3))'),
      makeStep('combine', 'Combine like terms', '3/((6y-5)(4y-3))'),
    ],
    [
      {
        promptEq: '10/(5y-3)-6/(3y-1)',
        steps: [
          makeStep('lcd', 'Combine over (5y − 3)(3y − 1)', '(10(3y-1)-6(5y-3))/((5y-3)(3y-1))'),
          makeStep('expand', 'Expand numerator', '(30y-10-30y+18)/((5y-3)(3y-1))'),
          makeStep('combine', 'Combine like terms', '8/((5y-3)(3y-1))'),
        ],
      },
      {
        promptEq: '6/(4y-7)-3/(2y-3)',
        steps: [
          makeStep('lcd', 'Combine over (4y − 7)(2y − 3)', '(6(2y-3)-3(4y-7))/((4y-7)(2y-3))'),
          makeStep('expand', 'Expand numerator', '(12y-18-12y+21)/((4y-7)(2y-3))'),
          makeStep('combine', 'Combine like terms', '3/((4y-7)(2y-3))'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2024 (I) Q1' },
  ),
];
