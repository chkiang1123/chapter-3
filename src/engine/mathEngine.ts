import type { QuestionMode, QuestionStep } from '../data/types';

// ── Exact BigInt Rational Arithmetic ──────────────────────────────────────────
export interface BigRat {
  n: bigint;
  d: bigint;
}

function bigAbs(a: bigint): bigint {
  return a < 0n ? -a : a;
}

function bigGcd(a: bigint, b: bigint): bigint {
  a = bigAbs(a);
  b = bigAbs(b);
  while (b !== 0n) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a === 0n ? 1n : a;
}

export function rat(n: bigint | number, d: bigint | number = 1n): BigRat {
  let bn = typeof n === 'bigint' ? n : BigInt(n);
  let bd = typeof d === 'bigint' ? d : BigInt(d);
  if (bd === 0n) throw new Error('Division by zero');
  if (bd < 0n) {
    bn = -bn;
    bd = -bd;
  }
  const g = bigGcd(bn, bd);
  return { n: bn / g, d: bd / g };
}

export function rAdd(a: BigRat, b: BigRat): BigRat {
  return rat(a.n * b.d + b.n * a.d, a.d * b.d);
}

export function rSub(a: BigRat, b: BigRat): BigRat {
  return rat(a.n * b.d - b.n * a.d, a.d * b.d);
}

export function rMul(a: BigRat, b: BigRat): BigRat {
  return rat(a.n * b.n, a.d * b.d);
}

export function rDiv(a: BigRat, b: BigRat): BigRat {
  if (b.n === 0n) throw new Error('Division by zero');
  return rat(a.n * b.d, a.d * b.n);
}

export function rNeg(a: BigRat): BigRat {
  return { n: -a.n, d: a.d };
}

export function rEq(a: BigRat, b: BigRat): boolean {
  return a.n === b.n && a.d === b.d;
}

export function rPow(base: BigRat, exp: number): BigRat {
  if (!Number.isInteger(exp) || Math.abs(exp) > 100) {
    throw new Error('Exponent must be an integer within [-100, 100]');
  }
  if (exp === 0) return rat(1n, 1n);
  if (exp < 0) {
    if (base.n === 0n) throw new Error('Zero to negative power');
    return rPow(rat(base.d, base.n), -exp);
  }
  return {
    n: base.n ** BigInt(exp),
    d: base.d ** BigInt(exp),
  };
}

export function parseDecimalToRat(text: string): BigRat {
  const parts = text.split('.');
  const whole = parts[0] || '0';
  const frac = parts[1] || '';
  const d = 10n ** BigInt(frac.length);
  const n = BigInt(whole + frac || '0');
  return rat(n, d);
}

export function ratToString(a: BigRat): string {
  const sign = a.n < 0n ? '−' : '';
  const absN = bigAbs(a.n);
  return sign + absN.toString() + (a.d === 1n ? '' : '/' + a.d.toString());
}

// ── Tokenizer ─────────────────────────────────────────────────────────────────
interface Token {
  t: 'num' | 'var' | 'op' | 'lp' | 'rp' | 'eq';
  v: string;
  raw?: string;
  rat?: BigRat;
  ws: boolean;
}

const SUPERSCRIPTS: Record<string, string> = {
  '⁰': '^0',
  '¹': '^1',
  '²': '^2',
  '³': '^3',
  '⁴': '^4',
  '⁵': '^5',
  '⁶': '^6',
  '⁷': '^7',
  '⁸': '^8',
  '⁹': '^9',
};

export function normalizeMathText(input: string): string {
  return String(input)
    .replace(/[−–—‒﹣－]/g, '-')
    .replace(/[＋]/g, '+')
    .replace(/[×✕·∙＊]/g, '*')
    .replace(/[÷]/g, '÷')
    .replace(/[／]/g, '/')
    .replace(/[＝]/g, '=')
    .replace(/[（]/g, '(')
    .replace(/[）]/g, ')')
    .replace(/[［]/g, '[')
    .replace(/[］]/g, ']')
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => SUPERSCRIPTS[c] || c);
}

export function tokenize(input: string): Token[] {
  const s = normalizeMathText(input);
  const tokens: Token[] = [];
  let i = 0;
  let ws = false;

  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      ws = true;
      i++;
      continue;
    }
    const numMatch = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
    if (numMatch) {
      tokens.push({
        t: 'num',
        v: numMatch[1],
        raw: numMatch[1],
        rat: parseDecimalToRat(numMatch[1]),
        ws,
      });
      i += numMatch[1].length;
    } else if (/[a-zA-Z]/.test(c)) {
      // Case-sensitive single-letter variables (e.g. M vs m, S vs s, E, P, Q)
      tokens.push({ t: 'var', v: c, ws });
      i++;
    } else if ('+-*/^÷'.indexOf(c) >= 0) {
      tokens.push({ t: 'op', v: c, ws });
      i++;
    } else if (c === '(' || c === '[' || c === '{') {
      tokens.push({ t: 'lp', v: c === '{' ? '[' : c, ws });
      i++;
    } else if (c === ')' || c === ']' || c === '}') {
      tokens.push({ t: 'rp', v: c === '}' ? ']' : c, ws });
      i++;
    } else if (c === '=') {
      tokens.push({ t: 'eq', v: '=', ws });
      i++;
    } else {
      throw new Error(`Unexpected character “${c}”`);
    }
    ws = false;
  }

  return tokens;
}

