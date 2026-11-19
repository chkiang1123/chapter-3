import { GoogleAuthProvider, signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { OperationType, auth, db, googleAuthProvider, googleSheetsProvider, handleFirestoreError } from '../firebase';
import { getChapterIdForSection } from '../data/curriculum';
import {
  ALL_CLASSES,
  EMAIL_MAX_LENGTH,
  MAX_S1C10_SEC1_DONE,
  MAX_S1C10_SEC2_DONE,
  MAX_S1C10_SEC3_DONE,
  MAX_S1C10_SEC4_DONE,
  MAX_SEC1_DONE,
  MAX_SEC2_DONE,
  MAX_SEC3_DONE,
  MAX_WRONG_INPUTS,
  NAME_MAX_LENGTH,
  PROMPT_EQ_MAX_LENGTH,
  QUESTION_ID_MAX_LENGTH,
  QUESTION_LABEL_MAX_LENGTH,
  TEACHER_NOTE_MAX_LENGTH,
  WRONG_INPUT_MAX_LENGTH,
  clampClass,
  clampClassNo,
  clampInt,
  clampStringArray,
  clampText,
  isPrimaryTeacherEmail,
  isValidEmailAddress,
  normalizeEmail,
  sanitizeAttemptDocId,
} from './firebaseSchemaConstants';
import type { AppStorageState, AttemptRecord, StudentProfile } from './storage';

/**
 * In-memory only OAuth access token for Google Sheets API calls.
 * Never persisted to localStorage, sessionStorage, or Firestore.
 */
let cachedSheetsAccessToken: string | null = null;

export function getSheetsAccessToken(): string | null {
  return cachedSheetsAccessToken;
}

export function clearSheetsAccessToken(): void {
  cachedSheetsAccessToken = null;
}

export interface CloudStudentSummary {
  uid: string;
  name: string;
  cls: string;
  classNo: number;
  email: string;
  score: number;
  scoreS1C10: number;
  scoreS2C3: number;
  doneCount: number;
  doneCountS1C10: number;
  doneCountS2C3: number;
  extraDone: number;
  wrongAttempts: number;
  hintsUsed: number;
  completedIdsSec1: string[];
  completedIdsSec2: string[];
  completedIdsSec3: string[];
  completedIdsS1C10Sec1: string[];
  completedIdsS1C10Sec2: string[];
  completedIdsS1C10Sec3: string[];
  completedIdsS1C10Sec4: string[];
  updatedAtIso: string;
}

export interface CloudLeaderboardRow {
  uid: string;
  name: string;
  cls: string;
  classNo: number;
  done: number;
  score: number;
  extraDone: number;
  scoreS1C10: number;
  scoreS2C3: number;
  doneCountS1C10: number;
  doneCountS2C3: number;
}

export interface TeacherAllowlistItem {
  email: string;
  addedBy: string;
  note: string;
  createdAtIso: string;
}

function timestampToIso(ts: unknown): string {
  if (ts instanceof Timestamp) {
    return ts.toDate().toISOString();
  }
  if (typeof ts === 'string') return ts;
  return new Date().toISOString();
}

export function formatAuthError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  if (raw.includes('auth/unauthorized-domain')) {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
    return `Google sign-in is blocked for "${host}". Add "${host}" under Firebase Console -> Authentication -> Settings -> Authorized domains.`;
  }
  if (raw.includes('auth/operation-not-allowed')) {
    return 'Google sign-in is not enabled yet in Firebase Console. Enable Google under Authentication -> Sign-in method.';
  }
  if (raw.includes('auth/popup-closed-by-user')) {
    return 'Google sign-in popup was closed before completing sign-in.';
  }
  if (raw.includes('auth/cancelled-popup-request')) {
    return 'Another sign-in window is already open. Please finish or close it and try again.';
  }
  if (raw.includes('auth/popup-blocked')) {
    return 'Your browser blocked the sign-in popup. Allow popups for this site (or open the app directly in a new browser tab instead of an embedded frame) and try again.';
  }
  if (raw.includes('auth/network-request-failed') || raw.includes('auth/internal-error')) {
    return 'Could not complete Google sign-in due to a network or embedded-frame restriction. Allow popups/cookies or open the app URL in its own browser tab.';
  }
  if (raw.includes('auth/web-storage-unsupported')) {
    return 'Browser storage/cookies are disabled. Enable cookies for Google sign-in to work.';
  }
  return raw;
}

