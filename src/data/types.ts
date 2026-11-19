export type ChapterId = 's1-ch10' | 's2-ch3';

export type SectionId =
  | 'sec1'
  | 'sec2'
  | 'sec3'
  | 's1c10_sec1'
  | 's1c10_sec2'
  | 's1c10_sec3'
  | 's1c10_sec4';

export type QuestionLevel = 'Level 1' | 'Level 2' | 'Level 3' | 'MCQ';

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

export interface OrderRule {
  direction: 'asc' | 'desc';
  variable: string | 'any';
}

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
  requireExpanded?: boolean;
  orderRule?: OrderRule;
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
  chapterId?: ChapterId;
  sectionId: SectionId;
  level: QuestionLevel;
  mode: QuestionMode;
  topicTag: string;
  sourceTag?: string;
  sims: QuestionVariant[];
}

export interface SectionDef {
  id: SectionId;
  chapterId?: ChapterId;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  levels: QuestionLevel[];
}

export interface ChapterUnit<Id extends string = ChapterId> {
  id: Id;
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
  chapterId: ChapterId;
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