// ── AST & Recursive-Descent Parser ────────────────────────────────────────────
export type AstNode =
  | { k: 'num'; v: BigRat; raw: string }
  | { k: 'var'; n: string }
  | { k: 'neg'; a: AstNode }
  | { k: 'grp'; a: AstNode; br: string }
  | { k: 'add'; a: AstNode; b: AstNode }
  | { k: 'sub'; a: AstNode; b: AstNode }
  | { k: 'mul'; a: AstNode; b: AstNode; implicit: boolean }
  | { k: 'div'; a: AstNode; b: AstNode; isDivSign?: boolean }
  | { k: 'pow'; a: AstNode; b: AstNode };

export interface ParsedEquation {
  left: AstNode;
  right: AstNode;
}

function parseTokens(tokens: Token[]): AstNode {
  let pos = 0;
  const peek = (k = 0): Token | undefined => tokens[pos + k];
  const isOp = (t: Token | undefined, v: string): boolean => Boolean(t && t.t === 'op' && t.v === v);
  function fail(msg?: string): never {
    throw new Error(msg || 'Cannot read this expression');
  }

  function expr(): AstNode {
    let node = signed();
    while (isOp(peek(), '+') || isOp(peek(), '-')) {
      const op = tokens[pos++].v;
      const right = signed();
      node = { k: op === '+' ? 'add' : 'sub', a: node, b: right };
    }
    return node;
  }

  function signed(): AstNode {
    if (isOp(peek(), '-')) {
      pos++;
      return { k: 'neg', a: signed() };
    }
    if (isOp(peek(), '+')) {
      pos++;
      return signed();
    }
    return divisionChain();
  }

  function divisionChain(): AstNode {
    let node = product();
    while (isOp(peek(), '÷')) {
      pos++;
      const right = factorAfterDivSign();
      node = { k: 'div', a: node, b: right, isDivSign: true };
    }
    return node;
  }

  function factorAfterDivSign(): AstNode {
    if (isOp(peek(), '-')) {
      pos++;
      return { k: 'neg', a: factorAfterDivSign() };
    }
    return product();
  }

  function factorAfterSlash(): AstNode {
    if (isOp(peek(), '-')) {
      pos++;
      return { k: 'neg', a: factorAfterSlash() };
    }
    return power();
  }

  function product(): AstNode {
    let node = power();
    for (;;) {
      const t = peek();
      if (isOp(t, '*')) {
        pos++;
        node = { k: 'mul', a: node, b: factorAfterSlash(), implicit: false };
      } else if (isOp(t, '/')) {
        pos++;
        node = { k: 'div', a: node, b: factorAfterSlash(), isDivSign: false };
      } else if (t && (t.t === 'var' || t.t === 'lp')) {
        node = { k: 'mul', a: node, b: power(), implicit: true };
      } else {
        break;
      }
    }
    return node;
  }

  function power(): AstNode {
    let node = primary();
    if (isOp(peek(), '^')) {
      pos++;
      const exp = powerExponent();
      node = { k: 'pow', a: node, b: exp };
    }
    return node;
  }

  function powerExponent(): AstNode {
    if (isOp(peek(), '-')) {
      pos++;
      return { k: 'neg', a: powerExponent() };
    }
    if (isOp(peek(), '+')) {
      pos++;
      return powerExponent();
    }
    return primary();
  }

  function primary(): AstNode {
    const t = peek();
    if (!t) {
      throw new Error('The expression ends too early');
    }
    if (t.t === 'num') {
      pos++;
      return { k: 'num', v: t.rat!, raw: t.raw || t.v };
    }
    if (t.t === 'var') {
      pos++;
      return { k: 'var', n: t.v };
    }
    if (t.t === 'lp') {
      pos++;
      const inner = expr();
      const close = peek();
      if (!close || close.t !== 'rp') {
        throw new Error('A bracket is not closed');
      }
      pos++;
      return { k: 'grp', a: inner, br: t.v };
    }
    throw new Error(`Something is missing near “${t.v}”`);
  }

  if (!tokens.length) fail('The expression is empty');
  const tree = expr();
  if (pos !== tokens.length) {
    fail(tokens[pos].t === 'rp' ? 'There is an extra closing bracket' : 'Cannot read this expression');
  }
  return tree;
}

export function parseExpression(text: string): AstNode {
  const tokens = tokenize(text);
  const eqCount = tokens.filter((t) => t.t === 'eq').length;
  if (eqCount > 0) {
    throw new Error('Write an algebraic expression without an “=” sign');
  }
  return parseTokens(tokens);
}

