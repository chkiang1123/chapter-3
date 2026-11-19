import {
  ALL_CLASSES,
  MAX_CLASS_NUMBER,
  S1_CLASSES,
  S2_CLASSES,
} from './firebaseSchemaConstants';
import {
  S1_CH10_QUESTIONS,
  S2_CH3_QUESTIONS,
  getChapterIdForSection,
} from '../data/curriculum';
import type { ChapterId, QuestionLevel, SectionId } from '../data/types';

export { S1_CLASSES, S2_CLASSES, ALL_CLASSES, MAX_CLASS_NUMBER };

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
  chapterId?: ChapterId;
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
  scoreByChapter: Record<ChapterId, number>;
  extraDone: number;
  wrongAttempts: number;
  hintsUsed: number;
  firstLogin: string;
  lastActive: string;
  sections: Record<SectionId, SectionProgress>;
  results: AttemptRecord[];
}

const LEGACY_STORAGE_KEY = 'balance_quest_s2_ch3_v1';
const GUEST_STORAGE_KEY = 'balance_quest_guest_v1';

export function getStorageKeyForUser(uid?: string | null): string {
  const cleanUid = typeof uid === 'string' ? uid.trim() : '';
  return cleanUid ? `balance_quest_user_${cleanUid}` : GUEST_STORAGE_KEY;
}

export function emptySections(): Record<SectionId, SectionProgress> {
  return {
    sec1: { completedIds: [], pendingSimilar: null },
    sec2: { completedIds: [], pendingSimilar: null },
    sec3: { completedIds: [], pendingSimilar: null },
    s1c10_sec1: { completedIds: [], pendingSimilar: null },
    s1c10_sec2: { completedIds: [], pendingSimilar: null },
    s1c10_sec3: { completedIds: [], pendingSimilar: null },
    s1c10_sec4: { completedIds: [], pendingSimilar: null },
  };
}

export function emptyScoreByChapter(): Record<ChapterId, number> {
  return {
    's1-ch10': 0,
    's2-ch3': 0,
  };
}

export function createDefaultState(): AppStorageState {
  const now = new Date().toISOString();
  return {
    profile: null,
    score: 0,
    scoreByChapter: emptyScoreByChapter(),
    extraDone: 0,
    wrongAttempts: 0,
    hintsUsed: 0,
    firstLogin: now,
    lastActive: now,
    sections: emptySections(),
    results: [],
  };
}

export function parseStoredAppState(raw: string | null): AppStorageState {
  if (!raw) return createDefaultState();
  try {
    const parsed = JSON.parse(raw) as Partial<AppStorageState>;
    const def = createDefaultState();
    const legacyS2Score = typeof parsed.score === 'number' ? parsed.score : 0;
    const scoreByChapter: Record<ChapterId, number> = {
      's1-ch10': parsed.scoreByChapter?.['s1-ch10'] ?? 0,
      's2-ch3': parsed.scoreByChapter?.['s2-ch3'] ?? legacyS2Score,
    };
    return {
      ...def,
      ...parsed,
      score: Math.max(legacyS2Score, scoreByChapter['s1-ch10'] + scoreByChapter['s2-ch3']),
      scoreByChapter,
      sections: {
        sec1: parsed.sections?.sec1 || def.sections.sec1,
        sec2: parsed.sections?.sec2 || def.sections.sec2,
        sec3: parsed.sections?.sec3 || def.sections.sec3,
        s1c10_sec1: parsed.sections?.s1c10_sec1 || def.sections.s1c10_sec1,
        s1c10_sec2: parsed.sections?.s1c10_sec2 || def.sections.s1c10_sec2,
        s1c10_sec3: parsed.sections?.s1c10_sec3 || def.sections.s1c10_sec3,
        s1c10_sec4: parsed.sections?.s1c10_sec4 || def.sections.s1c10_sec4,
      },
      results: Array.isArray(parsed.results) ? parsed.results : [],
    };
  } catch {
    return createDefaultState();
  }
}

export function loadAppStateForUser(uid?: string | null): AppStorageState {
  if (typeof window === 'undefined') return createDefaultState();
  try {
    const key = getStorageKeyForUser(uid);
    const raw = window.localStorage.getItem(key);
    if (!raw && !uid) {
      const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) return parseStoredAppState(legacyRaw);
    }
    return parseStoredAppState(raw);
  } catch {
    return createDefaultState();
  }
}

export function saveAppStateForUser(state: AppStorageState, uid?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(getStorageKeyForUser(uid), JSON.stringify(state));
  } catch {
    // ignore storage quota errors
  }
}

