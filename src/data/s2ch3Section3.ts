import { balanceMove, makeStep } from './stepHelpers';
import type { QuestionItem, QuestionLevel, QuestionVariant } from './types';

function s3(
  num: string,
  level: QuestionLevel,
  topicTag: string,
  promptEq: string,
  targetVar: string,
  steps: QuestionVariant['steps'],
  sims: QuestionVariant[],
  opts?: { sourceTag?: string; promptText?: string; mode?: 'subject' | 'change' },
): QuestionItem {
  return {
    id: `s3-q${num}`,
    numberLabel: `Q${num}`,
    sectionId: 'sec3',
    level,
    mode: opts?.mode || 'subject',
    topicTag,
    sourceTag: opts?.sourceTag,
    promptEq,
    promptText: opts?.promptText || `Make ${targetVar} the subject of the formula:`,
    targetVar,
    steps,
    sims,
  };
}

export const SECTION_3_QUESTIONS: QuestionItem[] = [
  // ── Level 1: Q105–122 ──
  s3(
    '105',
    'Level 1',
    'Basic subject change',
    'x + 2y = 7',
    'y',
    [
      balanceMove('sub', 'x', '2y = 7 - x'),
      balanceMove('div', '2', 'y = (7 - x)/2'),
    ],
    [
      {
        promptEq: 'x + 3y = 10',
        targetVar: 'y',
        steps: [balanceMove('sub', 'x', '3y = 10 - x'), balanceMove('div', '3', 'y = (10 - x)/3')],
      },
      {
        promptEq: 'a + 4b = 9',
        targetVar: 'b',
        steps: [balanceMove('sub', 'a', '4b = 9 - a'), balanceMove('div', '4', 'b = (9 - a)/4')],
      },
    ],
    { sourceTag: '~TSA 2024' },
  ),
  s3(
    '106',
    'Level 1',
    'Basic subject change',
    'M = 6 - 3n',
    'n',
    [
      balanceMove('add', '3n', 'M + 3n = 6'),
      balanceMove('sub', 'M', '3n = 6 - M'),
      balanceMove('div', '3', 'n = (6 - M)/3'),
    ],
    [
      {
        promptEq: 'M = 8 - 5n',
        targetVar: 'n',
        steps: [balanceMove('add', '5n', 'M + 5n = 8'), balanceMove('sub', 'M', '5n = 8 - M'), balanceMove('div', '5', 'n = (8 - M)/5')],
      },
      {
        promptEq: 'K = 12 - 4p',
        targetVar: 'p',
        steps: [balanceMove('add', '4p', 'K + 4p = 12'), balanceMove('sub', 'K', '4p = 12 - K'), balanceMove('div', '4', 'p = (12 - K)/4')],
      },
    ],
    { sourceTag: '~TSA 2018' },
  ),
  s3(
    '107',
    'Level 1',
    'Clearing a fraction',
    'a = (b - 3)/4',
    'b',
    [
      balanceMove('mul', '4', '4a = b - 3'),
      balanceMove('add', '3', 'b = 4a + 3'),
    ],
    [
      {
        promptEq: 'a = (b - 5)/3',
        targetVar: 'b',
        steps: [balanceMove('mul', '3', '3a = b - 5'), balanceMove('add', '5', 'b = 3a + 5')],
      },
      {
        promptEq: 'x = (y + 7)/5',
        targetVar: 'y',
        steps: [balanceMove('mul', '5', '5x = y + 7'), balanceMove('sub', '7', 'y = 5x - 7')],
      },
    ],
    { sourceTag: '~TSA 2021' },
  ),
  s3(
    '108',
    'Level 1',
    'Variable in denominator',
    '(6 - 5x)/y = 7',
    'x',
    [
      balanceMove('mul', 'y', '6 - 5x = 7y'),
      balanceMove('sub', '6', '-5x = 7y - 6'),
      balanceMove('div', '-5', 'x = (6 - 7y)/5'),
    ],
    [
      {
        promptEq: '(8 - 3x)/y = 5',
        targetVar: 'x',
        steps: [balanceMove('mul', 'y', '8 - 3x = 5y'), balanceMove('sub', '8', '-3x = 5y - 8'), balanceMove('div', '-3', 'x = (8 - 5y)/3')],
      },
      {
        promptEq: '(4 - 7a)/b = 3',
        targetVar: 'a',
        steps: [balanceMove('mul', 'b', '4 - 7a = 3b'), balanceMove('sub', '4', '-7a = 3b - 4'), balanceMove('div', '-7', 'a = (4 - 3b)/7')],
      },
    ],
    { sourceTag: '~HKDSE 2021 (I) Q2' },
  ),
  s3(
    '109',
    'Level 1',
    'Grouping like terms',
    '3c - d = 5d + 2',
    'd',
    [
      balanceMove('add', 'd', '3c = 6d + 2'),
      balanceMove('sub', '2', '3c - 2 = 6d'),
      balanceMove('div', '6', 'd = (3c - 2)/6'),
    ],
    [
      {
        promptEq: '4a - b = 3b + 5',
        targetVar: 'b',
        steps: [balanceMove('add', 'b', '4a = 4b + 5'), balanceMove('sub', '5', '4a - 5 = 4b'), balanceMove('div', '4', 'b = (4a - 5)/4')],
      },
      {
        promptEq: '5x - 2y = 4y + 7',
        targetVar: 'y',
        steps: [balanceMove('add', '2y', '5x = 6y + 7'), balanceMove('sub', '7', '5x - 7 = 6y'), balanceMove('div', '6', 'y = (5x - 7)/6')],
      },
    ],
  ),
  s3(
    '110',
    'Level 1',
    'Subject in numerator and denominator',
    '(2a - 4b + 3)/b = 6',
    'b',
    [
      balanceMove('mul', 'b', '2a - 4b + 3 = 6b'),
      balanceMove('add', '4b', '2a + 3 = 10b'),
      balanceMove('div', '10', 'b = (2a + 3)/10'),
    ],
    [
      {
        promptEq: '(3a - 2b + 5)/b = 4',
        targetVar: 'b',
        steps: [balanceMove('mul', 'b', '3a - 2b + 5 = 4b'), balanceMove('add', '2b', '3a + 5 = 6b'), balanceMove('div', '6', 'b = (3a + 5)/6')],
      },
      {
        promptEq: '(4x - 3y + 1)/y = 5',
        targetVar: 'y',
        steps: [balanceMove('mul', 'y', '4x - 3y + 1 = 5y'), balanceMove('add', '3y', '4x + 1 = 8y'), balanceMove('div', '8', 'y = (4x + 1)/8')],
      },
    ],
    { sourceTag: '~HKDSE 2015 (I) Q2' },
  ),
  s3(
    '111',
    'Level 1',
    'Brackets and grouping',
    '7(x + 8y) = 5x - 4',
    'x',
    [
      makeStep('expand', 'Expand the bracket on the left side', '7x + 56y = 5x - 4'),
      balanceMove('sub', '5x', '2x + 56y = -4'),
      balanceMove('sub', '56y', '2x = -56y - 4'),
      balanceMove('div', '2', 'x = -28y - 2'),
    ],
    [
      {
        promptEq: '5(x + 4y) = 3x - 6',
        targetVar: 'x',
        steps: [
          makeStep('expand', 'Expand the bracket on the left side', '5x + 20y = 3x - 6'),
          balanceMove('sub', '3x', '2x + 20y = -6'),
          balanceMove('sub', '20y', '2x = -20y - 6'),
          balanceMove('div', '2', 'x = -10y - 3'),
        ],
      },
      {
        promptEq: '6(a + 3b) = 4a - 8',
        targetVar: 'a',
        steps: [
          makeStep('expand', 'Expand the bracket on the left side', '6a + 18b = 4a - 8'),
          balanceMove('sub', '4a', '2a + 18b = -8'),
          balanceMove('sub', '18b', '2a = -18b - 8'),
          balanceMove('div', '2', 'a = -9b - 4'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2019 (I) Q1' },
  ),
  s3(
    '112',
    'Level 1',
    'Fractions and grouping',
    '(2m + n)/7 = n - 2',
    'm',
    [
      balanceMove('mul', '7', '2m + n = 7(n - 2)'),
      makeStep('expand', 'Expand the bracket on the right side', '2m + n = 7n - 14'),
      balanceMove('sub', 'n', '2m = 6n - 14'),
      balanceMove('div', '2', 'm = 3n - 7'),
    ],
    [
      {
        promptEq: '(2m + n)/5 = n - 4',
        targetVar: 'm',
        steps: [
          balanceMove('mul', '5', '2m + n = 5n - 20'),
          balanceMove('sub', 'n', '2m = 4n - 20'),
          balanceMove('div', '2', 'm = 2n - 10'),
        ],
      },
      {
        promptEq: '(3p + q)/4 = q - 3',
        targetVar: 'p',
        steps: [
          balanceMove('mul', '4', '3p + q = 4q - 12'),
          balanceMove('sub', 'q', '3p = 3q - 12'),
          balanceMove('div', '3', 'p = q - 4'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2012 (I) Q2' },
  ),
  s3(
    '113',
    'Level 1',
    'Cross-multiplying fractions',
    '(m + 3)/4 = (n + 2)/5',
    'n',
    [
      balanceMove('mul', '20', '5(m + 3) = 4(n + 2)'),
      makeStep('expand', 'Expand the brackets on both sides', '5m + 15 = 4n + 8'),
      balanceMove('sub', '8', '5m + 7 = 4n'),
      balanceMove('div', '4', 'n = (5m + 7)/4'),
    ],
    [
      {
        promptEq: '(m + 2)/3 = (n + 1)/4',
        targetVar: 'n',
        steps: [
          balanceMove('mul', '12', '4(m + 2) = 3(n + 1)'),
          makeStep('expand', 'Expand both sides', '4m + 8 = 3n + 3'),
          balanceMove('sub', '3', '4m + 5 = 3n'),
          balanceMove('div', '3', 'n = (4m + 5)/3'),
        ],
      },
      {
        promptEq: '(x + 4)/2 = (y + 3)/5',
        targetVar: 'y',
        steps: [
          balanceMove('mul', '10', '5(x + 4) = 2(y + 3)'),
          makeStep('expand', 'Expand both sides', '5x + 20 = 2y + 6'),
          balanceMove('sub', '6', '5x + 14 = 2y'),
          balanceMove('div', '2', 'y = (5x + 14)/2'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2018 (I) Q1' },
  ),
  s3(
    '114',
    'Level 1',
    'Subject in denominator',
    '(2m)/(n + 1) = 3',
    'n',
    [
      balanceMove('mul', '(n + 1)', '2m = 3(n + 1)'),
      makeStep('expand', 'Expand the right side', '2m = 3n + 3'),
      balanceMove('sub', '3', '2m - 3 = 3n'),
      balanceMove('div', '3', 'n = (2m - 3)/3'),
    ],
    [
      {
        promptEq: '(4a)/(b + 2) = 5',
        targetVar: 'b',
        steps: [
          balanceMove('mul', '(b + 2)', '4a = 5b + 10'),
          balanceMove('sub', '10', '4a - 10 = 5b'),
          balanceMove('div', '5', 'b = (4a - 10)/5'),
        ],
      },
      {
        promptEq: '(3x)/(y - 1) = 4',
        targetVar: 'y',
        steps: [
          balanceMove('mul', '(y − 1)', '3x = 4y - 4'),
          balanceMove('add', '4', '3x + 4 = 4y'),
          balanceMove('div', '4', 'y = (3x + 4)/4'),
        ],
      },
    ],
  ),
  s3(
    '115',
    'Level 1',
    'Subject in denominator',
    '(y - 2)/x = y + 1',
    'x',
    [
      balanceMove('mul', 'x', 'y - 2 = x(y + 1)'),
      balanceMove('div', '(y + 1)', 'x = (y - 2)/(y + 1)'),
    ],
    [
      {
        promptEq: '(a - 3)/x = a + 2',
        targetVar: 'x',
        steps: [
          balanceMove('mul', 'x', 'a - 3 = x(a + 2)'),
          balanceMove('div', '(a + 2)', 'x = (a - 3)/(a + 2)'),
        ],
      },
      {
        promptEq: '(m + 5)/n = m - 1',
        targetVar: 'n',
        steps: [
          balanceMove('mul', 'n', 'm + 5 = n(m - 1)'),
          balanceMove('div', '(m − 1)', 'n = (m + 5)/(m - 1)'),
        ],
      },
    ],
  ),
  s3(
    '116',
    'Level 1',
    'Factorizing subject out',
    '(7 + q)/(1 - q) = 6p',
    'q',
    [
      balanceMove('mul', '(1 − q)', '7 + q = 6p(1 - q)'),
      makeStep('expand', 'Expand the bracket on the right side', '7 + q = 6p - 6pq'),
      makeStep('group', 'Move all terms with q to the left side', 'q + 6pq = 6p - 7'),
      makeStep('factor', 'Factorize q out on the left side', 'q(1 + 6p) = 6p - 7'),
      balanceMove('div', '(1 + 6p)', 'q = (6p - 7)/(1 + 6p)'),
    ],
    [
      {
        promptEq: '(5 + q)/(1 - q) = 4p',
        targetVar: 'q',
        steps: [
          balanceMove('mul', '(1 − q)', '5 + q = 4p(1 - q)'),
          makeStep('expand', 'Expand the right side', '5 + q = 4p - 4pq'),
          makeStep('group', 'Group terms with q on the left side', 'q + 4pq = 4p - 5'),
          makeStep('factor', 'Factorize q out', 'q(1 + 4p) = 4p - 5'),
          balanceMove('div', '(1 + 4p)', 'q = (4p - 5)/(1 + 4p)'),
        ],
      },
      {
        promptEq: '(3 + y)/(1 - y) = 2x',
        targetVar: 'y',
        steps: [
          balanceMove('mul', '(1 − y)', '3 + y = 2x(1 - y)'),
          makeStep('expand', 'Expand the right side', '3 + y = 2x - 2xy'),
          makeStep('group', 'Group terms with y on the left side', 'y + 2xy = 2x - 3'),
          makeStep('factor', 'Factorize y out', 'y(1 + 2x) = 2x - 3'),
          balanceMove('div', '(1 + 2x)', 'y = (2x - 3)/(1 + 2x)'),
        ],
      },
    ],
  ),
  s3(
    '117',
    'Level 1',
    'Factorizing subject out',
    'mx + my = 5',
    'm',
    [
      makeStep('factor', 'Factorize m out on the left side', 'm(x + y) = 5'),
      balanceMove('div', '(x + y)', 'm = 5/(x + y)'),
    ],
    [
      {
        promptEq: 'ax + ay = 7',
        targetVar: 'a',
        steps: [makeStep('factor', 'Factorize a out on the left side', 'a(x + y) = 7'), balanceMove('div', '(x + y)', 'a = 7/(x + y)')],
      },
      {
        promptEq: 'kp - kq = 9',
        targetVar: 'k',
        steps: [makeStep('factor', 'Factorize k out on the left side', 'k(p - q) = 9'), balanceMove('div', '(p − q)', 'k = 9/(p - q)')],
      },
    ],
  ),
  s3(
    '118',
    'Level 1',
    'Grouping and factorizing subject',
    'nr = x + r',
    'r',
    [
      balanceMove('sub', 'r', 'nr - r = x'),
      makeStep('factor', 'Factorize r out on the left side', 'r(n - 1) = x'),
      balanceMove('div', '(n − 1)', 'r = x/(n - 1)'),
    ],
    [
      {
        promptEq: 'mr = y + r',
        targetVar: 'r',
        steps: [balanceMove('sub', 'r', 'mr - r = y'), makeStep('factor', 'Factorize r out', 'r(m - 1) = y'), balanceMove('div', '(m − 1)', 'r = y/(m - 1)')],
      },
      {
        promptEq: 'ab = c + 2b',
        targetVar: 'b',
        steps: [balanceMove('sub', '2b', 'ab - 2b = c'), makeStep('factor', 'Factorize b out', 'b(a - 2) = c'), balanceMove('div', '(a − 2)', 'b = c/(a - 2)')],
      },
    ],
  ),
  s3(
    '119',
    'Level 1',
    'Subject in numerator and denominator',
    'x = (5y - z)/z',
    'z',
    [
      balanceMove('mul', 'z', 'xz = 5y - z'),
      balanceMove('add', 'z', 'xz + z = 5y'),
      makeStep('factor', 'Factorize z out on the left side', 'z(x + 1) = 5y'),
      balanceMove('div', '(x + 1)', 'z = (5y)/(x + 1)'),
    ],
    [
      {
        promptEq: 'x = (4y - z)/z',
        targetVar: 'z',
        steps: [
          balanceMove('mul', 'z', 'xz = 4y - z'),
          balanceMove('add', 'z', 'xz + z = 4y'),
          makeStep('factor', 'Factorize z out', 'z(x + 1) = 4y'),
          balanceMove('div', '(x + 1)', 'z = (4y)/(x + 1)'),
        ],
      },
      {
        promptEq: 'a = (3b + c)/c',
        targetVar: 'c',
        steps: [
          balanceMove('mul', 'c', 'ac = 3b + c'),
          balanceMove('sub', 'c', 'ac - c = 3b'),
          makeStep('factor', 'Factorize c out', 'c(a - 1) = 3b'),
          balanceMove('div', '(a − 1)', 'c = (3b)/(a - 1)'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2017 (I) Q1' },
  ),
  s3(
    '120',
    'Level 1',
    'Subject in numerator and denominator',
    '(k + 4p)/(4k) = r',
    'k',
    [
      balanceMove('mul', '4k', 'k + 4p = 4kr'),
      makeStep('group', 'Group terms with k on one side', '4p = 4kr - k'),
      makeStep('factor', 'Factorize k out on the right side', '4p = k(4r - 1)'),
      balanceMove('div', '(4r − 1)', 'k = (4p)/(4r - 1)'),
    ],
    [
      {
        promptEq: '(k + 3p)/(3k) = r',
        targetVar: 'k',
        steps: [
          balanceMove('mul', '3k', 'k + 3p = 3kr'),
          makeStep('group', 'Group terms with k', '3p = 3kr - k'),
          makeStep('factor', 'Factorize k out', '3p = k(3r - 1)'),
          balanceMove('div', '(3r − 1)', 'k = (3p)/(3r - 1)'),
        ],
      },
      {
        promptEq: '(x + 5y)/(2x) = z',
        targetVar: 'x',
        steps: [
          balanceMove('mul', '2x', 'x + 5y = 2xz'),
          makeStep('group', 'Group terms with x', '5y = 2xz - x'),
          makeStep('factor', 'Factorize x out', '5y = x(2z - 1)'),
          balanceMove('div', '(2z − 1)', 'x = (5y)/(2z - 1)'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2017 (I) Q1' },
  ),
  s3(
    '121',
    'Level 1',
    'Subject on both sides with fraction',
    '(Py + C)/Q = 2y',
    'y',
    [
      balanceMove('mul', 'Q', 'Py + C = 2Qy'),
      makeStep('group', 'Group terms with y on one side', 'C = 2Qy - Py'),
      makeStep('factor', 'Factorize y out on the right side', 'C = y(2Q - P)'),
      balanceMove('div', '(2Q − P)', 'y = C/(2Q - P)'),
    ],
    [
      {
        promptEq: '(Py + C)/Q = 3y',
        targetVar: 'y',
        steps: [
          balanceMove('mul', 'Q', 'Py + C = 3Qy'),
          makeStep('group', 'Group terms with y', 'C = 3Qy - Py'),
          makeStep('factor', 'Factorize y out', 'C = y(3Q - P)'),
          balanceMove('div', '(3Q − P)', 'y = C/(3Q - P)'),
        ],
      },
      {
        promptEq: '(Ax + B)/C = 4x',
        targetVar: 'x',
        steps: [
          balanceMove('mul', 'C', 'Ax + B = 4Cx'),
          makeStep('group', 'Group terms with x', 'B = 4Cx - Ax'),
          makeStep('factor', 'Factorize x out', 'B = x(4C - A)'),
          balanceMove('div', '(4C − A)', 'x = B/(4C - A)'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2024 (I) Q2' },
  ),
  s3(
    '122',
    'Level 1',
    'Subject on both sides with fraction',
    '5m = (D - Em)/F',
    'm',
    [
      balanceMove('mul', 'F', '5Fm = D - Em'),
      balanceMove('add', 'Em', '5Fm + Em = D'),
      makeStep('factor', 'Factorize m out on the left side', 'm(5F + E) = D'),
      balanceMove('div', '(5F + E)', 'm = D/(5F + E)'),
    ],
    [
      {
        promptEq: '3m = (D - Em)/F',
        targetVar: 'm',
        steps: [
          balanceMove('mul', 'F', '3Fm = D - Em'),
          balanceMove('add', 'Em', '3Fm + Em = D'),
          makeStep('factor', 'Factorize m out', 'm(3F + E) = D'),
          balanceMove('div', '(3F + E)', 'm = D/(3F + E)'),
        ],
      },
      {
        promptEq: '4n = (A - Bn)/C',
        targetVar: 'n',
        steps: [
          balanceMove('mul', 'C', '4Cn = A - Bn'),
          balanceMove('add', 'Bn', '4Cn + Bn = A'),
          makeStep('factor', 'Factorize n out', 'n(4C + B) = A'),
          balanceMove('div', '(4C + B)', 'n = A/(4C + B)'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2024 (I) Q2' },
  ),

  // ── Level 2: Q123–135 ──
  s3(
    '123',
    'Level 2',
    'Expanding brackets & factorizing subject',
    'D(6 + E) = C - 5E',
    'E',
    [
      makeStep('expand', 'Expand the bracket on the left side', '6D + DE = C - 5E'),
      makeStep('group', 'Move terms with E to the left side', 'DE + 5E = C - 6D'),
      makeStep('factor', 'Factorize E out on the left side', 'E(D + 5) = C - 6D'),
      balanceMove('div', '(D + 5)', 'E = (C - 6D)/(D + 5)'),
    ],
    [
      {
        promptEq: 'D(4 + E) = C - 3E',
        targetVar: 'E',
        steps: [
          makeStep('expand', 'Expand the left side', '4D + DE = C - 3E'),
          makeStep('group', 'Group terms with E', 'DE + 3E = C - 4D'),
          makeStep('factor', 'Factorize E out', 'E(D + 3) = C - 4D'),
          balanceMove('div', '(D + 3)', 'E = (C - 4D)/(D + 3)'),
        ],
      },
      {
        promptEq: 'A(2 + x) = B - 7x',
        targetVar: 'x',
        steps: [
          makeStep('expand', 'Expand the left side', '2A + Ax = B - 7x'),
          makeStep('group', 'Group terms with x', 'Ax + 7x = B - 2A'),
          makeStep('factor', 'Factorize x out', 'x(A + 7) = B - 2A'),
          balanceMove('div', '(A + 7)', 'x = (B - 2A)/(A + 7)'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2016 (I) Q2' },
  ),
  s3(
    '124',
    'Level 2',
    'Expanding brackets & factorizing subject',
    'Py = Q(R - 5y)',
    'y',
    [
      makeStep('expand', 'Expand the bracket on the right side', 'Py = QR - 5Qy'),
      balanceMove('add', '5Qy', 'Py + 5Qy = QR'),
      makeStep('factor', 'Factorize y out on the left side', 'y(P + 5Q) = QR'),
      balanceMove('div', '(P + 5Q)', 'y = (QR)/(P + 5Q)'),
    ],
    [
      {
        promptEq: 'Py = Q(R - 3y)',
        targetVar: 'y',
        steps: [
          makeStep('expand', 'Expand the right side', 'Py = QR - 3Qy'),
          balanceMove('add', '3Qy', 'Py + 3Qy = QR'),
          makeStep('factor', 'Factorize y out', 'y(P + 3Q) = QR'),
          balanceMove('div', '(P + 3Q)', 'y = (QR)/(P + 3Q)'),
        ],
      },
      {
        promptEq: 'Ax = B(C - 4x)',
        targetVar: 'x',
        steps: [
          makeStep('expand', 'Expand the right side', 'Ax = BC - 4Bx'),
          balanceMove('add', '4Bx', 'Ax + 4Bx = BC'),
          makeStep('factor', 'Factorize x out', 'x(A + 4B) = BC'),
          balanceMove('div', '(A + 4B)', 'x = (BC)/(A + 4B)'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2016 (I) Q2' },
  ),
  s3(
    '125',
    'Level 2',
    'Cross-multiplying fractions',
    '5/(x + y) = y/x',
    'x',
    [
      balanceMove('mul', 'x(x + y)', '5x = y(x + y)'),
      makeStep('expand', 'Expand the bracket on the right side', '5x = xy + y^2'),
      balanceMove('sub', 'xy', '5x - xy = y^2'),
      makeStep('factor', 'Factorize x out on the left side', 'x(5 - y) = y^2'),
      balanceMove('div', '(5 − y)', 'x = (y^2)/(5 - y)'),
    ],
    [
      {
        promptEq: '3/(x + y) = y/x',
        targetVar: 'x',
        steps: [
          balanceMove('mul', 'x(x + y)', '3x = xy + y^2'),
          balanceMove('sub', 'xy', '3x - xy = y^2'),
          makeStep('factor', 'Factorize x out', 'x(3 - y) = y^2'),
          balanceMove('div', '(3 − y)', 'x = (y^2)/(3 - y)'),
        ],
      },
      {
        promptEq: '4/(a + b) = b/a',
        targetVar: 'a',
        steps: [
          balanceMove('mul', 'a(a + b)', '4a = ab + b^2'),
          balanceMove('sub', 'ab', '4a - ab = b^2'),
          makeStep('factor', 'Factorize a out', 'a(4 - b) = b^2'),
          balanceMove('div', '(4 − b)', 'a = (b^2)/(4 - b)'),
        ],
      },
    ],
  ),
  s3(
    '126',
    'Level 2',
    'Cross-multiplying fractions',
    '2/(p + q) = q/(4 - p)',
    'p',
    [
      balanceMove('mul', '(p + q)(4 − p)', '2(4 - p) = q(p + q)'),
      makeStep('expand', 'Expand the brackets on both sides', '8 - 2p = pq + q^2'),
      makeStep('group', 'Group terms with p on the right side', '8 - q^2 = pq + 2p'),
      makeStep('factor', 'Factorize p out on the right side', '8 - q^2 = p(q + 2)'),
      balanceMove('div', '(q + 2)', 'p = (8 - q^2)/(q + 2)'),
    ],
    [
      {
        promptEq: '3/(p + q) = q/(5 - p)',
        targetVar: 'p',
        steps: [
          balanceMove('mul', '(p + q)(5 − p)', '3(5 - p) = q(p + q)'),
          makeStep('expand', 'Expand both sides', '15 - 3p = pq + q^2'),
          makeStep('group', 'Group terms with p', '15 - q^2 = pq + 3p'),
          makeStep('factor', 'Factorize p out', '15 - q^2 = p(q + 3)'),
          balanceMove('div', '(q + 3)', 'p = (15 - q^2)/(q + 3)'),
        ],
      },
      {
        promptEq: '2/(x + y) = y/(3 - x)',
        targetVar: 'x',
        steps: [
          balanceMove('mul', '(x + y)(3 − x)', '2(3 - x) = y(x + y)'),
          makeStep('expand', 'Expand both sides', '6 - 2x = xy + y^2'),
          makeStep('group', 'Group terms with x', '6 - y^2 = xy + 2x'),
          makeStep('factor', 'Factorize x out', '6 - y^2 = x(y + 2)'),
          balanceMove('div', '(y + 2)', 'x = (6 - y^2)/(y + 2)'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2023 (I) Q1' },
  ),
  s3(
    '127',
    'Level 2',
    'Rational formula subject change',
    '(p - nq)/(p + q) = 8',
    'q',
    [
      balanceMove('mul', '(p + q)', 'p - nq = 8(p + q)'),
      makeStep('expand', 'Expand the right side', 'p - nq = 8p + 8q'),
      makeStep('group', 'Group terms with q on the right side', 'p - 8p = 8q + nq'),
      makeStep('combine', 'Simplify p − 8p and factorize q', '-7p = q(n + 8)'),
      balanceMove('div', '(n + 8)', 'q = (-7p)/(n + 8)'),
    ],
    [
      {
        promptEq: '(p - nq)/(p + q) = 5',
        targetVar: 'q',
        steps: [
          balanceMove('mul', '(p + q)', 'p - nq = 5p + 5q'),
          makeStep('group', 'Group terms with q', '-4p = 5q + nq'),
          makeStep('factor', 'Factorize q out', '-4p = q(n + 5)'),
          balanceMove('div', '(n + 5)', 'q = (-4p)/(n + 5)'),
        ],
      },
      {
        promptEq: '(a - mb)/(a + b) = 3',
        targetVar: 'b',
        steps: [
          balanceMove('mul', '(a + b)', 'a - mb = 3a + 3b'),
          makeStep('group', 'Group terms with b', '-2a = 3b + mb'),
          makeStep('factor', 'Factorize b out', '-2a = b(m + 3)'),
          balanceMove('div', '(m + 3)', 'b = (-2a)/(m + 3)'),
        ],
      },
    ],
  ),
  s3(
    '128',
    'Level 2',
    'Clearing multiple denominators',
    'x/a + y/b = 1',
    'x',
    [
      balanceMove('sub', 'y/b', 'x/a = 1 - y/b'),
      makeStep('combine', 'Combine right side over denominator b', 'x/a = (b - y)/b'),
      balanceMove('mul', 'a', 'x = (a(b - y))/b'),
    ],
    [
      {
        promptEq: 'x/a + y/b = 2',
        targetVar: 'x',
        steps: [
          balanceMove('sub', 'y/b', 'x/a = 2 - y/b'),
          makeStep('combine', 'Combine right side over b', 'x/a = (2b - y)/b'),
          balanceMove('mul', 'a', 'x = (a(2b - y))/b'),
        ],
      },
      {
        promptEq: 'x/m - y/n = 1',
        targetVar: 'x',
        steps: [
          balanceMove('add', 'y/n', 'x/m = 1 + y/n'),
          makeStep('combine', 'Combine right side over n', 'x/m = (n + y)/n'),
          balanceMove('mul', 'm', 'x = (m(n + y))/n'),
        ],
      },
    ],
  ),
  s3(
    '129',
    'Level 2',
    'Clearing denominators with L.C.M.',
    'x/y - m/(2y) = 1',
    'y',
    [
      balanceMove('mul', '2y', '2x - m = 2y'),
      balanceMove('div', '2', 'y = (2x - m)/2'),
    ],
    [
      {
        promptEq: 'x/y - m/(3y) = 1',
        targetVar: 'y',
        steps: [balanceMove('mul', '3y', '3x - m = 3y'), balanceMove('div', '3', 'y = (3x - m)/3')],
      },
      {
        promptEq: 'a/b + c/(2b) = 1',
        targetVar: 'b',
        steps: [balanceMove('mul', '2b', '2a + c = 2b'), balanceMove('div', '2', 'b = (2a + c)/2')],
      },
    ],
  ),
  s3(
    '130',
    'Level 2',
    'Reciprocal formula',
    '1/x + 1/y = 2',
    'x',
    [
      balanceMove('mul', 'xy', 'y + x = 2xy'),
      makeStep('group', 'Group terms with x on one side', 'y = 2xy - x'),
      makeStep('factor', 'Factorize x out on the right side', 'y = x(2y - 1)'),
      balanceMove('div', '(2y − 1)', 'x = y/(2y - 1)'),
    ],
    [
      {
        promptEq: '1/x + 1/y = 3',
        targetVar: 'x',
        steps: [
          balanceMove('mul', 'xy', 'y + x = 3xy'),
          makeStep('group', 'Group terms with x', 'y = 3xy - x'),
          makeStep('factor', 'Factorize x out', 'y = x(3y - 1)'),
          balanceMove('div', '(3y − 1)', 'x = y/(3y - 1)'),
        ],
      },
      {
        promptEq: '1/a + 1/b = 4',
        targetVar: 'a',
        steps: [
          balanceMove('mul', 'ab', 'b + a = 4ab'),
          makeStep('group', 'Group terms with a', 'b = 4ab - a'),
          makeStep('factor', 'Factorize a out', 'b = a(4b - 1)'),
          balanceMove('div', '(4b − 1)', 'a = b/(4b - 1)'),
        ],
      },
    ],
  ),
  s3(
    '131',
    'Level 2',
    'Lens / reciprocal formula',
    '1/m - 1/n = 1/v',
    'n',
    [
      balanceMove('mul', 'mnv', 'nv - mv = mn'),
      makeStep('group', 'Group terms with n on the left side', 'nv - mn = mv'),
      makeStep('factor', 'Factorize n out on the left side', 'n(v - m) = mv'),
      balanceMove('div', '(v − m)', 'n = (mv)/(v - m)'),
    ],
    [
      {
        promptEq: '1/m + 1/n = 1/v',
        targetVar: 'n',
        steps: [
          balanceMove('mul', 'mnv', 'nv + mv = mn'),
          makeStep('group', 'Group terms with n', 'mv = mn - nv'),
          makeStep('factor', 'Factorize n out', 'mv = n(m - v)'),
          balanceMove('div', '(m − v)', 'n = (mv)/(m - v)'),
        ],
      },
      {
        promptEq: '1/a - 1/b = 1/c',
        targetVar: 'b',
        steps: [
          balanceMove('mul', 'abc', 'bc - ac = ab'),
          makeStep('group', 'Group terms with b', 'bc - ab = ac'),
          makeStep('factor', 'Factorize b out', 'b(c - a) = ac'),
          balanceMove('div', '(c − a)', 'b = (ac)/(c - a)'),
        ],
      },
    ],
  ),
  s3(
    '132',
    'Level 2',
    'Subject on both sides with bracketed denominator',
    'm + 3n = m/(n - 1)',
    'm',
    [
      balanceMove('mul', '(n − 1)', '(m + 3n)(n - 1) = m'),
      makeStep('expand', 'Expand (m + 3n)(n − 1)', 'mn - m + 3n^2 - 3n = m'),
      makeStep('group', 'Move all m terms to the right side', '3n^2 - 3n = 2m - mn'),
      makeStep('factor', 'Factorize m out on the right side', '3n^2 - 3n = m(2 - n)'),
      balanceMove('div', '(2 − n)', 'm = (3n^2 - 3n)/(2 - n)'),
    ],
    [
      {
        promptEq: 'm + 2n = m/(n - 1)',
        targetVar: 'm',
        steps: [
          balanceMove('mul', '(n − 1)', '(m + 2n)(n - 1) = m'),
          makeStep('expand', 'Expand the left side', 'mn - m + 2n^2 - 2n = m'),
          makeStep('group', 'Group terms with m', '2n^2 - 2n = 2m - mn'),
          makeStep('factor', 'Factorize m out', '2n^2 - 2n = m(2 - n)'),
          balanceMove('div', '(2 − n)', 'm = (2n^2 - 2n)/(2 - n)'),
        ],
      },
      {
        promptEq: 'x + 4y = x/(y - 1)',
        targetVar: 'x',
        steps: [
          balanceMove('mul', '(y − 1)', '(x + 4y)(y - 1) = x'),
          makeStep('expand', 'Expand the left side', 'xy - x + 4y^2 - 4y = x'),
          makeStep('group', 'Group terms with x', '4y^2 - 4y = 2x - xy'),
          makeStep('factor', 'Factorize x out', '4y^2 - 4y = x(2 - y)'),
          balanceMove('div', '(2 − y)', 'x = (4y^2 - 4y)/(2 - y)'),
        ],
      },
    ],
  ),
  s3(
    '133',
    'Level 2',
    'Clearing L.C.M. 2x',
    '(1 - 4y)/(2x) = 1 - y/x',
    'x',
    [
      balanceMove('mul', '2x', '1 - 4y = 2x - 2y'),
      balanceMove('add', '2y', '1 - 2y = 2x'),
      balanceMove('div', '2', 'x = (1 - 2y)/2'),
    ],
    [
      {
        promptEq: '(3 - 4y)/(2x) = 1 - y/x',
        targetVar: 'x',
        steps: [
          balanceMove('mul', '2x', '3 - 4y = 2x - 2y'),
          balanceMove('add', '2y', '3 - 2y = 2x'),
          balanceMove('div', '2', 'x = (3 - 2y)/2'),
        ],
      },
      {
        promptEq: '(5 - 6b)/(2a) = 1 - b/a',
        targetVar: 'a',
        steps: [
          balanceMove('mul', '2a', '5 - 6b = 2a - 2b'),
          balanceMove('add', '2b', '5 - 4b = 2a'),
          balanceMove('div', '2', 'a = (5 - 4b)/2'),
        ],
      },
    ],
  ),
  s3(
    '134a',
    'Level 2',
    'HKDSE subject change',
    '2(3x + y) = 4 + 9x',
    'x',
    [
      makeStep('expand', 'Expand the bracket on the left side', '6x + 2y = 4 + 9x'),
      balanceMove('sub', '6x', '2y = 4 + 3x'),
      balanceMove('sub', '4', '2y - 4 = 3x'),
      balanceMove('div', '3', 'x = (2y - 4)/3'),
    ],
    [
      {
        promptEq: '2(2x + y) = 5 + 7x',
        targetVar: 'x',
        steps: [
          makeStep('expand', 'Expand the left side', '4x + 2y = 5 + 7x'),
          balanceMove('sub', '4x', '2y = 5 + 3x'),
          balanceMove('sub', '5', '2y - 5 = 3x'),
          balanceMove('div', '3', 'x = (2y - 5)/3'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2014 (I) Q5', promptText: '134(a) Make x the subject of the formula:' },
  ),
  s3(
    '134b',
    'Level 2',
    'Change in value',
    'x = (2y - 4)/3',
    'x',
    [
      makeStep('change', 'Find the change in x when y increases by 2', '4/3', {
        hint: 'From part (a), x = (2/3)y − 4/3. Increasing y by 2 increases x by (2/3) × 2 = 4/3.',
        wrongMoves: ['Multiply the change by 3/2 instead of 2/3', 'Keep x unchanged'],
        changeAnswer: { direction: 'increase', amount: '4/3' },
      }),
    ],
    [
      {
        promptEq: 'x = (3y - 5)/4',
        targetVar: 'x',
        promptText: '134(b) Similar: If y is increased by 4, write down the change in x.',
        steps: [
          makeStep('change', 'Multiply the coefficient 3/4 by +4', '3', {
            changeAnswer: { direction: 'increase', amount: '3' },
          }),
        ],
      },
    ],
    {
      mode: 'change',
      sourceTag: '~HKDSE 2014 (I) Q5',
      promptText: '134(b) Using part (a), if the value of y is increased by 2, write down the change in the value of x.',
    },
  ),
  s3(
    '135a',
    'Level 2',
    'HKDSE subject change',
    '3(2m + 4n - 5) = 8n',
    'n',
    [
      makeStep('expand', 'Expand the bracket on the left side', '6m + 12n - 15 = 8n'),
      makeStep('group', 'Group terms with n on the left side', '4n = 15 - 6m'),
      balanceMove('div', '4', 'n = (15 - 6m)/4'),
    ],
    [
      {
        promptEq: '2(3m + 5n - 4) = 6n',
        targetVar: 'n',
        steps: [
          makeStep('expand', 'Expand the left side', '6m + 10n - 8 = 6n'),
          makeStep('group', 'Group terms with n', '4n = 8 - 6m'),
          balanceMove('div', '4', 'n = (4 - 3m)/2'),
        ],
      },
    ],
    { sourceTag: '~HKDSE 2014 (I) Q5', promptText: '135(a) Make n the subject of the formula:' },
  ),
  s3(
    '135b',
    'Level 2',
    'Change in value',
    'n = (15 - 6m)/4',
    'n',
    [
      makeStep('change', 'Find the change in n when m decreases by 1', '3/2', {
        hint: 'From part (a), n = 15/4 − (3/2)m. When m decreases by 1 (−1), n changes by (−3/2) × (−1) = +3/2 (increases by 3/2).',
        wrongMoves: ['n decreases by 3/2', 'n increases by 6'],
        changeAnswer: { direction: 'increase', amount: '3/2' },
      }),
    ],
    [
      {
        promptEq: 'n = (8 - 6m)/4',
        targetVar: 'n',
        promptText: '135(b) Similar: If m is decreased by 2, write down the change in n.',
        steps: [
          makeStep('change', 'Multiply the coefficient −3/2 by −2', '3', {
            changeAnswer: { direction: 'increase', amount: '3' },
          }),
        ],
      },
    ],
    {
      mode: 'change',
      sourceTag: '~HKDSE 2014 (I) Q5',
      promptText: '135(b) Using part (a), if the value of m is decreased by 1, write down the change in the value of n.',
    },
  ),
];