export function parseEquation(text: string): ParsedEquation {
  const tokens = tokenize(text);
  const eqIndices: number[] = [];
  tokens.forEach((t, i) => {
    if (t.t === 'eq') eqIndices.push(i);
  });
  if (eqIndices.length !== 1) {
    throw new Error(eqIndices.length ? 'Use only one “=” sign' : 'Write a full equation with an “=” sign');
  }
  return {
    left: parseTokens(tokens.slice(0, eqIndices[0])),
    right: parseTokens(tokens.slice(eqIndices[0] + 1)),
  };
}

// ── Variable Extraction ───────────────────────────────────────────────────────
export function extractVariables(text: string): string[] {
  const vars: string[] = [];
  try {
    const tokens = tokenize(text);
    for (const t of tokens) {
      if (t.t === 'var' && !vars.includes(t.v)) {
        vars.push(t.v);
      }
    }
  } catch {
    // ignore partial strings
  }
  return vars;
}

export function collectAstVars(node: AstNode, set: Set<string>): void {
  switch (node.k) {
    case 'var':
      set.add(node.n);
      break;
    case 'neg':
    case 'grp':
      collectAstVars(node.a, set);
      break;
    case 'add':
    case 'sub':
    case 'mul':
    case 'div':
    case 'pow':
      collectAstVars(node.a, set);
      collectAstVars(node.b, set);
      break;
  }
}

// ── Exact Rational Evaluation ─────────────────────────────────────────────────
export function evalAst(node: AstNode, env: Record<string, BigRat>): BigRat {
  switch (node.k) {
    case 'num':
      return node.v;
    case 'var': {
      const val = env[node.n];
      if (!val) throw new Error(`Unknown variable ${node.n}`);
      return val;
    }
    case 'neg':
      return rNeg(evalAst(node.a, env));
    case 'grp':
      return evalAst(node.a, env);
    case 'add':
      return rAdd(evalAst(node.a, env), evalAst(node.b, env));
    case 'sub':
      return rSub(evalAst(node.a, env), evalAst(node.b, env));
    case 'mul':
      return rMul(evalAst(node.a, env), evalAst(node.b, env));
    case 'div':
      return rDiv(evalAst(node.a, env), evalAst(node.b, env));
    case 'pow': {
      const base = evalAst(node.a, env);
      const expRat = evalAst(node.b, env);
      if (expRat.d !== 1n) throw new Error('Fractional exponent not supported');
      return rPow(base, Number(expRat.n));
    }
  }
}

const PRIME_POOL = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

function buildSampleEnvs(vars: string[], count = 24): Record<string, BigRat>[] {
  const envs: Record<string, BigRat>[] = [];
  for (let trial = 0; trial < count; trial++) {
    const env: Record<string, BigRat> = {};
    vars.forEach((v, idx) => {
      const p = PRIME_POOL[(trial * 3 + idx * 5) % PRIME_POOL.length];
      const sign = (trial + idx) % 4 === 2 ? -1 : 1;
      const offset = trial > 8 ? trial - 4 : 0;
      env[v] = rat(sign * (p + offset), 1);
    });
    envs.push(env);
  }
  return envs;
}

export function areExpressionsEquivalent(a: AstNode, b: AstNode): boolean {
  const varSet = new Set<string>();
  collectAstVars(a, varSet);
  collectAstVars(b, varSet);
  const vars = Array.from(varSet).sort();

  if (vars.length === 0) {
    try {
      return rEq(evalAst(a, {}), evalAst(b, {}));
    } catch {
      return false;
    }
  }

  const envs = buildSampleEnvs(vars, 28);
  let validChecks = 0;

  for (const env of envs) {
    let va: BigRat | null = null;
    let vb: BigRat | null = null;
    let errA = false;
    let errB = false;
    try {
      va = evalAst(a, env);
    } catch {
      errA = true;
    }
    try {
      vb = evalAst(b, env);
    } catch {
      errB = true;
    }

    if (errA && errB) continue; // Both singular at this sample point
    if (errA !== errB) return false;
    if (!rEq(va!, vb!)) return false;
    validChecks++;
    if (validChecks >= 7) return true;
  }

  return validChecks >= 3;
}

/**
 * Checks if student equation (L = R) is algebraically equivalent to target equation (subject = targetRhs).
 */
export function areEquationsEquivalentWithTarget(
  studentEq: ParsedEquation,
  subject: string,
  targetRhs: AstNode,
): boolean {
  const varSet = new Set<string>();
  collectAstVars(studentEq.left, varSet);
  collectAstVars(studentEq.right, varSet);
  collectAstVars(targetRhs, varSet);
  varSet.delete(subject);
  const otherVars = Array.from(varSet).sort();

  const studentDiff: AstNode = { k: 'sub', a: studentEq.left, b: studentEq.right };
  const envs = buildSampleEnvs(otherVars, 28);
  let validChecks = 0;
  let nonTautologyChecks = 0;

  for (const env of envs) {
    let subVal: BigRat;
    try {
      subVal = evalAst(targetRhs, env);
    } catch {
      continue;
    }

    const solvedEnv = { ...env, [subject]: subVal };
    try {
      const diff = evalAst(studentDiff, solvedEnv);
      if (diff.n !== 0n) return false;
      validChecks++;
    } catch {
      continue;
    }

    // Verify it isn't a tautology like 0 = 0 or x = x by perturbing subject
    const perturbedEnv = { ...env, [subject]: rAdd(subVal, rat(1, 1)) };
    try {
      const diffPerturbed = evalAst(studentDiff, perturbedEnv);
      if (diffPerturbed.n !== 0n) nonTautologyChecks++;
    } catch {
      nonTautologyChecks++;
    }

    if (validChecks >= 6 && nonTautologyChecks >= 3) return true;
  }

  return validChecks >= 3 && nonTautologyChecks >= 1;
}

