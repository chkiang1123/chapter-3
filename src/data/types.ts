export type SectionId = 'sec1' | 'sec2' | 'sec3';

export type QuestionLevel = 'Level 1' | 'Level 2' | 'MCQ';

export type QuestionMode = 'expression' | 'substitution' | 'subject' | 'change';

export type StepOp =
  | 'simplify'
  | 'factor'
  | 'cancel'
  | 'invert'
  | 'multiply'
  | 'lcd'
  | 'expand'
  | 'combine'
  | 'substitute'
  | 'add'
  | 'sub'
  | 'mul'
  | 'div'
  | 'group'
  | 'change'
  | 'mcq';

export interface McqOption {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuestionStep {
  op: StepOp;
  move: string;
  symbol?: string;
  line: string;
  hint: string;
  wrongMoves: string[];
  kind: 'balance' | 'simplify';
  mcqOptions?: McqOption[];
  correctMcq?: 'A' | 'B' | 'C' | 'D';
  changeAnswer?: {
    direction: 'increase' | 'decrease';
    amount: string;
  };
}

export interface QuestionVariant {
  promptEq: string;
  promptText?: string;
  givenValues?: Record<string, string>;
  targetVar?: string;
  steps: QuestionStep[];
  altSteps?: QuestionStep[];
}

export interface QuestionItem extends QuestionVariant {
  id: string;
  numberLabel: string;
  sectionId: SectionId;
  level: QuestionLevel;
  mode: QuestionMode;
  topicTag: string;
  sourceTag?: string;
  sims: QuestionVariant[];
}

export interface SectionDef {
  id: SectionId;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  levels: QuestionLevel[];
}

export interface ChapterUnit {
  id: string;
  form: string;
  chapterLabel: string;
  title: string;
  subtitle: string;
  status: 'active' | 'reserved';
  sections: SectionDef[];
  reservedNote?: string;
}

export interface PlayableQuestion {
  id: string;
  baseId: string;
  numberLabel: string;
  sectionId: SectionId;
  level: QuestionLevel;
  mode: QuestionMode;
  topicTag: string;
  sourceTag?: string;
  promptEq: string;
  promptText: string;
  givenValues?: Record<string, string>;
  targetVar?: string;
  steps: QuestionStep[];
  altSteps?: QuestionStep[];
  isSimilar: boolean;
  variables: string[];
}