export async function signInWithGoogle(): Promise<User> {
  try {
    const cred = await signInWithPopup(auth, googleAuthProvider);
    return cred.user;
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}

export async function connectGoogleSheetsScope(): Promise<string> {
  try {
    const cred = await signInWithPopup(auth, googleSheetsProvider);
    const oauthCred = GoogleAuthProvider.credentialFromResult(cred);
    if (!oauthCred?.accessToken) {
      throw new Error('Google did not return a Google Sheets access token. Please try connecting again.');
    }
    cachedSheetsAccessToken = oauthCred.accessToken;
    return oauthCred.accessToken;
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}

export async function signOutGoogle(): Promise<void> {
  cachedSheetsAccessToken = null;
  await signOut(auth);
}

export async function checkIsAuthorizedTeacher(user: User | null): Promise<boolean> {
  if (!user || !user.email || !user.emailVerified) return false;
  const emailLower = normalizeEmail(user.email);
  if (isPrimaryTeacherEmail(emailLower)) return true;
  if (!isValidEmailAddress(emailLower)) return false;

  const path = `teacherAllowlist/${emailLower}`;
  try {
    const snap = await getDoc(doc(db, 'teacherAllowlist', emailLower));
    return snap.exists();
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

function docToCloudSummary(uid: string, d: Record<string, unknown>, fallbackName = 'Student', fallbackEmail = ''): CloudStudentSummary {
  const s2Sec1 = Array.isArray(d.completedIdsSec1) ? d.completedIdsSec1.map(String) : [];
  const s2Sec2 = Array.isArray(d.completedIdsSec2) ? d.completedIdsSec2.map(String) : [];
  const s2Sec3 = Array.isArray(d.completedIdsSec3) ? d.completedIdsSec3.map(String) : [];
  const s1Sec1 = Array.isArray(d.completedIdsS1C10Sec1) ? d.completedIdsS1C10Sec1.map(String) : [];
  const s1Sec2 = Array.isArray(d.completedIdsS1C10Sec2) ? d.completedIdsS1C10Sec2.map(String) : [];
  const s1Sec3 = Array.isArray(d.completedIdsS1C10Sec3) ? d.completedIdsS1C10Sec3.map(String) : [];
  const s1Sec4 = Array.isArray(d.completedIdsS1C10Sec4) ? d.completedIdsS1C10Sec4.map(String) : [];

  const totalScore = Number(d.score || 0);
  const doneS1 = typeof d.doneCountS1C10 === 'number'
    ? d.doneCountS1C10
    : s1Sec1.length + s1Sec2.length + s1Sec3.length + s1Sec4.length;
  const doneS2 = typeof d.doneCountS2C3 === 'number'
    ? d.doneCountS2C3
    : s2Sec1.length + s2Sec2.length + s2Sec3.length;
  const scoreS1 = typeof d.scoreS1C10 === 'number' ? d.scoreS1C10 : 0;
  const scoreS2 = typeof d.scoreS2C3 === 'number' ? d.scoreS2C3 : Math.max(0, totalScore - scoreS1);

  return {
    uid: String(d.uid || uid),
    name: String(d.name || fallbackName),
    cls: String(d.cls || '2A'),
    classNo: Number(d.classNo || 1),
    email: String(d.email || fallbackEmail),
    score: totalScore,
    scoreS1C10: scoreS1,
    scoreS2C3: scoreS2,
    doneCount: Number(d.doneCount || doneS1 + doneS2),
    doneCountS1C10: doneS1,
    doneCountS2C3: doneS2,
    extraDone: Number(d.extraDone || 0),
    wrongAttempts: Number(d.wrongAttempts || 0),
    hintsUsed: Number(d.hintsUsed || 0),
    completedIdsSec1: s2Sec1,
    completedIdsSec2: s2Sec2,
    completedIdsSec3: s2Sec3,
    completedIdsS1C10Sec1: s1Sec1,
    completedIdsS1C10Sec2: s1Sec2,
    completedIdsS1C10Sec3: s1Sec3,
    completedIdsS1C10Sec4: s1Sec4,
    updatedAtIso: timestampToIso(d.updatedAt),
  };
}

export async function loadStudentSummaryFromCloud(
  user: User,
): Promise<CloudStudentSummary | null> {
  const path = `students/${user.uid}`;
  try {
    const snap = await getDoc(doc(db, 'students', user.uid));
    if (!snap.exists()) return null;
    return docToCloudSummary(user.uid, snap.data(), user.displayName || 'Student', user.email || '');
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

function buildStudentSummaryFields(user: User, state: AppStorageState, profile: StudentProfile) {
  const sec1 = clampStringArray(state.sections.sec1.completedIds, MAX_SEC1_DONE, QUESTION_ID_MAX_LENGTH);
  const sec2 = clampStringArray(state.sections.sec2.completedIds, MAX_SEC2_DONE, QUESTION_ID_MAX_LENGTH);
  const sec3 = clampStringArray(state.sections.sec3.completedIds, MAX_SEC3_DONE, QUESTION_ID_MAX_LENGTH);
  const s1Sec1 = clampStringArray(state.sections.s1c10_sec1.completedIds, MAX_S1C10_SEC1_DONE, QUESTION_ID_MAX_LENGTH);
  const s1Sec2 = clampStringArray(state.sections.s1c10_sec2.completedIds, MAX_S1C10_SEC2_DONE, QUESTION_ID_MAX_LENGTH);
  const s1Sec3 = clampStringArray(state.sections.s1c10_sec3.completedIds, MAX_S1C10_SEC3_DONE, QUESTION_ID_MAX_LENGTH);
  const s1Sec4 = clampStringArray(state.sections.s1c10_sec4.completedIds, MAX_S1C10_SEC4_DONE, QUESTION_ID_MAX_LENGTH);

  const doneCountS1C10 = clampInt(s1Sec1.length + s1Sec2.length + s1Sec3.length + s1Sec4.length, 0, 500);
  const doneCountS2C3 = clampInt(sec1.length + sec2.length + sec3.length, 0, 500);
  const doneCount = clampInt(doneCountS1C10 + doneCountS2C3, 0, 500);

  const scoreS1C10 = clampInt(state.scoreByChapter['s1-ch10'] ?? 0, 0, 100000);
  const scoreS2C3 = clampInt(state.scoreByChapter['s2-ch3'] ?? state.score, 0, 100000);
  const safeScore = clampInt(Math.max(state.score, scoreS1C10 + scoreS2C3), 0, 100000);

  const safeName = clampText(profile.name, NAME_MAX_LENGTH, user.displayName || 'Student');
  const safeCls = clampClass(profile.cls);
  const safeClassNo = clampClassNo(profile.classNo);
  const safeEmail = normalizeEmail(user.email || profile.email).slice(0, EMAIL_MAX_LENGTH);
  const safeExtraDone = clampInt(state.extraDone, 0, 2000);

  const progressFields = {
    score: safeScore,
    scoreS1C10,
    scoreS2C3,
    doneCount,
    doneCountS1C10,
    doneCountS2C3,
    extraDone: safeExtraDone,
    wrongAttempts: clampInt(state.wrongAttempts, 0, 20000),
    hintsUsed: clampInt(state.hintsUsed, 0, 20000),
    completedIdsSec1: sec1,
    completedIdsSec2: sec2,
    completedIdsSec3: sec3,
    completedIdsS1C10Sec1: s1Sec1,
    completedIdsS1C10Sec2: s1Sec2,
    completedIdsS1C10Sec3: s1Sec3,
    completedIdsS1C10Sec4: s1Sec4,
    updatedAt: serverTimestamp(),
  };

  const leaderboardProgressFields = {
    doneCount,
    score: safeScore,
    scoreS1C10,
    scoreS2C3,
    doneCountS1C10,
    doneCountS2C3,
    extraDone: safeExtraDone,
    updatedAt: serverTimestamp(),
  };

  return {
    summaryCreate: {
      name: safeName,
      cls: safeCls,
      classNo: safeClassNo,
      email: safeEmail,
      ...progressFields,
    },
    summaryUpdate: progressFields,
    leaderboardCreate: {
      name: safeName,
      cls: safeCls,
      classNo: safeClassNo,
      ...leaderboardProgressFields,
    },
    leaderboardUpdate: leaderboardProgressFields,
  };
}

export async function saveStudentStateToCloud(
  user: User,
  state: AppStorageState,
  profile: StudentProfile,
): Promise<void> {
  if (!user.emailVerified || !user.email) return;
  const studentRef = doc(db, 'students', user.uid);
  const lbRef = doc(db, 'leaderboard', user.uid);
  const path = `students/${user.uid}`;

  try {
    const [studentSnap, lbSnap] = await Promise.all([getDoc(studentRef), getDoc(lbRef)]);
    const { summaryCreate, summaryUpdate, leaderboardCreate, leaderboardUpdate } = buildStudentSummaryFields(
      user,
      state,
      profile,
    );
    const batch = writeBatch(db);

    if (studentSnap.exists()) {
      batch.update(studentRef, summaryUpdate);
    } else {
      batch.set(studentRef, {
        uid: user.uid,
        ...summaryCreate,
        createdAt: serverTimestamp(),
      });
    }

    if (lbSnap.exists()) {
      batch.update(lbRef, leaderboardUpdate);
    } else {
      batch.set(lbRef, {
        uid: user.uid,
        ...leaderboardCreate,
      });
    }

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function recordAttemptToCloud(
  user: User,
  state: AppStorageState,
  profile: StudentProfile,
  record: AttemptRecord,
): Promise<void> {
  if (!user.emailVerified || !user.email) return;
  const studentRef = doc(db, 'students', user.uid);
  const lbRef = doc(db, 'leaderboard', user.uid);
  const attemptId = sanitizeAttemptDocId(record.id);
  const attemptRef = doc(db, 'students', user.uid, 'attempts', attemptId);
  const path = `students/${user.uid}/attempts/${attemptId}`;

  try {
    const [studentSnap, lbSnap] = await Promise.all([getDoc(studentRef), getDoc(lbRef)]);
    const { summaryCreate, summaryUpdate, leaderboardCreate, leaderboardUpdate } = buildStudentSummaryFields(
      user,
      state,
      profile,
    );
    const batch = writeBatch(db);

    if (studentSnap.exists()) {
      batch.update(studentRef, summaryUpdate);
    } else {
      batch.set(studentRef, {
        uid: user.uid,
        ...summaryCreate,
        createdAt: serverTimestamp(),
      });
    }

    if (lbSnap.exists()) {
      batch.update(lbRef, leaderboardUpdate);
    } else {
      batch.set(lbRef, {
        uid: user.uid,
        ...leaderboardCreate,
      });
    }

    batch.set(attemptRef, {
      uid: user.uid,
      studentName: clampText(record.studentName, NAME_MAX_LENGTH, summaryCreate.name),
      studentCls: clampClass(record.studentCls),
      studentClassNo: clampClassNo(record.studentClassNo),
      chapterId: record.chapterId || getChapterIdForSection(record.sectionId),
      sectionId: record.sectionId,
      questionId: clampText(record.questionId, QUESTION_ID_MAX_LENGTH, 'q'),
      questionLabel: clampText(record.questionLabel, QUESTION_LABEL_MAX_LENGTH, 'Q'),
      type: record.type === 'Similar' ? 'Similar' : 'Main',
      promptEq: clampText(record.promptEq, PROMPT_EQ_MAX_LENGTH, '–'),
      points: clampInt(record.points, 0, 500),
      maxPoints: clampInt(record.maxPoints, 0, 500),
      wrongMoves: clampInt(record.wrongMoves, 0, 500),
      wrongLines: clampInt(record.wrongLines, 0, 500),
      hints: clampInt(record.hints, 0, 500),
      skipped: clampInt(record.skipped, 0, 50),
      seconds: clampInt(record.seconds, 0, 86400),
      wrongInputs: clampStringArray(record.wrongInputs, MAX_WRONG_INPUTS, WRONG_INPUT_MAX_LENGTH),
      createdAt: serverTimestamp(),
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

function docToAttemptRecord(id: string, d: Record<string, unknown>, emailFallback = ''): AttemptRecord {
  const sectionId = (d.sectionId as AttemptRecord['sectionId']) || 'sec1';
  return {
    id,
    timestamp: timestampToIso(d.createdAt),
    studentEmail: emailFallback,
    studentName: String(d.studentName || ''),
    studentCls: String(d.studentCls || '2A'),
    studentClassNo: Number(d.studentClassNo || 1),
    chapterId: (d.chapterId as AttemptRecord['chapterId']) || getChapterIdForSection(sectionId),
    sectionId,
    questionId: String(d.questionId || ''),
    questionLabel: String(d.questionLabel || ''),
    type: d.type === 'Similar' ? 'Similar' : 'Main',
    promptEq: String(d.promptEq || ''),
    points: Number(d.points || 0),
    maxPoints: Number(d.maxPoints || 0),
    wrongMoves: Number(d.wrongMoves || 0),
    wrongLines: Number(d.wrongLines || 0),
    hints: Number(d.hints || 0),
    skipped: Number(d.skipped || 0),
    seconds: Number(d.seconds || 0),
    wrongInputs: Array.isArray(d.wrongInputs) ? d.wrongInputs.map(String) : [],
  };
}

export function subscribeMyAttemptsFromCloud(
  user: User,
  onData: (attempts: AttemptRecord[]) => void,
): Unsubscribe {
  const path = `students/${user.uid}/attempts`;
  const q = query(
    collection(db, 'students', user.uid, 'attempts'),
    where('uid', '==', user.uid),
    limit(250),
  );
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs
        .map((docSnap) => docToAttemptRecord(docSnap.id, docSnap.data(), user.email || ''))
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      onData(rows);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export function subscribeLeaderboardFromCloud(
  onData: (rows: CloudLeaderboardRow[]) => void,
): Unsubscribe {
  const path = 'leaderboard';
  const q = query(
    collection(db, 'leaderboard'),
    where('cls', 'in', [...ALL_CLASSES]),
  );
  return onSnapshot(
    q,
    (snap) => {
      const rows: CloudLeaderboardRow[] = snap.docs.map((docSnap) => {
        const d = docSnap.data();
        const totalScore = Number(d.score || 0);
        const totalDone = Number(d.doneCount || 0);
        const scoreS1 = typeof d.scoreS1C10 === 'number' ? d.scoreS1C10 : 0;
        const scoreS2 = typeof d.scoreS2C3 === 'number' ? d.scoreS2C3 : Math.max(0, totalScore - scoreS1);
        const doneS1 = typeof d.doneCountS1C10 === 'number' ? d.doneCountS1C10 : 0;
        const doneS2 = typeof d.doneCountS2C3 === 'number' ? d.doneCountS2C3 : Math.max(0, totalDone - doneS1);
        return {
          uid: String(d.uid || docSnap.id),
          name: String(d.name || ''),
          cls: String(d.cls || '2A'),
          classNo: Number(d.classNo || 1),
          done: totalDone,
          score: totalScore,
          extraDone: Number(d.extraDone || 0),
          scoreS1C10: scoreS1,
          scoreS2C3: scoreS2,
          doneCountS1C10: doneS1,
          doneCountS2C3: doneS2,
        };
      });
      onData(rows);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export function subscribeAllStudentsForTeacher(
  onData: (students: CloudStudentSummary[]) => void,
): Unsubscribe {
  const path = 'students';
  return onSnapshot(
    collection(db, 'students'),
    (snap) => {
      const rows: CloudStudentSummary[] = snap.docs.map((docSnap) =>
        docToCloudSummary(docSnap.id, docSnap.data()),
      );
      rows.sort((a, b) => a.cls.localeCompare(b.cls) || a.classNo - b.classNo || a.name.localeCompare(b.name));
      onData(rows);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export function subscribeStudentAttemptsForTeacher(
  studentUid: string,
  studentEmail: string,
  onData: (attempts: AttemptRecord[]) => void,
): Unsubscribe {
  const path = `students/${studentUid}/attempts`;
  const q = query(
    collection(db, 'students', studentUid, 'attempts'),
    orderBy('createdAt', 'desc'),
    limit(250),
  );
  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((docSnap) =>
        docToAttemptRecord(docSnap.id, docSnap.data(), studentEmail),
      );
      onData(rows);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export async function fetchAllStudentsAttemptsForTeacher(
  students: CloudStudentSummary[],
): Promise<AttemptRecord[]> {
  const batches = await Promise.all(
    students.map(async (s) => {
      const path = `students/${s.uid}/attempts`;
      try {
        const snap = await getDocs(
          query(collection(db, 'students', s.uid, 'attempts'), orderBy('createdAt', 'desc'), limit(200)),
        );
        return snap.docs.map((docSnap) => docToAttemptRecord(docSnap.id, docSnap.data(), s.email));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    }),
  );
  return batches.flat().sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function subscribeTeacherAllowlist(
  onData: (items: TeacherAllowlistItem[]) => void,
): Unsubscribe {
  const path = 'teacherAllowlist';
  return onSnapshot(
    collection(db, 'teacherAllowlist'),
    (snap) => {
      const rows: TeacherAllowlistItem[] = snap.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          email: String(d.email || docSnap.id),
          addedBy: String(d.addedBy || ''),
          note: String(d.note || ''),
          createdAtIso: timestampToIso(d.createdAt),
        };
      });
      rows.sort((a, b) => a.email.localeCompare(b.email));
      onData(rows);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    },
  );
}

export async function addTeacherAllowlistEmail(
  adminEmail: string,
  targetEmail: string,
  note = '',
): Promise<void> {
  const cleanTarget = normalizeEmail(targetEmail);
  const cleanAdmin = normalizeEmail(adminEmail);
  if (!isValidEmailAddress(cleanTarget)) {
    throw new Error('Please enter a valid Google email address.');
  }
  if (isPrimaryTeacherEmail(cleanTarget)) {
    throw new Error(`${cleanTarget} is already a built-in primary teacher.`);
  }
  const path = `teacherAllowlist/${cleanTarget}`;
  try {
    await setDoc(doc(db, 'teacherAllowlist', cleanTarget), {
      email: cleanTarget,
      addedBy: cleanAdmin,
      note: note.trim().slice(0, TEACHER_NOTE_MAX_LENGTH),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function removeTeacherAllowlistEmail(targetEmail: string): Promise<void> {
  const cleanTarget = normalizeEmail(targetEmail);
  if (isPrimaryTeacherEmail(cleanTarget)) {
    throw new Error('The primary teacher account cannot be removed.');
  }
  const path = `teacherAllowlist/${cleanTarget}`;
  try {
    await deleteDoc(doc(db, 'teacherAllowlist', cleanTarget));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
