import type { QuestionLevel, SectionId } from '../data/types';

export const S2_CLASSES = ['2A', '2B', '2C', '2D', '2E'] as const;
export const MAX_CLASS_NUMBER = 45;

export interface StudentProfile {
  name: string;
  cls: string;
  classNo: number;
  email: string;
}

export interface PendingSimilar {
  forId: string;
  variantIndex: number;
}

export interface SectionProgress {
  completedIds: string[];
  pendingSimilar: PendingSimilar | null;
}

export interface AttemptRecord {
  id: string;
  timestamp: string;
  studentEmail: string;
  studentName: string;
  studentCls: string;
  studentClassNo: number;
  sectionId: SectionId;
  questionId: string;
  questionLabel: string;
  type: 'Main' | 'Similar';
  promptEq: string;
  points: number;
  maxPoints: number;
  wrongMoves: number;
  wrongLines: number;
  hints: number;
  skipped: number;
  seconds: number;
  wrongInputs: string[];
}

export interface AppStorageState {
  profile: StudentProfile | null;
  score: number;
  extraDone: number;
  wrongAttempts: number;
  hintsUsed: number;
  firstLogin: string;
  lastActive: string;
  sections: Record<SectionId, SectionProgress>;
  results: AttemptRecord[];
}

const STORAGE_KEY = 'balance_quest_s2_ch3_v1';

function emptySections(): Record<SectionId, SectionProgress> {
  return {
    sec1: { completedIds: [], pendingSimilar: null },
    sec2: { completedIds: [], pendingSimilar: null },
    sec3: { completedIds: [], pendingSimilar: null },
  };
}

export function createDefaultState(): AppStorageState {
  const now = new Date().toISOString();
  return {
    profile: null,
    score: 0,
    extraDone: 0,
    wrongAttempts: 0,
    hintsUsed: 0,
    firstLogin: now,
    lastActive: now,
    sections: emptySections(),
    results: [],
  };
}

export function loadAppState(): AppStorageState {
  if (typeof window === 'undefined') return createDefaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw) as Partial<AppStorageState>;
    const def = createDefaultState();
    return {
      ...def,
      ...parsed,
      sections: {
        sec1: parsed.sections?.sec1 || def.sections.sec1,
        sec2: parsed.sections?.sec2 || def.sections.sec2,
        sec3: parsed.sections?.sec3 || def.sections.sec3,
      },
      results: Array.isArray(parsed.results) ? parsed.results : [],
    };
  } catch {
    return createDefaultState();
  }
}

export function saveAppState(state: AppStorageState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota errors
  }
}

export function resetStudentProgress(state: AppStorageState): AppStorageState {
  const next: AppStorageState = {
    ...createDefaultState(),
    profile: state.profile,
  };
  saveAppState(next);
  return next;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  cls: string;
  classNo: number;
  done: number;
  score: number;
  extraDone: number;
  isMe: boolean;
}

const SEED_CLASSMATES: Array<{
  name: string;
  cls: string;
  classNo: number;
  done: number;
  score: number;
  extraDone: number;
  wrong: number;
  hints: number;
}> = [
  { name: 'Chan Tsz Hin', cls: '2A', classNo: 4, done: 48, score: 1120, extraDone: 3, wrong: 4, hints: 2 },
  { name: 'Wong Lok Yiu', cls: '2A', classNo: 19, done: 42, score: 985, extraDone: 4, wrong: 6, hints: 3 },
  { name: 'Lam Ka Hei', cls: '2B', classNo: 11, done: 54, score: 1290, extraDone: 2, wrong: 3, hints: 1 },
  { name: 'Cheung Wing Yan', cls: '2B', classNo: 26, done: 37, score: 860, extraDone: 5, wrong: 7, hints: 4 },
  { name: 'Lau Ho Yin', cls: '2C', classNo: 8, done: 61, score: 1410, extraDone: 2, wrong: 2, hints: 2 },
  { name: 'Ng Sze Wing', cls: '2C', classNo: 22, done: 29, score: 690, extraDone: 3, wrong: 5, hints: 3 },
  { name: 'Ho Chun Kit', cls: '2D', classNo: 14, done: 33, score: 775, extraDone: 4, wrong: 6, hints: 2 },
  { name: 'Leung Yat Long', cls: '2E', classNo: 7, done: 45, score: 1050, extraDone: 3, wrong: 4, hints: 1 },
  { name: 'Kwok Sum Yu', cls: '2A', classNo: 12, done: 24, score: 560, extraDone: 2, wrong: 3, hints: 2 },
  { name: 'Yip Pak Him', cls: '2D', classNo: 30, done: 18, score: 420, extraDone: 2, wrong: 4, hints: 3 },
];