/**
 * Checks if two general equations (e.g. in Section 2 before final isolation) are equivalent.
 */
export function areEquationsEquivalent(a: ParsedEquation, b: ParsedEquation): boolean {
  const varSet = new Set<string>();
  collectAstVars(a.left, varSet);
  collectAstVars(a.right, varSet);
  collectAstVars(b.left, varSet);
  collectAstVars(b.right, varSet);
  const vars = Array.from(varSet).sort();

  const diffA: AstNode = { k: 'sub', a: a.left, b: a.right };
  const diffB: AstNode = { k: 'sub', a: b.left, b: b.right };

  // Check if diffA / diffB is a constant non-zero ratio across points
  const envs = buildSampleEnvs(vars, 24);
  let ratio: BigRat | null = null;
  let valid = 0;

  for (const env of envs) {
    let va: BigRat;
    let vb: BigRat;
    try {
      va = evalAst(diffA, env);
      vb = evalAst(diffB, env);
    } catch {
      continue;
    }
    if (va.n === 0n && vb.n === 0n) continue;
    if (va.n === 0n || vb.n === 0n) return false;
    const currentRatio = rDiv(va, vb);
    if (!ratio) {
      ratio = currentRatio;
    } else if (!rEq(ratio, currentRatio)) {
      return false;
    }
    valid++;
    if (valid >= 6) return true;
  }

  // Fallback for 0-variable or identity-like equations if both sides match
  if (valid === 0) {
    return (
      (areExpressionsEquivalent(a.left, b.left) && areExpressionsEquivalent(a.right, b.right)) ||
      (areExpressionsEquivalent(a.left, b.right) && areExpressionsEquivalent(a.right, b.left))
    );
  }
  return valid >= 2;
}

// ── Complexity & Structural Helpers ───────────────────────────────────────────
function stripGrp(node: AstNode): AstNode {
  while (node.k === 'grp') node = node.a;
  return node;
}

function isPlainNum(node: AstNode): boolean {
  return node.k === 'num';
}

function isRationalLiteral(node: AstNode): boolean {
  return node.k === 'div' && !node.isDivSign && isPlainNum(node.a) && isPlainNum(node.b);
}

export function complexity(node: AstNode): number {
  switch (node.k) {
    case 'num':
      return 1;
    case 'var':
      return 1;
    case 'neg':
      return complexity(node.a);
    case 'grp':
      return complexity(node.a) + (isPlainNum(node.a) ? 0 : 1);
    case 'add':
    case 'sub':
      return complexity(node.a) + complexity(node.b);
    case 'mul':
      if (node.implicit && node.a.k === 'num' && rEq(node.a.v, rat(1, 1))) {
        return complexity(node.b);
      }
      return complexity(node.a) + complexity(node.b);
    case 'div':
      if (isRationalLiteral(node)) return 2;
      return complexity(node.a) + complexity(node.b) + 1;
    case 'pow':
      return complexity(node.a) + complexity(node.b);
  }
}

function canon(node: AstNode): string {
  switch (node.k) {
    case 'num':
      return ratToString(node.v);
    case 'var':
      return node.n;
    case 'neg':
      return '-' + canon(node.a);
    case 'grp':
      return '(' + canon(node.a) + ')';
    case 'add':
      return canon(node.a) + '+' + canon(node.b);
    case 'sub':
      return canon(node.a) + '-' + canon(node.b);
    case 'mul':
      return canon(node.a) + '*' + canon(node.b);
    case 'div':
      return canon(node.a) + '/' + canon(node.b);
    case 'pow':
      return canon(node.a) + '^' + canon(node.b);
  }
}

interface TopTerm {
  sign: number;
  node: AstNode;
}

function topTerms(node: AstNode, sign: number, out: TopTerm[]): TopTerm[] {
  if (node.k === 'add') {
    topTerms(node.a, sign, out);
    topTerms(node.b, sign, out);
  } else if (node.k === 'sub') {
    topTerms(node.a, sign, out);
    topTerms(node.b, -sign, out);
  } else if (node.k === 'neg') {
    topTerms(node.a, -sign, out);
  } else {
    out.push({ sign, node });
  }
  return out;
}

function sideKey(node: AstNode): string {
  return topTerms(node, 1, [])
    .map((t) => (t.sign < 0 ? '-' : '+') + canon(t.node))
    .sort()
    .join('|');
}

export function sameExpressionStructure(a: AstNode, b: AstNode): boolean {
  return sideKey(a) === sideKey(b);
}

