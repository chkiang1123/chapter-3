import { makeStep } from './stepHelpers';
import type { QuestionItem, QuestionLevel, QuestionVariant } from './types';

function sec1Item(
  num: string,
  level: QuestionLevel,
  topicTag: string,
  promptEq: string,
  steps: QuestionVariant['steps'],
  sims: QuestionVariant[],
  opts?: { sourceTag?: string; promptText?: string },
): QuestionItem {
  return {
    id: `s1c10-s1-q${num}`,
    numberLabel: `Q${num}`,
    chapterId: 's1-ch10',
    sectionId: 's1c10_sec1',
    level,
    mode: 'expression',
    topicTag,
    sourceTag: opts?.sourceTag,
    promptEq,
    promptText: opts?.promptText || 'Simplify the expression using the laws of positive integral indices:',
    steps,
    sims,
  };
}

export const S1_CH10_SECTION_1_QUESTIONS: QuestionItem[] = [
  // ── Level 1: Q1–Q18 ──
  sec1Item(
    '1a',
    'Level 1',
    'Multiplying powers of same base',
    'a^3 * a^5',
    [makeStep('simplify', 'Add indices of a (a^m × a^n = a^(m+n))', 'a^8', { requireExpanded: true, hint: '3 + 5 = 8, so a^3 × a^5 = a^8.' })],
    [
      { promptEq: 'a^4 * a^6', steps: [makeStep('simplify', 'Add indices of a', 'a^10', { requireExpanded: true })] },
      { promptEq: 'x^2 * x^7', steps: [makeStep('simplify', 'Add indices of x', 'x^9', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '1b',
    'Level 1',
    'Multiplying powers of same base',
    'b^13 * b^10',
    [makeStep('simplify', 'Add indices of b', 'b^23', { requireExpanded: true, hint: '13 + 10 = 23.' })],
    [
      { promptEq: 'b^11 * b^9', steps: [makeStep('simplify', 'Add indices of b', 'b^20', { requireExpanded: true })] },
      { promptEq: 'p^12 * p^14', steps: [makeStep('simplify', 'Add indices of p', 'p^26', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '2a',
    'Level 1',
    'Multiplying signed powers',
    '(m^2)(-m^7)',
    [makeStep('simplify', 'Multiply signs and add indices of m', '-m^9', { requireExpanded: true, hint: '(+) × (−) = −, and m^2 × m^7 = m^(2+7) = m^9.' })],
    [
      { promptEq: '(m^3)(-m^5)', steps: [makeStep('simplify', 'Multiply signs and add indices of m', '-m^8', { requireExpanded: true })] },
      { promptEq: '(-a^4)(a^6)', steps: [makeStep('simplify', 'Multiply signs and add indices of a', '-a^10', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '2b',
    'Level 1',
    'Multiplying signed powers',
    '(-n^6)(-n^11)',
    [makeStep('simplify', 'Multiply signs (− × − = +) and add indices', 'n^17', { requireExpanded: true, hint: 'Two negatives multiply to give a positive sign, and 6 + 11 = 17.' })],
    [
      { promptEq: '(-n^4)(-n^9)', steps: [makeStep('simplify', 'Multiply signs and add indices', 'n^13', { requireExpanded: true })] },
      { promptEq: '(-y^5)(-y^8)', steps: [makeStep('simplify', 'Multiply signs and add indices', 'y^13', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '3a',
    'Level 1',
    'Multiplying monomials',
    '(5p^8)(7p^9)',
    [makeStep('simplify', 'Multiply coefficients and add indices of p', '35p^17', { requireExpanded: true, hint: '5 × 7 = 35, and p^8 × p^9 = p^(8+9) = p^17.' })],
    [
      { promptEq: '(4p^6)(6p^7)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '24p^13', { requireExpanded: true })] },
      { promptEq: '(3k^5)(8k^4)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '24k^9', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '3b',
    'Level 1',
    'Multiplying monomials',
    '(-6q^5)(8q^3)',
    [makeStep('simplify', 'Multiply coefficients and add indices of q', '-48q^8', { requireExpanded: true, hint: '(−6) × 8 = −48, and 5 + 3 = 8.' })],
    [
      { promptEq: '(-4q^7)(9q^2)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '-36q^9', { requireExpanded: true })] },
      { promptEq: '(7m^6)(-5m^4)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '-35m^10', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '4a',
    'Level 1',
    'Multiplying monomials',
    '(-12x^9)(10x^7)',
    [makeStep('simplify', 'Multiply coefficients and add indices of x', '-120x^16', { requireExpanded: true, hint: '(−12) × 10 = −120, and 9 + 7 = 16.' })],
    [
      { promptEq: '(-11x^8)(10x^5)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '-110x^13', { requireExpanded: true })] },
      { promptEq: '(-13a^6)(5a^7)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '-65a^13', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '4b',
    'Level 1',
    'Multiplying monomials',
    '(-15y^10)(-20y^17)',
    [makeStep('simplify', 'Multiply coefficients and add indices of y', '300y^27', { requireExpanded: true, hint: '(−15) × (−20) = 300, and 10 + 17 = 27.' })],
    [
      { promptEq: '(-12y^8)(-15y^11)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '180y^19', { requireExpanded: true })] },
      { promptEq: '(-25z^9)(-4z^13)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '100z^22', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '5a',
    'Level 1',
    'Monomials with fractional coefficients',
    '(3c^12)((1/6)c^5)',
    [makeStep('simplify', 'Multiply fractional coefficients and add indices of c', 'c^17/2', { requireExpanded: true, hint: '3 × (1/6) = 1/2, and c^12 × c^5 = c^17.' })],
    [
      { promptEq: '(4c^9)((1/8)c^4)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', 'c^13/2', { requireExpanded: true })] },
      { promptEq: '(6x^10)((1/18)x^3)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', 'x^13/3', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '5b',
    'Level 1',
    'Monomials with fractional coefficients',
    '(-(4/27)e^10)(9e^6)',
    [makeStep('simplify', 'Multiply coefficients (−4/27 × 9) and add indices of e', '-(4e^16)/3', { requireExpanded: true, hint: '(−4/27) × 9 = −4/3, and 10 + 6 = 16.' })],
    [
      { promptEq: '(-(5/16)e^8)(8e^5)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '-(5e^13)/2', { requireExpanded: true })] },
      { promptEq: '(-(3/25)k^11)(10k^4)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '-(6k^15)/5', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '6a',
    'Level 1',
    'Dividing powers of same base',
    'a^24/a^8',
    [makeStep('simplify', 'Subtract indices of a (a^m ÷ a^n = a^(m−n))', 'a^16', { requireExpanded: true, hint: '24 − 8 = 16.' })],
    [
      { promptEq: 'a^19/a^7', steps: [makeStep('simplify', 'Subtract indices', 'a^12', { requireExpanded: true })] },
      { promptEq: 'x^21/x^6', steps: [makeStep('simplify', 'Subtract indices', 'x^15', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '6b',
    'Level 1',
    'Dividing powers (denominator larger)',
    'b^5/b^25',
    [makeStep('simplify', 'Cancel b^5 from top and bottom (keep positive index in denominator)', '1/b^20', { requireExpanded: true, hint: '25 − 5 = 20 in the denominator, giving 1/b^20.' })],
    [
      { promptEq: 'b^4/b^18', steps: [makeStep('simplify', 'Cancel b^4 from numerator and denominator', '1/b^14', { requireExpanded: true })] },
      { promptEq: 'm^7/m^22', steps: [makeStep('simplify', 'Cancel m^7 from numerator and denominator', '1/m^15', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '7a',
    'Level 1',
    'Dividing signed powers',
    '(-g^7)/g^2',
    [makeStep('simplify', 'Keep the negative sign and subtract indices of g', '-g^5', { requireExpanded: true, hint: '−g^7 ÷ g^2 = −g^(7−2) = −g^5.' })],
    [
      { promptEq: '(-g^9)/g^4', steps: [makeStep('simplify', 'Subtract indices and keep negative sign', '-g^5', { requireExpanded: true })] },
      { promptEq: '(-p^11)/p^3', steps: [makeStep('simplify', 'Subtract indices and keep negative sign', '-p^8', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '7b',
    'Level 1',
    'Dividing signed powers',
    'h^3/(-h^9)',
    [makeStep('simplify', 'Divide signs (+ ÷ − = −) and cancel h^3', '-1/h^6', { requireExpanded: true, hint: '9 − 3 = 6 in the denominator with a minus sign: −1/h^6.' })],
    [
      { promptEq: 'h^4/(-h^10)', steps: [makeStep('simplify', 'Divide signs and cancel h^4', '-1/h^6', { requireExpanded: true })] },
      { promptEq: 'x^5/(-x^12)', steps: [makeStep('simplify', 'Divide signs and cancel x^5', '-1/x^7', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '8a',
    'Level 1',
    'Dividing monomials',
    '(4u^8)/u^5',
    [makeStep('simplify', 'Subtract indices of u and keep coefficient 4', '4u^3', { requireExpanded: true, hint: 'u^8 ÷ u^5 = u^3, so the result is 4u^3.' })],
    [
      { promptEq: '(7u^9)/u^4', steps: [makeStep('simplify', 'Subtract indices of u', '7u^5', { requireExpanded: true })] },
      { promptEq: '(9k^11)/k^6', steps: [makeStep('simplify', 'Subtract indices of k', '9k^5', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '8b',
    'Level 1',
    'Dividing monomials',
    'v^12/(-11v^20)',
    [makeStep('simplify', 'Divide signs and cancel v^12 from top and bottom', '-1/(11v^8)', { requireExpanded: true, hint: 'Keep 11 in the denominator and v^(20−12) = v^8 in the denominator.' })],
    [
      { promptEq: 'v^9/(-7v^16)', steps: [makeStep('simplify', 'Divide signs and cancel v^9', '-1/(7v^7)', { requireExpanded: true })] },
      { promptEq: 'a^8/(-5a^15)', steps: [makeStep('simplify', 'Divide signs and cancel a^8', '-1/(5a^7)', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '9a',
    'Level 1',
    'Dividing monomials',
    '(30m^18)/(25m^9)',
    [makeStep('simplify', 'Cancel H.C.F. 5 and subtract indices of m', '(6m^9)/5', { requireExpanded: true, hint: '30/25 = 6/5 and m^18 ÷ m^9 = m^9.' })],
    [
      { promptEq: '(24m^15)/(18m^6)', steps: [makeStep('simplify', 'Cancel H.C.F. 6 and subtract indices', '(4m^9)/3', { requireExpanded: true })] },
      { promptEq: '(35x^14)/(20x^8)', steps: [makeStep('simplify', 'Cancel H.C.F. 5 and subtract indices', '(7x^6)/4', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '9b',
    'Level 1',
    'Dividing monomials',
    '(22n^8)/(-44n^17)',
    [makeStep('simplify', 'Reduce 22/(−44) to −1/2 and cancel n^8', '-1/(2n^9)', { requireExpanded: true, hint: '22 ÷ (−44) = −1/2, and n^17 ÷ n^8 leaves n^9 in the denominator.' })],
    [
      { promptEq: '(18n^6)/(-36n^15)', steps: [makeStep('simplify', 'Reduce 18/(−36) and cancel n^6', '-1/(2n^9)', { requireExpanded: true })] },
      { promptEq: '(15y^5)/(-45y^11)', steps: [makeStep('simplify', 'Reduce 15/(−45) and cancel y^5', '-1/(3y^6)', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '10a',
    'Level 1',
    'Dividing monomials',
    '(-7x^5)/(14x^9)',
    [makeStep('simplify', 'Reduce −7/14 to −1/2 and cancel x^5', '-1/(2x^4)', { requireExpanded: true, hint: '−7/14 = −1/2 and 9 − 5 = 4 in the denominator.' })],
    [
      { promptEq: '(-9x^4)/(27x^10)', steps: [makeStep('simplify', 'Reduce −9/27 and cancel x^4', '-1/(3x^6)', { requireExpanded: true })] },
      { promptEq: '(-8a^3)/(32a^8)', steps: [makeStep('simplify', 'Reduce −8/32 and cancel a^3', '-1/(4a^5)', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '10b',
    'Level 1',
    'Dividing monomials',
    '(-63y^24)/(-49y^20)',
    [makeStep('simplify', 'Cancel negative signs, divide by 7, and subtract indices of y', '(9y^4)/7', { requireExpanded: true, hint: '(−63)/(−49) = 9/7, and y^24 ÷ y^20 = y^4.' })],
    [
      { promptEq: '(-56y^18)/(-42y^13)', steps: [makeStep('simplify', 'Cancel negative signs, divide by 14, and subtract indices', '(4y^5)/3', { requireExpanded: true })] },
      { promptEq: '(-45b^20)/(-27b^14)', steps: [makeStep('simplify', 'Cancel negative signs, divide by 9, and subtract indices', '(5b^6)/3', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '11a',
    'Level 1',
    'Multiplying three powers',
    'a^3 * a^4 * a^5',
    [makeStep('simplify', 'Add all three indices of a', 'a^12', { requireExpanded: true, hint: '3 + 4 + 5 = 12.' })],
    [
      { promptEq: 'a^2 * a^5 * a^6', steps: [makeStep('simplify', 'Add all three indices', 'a^13', { requireExpanded: true })] },
      { promptEq: 'k^4 * k^7 * k^3', steps: [makeStep('simplify', 'Add all three indices', 'k^14', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '11b',
    'Level 1',
    'Multiplying three powers',
    'b^8 * b^4 * b^7',
    [makeStep('simplify', 'Add all three indices of b', 'b^19', { requireExpanded: true, hint: '8 + 4 + 7 = 19.' })],
    [
      { promptEq: 'b^6 * b^5 * b^9', steps: [makeStep('simplify', 'Add all three indices', 'b^20', { requireExpanded: true })] },
      { promptEq: 'm^3 * m^8 * m^6', steps: [makeStep('simplify', 'Add all three indices', 'm^17', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '12a',
    'Level 1',
    'Multiplying three signed powers',
    '(g^6)(-g^7)(g^10)',
    [makeStep('simplify', 'Determine sign (one negative = −) and add indices', '-g^23', { requireExpanded: true, hint: '6 + 7 + 10 = 23 with one minus sign.' })],
    [
      { promptEq: '(g^4)(-g^5)(g^8)', steps: [makeStep('simplify', 'Determine sign and add indices', '-g^17', { requireExpanded: true })] },
      { promptEq: '(-p^3)(p^6)(p^9)', steps: [makeStep('simplify', 'Determine sign and add indices', '-p^18', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '12b',
    'Level 1',
    'Multiplying three signed powers',
    '(h^12)(-2h^5)(-h^4)',
    [makeStep('simplify', 'Multiply coefficients (−2 × −1 = +2) and add indices', '2h^21', { requireExpanded: true, hint: 'Two negative factors give +, coefficient 2, and 12 + 5 + 4 = 21.' })],
    [
      { promptEq: '(h^8)(-3h^4)(-h^6)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '3h^18', { requireExpanded: true })] },
      { promptEq: '(-4x^5)(x^3)(-x^7)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '4x^15', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '13a',
    'Level 1',
    'Multiplying three monomials',
    '(3m^5)(m^3)(4m^6)',
    [makeStep('simplify', 'Multiply coefficients and add indices of m', '12m^14', { requireExpanded: true, hint: '3 × 1 × 4 = 12, and 5 + 3 + 6 = 14.' })],
    [
      { promptEq: '(2m^4)(m^6)(5m^3)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '10m^13', { requireExpanded: true })] },
      { promptEq: '(4a^2)(3a^5)(a^7)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '12a^14', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '13b',
    'Level 1',
    'Multiplying three monomials',
    '(-5n^10)(-3n^4)(2n^2)',
    [makeStep('simplify', 'Multiply coefficients and add indices of n', '30n^16', { requireExpanded: true, hint: '(−5)(−3)(2) = +30, and 10 + 4 + 2 = 16.' })],
    [
      { promptEq: '(-4n^7)(-2n^5)(3n^3)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '24n^15', { requireExpanded: true })] },
      { promptEq: '(-6y^5)(-2y^4)(5y)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '60y^10', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '14a',
    'Level 1',
    'Multiplying three monomials',
    '(-x^4)(6x^12)(-3x^3)',
    [makeStep('simplify', 'Multiply coefficients and add indices of x', '18x^19', { requireExpanded: true, hint: '(−1)(6)(−3) = 18, and 4 + 12 + 3 = 19.' })],
    [
      { promptEq: '(-x^5)(4x^8)(-5x^2)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '20x^15', { requireExpanded: true })] },
      { promptEq: '(-2a^3)(7a^6)(-a^4)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '14a^13', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '14b',
    'Level 1',
    'Multiplying three monomials',
    '(-2y^6)(-7y^7)(-10y^8)',
    [makeStep('simplify', 'Multiply coefficients and add indices of y', '-140y^21', { requireExpanded: true, hint: '(−2)(−7)(−10) = −140, and 6 + 7 + 8 = 21.' })],
    [
      { promptEq: '(-3y^4)(-5y^6)(-2y^5)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '-30y^15', { requireExpanded: true })] },
      { promptEq: '(-2b^3)(-4b^7)(-6b^4)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '-48b^14', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '15a',
    'Level 1',
    'Combined multiplication & division',
    '((w^7)(w^9))/w^8',
    [
      makeStep('simplify', 'Simplify numerator by adding indices', 'w^16/w^8', { hint: '7 + 9 = 16 in the numerator.' }),
      makeStep('simplify', 'Divide by subtracting indices', 'w^8', { requireExpanded: true, hint: '16 − 8 = 8.' }),
    ],
    [
      {
        promptEq: '((w^5)(w^8))/w^6',
        steps: [
          makeStep('simplify', 'Simplify numerator', 'w^13/w^6'),
          makeStep('simplify', 'Divide powers', 'w^7', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '((a^6)(a^9))/a^10',
        steps: [
          makeStep('simplify', 'Simplify numerator', 'a^15/a^10'),
          makeStep('simplify', 'Divide powers', 'a^5', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '15b',
    'Level 1',
    'Combined multiplication & division',
    '((z^2)(z^11))/(-z^10)',
    [
      makeStep('simplify', 'Simplify numerator by adding indices', 'z^13/(-z^10)', { hint: 'z^2 × z^11 = z^13.' }),
      makeStep('simplify', 'Divide and apply negative sign', '-z^3', { requireExpanded: true, hint: 'z^13 ÷ (−z^10) = −z^3.' }),
    ],
    [
      {
        promptEq: '((z^4)(z^9))/(-z^8)',
        steps: [
          makeStep('simplify', 'Simplify numerator', 'z^13/(-z^8)'),
          makeStep('simplify', 'Divide powers', '-z^5', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '((k^5)(k^7))/(-k^9)',
        steps: [
          makeStep('simplify', 'Simplify numerator', 'k^12/(-k^9)'),
          makeStep('simplify', 'Divide powers', '-k^3', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '16a',
    'Level 1',
    'Combined multiplication & division',
    'u^8/((u^9)(u^5))',
    [
      makeStep('simplify', 'Simplify denominator by adding indices', 'u^8/u^14', { hint: '9 + 5 = 14 in the denominator.' }),
      makeStep('simplify', 'Cancel u^8 from top and bottom', '1/u^6', { requireExpanded: true, hint: '14 − 8 = 6 in the denominator.' }),
    ],
    [
      {
        promptEq: 'u^7/((u^6)(u^5))',
        steps: [
          makeStep('simplify', 'Simplify denominator', 'u^7/u^11'),
          makeStep('simplify', 'Cancel u^7', '1/u^4', { requireExpanded: true }),
        ],
      },
      {
        promptEq: 'x^9/((x^8)(x^7))',
        steps: [
          makeStep('simplify', 'Simplify denominator', 'x^9/x^15'),
          makeStep('simplify', 'Cancel x^9', '1/x^6', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '16b',
    'Level 1',
    'Combined multiplication & division',
    'v^19/((v^10)(v^14))',
    [
      makeStep('simplify', 'Simplify denominator by adding indices', 'v^19/v^24', { hint: '10 + 14 = 24.' }),
      makeStep('simplify', 'Cancel v^19 from top and bottom', '1/v^5', { requireExpanded: true, hint: '24 − 19 = 5 in the denominator.' }),
    ],
    [
      {
        promptEq: 'v^15/((v^8)(v^11))',
        steps: [
          makeStep('simplify', 'Simplify denominator', 'v^15/v^19'),
          makeStep('simplify', 'Cancel v^15', '1/v^4', { requireExpanded: true }),
        ],
      },
      {
        promptEq: 'b^16/((b^9)(b^13))',
        steps: [
          makeStep('simplify', 'Simplify denominator', 'b^16/b^22'),
          makeStep('simplify', 'Cancel b^16', '1/b^6', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '17a',
    'Level 1',
    'Combined multiplication & division',
    '(22m^21)/((m^12)(m^8))',
    [
      makeStep('simplify', 'Simplify denominator by adding indices', '(22m^21)/m^20', { hint: '12 + 8 = 20.' }),
      makeStep('simplify', 'Subtract indices of m', '22m', { requireExpanded: true, hint: 'm^21 ÷ m^20 = m^1 = m.' }),
    ],
    [
      {
        promptEq: '(15m^18)/((m^10)(m^7))',
        steps: [
          makeStep('simplify', 'Simplify denominator', '(15m^18)/m^17'),
          makeStep('simplify', 'Subtract indices', '15m', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(18x^14)/((x^5)(x^6))',
        steps: [
          makeStep('simplify', 'Simplify denominator', '(18x^14)/x^11'),
          makeStep('simplify', 'Subtract indices', '18x^3', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '17b',
    'Level 1',
    'Combined multiplication & division',
    'n^19/((3n^6)(n^5))',
    [
      makeStep('simplify', 'Simplify denominator by multiplying coefficients and adding indices', 'n^19/(3n^11)', { hint: '3 × 1 = 3 and 6 + 5 = 11.' }),
      makeStep('simplify', 'Subtract indices of n', 'n^8/3', { requireExpanded: true, hint: '19 − 11 = 8, keep 3 in the denominator.' }),
    ],
    [
      {
        promptEq: 'n^15/((5n^4)(n^6))',
        steps: [
          makeStep('simplify', 'Simplify denominator', 'n^15/(5n^10)'),
          makeStep('simplify', 'Subtract indices', 'n^5/5', { requireExpanded: true }),
        ],
      },
      {
        promptEq: 'p^17/((4p^7)(p^5))',
        steps: [
          makeStep('simplify', 'Simplify denominator', 'p^17/(4p^12)'),
          makeStep('simplify', 'Subtract indices', 'p^5/4', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '18a',
    'Level 1',
    'Combined multiplication & division',
    '-(x^15)/((x^4)(-x^9))',
    [
      makeStep('simplify', 'Simplify denominator first', '-(x^15)/(-x^13)', { hint: '(x^4)(−x^9) = −x^13.' }),
      makeStep('simplify', 'Cancel double negative and subtract indices', 'x^2', { requireExpanded: true, hint: '−(x^15)/(−x^13) = +x^(15−13) = x^2.' }),
    ],
    [
      {
        promptEq: '-(x^14)/((x^3)(-x^8))',
        steps: [
          makeStep('simplify', 'Simplify denominator', '-(x^14)/(-x^11)'),
          makeStep('simplify', 'Cancel signs and subtract indices', 'x^3', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '-(a^12)/((a^5)(-a^4))',
        steps: [
          makeStep('simplify', 'Simplify denominator', '-(a^12)/(-a^9)'),
          makeStep('simplify', 'Cancel signs and subtract indices', 'a^3', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '18b',
    'Level 1',
    'Combined multiplication & division',
    '(4y^6)/((y^7)(y^8))',
    [
      makeStep('simplify', 'Simplify denominator by adding indices', '(4y^6)/y^15', { hint: '7 + 8 = 15.' }),
      makeStep('simplify', 'Cancel y^6 from top and bottom', '4/y^9', { requireExpanded: true, hint: '15 − 6 = 9 in the denominator.' }),
    ],
    [
      {
        promptEq: '(7y^5)/((y^6)(y^7))',
        steps: [
          makeStep('simplify', 'Simplify denominator', '(7y^5)/y^13'),
          makeStep('simplify', 'Cancel y^5', '7/y^8', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(9m^4)/((m^5)(m^6))',
        steps: [
          makeStep('simplify', 'Simplify denominator', '(9m^4)/m^11'),
          makeStep('simplify', 'Cancel m^4', '9/m^7', { requireExpanded: true }),
        ],
      },
    ],
  ),

  // ── Level 2: Q19–Q27 ──
  sec1Item(
    '19a',
    'Level 2',
    'Fractions with monomial products',
    '((2b^7)(b^4))/(6b^5)',
    [
      makeStep('simplify', 'Multiply terms in the numerator', '(2b^11)/(6b^5)', { hint: '2 × 1 = 2 and b^7 × b^4 = b^11.' }),
      makeStep('simplify', 'Reduce coefficient 2/6 and subtract indices', 'b^6/3', { requireExpanded: true, hint: '2/6 = 1/3 and 11 − 5 = 6.' }),
    ],
    [
      {
        promptEq: '((3b^6)(b^5))/(9b^4)',
        steps: [
          makeStep('simplify', 'Multiply numerator', '(3b^11)/(9b^4)'),
          makeStep('simplify', 'Reduce and subtract indices', 'b^7/3', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '((4a^8)(a^3))/(12a^6)',
        steps: [
          makeStep('simplify', 'Multiply numerator', '(4a^11)/(12a^6)'),
          makeStep('simplify', 'Reduce and subtract indices', 'a^5/3', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '19b',
    'Level 2',
    'Fractions with monomial products',
    '((8c^4)(-4c^8))/(16c^14)',
    [
      makeStep('simplify', 'Multiply terms in the numerator', '(-32c^12)/(16c^14)', { hint: '8 × (−4) = −32 and 4 + 8 = 12.' }),
      makeStep('simplify', 'Divide −32/16 and cancel c^12', '-2/c^2', { requireExpanded: true, hint: '−32 ÷ 16 = −2, and c^14 ÷ c^12 leaves c^2 in the denominator.' }),
    ],
    [
      {
        promptEq: '((6c^5)(-4c^6))/(12c^14)',
        steps: [
          makeStep('simplify', 'Multiply numerator', '(-24c^11)/(12c^14)'),
          makeStep('simplify', 'Reduce and cancel c^11', '-2/c^3', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '((9x^3)(-2x^7))/(6x^14)',
        steps: [
          makeStep('simplify', 'Multiply numerator', '(-18x^10)/(6x^14)'),
          makeStep('simplify', 'Reduce and cancel x^10', '-3/x^4', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '20a',
    'Level 2',
    'Fractions with monomial products',
    '(-25p^15)/((-10p^14)(2p^9))',
    [
      makeStep('simplify', 'Multiply terms in the denominator', '(-25p^15)/(-20p^23)', { hint: '(−10) × 2 = −20 and 14 + 9 = 23.' }),
      makeStep('simplify', 'Cancel signs, reduce 25/20, and cancel p^15', '5/(4p^8)', { requireExpanded: true, hint: '(−25)/(−20) = 5/4, and 23 − 15 = 8 in the denominator.' }),
    ],
    [
      {
        promptEq: '(-18p^12)/((-6p^10)(2p^7))',
        steps: [
          makeStep('simplify', 'Multiply denominator', '(-18p^12)/(-12p^17)'),
          makeStep('simplify', 'Reduce and cancel p^12', '3/(2p^5)', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(-21k^10)/((-3k^8)(5k^6))',
        steps: [
          makeStep('simplify', 'Multiply denominator', '(-21k^10)/(-15k^14)'),
          makeStep('simplify', 'Reduce and cancel k^10', '7/(5k^4)', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '20b',
    'Level 2',
    'Fractions with monomial products',
    '(-36q^22)/((-6q^16)(-9q^5))',
    [
      makeStep('simplify', 'Multiply terms in the denominator', '(-36q^22)/(54q^21)', { hint: '(−6) × (−9) = 54 and 16 + 5 = 21.' }),
      makeStep('simplify', 'Reduce −36/54 by dividing by 18 and subtract indices', '-(2q)/3', { requireExpanded: true, hint: '−36/54 = −2/3 and q^22 ÷ q^21 = q.' }),
    ],
    [
      {
        promptEq: '(-24q^19)/((-4q^12)(-9q^5))',
        steps: [
          makeStep('simplify', 'Multiply denominator', '(-24q^19)/(36q^17)'),
          makeStep('simplify', 'Reduce and subtract indices', '-(2q^2)/3', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(-40m^16)/((-5m^9)(-10m^6))',
        steps: [
          makeStep('simplify', 'Multiply denominator', '(-40m^16)/(50m^15)'),
          makeStep('simplify', 'Reduce and subtract indices', '-(4m)/5', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '21a',
    'Level 2',
    'Fractions with monomial products',
    '((x^15)(4x^2))/((8x^14)(-5x^3))',
    [
      makeStep('simplify', 'Multiply numerator and denominator separately', '(4x^17)/(-40x^17)', { hint: 'Top: 4x^17; bottom: 8 × (−5)x^(14+3) = −40x^17.' }),
      makeStep('simplify', 'Cancel x^17 and reduce 4/(−40)', '-1/10', { requireExpanded: true, hint: 'x^17/x^17 = 1 and 4/(−40) = −1/10.' }),
    ],
    [
      {
        promptEq: '((x^10)(6x^3))/((9x^8)(-4x^5))',
        steps: [
          makeStep('simplify', 'Multiply numerator and denominator', '(6x^13)/(-36x^13)'),
          makeStep('simplify', 'Cancel x^13 and reduce', '-1/6', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '((a^9)(3a^4))/((6a^7)(-5a^6))',
        steps: [
          makeStep('simplify', 'Multiply numerator and denominator', '(3a^13)/(-30a^13)'),
          makeStep('simplify', 'Cancel a^13 and reduce', '-1/10', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '21b',
    'Level 2',
    'Fractions with monomial products',
    '((-7y^6)(10y^8))/((2y^12)(-14y^11))',
    [
      makeStep('simplify', 'Multiply numerator and denominator separately', '(-70y^14)/(-28y^23)', { hint: 'Top: −70y^14; bottom: −28y^23.' }),
      makeStep('simplify', 'Cancel signs, reduce 70/28, and cancel y^14', '5/(2y^9)', { requireExpanded: true, hint: '70/28 = 5/2 and 23 − 14 = 9 in the denominator.' }),
    ],
    [
      {
        promptEq: '((-5y^4)(12y^7))/((3y^10)(-8y^9))',
        steps: [
          makeStep('simplify', 'Multiply numerator and denominator', '(-60y^11)/(-24y^19)'),
          makeStep('simplify', 'Reduce and cancel y^11', '5/(2y^8)', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '((-3b^5)(8b^6))/((4b^9)(-9b^7))',
        steps: [
          makeStep('simplify', 'Multiply numerator and denominator', '(-24b^11)/(-36b^16)'),
          makeStep('simplify', 'Reduce and cancel b^11', '2/(3b^5)', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '22a',
    'Level 2',
    'Two-variable monomial products',
    '(a^5)(a^2b^4)',
    [makeStep('simplify', 'Add indices of a and keep b^4', 'a^7b^4', { requireExpanded: true, hint: 'Only bases that match combine: a^5 × a^2 = a^7.' })],
    [
      { promptEq: '(a^4)(a^3b^5)', steps: [makeStep('simplify', 'Add indices of a', 'a^7b^5', { requireExpanded: true })] },
      { promptEq: '(x^6)(x^2y^3)', steps: [makeStep('simplify', 'Add indices of x', 'x^8y^3', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '22b',
    'Level 2',
    'Two-variable monomial products',
    '(mn^9)(m^8n^3)',
    [makeStep('simplify', 'Add indices of m and n separately', 'm^9n^12', { requireExpanded: true, hint: 'm = m^1, so m^1 × m^8 = m^9 and n^9 × n^3 = n^12.' })],
    [
      { promptEq: '(mn^6)(m^5n^4)', steps: [makeStep('simplify', 'Add indices of m and n', 'm^6n^10', { requireExpanded: true })] },
      { promptEq: '(ab^7)(a^4b^2)', steps: [makeStep('simplify', 'Add indices of a and b', 'a^5b^9', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '23a',
    'Level 2',
    'Two-variable monomial products',
    '(g^10h^3)(4g^2h^11)',
    [makeStep('simplify', 'Multiply coefficients and add indices of g and h', '4g^12h^14', { requireExpanded: true, hint: 'g: 10 + 2 = 12; h: 3 + 11 = 14.' })],
    [
      { promptEq: '(g^7h^4)(5g^3h^8)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '5g^10h^12', { requireExpanded: true })] },
      { promptEq: '(3x^5y^2)(x^4y^9)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '3x^9y^11', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '23b',
    'Level 2',
    'Two-variable monomial products',
    '(2p^5q^7)(-p^8q^9)',
    [makeStep('simplify', 'Multiply coefficients and add indices of p and q', '-2p^13q^16', { requireExpanded: true, hint: '2 × (−1) = −2, p^(5+8) = p^13, q^(7+9) = q^16.' })],
    [
      { promptEq: '(4p^3q^6)(-p^5q^8)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '-4p^8q^14', { requireExpanded: true })] },
      { promptEq: '(-3a^4b^5)(a^7b^2)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '-3a^11b^7', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '24a',
    'Level 2',
    'Two-variable monomial products',
    '(-7uv^10)(6u^8v)',
    [makeStep('simplify', 'Multiply coefficients and add indices of u and v', '-42u^9v^11', { requireExpanded: true, hint: '(−7)(6) = −42, u^(1+8) = u^9, v^(10+1) = v^11.' })],
    [
      { promptEq: '(-5uv^7)(4u^6v)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '-20u^7v^8', { requireExpanded: true })] },
      { promptEq: '(-8xy^9)(3x^4y)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '-24x^5y^10', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '24b',
    'Level 2',
    'Two-variable monomial products',
    '(-8x^5y^3)(-3x^2y^2)',
    [makeStep('simplify', 'Multiply coefficients and add indices of x and y', '24x^7y^5', { requireExpanded: true, hint: '(−8)(−3) = 24, x^(5+2) = x^7, y^(3+2) = y^5.' })],
    [
      { promptEq: '(-6x^4y^5)(-4x^3y^2)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '24x^7y^7', { requireExpanded: true })] },
      { promptEq: '(-9m^3n^4)(-2m^5n^6)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '18m^8n^10', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '25a',
    'Level 2',
    'Two-variable monomial division',
    'm^8/(m^3n^4)',
    [makeStep('simplify', 'Cancel m^3 from top and bottom; keep n^4 in denominator', 'm^5/n^4', { requireExpanded: true, hint: 'm^8 ÷ m^3 = m^5; n^4 stays in the denominator.' })],
    [
      { promptEq: 'm^9/(m^4n^5)', steps: [makeStep('simplify', 'Cancel m^4', 'm^5/n^5', { requireExpanded: true })] },
      { promptEq: 'a^7/(a^2b^6)', steps: [makeStep('simplify', 'Cancel a^2', 'a^5/b^6', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '25b',
    'Level 2',
    'Two-variable monomial division',
    '(p^7q^12)/(6p^11q^5)',
    [makeStep('simplify', 'Cancel p^7 and q^5 from top and bottom', 'q^7/(6p^4)', { requireExpanded: true, hint: 'p: 11 − 7 = 4 in denominator; q: 12 − 5 = 7 in numerator.' })],
    [
      { promptEq: '(p^5q^10)/(4p^9q^3)', steps: [makeStep('simplify', 'Cancel p^5 and q^3', 'q^7/(4p^4)', { requireExpanded: true })] },
      { promptEq: '(x^6y^11)/(5x^10y^4)', steps: [makeStep('simplify', 'Cancel x^6 and y^4', 'y^7/(5x^4)', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '26a',
    'Level 2',
    'Two-variable monomial division',
    '(21a^2b^9)/(-12b^6)',
    [makeStep('simplify', 'Reduce 21/(−12) by 3 and subtract indices of b', '-(7a^2b^3)/4', { requireExpanded: true, hint: '21/(−12) = −7/4, a^2 stays, and b^9 ÷ b^6 = b^3.' })],
    [
      { promptEq: '(18a^3b^8)/(-12b^5)', steps: [makeStep('simplify', 'Reduce and subtract indices of b', '-(3a^3b^3)/2', { requireExpanded: true })] },
      { promptEq: '(15x^4y^7)/(-10y^2)', steps: [makeStep('simplify', 'Reduce and subtract indices of y', '-(3x^4y^5)/2', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '26b',
    'Level 2',
    'Two-variable monomial division',
    '(-8u^6v^3)/(-24u^12v^9)',
    [makeStep('simplify', 'Cancel signs, divide by 8, and cancel u^6v^3', '1/(3u^6v^6)', { requireExpanded: true, hint: '(−8)/(−24) = 1/3, u^(12−6) = u^6, and v^(9−3) = v^6 in denominator.' })],
    [
      { promptEq: '(-6u^4v^2)/(-18u^9v^7)', steps: [makeStep('simplify', 'Reduce and cancel u^4v^2', '1/(3u^5v^5)', { requireExpanded: true })] },
      { promptEq: '(-9a^5b^3)/(-36a^10b^8)', steps: [makeStep('simplify', 'Reduce and cancel a^5b^3', '1/(4a^5b^5)', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '27a',
    'Level 2',
    'Two-variable monomial division',
    '(12a^7b^4)/(-15a^3b^3)',
    [makeStep('simplify', 'Reduce 12/(−15) by 3 and subtract indices of a and b', '-(4a^4b)/5', { requireExpanded: true, hint: '12/(−15) = −4/5, a^(7−3) = a^4, b^(4−3) = b.' })],
    [
      { promptEq: '(16a^8b^5)/(-20a^4b^4)', steps: [makeStep('simplify', 'Reduce and subtract indices', '-(4a^4b)/5', { requireExpanded: true })] },
      { promptEq: '(14m^6n^3)/(-21m^2n^2)', steps: [makeStep('simplify', 'Reduce and subtract indices', '-(2m^4n)/3', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '27b',
    'Level 2',
    'Two-variable monomial division',
    '(-64m^13n^17)/(32m^7n^21)',
    [makeStep('simplify', 'Divide −64/32 and cancel m^7n^17', '-(2m^6)/n^4', { requireExpanded: true, hint: '−64/32 = −2, m^(13−7) = m^6 on top, and n^(21−17) = n^4 on bottom.' })],
    [
      { promptEq: '(-48m^11n^14)/(16m^6n^19)', steps: [makeStep('simplify', 'Divide coefficients and cancel powers', '-(3m^5)/n^5', { requireExpanded: true })] },
      { promptEq: '(-54x^12y^15)/(18x^8y^20)', steps: [makeStep('simplify', 'Divide coefficients and cancel powers', '-(3x^4)/y^5', { requireExpanded: true })] },
    ],
  ),

  // ── Level 3: Q28–Q31 ──
  sec1Item(
    '28a',
    'Level 3',
    'Triple two-variable products',
    '(2a^2b^3)(4a^4b^5)(6a^6b^7)',
    [makeStep('simplify', 'Multiply coefficients (2×4×6) and add indices of a and b', '48a^12b^15', { requireExpanded: true, hint: '2×4×6 = 48; a^(2+4+6) = a^12; b^(3+5+7) = b^15.' })],
    [
      { promptEq: '(2a^3b^2)(3a^4b^5)(5a^2b^4)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '30a^9b^11', { requireExpanded: true })] },
      { promptEq: '(3x^2y)(2x^5y^3)(4x^3y^6)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '24x^10y^10', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '28b',
    'Level 3',
    'Triple two-variable products',
    '(-3b^6)(10ab^8)(-5a^5b^10)',
    [makeStep('simplify', 'Multiply coefficients and add indices of a and b', '150a^6b^24', { requireExpanded: true, hint: '(−3)(10)(−5) = +150; a^(1+5) = a^6; b^(6+8+10) = b^24.' })],
    [
      { promptEq: '(-2b^4)(8ab^5)(-3a^4b^7)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '48a^5b^16', { requireExpanded: true })] },
      { promptEq: '(-4y^5)(5xy^3)(-2x^3y^6)', steps: [makeStep('simplify', 'Multiply coefficients and add indices', '40x^4y^14', { requireExpanded: true })] },
    ],
  ),
  sec1Item(
    '29a',
    'Level 3',
    'Multi-step two-variable quotients',
    '(27g^10h^12)/((3g^11h^9)(-g^5h^8))',
    [
      makeStep('simplify', 'Multiply factors in the denominator', '(27g^10h^12)/(-3g^16h^17)', { hint: '(3g^11h^9)(−g^5h^8) = −3g^16h^17.' }),
      makeStep('simplify', 'Divide 27/(−3) and cancel g^10h^12', '-9/(g^6h^5)', { requireExpanded: true, hint: '27/(−3) = −9, g^(16−10) = g^6 and h^(17−12) = h^5 in denominator.' }),
    ],
    [
      {
        promptEq: '(24g^8h^10)/((4g^10h^7)(-2g^3h^6))',
        steps: [
          makeStep('simplify', 'Multiply denominator', '(24g^8h^10)/(-8g^13h^13)'),
          makeStep('simplify', 'Divide and cancel powers', '-3/(g^5h^3)', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(30x^7y^9)/((5x^9y^6)(-2x^4y^8))',
        steps: [
          makeStep('simplify', 'Multiply denominator', '(30x^7y^9)/(-10x^13y^14)'),
          makeStep('simplify', 'Divide and cancel powers', '-3/(x^6y^5)', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '29b',
    'Level 3',
    'Multi-step two-variable quotients',
    '(4p^20q^23)/((-p^11q^5)(2p^6q^15))',
    [
      makeStep('simplify', 'Multiply factors in the denominator', '(4p^20q^23)/(-2p^17q^20)', { hint: '(−p^11q^5)(2p^6q^15) = −2p^17q^20.' }),
      makeStep('simplify', 'Divide 4/(−2) and subtract indices of p and q', '-2p^3q^3', { requireExpanded: true, hint: '4/(−2) = −2, p^(20−17) = p^3, q^(23−20) = q^3.' }),
    ],
    [
      {
        promptEq: '(6p^18q^21)/((-p^9q^6)(3p^5q^11))',
        steps: [
          makeStep('simplify', 'Multiply denominator', '(6p^18q^21)/(-3p^14q^17)'),
          makeStep('simplify', 'Divide and subtract indices', '-2p^4q^4', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '(10a^16b^19)/((-2a^7b^8)(a^6b^7))',
        steps: [
          makeStep('simplify', 'Multiply denominator', '(10a^16b^19)/(-2a^13b^15)'),
          makeStep('simplify', 'Divide and subtract indices', '-5a^3b^4', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '30a',
    'Level 3',
    'Multi-step two-variable quotients',
    '((18r^8s^3)(-2rs^3))/(6r^3s^4)',
    [
      makeStep('simplify', 'Multiply terms in the numerator', '(-36r^9s^6)/(6r^3s^4)', { hint: '18 × (−2) = −36, r^(8+1) = r^9, s^(3+3) = s^6.' }),
      makeStep('simplify', 'Divide −36/6 and subtract indices of r and s', '-6r^6s^2', { requireExpanded: true, hint: '−36/6 = −6, r^(9−3) = r^6, s^(6−4) = s^2.' }),
    ],
    [
      {
        promptEq: '((12r^6s^4)(-3rs^2))/(9r^2s^3)',
        steps: [
          makeStep('simplify', 'Multiply numerator', '(-36r^7s^6)/(9r^2s^3)'),
          makeStep('simplify', 'Divide and subtract indices', '-4r^5s^3', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '((15x^5y^4)(-2x^2y^3))/(5x^3y^2)',
        steps: [
          makeStep('simplify', 'Multiply numerator', '(-30x^7y^7)/(5x^3y^2)'),
          makeStep('simplify', 'Divide and subtract indices', '-6x^4y^5', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '30b',
    'Level 3',
    'Multi-step two-variable quotients',
    '-((-6u^5)(3u^4v^4))/(24u^11v^10)',
    [
      makeStep('simplify', 'Multiply terms in the numerator', '-(-18u^9v^4)/(24u^11v^10)', { hint: '(−6u^5)(3u^4v^4) = −18u^9v^4.' }),
      makeStep('simplify', 'Cancel double negative, reduce 18/24, and cancel u^9v^4', '3/(4u^2v^6)', { requireExpanded: true, hint: '−(−18)/24 = +3/4; u^(11−9) = u^2 and v^(10−4) = v^6 in denominator.' }),
    ],
    [
      {
        promptEq: '-((-4u^4)(6u^3v^5))/(16u^10v^9)',
        steps: [
          makeStep('simplify', 'Multiply numerator', '-(-24u^7v^5)/(16u^10v^9)'),
          makeStep('simplify', 'Cancel signs, reduce and cancel powers', '3/(2u^3v^4)', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '-((-5a^6)(4a^2b^3))/(30a^11b^8)',
        steps: [
          makeStep('simplify', 'Multiply numerator', '-(-20a^8b^3)/(30a^11b^8)'),
          makeStep('simplify', 'Cancel signs, reduce and cancel powers', '2/(3a^3b^5)', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '31a',
    'Level 3',
    'Full monomial fraction simplification',
    '((m^7n^2)(12n^7))/((6m)(4m^4n^5))',
    [
      makeStep('simplify', 'Multiply numerator and denominator separately', '(12m^7n^9)/(24m^5n^5)', { hint: 'Top: 12m^7n^9; bottom: 24m^5n^5.' }),
      makeStep('simplify', 'Reduce 12/24 to 1/2 and subtract indices', '(m^2n^4)/2', { requireExpanded: true, hint: '12/24 = 1/2, m^(7−5) = m^2, n^(9−5) = n^4.' }),
    ],
    [
      {
        promptEq: '((m^8n^3)(6n^5))/((3m)(4m^3n^4))',
        steps: [
          makeStep('simplify', 'Multiply numerator and denominator', '(6m^8n^8)/(12m^4n^4)'),
          makeStep('simplify', 'Reduce and subtract indices', '(m^4n^4)/2', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '((p^9q^4)(10q^6))/((5p)(6p^4q^5))',
        steps: [
          makeStep('simplify', 'Multiply numerator and denominator', '(10p^9q^10)/(30p^5q^5)'),
          makeStep('simplify', 'Reduce and subtract indices', '(p^4q^5)/3', { requireExpanded: true }),
        ],
      },
    ],
  ),
  sec1Item(
    '31b',
    'Level 3',
    'Full monomial fraction simplification',
    '((-6x^3y^6)(-10x^5y^2))/((3x^8y^13)(-15x^4y^7))',
    [
      makeStep('simplify', 'Multiply numerator and denominator separately', '(60x^8y^8)/(-45x^12y^20)', { hint: 'Top: +60x^8y^8; bottom: −45x^12y^20.' }),
      makeStep('simplify', 'Reduce 60/(−45) by 15 and cancel x^8y^8', '-4/(3x^4y^12)', { requireExpanded: true, hint: '60/(−45) = −4/3; x^(12−8) = x^4 and y^(20−8) = y^12 in denominator.' }),
    ],
    [
      {
        promptEq: '((-4x^2y^5)(-9x^4y^3))/((2x^7y^10)(-12x^3y^6))',
        steps: [
          makeStep('simplify', 'Multiply numerator and denominator', '(36x^6y^8)/(-24x^10y^16)'),
          makeStep('simplify', 'Reduce and cancel powers', '-3/(2x^4y^8)', { requireExpanded: true }),
        ],
      },
      {
        promptEq: '((-8a^4b^3)(-5a^3b^4))/((4a^9b^9)(-15a^2b^5))',
        steps: [
          makeStep('simplify', 'Multiply numerator and denominator', '(40a^7b^7)/(-60a^11b^14)'),
          makeStep('simplify', 'Reduce and cancel powers', '-2/(3a^4b^7)', { requireExpanded: true }),
        ],
      },
    ],
  ),

  // ── Multiple Choice Questions: Q32–Q35 ──
  sec1Item(
    '32',
    'MCQ',
    'Index laws MCQ',
    '(-7a^3)(-5a^3)',
    [
      makeStep('mcq', 'Multiply coefficients and add indices of a', '35a^6', {
        hint: '(−7)(−5) = +35, and a^3 × a^3 = a^(3+3) = a^6.',
        wrongMoves: ['Add coefficients (−7 + −5)', 'Multiply the exponents (3 × 3)'],
        mcqOptions: [
          { label: 'A', text: '-12a^3' },
          { label: 'B', text: '-12a^6' },
          { label: 'C', text: '35a^6' },
          { label: 'D', text: '35a^9' },
        ],
        correctMcq: 'C',
      }),
    ],
    [
      {
        promptEq: '(-4a^5)(-6a^5)',
        steps: [
          makeStep('mcq', 'Multiply coefficients and add indices of a', '24a^10', {
            mcqOptions: [
              { label: 'A', text: '-10a^5' },
              { label: 'B', text: '-10a^10' },
              { label: 'C', text: '24a^10' },
              { label: 'D', text: '24a^25' },
            ],
            correctMcq: 'C',
          }),
        ],
      },
    ],
    { promptText: 'Simplify the expression and choose the correct option:' },
  ),
  sec1Item(
    '33',
    'MCQ',
    'Index laws MCQ',
    '(18y^7)/(6y^14)',
    [
      makeStep('mcq', 'Divide 18 by 6 and cancel y^7 from top and bottom', '3/y^7', {
        hint: '18 ÷ 6 = 3, and y^14 ÷ y^7 leaves y^7 in the denominator.',
        wrongMoves: ['Divide the exponents 14 ÷ 7 = 2', 'Keep y^7 in the numerator'],
        mcqOptions: [
          { label: 'A', text: '3y^2' },
          { label: 'B', text: '3y^7' },
          { label: 'C', text: '3/y^2' },
          { label: 'D', text: '3/y^7' },
        ],
        correctMcq: 'D',
      }),
    ],
    [
      {
        promptEq: '(20y^5)/(5y^10)',
        steps: [
          makeStep('mcq', 'Divide 20 by 5 and cancel y^5 from top and bottom', '4/y^5', {
            mcqOptions: [
              { label: 'A', text: '4y^2' },
              { label: 'B', text: '4y^5' },
              { label: 'C', text: '4/y^2' },
              { label: 'D', text: '4/y^5' },
            ],
            correctMcq: 'D',
          }),
        ],
      },
    ],
    { promptText: 'Simplify the expression and choose the correct option:' },
  ),
  sec1Item(
    '34',
    'MCQ',
    'Index laws MCQ',
    '((7x^2y^8)(xy^9))/(14x^4y^4)',
    [
      makeStep('mcq', 'Multiply numerator (7x^3y^17) and simplify against denominator (14x^4y^4)', 'y^13/(2x)', {
        hint: '7/14 = 1/2, x^3/x^4 = 1/x, and y^17/y^4 = y^13.',
        wrongMoves: ['Multiply exponents when multiplying bases', 'Add the exponents in numerator and denominator'],
        mcqOptions: [
          { label: 'A', text: 'y^13/(2x)' },
          { label: 'B', text: 'y^18/(2x^2)' },
          { label: 'C', text: 'y^13/(7x)' },
          { label: 'D', text: 'y^18/(7x^2)' },
        ],
        correctMcq: 'A',
      }),
    ],
    [
      {
        promptEq: '((5x^3y^6)(xy^8))/(15x^5y^3)',
        steps: [
          makeStep('mcq', 'Multiply numerator and simplify against denominator', 'y^11/(3x)', {
            mcqOptions: [
              { label: 'A', text: 'y^11/(3x)' },
              { label: 'B', text: 'y^14/(3x^2)' },
              { label: 'C', text: 'y^11/(10x)' },
              { label: 'D', text: 'y^14/(10x^2)' },
            ],
            correctMcq: 'A',
          }),
        ],
      },
    ],
    { promptText: 'Simplify the expression and choose the correct option:' },
  ),
  sec1Item(
    '35',
    'MCQ',
    'Indices vs like terms MCQ',
    '((2h)(2h)(2h))/(2h+2h+2h)',
    [
      makeStep('mcq', 'Multiply numerator (8h^3) and add like terms in denominator (6h), then reduce', '(4h^2)/3', {
        hint: 'Top = (2h)^3 = 8h^3; bottom = 2h + 2h + 2h = 6h. Then 8h^3 / (6h) = 4h^2 / 3.',
        wrongMoves: ['Treat addition in denominator as multiplication', 'Cancel 2h directly with all three terms added'],
        mcqOptions: [
          { label: 'A', text: '1' },
          { label: 'B', text: 'h^2' },
          { label: 'C', text: '4/3' },
          { label: 'D', text: '(4h^2)/3' },
        ],
        correctMcq: 'D',
      }),
    ],
    [
      {
        promptEq: '((3k)(3k)(3k))/(3k+3k+3k)',
        steps: [
          makeStep('mcq', 'Compute numerator 27k^3 and denominator 9k, then divide', '3k^2', {
            mcqOptions: [
              { label: 'A', text: '1' },
              { label: 'B', text: '3k' },
              { label: 'C', text: '3k^2' },
              { label: 'D', text: '9k^2' },
            ],
            correctMcq: 'C',
          }),
        ],
      },
    ],
    { promptText: 'Simplify the expression and choose the correct option:' },
  ),
];