export function clearGuestAppState(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(GUEST_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

export function loadAppState(): AppStorageState {
  return loadAppStateForUser(null);
}

export function saveAppState(state: AppStorageState): void {
  saveAppStateForUser(state, null);
}

export function resetStudentProgress(state: AppStorageState, uid?: string | null): AppStorageState {
  const next: AppStorageState = {
    ...createDefaultState(),
    profile: state.profile,
  };
  saveAppStateForUser(next, uid);
  return next;
}

export function getChapterProgress(
  state: AppStorageState,
  chapterId: ChapterId,
): { doneCount: number; totalCount: number; score: number; pct: number } {
  if (chapterId === 's1-ch10') {
    const doneCount =
      state.sections.s1c10_sec1.completedIds.length +
      state.sections.s1c10_sec2.completedIds.length +
      state.sections.s1c10_sec3.completedIds.length +
      state.sections.s1c10_sec4.completedIds.length;
    const totalCount = S1_CH10_QUESTIONS.length;
    const score = state.scoreByChapter['s1-ch10'] ?? 0;
    const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
    return { doneCount, totalCount, score, pct };
  }

  const doneCount =
    state.sections.sec1.completedIds.length +
    state.sections.sec2.completedIds.length +
    state.sections.sec3.completedIds.length;
  const totalCount = S2_CH3_QUESTIONS.length;
  const score = state.scoreByChapter['s2-ch3'] ?? state.score;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  return { doneCount, totalCount, score, pct };
}

export function getDefaultChapterForClass(cls?: string): ChapterId {
  if (cls && cls.startsWith('1')) return 's1-ch10';
  return 's2-ch3';
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

const SEED_CLASSMATES_S2: Array<{
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

const SEED_CLASSMATES_S1: Array<{
  name: string;
  cls: string;
  classNo: number;
  done: number;
  score: number;
  extraDone: number;
  wrong: number;
  hints: number;
}> = [
  { name: 'Lee Tsz Ching', cls: '1A', classNo: 3, done: 52, score: 960, extraDone: 2, wrong: 3, hints: 1 },
  { name: 'Tam Chun Yu', cls: '1A', classNo: 16, done: 44, score: 810, extraDone: 3, wrong: 4, hints: 2 },
  { name: 'Chow Hoi Lam', cls: '1B', classNo: 9, done: 64, score: 1180, extraDone: 1, wrong: 2, hints: 1 },
  { name: 'Fong Pak Ho', cls: '1B', classNo: 21, done: 35, score: 640, extraDone: 4, wrong: 5, hints: 3 },
  { name: 'Ma Wing Tung', cls: '1C', classNo: 5, done: 58, score: 1090, extraDone: 2, wrong: 2, hints: 1 },
  { name: 'Tsang Tsz Yui', cls: '1D', classNo: 14, done: 39, score: 720, extraDone: 3, wrong: 4, hints: 2 },
  { name: 'Yuen Ka Yan', cls: '1E', classNo: 11, done: 47, score: 880, extraDone: 2, wrong: 3, hints: 2 },
  { name: 'Siu Cheuk Yin', cls: '1A', classNo: 25, done: 28, score: 510, extraDone: 2, wrong: 3, hints: 2 },
];

export interface CloudBoardInput {
  uid?: string;
  name: string;
  cls: string;
  classNo: number;
  done: number;
  score: number;
  extraDone: number;
  scoreS1C10?: number;
  scoreS2C3?: number;
  doneCountS1C10?: number;
  doneCountS2C3?: number;
}

export function buildLeaderboards(
  state: AppStorageState,
  filterCls?: string,
  cloudRows?: CloudBoardInput[],
  chapterId?: ChapterId,
): {
  classTop: LeaderboardEntry[];
  formTop: LeaderboardEntry[];
  myClassRank: number | null;
  myFormRank: number | null;
} {
  const activeChapter: ChapterId = chapterId || getDefaultChapterForClass(filterCls || state.profile?.cls);
  const formPrefix = activeChapter === 's1-ch10' ? '1' : '2';
  const defaultCls = activeChapter === 's1-ch10' ? '1A' : '2A';
  const targetCls =
    filterCls && filterCls.startsWith(formPrefix)
      ? filterCls
      : state.profile?.cls.startsWith(formPrefix)
        ? state.profile.cls
        : defaultCls;

  const myProgress = getChapterProgress(state, activeChapter);
  const hasCloudData = Array.isArray(cloudRows) && cloudRows.length > 0;

  const combined = hasCloudData
    ? cloudRows
        .filter((c) => {
          const chScore = activeChapter === 's1-ch10' ? (c.scoreS1C10 ?? 0) : (c.scoreS2C3 ?? c.score);
          const chDone = activeChapter === 's1-ch10' ? (c.doneCountS1C10 ?? 0) : (c.doneCountS2C3 ?? c.done);
          return c.cls.startsWith(formPrefix) || chScore > 0 || chDone > 0;
        })
        .map((c) => {
          const chScore = activeChapter === 's1-ch10' ? (c.scoreS1C10 ?? 0) : (c.scoreS2C3 ?? c.score);
          const chDone = activeChapter === 's1-ch10' ? (c.doneCountS1C10 ?? 0) : (c.doneCountS2C3 ?? c.done);
          return {
            name: c.name,
            cls: c.cls,
            classNo: c.classNo,
            done: chDone,
            score: chScore,
            extraDone: c.extraDone,
            wrong: 0,
            hints: 0,
            isMe: Boolean(
              state.profile &&
                c.cls === state.profile.cls &&
                c.classNo === state.profile.classNo &&
                c.name.trim().toLowerCase() === state.profile.name.trim().toLowerCase(),
            ),
          };
        })
    : (activeChapter === 's1-ch10' ? SEED_CLASSMATES_S1 : SEED_CLASSMATES_S2).map((c) => ({
        ...c,
        isMe: false,
      }));

  const meAlreadyInCloud = combined.some((c) => c.isMe);
  if (state.profile && !meAlreadyInCloud && (state.profile.cls.startsWith(formPrefix) || myProgress.doneCount > 0 || myProgress.score > 0)) {
    combined.push({
      name: state.profile.name,
      cls: state.profile.cls,
      classNo: state.profile.classNo,
      done: myProgress.doneCount,
      score: myProgress.score,
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
  return [...SEED_CLASSMATES_S1, ...SEED_CLASSMATES_S2];
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
  chapterId?: ChapterId,
): string[] {
  const mistakeSet = new Set<string>();
  for (const r of results) {
    if (chapterId && getChapterIdForSection(r.sectionId) !== chapterId) {
      continue;
    }
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