export function sameEquationStructure(e1: ParsedEquation, e2: ParsedEquation): boolean {
  const a1 = sideKey(e1.left);
  const b1 = sideKey(e1.right);
  const a2 = sideKey(e2.left);
  const b2 = sideKey(e2.right);
  return (a1 === a2 && b1 === b2) || (a1 === b2 && b1 === a2);
}

function countTopLevelDivisions(node: AstNode): number {
  const terms = topTerms(stripGrp(node), 1, []);
  let divs = 0;
  for (const t of terms) {
    if (stripGrp(t.node).k === 'div') divs++;
  }
  return divs;
}

function isIsolatedSubject(eq: ParsedEquation, subject: string): AstNode | null {
  const bareVar = (n: AstNode): boolean => {
    let cur = stripGrp(n);
    if (cur.k === 'mul' && cur.implicit && cur.a.k === 'num' && rEq(cur.a.v, rat(1, 1))) {
      cur = stripGrp(cur.b);
    }
    return cur.k === 'var' && cur.n === subject;
  };
  const containsSubject = (n: AstNode): boolean => {
    const vars = new Set<string>();
    collectAstVars(n, vars);
    return vars.has(subject);
  };
  if (bareVar(eq.left) && !containsSubject(eq.right)) return eq.right;
  if (bareVar(eq.right) && !containsSubject(eq.left)) return eq.left;
  return null;
}

function inLowestNumericTerms(node: AstNode): boolean {
  const n = stripGrp(node);
  if (n.k === 'neg') return inLowestNumericTerms(n.a);
  if (isRationalLiteral(n)) {
    const top = (n as { a: { v: BigRat } }).a.v;
    const bot = (n as { b: { v: BigRat } }).b.v;
    if (top.d !== 1n || bot.d !== 1n) return false;
    return bot.n !== 1n && bigGcd(top.n, bot.n) === 1n;
  }
  return n.k === 'num';
}

function hasMulFactorization(node: AstNode): boolean {
  const n = stripGrp(node);
  if (n.k === 'mul' || n.k === 'pow') return true;
  if (n.k === 'neg') return hasMulFactorization(n.a);
  return false;
}

function hasUncancelledConstantFactor(node: AstNode): boolean {
  const n = stripGrp(node);
  if (n.k === 'neg') return hasUncancelledConstantFactor(n.a);
  if (n.k !== 'div') return false;
  const extractLeadingInt = (side: AstNode): bigint | null => {
    const s = stripGrp(side);
    if (s.k === 'num' && s.v.d === 1n) return bigAbs(s.v.n);
    if (s.k === 'neg') return extractLeadingInt(s.a);
    if (s.k === 'mul') {
      const left = extractLeadingInt(s.a);
      if (left !== null) return left;
    }
    return null;
  };
  const topInt = extractLeadingInt(n.a);
  const botInt = extractLeadingInt(n.b);
  if (topInt && botInt && topInt > 0n && botInt > 0n) {
    return bigGcd(topInt, botInt) > 1n;
  }
  return false;
}

function hasUnexpandedBracketMul(node: AstNode): boolean {
  const n = stripGrp(node);
  switch (n.k) {
    case 'num':
    case 'var':
      return false;
    case 'neg':
    case 'grp':
      return hasUnexpandedBracketMul(n.a);
    case 'add':
    case 'sub':
      return hasUnexpandedBracketMul(n.a) || hasUnexpandedBracketMul(n.b);
    case 'mul': {
      const a = stripGrp(n.a);
      const b = stripGrp(n.b);
      if (a.k === 'add' || a.k === 'sub' || b.k === 'add' || b.k === 'sub') {
        return true;
      }
      return hasUnexpandedBracketMul(a) || hasUnexpandedBracketMul(b);
    }
    case 'div':
      return hasUnexpandedBracketMul(n.a) || hasUnexpandedBracketMul(n.b);
    case 'pow': {
      const base = stripGrp(n.a);
      if (base.k === 'add' || base.k === 'sub' || base.k === 'mul') {
        return true;
      }
      return hasUnexpandedBracketMul(base);
    }
  }
}

function hasUncombinedProductFactors(node: AstNode): boolean {
  const varsSeen = new Set<string>();
  let numCount = 0;
  let duplicate = false;

  const walk = (cur: AstNode) => {
    if (duplicate) return;
    const n = stripGrp(cur);
    if (n.k === 'neg') {
      walk(n.a);
    } else if (n.k === 'mul') {
      walk(n.a);
      walk(n.b);
    } else if (n.k === 'num') {
      numCount++;
      if (numCount > 1) duplicate = true;
    } else if (n.k === 'var') {
      if (varsSeen.has(n.n)) duplicate = true;
      varsSeen.add(n.n);
    } else if (n.k === 'pow') {
      const base = stripGrp(n.a);
      if (base.k === 'var') {
        if (varsSeen.has(base.n)) duplicate = true;
        varsSeen.add(base.n);
      } else {
        duplicate = true;
      }
    }
  };

  walk(node);
  return duplicate;
}

