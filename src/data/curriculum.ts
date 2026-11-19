import { extractVariables } from '../engine/mathEngine';
import { S1_CH10_SECTION_1_QUESTIONS } from './s1ch10Section1';
import { S1_CH10_SECTION_2_QUESTIONS } from './s1ch10Section2';
import { S1_CH10_SECTION_3_QUESTIONS } from './s1ch10Section3';
import { S1_CH10_SECTION_4_QUESTIONS } from './s1ch10Section4';
import { SECTION_1_QUESTIONS } from './s2ch3Section1';
import { SECTION_2_QUESTIONS } from './s2ch3Section2';
import { SECTION_3_QUESTIONS } from './s2ch3Section3';
import type { ChapterId, ChapterUnit, PlayableQuestion, QuestionItem, QuestionLevel, SectionId } from './types';

export const S1_CHAPTER_10: ChapterUnit = {
  id: 's1-ch10',
  form: 'S.1',
  chapterLabel: 'Chapter 10',
  title: 'Manipulation of Simple Polynomials',
  subtitle: 'Uploaded Exercise Bank · 4 Separate Sections',
  status: 'active',
  sections: [
    {
      id: 's1c10_sec1',
      chapterId: 's1-ch10',
      number: 1,
      title: 'Laws of Positive Integral Indices',
      subtitle: 'Section 1 (Q1–Q35)',
      description: 'Multiply and divide powers with the same base, handle negative coefficients, and solve index MCQs.',
      levels: ['Level 1', 'Level 2', 'Level 3', 'MCQ'],
    },
    {
      id: 's1c10_sec2',
      chapterId: 's1-ch10',
      number: 2,
      title: 'Manipulation of Simple Polynomials',
      subtitle: 'Section 2 (Q41–Q46, Q50–Q56)',
      description: 'Collect like terms and arrange polynomials in ascending or descending powers of variables.',
      levels: ['Level 1', 'Level 2'],
    },
    {
      id: 's1c10_sec3',
      chapterId: 's1-ch10',
      number: 3,
      title: 'Addition and Subtraction of Polynomials',
      subtitle: 'Section 3 (Q67–Q87)',
      description: 'Remove brackets carefully with signs, add or subtract polynomials, and order by ascending/descending powers.',
      levels: ['Level 1', 'Level 2'],
    },
    {
      id: 's1c10_sec4',
      chapterId: 's1-ch10',
      number: 4,
      title: 'Multiplication of Polynomials',
      subtitle: 'Section 4 (Q102–Q126)',
      description: 'Expand monomial-by-polynomial and multi-bracket products, combine like terms, and solve HKDSE MCQs.',
      levels: ['Level 1', 'Level 2', 'Level 3', 'MCQ'],
    },
  ],
};

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
      chapterId: 's2-ch3',
      number: 1,
      title: 'Manipulation of Algebraic Fractions',
      subtitle: 'Section 1',
      description: 'Reduce monomial & polynomial fractions, multiply, divide, and combine with L.C.M.',
      levels: ['Level 1', 'Level 2'],
    },
    {
      id: 'sec2',
      chapterId: 's2-ch3',
      number: 2,
      title: 'Formulas and Substitution',
      subtitle: 'Section 2',
      description: 'Substitute values into formulas, solve for unknowns, and complete TSA-style MCQs.',
      levels: ['Level 1', 'Level 2', 'MCQ'],
    },
    {
      id: 'sec3',
      chapterId: 's2-ch3',
      number: 3,
      title: 'Change of Subject of a Formula',
      subtitle: 'Section 3',
      description: 'Rearrange formulas step by step, factorize the subject, and analyse changes in value.',
      levels: ['Level 1', 'Level 2'],
    },
  ],
};

/**
 * Reserved topic slots so additional chapters or missing S.1 Ch.10 pages
 * can be plugged in without refactoring the app shell.
 */
export const RESERVED_TOPIC_SLOTS: ChapterUnit<string>[] = [
  {
    id: 's1-ch10-missing-slot',
    form: 'S.1',
    chapterLabel: 'Ch.10 Extension',
    title: 'Reserved Vacancy · Remaining S.1 Ch.10 Pages',
    subtitle: 'Space reserved for Q36–40, Q47–49, Q57–66, Q88–101, Q127–130',
    status: 'reserved',
    sections: [],
    reservedNote: 'Ready for the remaining uploaded exercise pages (substitution, degree identification, Level 3 & MCQs).',
  },
  {
    id: 's2-topic-slot-1',
    form: 'S.2',
    chapterLabel: 'Next Topic',
    title: 'Reserved Vacancy · Future S.1 / S.2 Chapter',
    subtitle: 'Space reserved for upcoming school chapters',
    status: 'reserved',
    sections: [],
    reservedNote: 'Additional chapters or question banks can be appended directly into the curriculum registry.',
  },
];

export const ACTIVE_CHAPTERS: ChapterUnit[] = [S1_CHAPTER_10, S2_CHAPTER_3];

export const CHAPTER_REGISTRY: ChapterUnit<string>[] = [...ACTIVE_CHAPTERS, ...RESERVED_TOPIC_SLOTS];

export const S1_CH10_QUESTIONS: QuestionItem[] = [
  ...S1_CH10_SECTION_1_QUESTIONS,
  ...S1_CH10_SECTION_2_QUESTIONS,
  ...S1_CH10_SECTION_3_QUESTIONS,
  ...S1_CH10_SECTION_4_QUESTIONS,
];

export const S2_CH3_QUESTIONS: QuestionItem[] = [
  ...SECTION_1_QUESTIONS.map((q) => ({ ...q, chapterId: 's2-ch3' as const })),
  ...SECTION_2_QUESTIONS.map((q) => ({ ...q, chapterId: 's2-ch3' as const })),
  ...SECTION_3_QUESTIONS.map((q) => ({ ...q, chapterId: 's2-ch3' as const })),
];

export const ALL_QUESTIONS: QuestionItem[] = [
  ...S1_CH10_QUESTIONS,
  ...S2_CH3_QUESTIONS,
];

export function getChapterForSection(sectionId: SectionId): ChapterUnit {
  return sectionId.startsWith('s1c10_') ? S1_CHAPTER_10 : S2_CHAPTER_3;
}

export function getChapterIdForSection(sectionId: SectionId): ChapterId {
  return sectionId.startsWith('s1c10_') ? 's1-ch10' : 's2-ch3';
}

export function getChapterById(chapterId: ChapterId): ChapterUnit {
  return chapterId === 's1-ch10' ? S1_CHAPTER_10 : S2_CHAPTER_3;
}

export function getQuestionsForChapter(chapterId: ChapterId): QuestionItem[] {
  return chapterId === 's1-ch10' ? S1_CH10_QUESTIONS : S2_CH3_QUESTIONS;
}

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
    chapterId: item.chapterId || getChapterIdForSection(item.sectionId),
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
