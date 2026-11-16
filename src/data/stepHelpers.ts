import type { McqOption, QuestionStep, StepOp } from './types';

export function makeStep(
  op: StepOp,
  move: string,
  line: string,
  opts?: {
    symbol?: string;
    hint?: string;
    wrongMoves?: string[];
    kind?: 'balance' | 'simplify';
    mcqOptions?: McqOption[];
    correctMcq?: 'A' | 'B' | 'C' | 'D';
    changeAnswer?: { direction: 'increase' | 'decrease'; amount: string };
  },
): QuestionStep {
  const isBalance =
    opts?.kind === 'balance' ||
    op === 'add' ||
    op === 'sub' ||
    op === 'mul' ||
    op === 'div';

  const defaultHints: Record<StepOp, string> = {
    simplify: 'Divide numerator and denominator by their highest common factor (H.C.F.) and apply index laws.',
    factor: 'Take out the common factor or factorize using identities (difference of squares / perfect square) first.',
    cancel: 'Cancel the common factor from both the numerator and the denominator.',
    invert: 'Dividing by a fraction is the same as multiplying by its reciprocal (flip numerator and denominator).',
    multiply: 'Multiply the numerators together and denominators together, cancelling any common factors.',
    lcd: 'Find the L.C.M. of the denominators, convert each fraction to the common denominator, and combine.',
    expand: 'Multiply every term inside the bracket by the factor outside. Watch the negative signs!',
    combine: 'Collect like terms together and simplify the numerator or equation.',
    substitute: 'Replace each given variable with its numerical value inside brackets.',
    add: 'Add the same term to both sides of the equation to keep it balanced.',
    sub: 'Subtract the same term from both sides of the equation to keep it balanced.',
    mul: 'Multiply every term on both sides by the same expression to clear the denominator.',
    div: 'Divide both sides by the coefficient or bracketed factor of the subject.',
    group: 'Move all terms containing the target subject to one side, and all other terms to the other side.',
    change: 'Look at the coefficient of the changing variable in the formula with the new subject.',
    mcq: 'Match your final solved value with the choices A, B, C, or D.',
  };

  const defaultWrongs: Record<StepOp, string[]> = {
    simplify: ['Subtract the same number from numerator and denominator', 'Cancel terms separated by + or −'],
    factor: ['Cancel a single term without factorizing first', 'Multiply numerator and denominator by the constant'],
    cancel: ['Add the common factor to both numerator and denominator', 'Cancel only in the numerator'],
    invert: ['Flip the first fraction instead of the divisor', 'Add the numerators and denominators directly'],
    multiply: ['Cross-multiply as if it were an equation', 'Add the denominators together'],
    lcd: ['Add the denominators directly without finding L.C.M.', 'Multiply only the first numerator'],
    expand: ['Multiply only the first term inside the bracket', 'Ignore the minus sign in front of the bracket'],
    combine: ['Combine unlike terms together', 'Drop the negative sign when combining'],
    substitute: ['Replace only one variable and leave the rest', 'Swap the values of two variables'],
    add: ['Subtract the term from both sides instead', 'Add the term to the left side only'],
    sub: ['Add the term to both sides instead', 'Subtract from the left side only'],
    mul: ['Divide both sides instead of multiplying', 'Multiply only the fraction and skip other terms'],
    div: ['Multiply both sides instead of dividing', 'Divide only one term on the right side'],
    group: ['Leave the target subject on both sides', 'Move a term across “=” without changing its sign'],
    change: ['Multiply the change by the reciprocal of the coefficient', 'Keep the same value regardless of the change'],
    mcq: ['Guess without substituting back', 'Ignore the negative sign'],
  };

  return {
    op,
    move,
    symbol: opts?.symbol,
    line,
    hint: opts?.hint || defaultHints[op],
    wrongMoves: (opts?.wrongMoves || defaultWrongs[op]).filter((w) => w !== move),
    kind: isBalance ? 'balance' : 'simplify',
    mcqOptions: opts?.mcqOptions,
    correctMcq: opts?.correctMcq,
    changeAnswer: opts?.changeAnswer,
  };
}

export function balanceMove(
  op: 'add' | 'sub' | 'mul' | 'div',
  arg: string,
  line: string,
  hint?: string,
  wrongMoves?: string[],
): QuestionStep {
  const map = {
    add: {
      move: `Add ${arg} to both sides`,
      symbol: `+ ${arg}`,
      wrongs: [`Subtract ${arg} from both sides`, `Add ${arg} to the left side only`],
    },
    sub: {
      move: `Subtract ${arg} from both sides`,
      symbol: `− ${arg}`,
      wrongs: [`Add ${arg} to both sides`, `Subtract ${arg} from the left side only`],
    },
    mul: {
      move: `Multiply both sides by ${arg}`,
      symbol: `× ${arg.startsWith('-') || arg.startsWith('−') ? `(${arg})` : arg}`,
      wrongs: [`Divide both sides by ${arg}`, `Multiply the left side only by ${arg}`],
    },
    div: {
      move: `Divide both sides by ${arg}`,
      symbol: `÷ ${arg.startsWith('-') || arg.startsWith('−') ? `(${arg})` : arg}`,
      wrongs: [`Multiply both sides by ${arg}`, `Subtract ${arg} from both sides`],
    },
  }[op];

  return makeStep(op, map.move, line, {
    symbol: map.symbol,
    hint,
    wrongMoves: wrongMoves || map.wrongs,
    kind: 'balance',
  });
}