function hasUncombinedTermFactors(node: AstNode): boolean {
  const n = stripGrp(node);
  if (n.k === 'neg') return hasUncombinedTermFactors(n.a);
  if (n.k === 'div') {
    return hasUncombinedProductFactors(n.a) || hasUncombinedProductFactors(n.b);
  }
  return hasUncombinedProductFactors(n);
}

function termDegreeInVar(node: AstNode, targetVar: string | 'any'): number {
  const n = stripGrp(node);
  switch (n.k) {
    case 'num':
      return 0;
    case 'var':
      return targetVar === 'any' || n.n === targetVar ? 1 : 0;
    case 'neg':
    case 'grp':
      return termDegreeInVar(n.a, targetVar);
    case 'mul':
      return termDegreeInVar(n.a, targetVar) + termDegreeInVar(n.b, targetVar);
    case 'div':
      return termDegreeInVar(n.a, targetVar) - termDegreeInVar(n.b, targetVar);
    case 'pow': {
      const baseDeg = termDegreeInVar(n.a, targetVar);
      if (baseDeg === 0) return 0;
      try {
        const expVal = evalAst(n.b, {});
        if (expVal.d === 1n) return baseDeg * Number(expVal.n);
      } catch {
        // non-numeric exponent
      }
      return baseDeg;
    }
    case 'add':
    case 'sub':
      return Math.max(termDegreeInVar(n.a, targetVar), termDegreeInVar(n.b, targetVar));
  }
}

function matchesOrderRule(
  node: AstNode,
  rule: { direction: 'asc' | 'desc'; variable: string | 'any' },
): boolean {
  const terms = topTerms(stripGrp(node), 1, []);
  if (terms.length <= 1) return true;
  const degrees = terms.map((t) => termDegreeInVar(t.node, rule.variable));
  for (let i = 0; i < degrees.length - 1; i++) {
    if (rule.direction === 'asc' && degrees[i] > degrees[i + 1]) return false;
    if (rule.direction === 'desc' && degrees[i] < degrees[i + 1]) return false;
  }
  return true;
}

// ── Unified Step Checker ──────────────────────────────────────────────────────
export interface CheckResult {
  ok: boolean;
  index?: number;
  message?: string;
}