export interface CloudBoardInput {
  uid?: string;
  name: string;
  cls: string;
  classNo: number;
  done: number;
  score: number;
  extraDone: number;
}

export function buildLeaderboards(
  state: AppStorageState,
  filterCls?: string,
  cloudRows?: CloudBoardInput[],
): {
  classTop: LeaderboardEntry[];
  formTop: LeaderboardEntry[];
  myClassRank: number | null;
  myFormRank: number | null;
} {
  const meDone =
    state.sections.sec1.completedIds.length +
    state.sections.sec2.completedIds.length +
    state.sections.sec3.completedIds.length;

  const targetCls = filterCls || state.profile?.cls || '2A';
  const hasCloudData = Array.isArray(cloudRows) && cloudRows.length > 0;
  const combined = hasCloudData
    ? cloudRows.map((c) => ({
        name: c.name,
        cls: c.cls,
        classNo: c.classNo,
        done: c.done,
        score: c.score,
        extraDone: c.extraDone,
        wrong: 0,
        hints: 0,
        isMe: Boolean(
          state.profile &&
            c.cls === state.profile.cls &&
            c.classNo === state.profile.classNo &&
            c.name.trim().toLowerCase() === state.profile.name.trim().toLowerCase(),
        ),
      }))
    : SEED_CLASSMATES.map((c) => ({
        ...c,
        isMe: false,
      }));

  const meAlreadyInCloud = combined.some((c) => c.isMe);
  if (state.profile && !meAlreadyInCloud) {
    combined.push({
      name: state.profile.name,
      cls: state.profile.cls,
      classNo: state.profile.classNo,
      done: meDone,
      score: state.score,
      extraDone: state.extraDone,
      wrong: state.wrongAttempts,
      hints: state.hintsUsed,
      isMe: true,
    });
  }

  const rankList = (items: typeof combined): LeaderboardEntry[] => {
    const sorted = items
      .slice()
      .sort((a, b) => b.score - a.score || b.done - a.done || a.name.localeCompare(b.name));
    const ranked: LeaderboardEntry[] = [];
    for (let i = 0; i < sorted.length; i++) {
      const prev = ranked[i - 1];
      const same = prev && prev.score === sorted[i].score && prev.done === sorted[i].done;
      ranked.push({
        rank: same ? prev.rank : i + 1,
        name: sorted[i].name,
        cls: sorted[i].cls,
        classNo: sorted[i].classNo,
        done: sorted[i].done,
        score: sorted[i].score,
        extraDone: sorted[i].extraDone,
        isMe: sorted[i].isMe,
      });
    }
    return ranked;
  };

  const formRanked = rankList(combined);
  const classRanked = rankList(combined.filter((c) => c.cls === targetCls));
  const meForm = formRanked.find((r) => r.isMe);
  const meClass = classRanked.find((r) => r.isMe);

  return {
    classTop: classRanked.slice(0, 10),
    formTop: formRanked.slice(0, 20),
    myClassRank: meClass ? meClass.rank : null,
    myFormRank: meForm ? meForm.rank : null,
  };
}

export function getSeedClassmates() {
  return SEED_CLASSMATES;
}

export function formatDuration(sec: number): string {
  if (!sec) return '–';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m ? `${m}m ${s}s` : `${s}s`;
}

export function formatShortTime(iso: string): string {
  if (!iso) return '–';
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function getMistakeQuestionIds(
  results: AttemptRecord[],
  orderedIds?: string[],
): string[] {
  const mistakeSet = new Set<string>();
  for (const r of results) {
    if (r.wrongMoves > 0 || r.wrongLines > 0) {
      mistakeSet.add(r.questionId);
    }
  }
  if (!mistakeSet.size) return [];
  if (orderedIds && orderedIds.length > 0) {
    const ordered = orderedIds.filter((id) => mistakeSet.has(id));
    const orderedSet = new Set(ordered);
    for (const id of mistakeSet) {
      if (!orderedSet.has(id)) ordered.push(id);
    }
    return ordered;
  }
  return Array.from(mistakeSet);
}

export interface PlaySessionConfig {
  sectionId: SectionId;
  levelFilter: QuestionLevel | 'ALL';
  practiceMode: boolean;
  startQuestionId?: string;
  reviewMistakes?: boolean;
  questionIds?: string[];
}
