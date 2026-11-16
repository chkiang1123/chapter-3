import { extractVariables } from '../engine/mathEngine';
import { SECTION_1_QUESTIONS } from './s2ch3Section1';
import { SECTION_2_QUESTIONS } from './s2ch3Section2';
import { SECTION_3_QUESTIONS } from './s2ch3Section3';
import type { ChapterUnit, PlayableQuestion, QuestionItem, QuestionLevel, SectionId } from './types';

export const S2_CHAPTER_3: ChapterUnit = {
  id: 's2-ch3',
  form: 'S.2',
  chapterLabel: 'Chapter 3',
  title: 'Algebraic Fractions and Formulas',
  subtitle: 'All-in-One Step-by-Step Practice',
  status: 'active',
  sections: [
    {
      id: 'sec1',
      number: 1,
      title: 'Manipulation of Algebraic Fractions',
      subtitle: 'Section 1',
      description: 'Reduce monomial & polynomial fractions, multiply, divide, and combine with L.C.M.',
      levels: ['Level 1', 'Level 2'],
    },
    {
      id: 'sec2',
      number: 2,
      title: 'Formulas and Substitution',
      subtitle: 'Section 2',
      description: 'Substitute values into formulas, solve for unknowns, and complete TSA-style MCQs.',
      levels: ['Level 1', 'Level 2', 'MCQ'],
    },
    {
      id: 'sec3',
      number: 3,
      title: 'Change of Subject of a Formula',
      subtitle: 'Section 3',
      description: 'Rearrange formulas step by step, factorize the subject, and analyse changes in value.',
      levels: ['Level 1', 'Level 2'],
    },
  ],
};

/**
 * Reserved topic slots so additional S.2 chapters or extra sections
 * can be plugged in without refactoring the app shell.
 */
export const RESERVED_TOPIC_SLOTS: ChapterUnit[] = [
  {
    id: 's2-topic-slot-1',
    form: 'S.2',
    chapterLabel: 'Topic Slot 2',
    title: 'Reserved Vacancy · Next Topic',
    subtitle: 'Space reserved for upcoming S.2 chapter',
    status: 'reserved',
    sections: [],
    reservedNote: 'Ready for future chapter upload (e.g. Identities & Factorization or Simultaneous Equations).',
  },
  {
    id: 's2-topic-slot-2',
    form: 'S.2',
    chapterLabel: 'Topic Slot 3',
    title: 'Reserved Vacancy · Future Topic',
    subtitle: 'Space reserved for upcoming S.2 chapter',
    status: 'reserved',
    sections: [],
    reservedNote: 'Additional section or chapter bank can be appended directly into the curriculum registry.',
  },
];

export const CHAPTER_REGISTRY: ChapterUnit[] = [S2_CHAPTER_3, ...RESERVED_TOPIC_SLOTS];

export const ALL_QUESTIONS: QuestionItem[] = [
  ...SECTION_1_QUESTIONS,
  ...SECTION_2_QUESTIONS,
  ...SECTION_3_QUESTIONS,
];

export function getQuestionsForSection(
  sectionId: SectionId,
  levelFilter?: QuestionLevel | 'ALL',
): QuestionItem[] {
  return ALL_QUESTIONS.filter(
    (q) => q.sectionId === sectionId && (!levelFilter || levelFilter === 'ALL' || q.level === levelFilter),
  );
}

export function getQuestionById(id: string): QuestionItem | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}

export function buildPlayableQuestion(
  item: QuestionItem,
  variantIndex?: number, // undefined = original; 0..n-1 = similar variant
): PlayableQuestion {
  const isSimilar = variantIndex !== undefined && item.sims[variantIndex] !== undefined;
  const variant = isSimilar ? item.sims[variantIndex!] : item;

  const promptEq = variant.promptEq;
  const promptText = variant.promptText || item.promptText || 'Solve step by step:';
  const targetVar = variant.targetVar || item.targetVar;
  const givenValues = variant.givenValues || item.givenValues;

  const varSet = new Set<string>();
  extractVariables(promptEq).forEach((v) => varSet.add(v));
  variant.steps.forEach((st) => extractVariables(st.line).forEach((v) => varSet.add(v)));
  if (targetVar) varSet.add(targetVar);

  return {
    id: isSimilar ? `${item.id}#s${variantIndex! + 1}` : item.id,
    baseId: item.id,
    numberLabel: isSimilar ? `${item.numberLabel} · Similar` : item.numberLabel,
    sectionId: item.sectionId,
    level: item.level,
    mode: item.mode,
    topicTag: item.topicTag,
    sourceTag: isSimilar ? undefined : item.sourceTag,
    promptEq,
    promptText,
    givenValues,
    targetVar,
    steps: variant.steps,
    altSteps: variant.altSteps,
    isSimilar,
    variables: Array.from(varSet),
  };
}