export function checkStepAnswer(params: {
  input: string;
  mode: QuestionMode;
  steps: QuestionStep[];
  fromIndex: number;
  maxAhead?: number;
  previousLine: string;
  targetVar?: string;
  givenValues?: Record<string, string>;
}): CheckResult {
  const { input, mode, steps, fromIndex, maxAhead = 2, previousLine, targetVar, givenValues } = params;
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, message: 'Enter your mathematical line before checking.' };

  if (mode === 'expression') {
    const cleaned = trimmed.startsWith('=') ? trimmed.slice(1).trim() : trimmed;
    let studentAst: AstNode;
    try {
      studentAst = parseExpression(cleaned);
    } catch (err) {
      return { ok: false, message: `${(err as Error).message}.` };
    }

    const prevAst = parseExpression(previousLine);
    if (sameExpressionStructure(studentAst, prevAst)) {
      return { ok: false, message: 'That is the same as the line before. Apply the step, then simplify.' };
    }

    const lastIdx = Math.min(steps.length - 1, fromIndex + maxAhead);
    let unsimplified = false;
    let needsFactor = false;
    let needsLowestTerms = false;
    let needsExpanded = false;
    let needsCombinedTerms = false;
    let wrongOrderRule: { direction: 'asc' | 'desc'; variable: string | 'any' } | null = null;

    for (let i = lastIdx; i >= fromIndex; i--) {
      const expectedStep = steps[i];
      const expectedAst = parseExpression(expectedStep.line);
      if (!areExpressionsEquivalent(studentAst, expectedAst)) continue;

      // Factorization step check (e.g. Q52a y^2 - 36 -> (y+6)(y-6))
      if (expectedStep.op === 'factor' && i === steps.length - 1) {
        if (!hasMulFactorization(studentAst)) {
          needsFactor = true;
          continue;
        }
      }

      // Polynomial expansion & index combination checks
      if (expectedStep.requireExpanded) {
        if (hasUnexpandedBracketMul(studentAst)) {
          needsExpanded = true;
          continue;
        }
        const stuTerms = topTerms(stripGrp(studentAst), 1, []);
        const expTerms = topTerms(stripGrp(expectedAst), 1, []);
        if (stuTerms.length > expTerms.length || stuTerms.some((t) => hasUncombinedTermFactors(t.node))) {
          needsCombinedTerms = true;
          continue;
        }
      }

      if (expectedStep.orderRule && !matchesOrderRule(studentAst, expectedStep.orderRule)) {
        wrongOrderRule = expectedStep.orderRule;
        continue;
      }

      // Final step must be simplified
      if (i === steps.length - 1) {
        const expDivs = countTopLevelDivisions(expectedAst);
        const stuDivs = countTopLevelDivisions(studentAst);
        if (stuDivs > expDivs) {
          unsimplified = true;
          continue;
        }
        if (hasUncancelledConstantFactor(studentAst)) {
          needsLowestTerms = true;
          continue;
        }
        if (complexity(studentAst) > complexity(expectedAst) + 4) {
          unsimplified = true;
          continue;
        }
      } else {
        if (complexity(studentAst) > complexity(expectedAst) + 5) {
          unsimplified = true;
          continue;
        }
      }

      return { ok: true, index: i };
    }

    if (needsFactor) {
      return { ok: false, message: 'Write the expression in factorized form as a product of factors.' };
    }
    if (needsExpanded) {
      return { ok: false, message: 'Expand all brackets and simplify completely.' };
    }
    if (needsCombinedTerms) {
      return { ok: false, message: 'Combine all like terms and variable powers into a single simplified polynomial.' };
    }
    if (wrongOrderRule) {
      const dirLabel = wrongOrderRule.direction === 'asc' ? 'ascending' : 'descending';
      const varLabel = wrongOrderRule.variable === 'any' ? 'the variable' : wrongOrderRule.variable;
      return {
        ok: false,
        message: `Algebraically equivalent, but arrange the terms in ${dirLabel} powers of ${varLabel}.`,
      };
    }
    if (needsLowestTerms) {
      return { ok: false, message: 'Nearly! Cancel the common numeric factor to write it in simplest form.' };
    }
    if (unsimplified) {
      return { ok: false, message: 'Your expression is equivalent, but not simplified yet. Combine terms and cancel common factors.' };
    }
    const hasUngroupedSlashDenom = /\/\d+[a-zA-Z]/.test(cleaned);
    return {
      ok: false,
      message: hasUngroupedSlashDenom
        ? 'That expression is not equivalent. Tip: put brackets around a denominator with multiple factors, e.g. 1/(7x).'
        : 'That expression is not equivalent. Recheck the signs, powers, or common denominator.',
    };
  }

  if (mode === 'substitution') {
    const finalLine = steps[steps.length - 1].line;
    const finalEq = parseEquation(finalLine);
    const subject = targetVar || extractVariables(finalLine)[0] || 'x';

    // Allow bare expression/number on the final step if it's a direct value
    let candidate = trimmed;
    if (!candidate.includes('=')) {
      candidate = `${subject} = ${candidate}`;
    }

    let studentEq: ParsedEquation;
    try {
      studentEq = parseEquation(candidate);
    } catch (err) {
      return { ok: false, message: `${(err as Error).message}.` };
    }

    const prevEq = parseEquation(previousLine);
    if (sameEquationStructure(studentEq, prevEq)) {
      return { ok: false, message: 'That is the same as the line before. Apply the step, then simplify.' };
    }

    const lastIdx = Math.min(steps.length - 1, fromIndex + maxAhead);
    let unsimplified = false;
    let missingSub = false;
    let needsLowest = false;

    for (let i = lastIdx; i >= fromIndex; i--) {
      const expectedStep = steps[i];
      const expectedEq = parseEquation(expectedStep.line);
      if (!areEquationsEquivalent(studentEq, expectedEq)) continue;

      if (expectedStep.op === 'substitute' && givenValues) {
        const studentVars = new Set<string>();
        collectAstVars(studentEq.left, studentVars);
        collectAstVars(studentEq.right, studentVars);
        const stillHasGiven = Object.keys(givenValues).some((v) => studentVars.has(v));
        if (stillHasGiven) {
          missingSub = true;
          continue;
        }
      }

      if (i === steps.length - 1) {
        const rhs = isIsolatedSubject(studentEq, subject);
        if (!rhs) {
          unsimplified = true;
          continue;
        }
        if (!inLowestNumericTerms(rhs)) {
          needsLowest = true;
          continue;
        }
        return { ok: true, index: i };
      }

      if (
        complexity(studentEq.left) + complexity(studentEq.right) >
        complexity(expectedEq.left) + complexity(expectedEq.right) + 6
      ) {
        unsimplified = true;
        continue;
      }

      return { ok: true, index: i };
    }

    if (missingSub) {
      return { ok: false, message: 'Substitute all the given numbers into the formula.' };
    }
    if (needsLowest) {
      return { ok: false, message: 'Nearly! Simplify the value to an integer or fraction in lowest terms.' };
    }
    if (unsimplified) {
      return { ok: false, message: 'Your equation is balanced, but simplify the arithmetic further.' };
    }
    if (!areEquationsEquivalent(studentEq, finalEq)) {
      return { ok: false, message: 'That value or equation does not match the formula. Recheck your substitution and arithmetic.' };
    }
    return { ok: false, message: 'That line is not balanced. Recheck both sides.' };
  }

  if (mode === 'subject') {
    const subject = targetVar || 'x';
    const finalLine = steps[steps.length - 1].line;
    const finalEq = parseEquation(finalLine);
    const targetRhs = isIsolatedSubject(finalEq, subject);
    if (!targetRhs) {
      return { ok: false, message: 'Internal target error.' };
    }

    let studentEq: ParsedEquation;
    try {
      studentEq = parseEquation(trimmed);
    } catch (err) {
      return { ok: false, message: `${(err as Error).message}.` };
    }

    const prevEq = parseEquation(previousLine);
    if (sameEquationStructure(studentEq, prevEq)) {
      return { ok: false, message: 'That is the same as the line before. Apply the step, then simplify.' };
    }

    if (!areEquationsEquivalentWithTarget(studentEq, subject, targetRhs)) {
      return { ok: false, message: 'That equation is not equivalent to the formula. Recheck both sides.' };
    }

    const lastIdx = Math.min(steps.length - 1, fromIndex + maxAhead);
    let unsimplified = false;
    let notIsolated = false;
    let needsLowest = false;

    for (let i = lastIdx; i >= fromIndex; i--) {
      const expectedStep = steps[i];
      const expectedEq = parseEquation(expectedStep.line);

      if (i === steps.length - 1) {
        const rhs = isIsolatedSubject(studentEq, subject);
        if (!rhs) {
          notIsolated = true;
          continue;
        }
        if (hasUncancelledConstantFactor(rhs)) {
          needsLowest = true;
          continue;
        }
        if (complexity(rhs) > complexity(targetRhs) + 5) {
          unsimplified = true;
          continue;
        }
        return { ok: true, index: i };
      }

      const stuCx = complexity(studentEq.left) + complexity(studentEq.right);
      const expCx = complexity(expectedEq.left) + complexity(expectedEq.right);
      if (stuCx <= expCx + 7) {
        return { ok: true, index: i };
      }
      unsimplified = true;
    }

    if (notIsolated) {
      return { ok: false, message: `Almost there! Make ${subject} stand alone on one side of the “=” sign.` };
    }
    if (needsLowest) {
      return { ok: false, message: 'Nearly! Cancel any common factor to write the formula in simplest form.' };
    }
    if (unsimplified) {
      return { ok: false, message: 'Your equation is equivalent, but simplify it further.' };
    }
    return { ok: true, index: fromIndex };
  }

  return { ok: false, message: 'Unsupported question mode.' };
}

// ── Math HTML Renderer (Stacked Fractions & Exponents) ────────────────────────
function escHtml(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fracHtml(top: string, bottom: string, label: string): string {
  return `<span class="frac" role="math" aria-label="${escHtml(label)}"><span class="nu">${top}</span><span class="de">${bottom}</span></span>`;
}

function spokenNode(node: AstNode): string {
  return canon(node)
    .replace(/-/g, ' minus ')
    .replace(/\+/g, ' plus ')
    .replace(/\*/g, ' times ')
    .replace(/\//g, ' over ')
    .replace(/\^/g, ' to the power ');
}

function unwrapFracGrp(node: AstNode): AstNode {
  if (node.k === 'grp' && node.a.k === 'div' && !node.a.isDivSign) return node.a;
  return node;
}

function astToHtml(node: AstNode): string {
  switch (node.k) {
    case 'num':
      return escHtml(node.raw);
    case 'var':
      return `<i>${escHtml(node.n)}</i>`;
    case 'neg':
      return '−' + astToHtml(node.a);
    case 'grp':
      return (node.br === '[' ? '[' : '(') + astToHtml(node.a) + (node.br === '[' ? ']' : ')');
    case 'add':
      return `${astToHtml(node.a)} + ${astToHtml(node.b)}`;
    case 'sub':
      return `${astToHtml(node.a)} − ${astToHtml(node.b)}`;
    case 'mul':
      if (!node.implicit) {
        return `${astToHtml(unwrapFracGrp(node.a))} × ${astToHtml(unwrapFracGrp(node.b))}`;
      }
      return `${astToHtml(node.a)}${astToHtml(node.b)}`;
    case 'div':
      if (node.isDivSign) {
        return `${astToHtml(stripGrp(node.a))} ÷ ${astToHtml(stripGrp(node.b))}`;
      }
      return fracHtml(
        astToHtml(stripGrp(node.a)),
        astToHtml(stripGrp(node.b)),
        spokenNode(node),
      );
    case 'pow': {
      const baseHtml = astToHtml(node.a);
      const expHtml = astToHtml(stripGrp(node.b));
      return `${baseHtml}<sup class="math-sup">${expHtml}</sup>`;
    }
  }
}

function sideToHtml(node: AstNode, highlight: boolean): string {
  const terms = topTerms(node, 1, []);
  return terms
    .map((t, i) => {
      const body = astToHtml(t.node);
      const signText = i === 0 ? (t.sign < 0 ? '−' : '') : t.sign < 0 ? ' − ' : ' + ';
      const hasVar = /[a-zA-Z]/.test(canon(t.node));
      if (highlight) {
        const lead = i === 0 ? '' : ' ';
        const inner = i === 0 ? signText + body : signText.trim() + ' ' + body;
        return `${lead}<mark class="term-highlight ${hasVar ? 'variable' : 'constant'}">${inner}</mark>`;
      }
      return signText + body;
    })
    .join('');
}

export function renderMathToHtml(line: string, highlight = false): string {
  try {
    if (line.includes('=')) {
      const eq = parseEquation(line);
      return `${sideToHtml(eq.left, highlight)} = ${sideToHtml(eq.right, highlight)}`;
    }
    const expr = parseExpression(line);
    return sideToHtml(expr, highlight);
  } catch {
    return escHtml(line);
  }
}
