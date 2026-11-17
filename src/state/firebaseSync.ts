import { signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
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
import { OperationType, auth, db, googleProvider, handleFirestoreError } from '../firebase';
import {
  EMAIL_MAX_LENGTH,
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

export interface CloudStudentSummary {
  uid: string;
  name: string;
  cls: string;
  classNo: number;
  email: string;
  score: number;
  doneCount: number;
  extraDone: number;
  wrongAttempts: number;
  hintsUsed: number;
  completedIdsSec1: string[];
  completedIdsSec2: string[];
  completedIdsSec3: string[];
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
  if (raw.includes('auth/popup-closed-by-user')) {
    return 'Google sign-in popup was closed before completing sign-in.';
  }
  if (raw.includes('auth/popup-blocked')) {
    return 'Your browser blocked the sign-in popup. Please allow popups for this site and try again.';
  }
  return raw;
}

export async function signInWithGoogle(): Promise<User> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
}

export async function signOutGoogle(): Promise<void> {
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

export async function loadStudentSummaryFromCloud(
  user: User,
): Promise<CloudStudentSummary | null> {
  const path = `students/${user.uid}`;
  try {
    const snap = await getDoc(doc(db, 'students', user.uid));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      uid: String(d.uid || user.uid),
      name: String(d.name || user.displayName || 'Student'),
      cls: String(d.cls || '2A'),
      classNo: Number(d.classNo || 1),
      email: String(d.email || user.email || ''),
      score: Number(d.score || 0),
      doneCount: Number(d.doneCount || 0),
      extraDone: Number(d.extraDone || 0),
      wrongAttempts: Number(d.wrongAttempts || 0),
      hintsUsed: Number(d.hintsUsed || 0),
      completedIdsSec1: Array.isArray(d.completedIdsSec1) ? d.completedIdsSec1.map(String) : [],
      completedIdsSec2: Array.isArray(d.completedIdsSec2) ? d.completedIdsSec2.map(String) : [],
      completedIdsSec3: Array.isArray(d.completedIdsSec3) ? d.completedIdsSec3.map(String) : [],
      updatedAtIso: timestampToIso(d.updatedAt),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

function buildStudentSummaryFields(user: User, state: AppStorageState, profile: StudentProfile) {
  const sec1 = clampStringArray(state.sections.sec1.completedIds, MAX_SEC1_DONE, QUESTION_ID_MAX_LENGTH);
  const sec2 = clampStringArray(state.sections.sec2.completedIds, MAX_SEC2_DONE, QUESTION_ID_MAX_LENGTH);
  const sec3 = clampStringArray(state.sections.sec3.completedIds, MAX_SEC3_DONE, QUESTION_ID_MAX_LENGTH);
  const doneCount = clampInt(sec1.length + sec2.length + sec3.length, 0, 500);
  const safeName = clampText(profile.name, NAME_MAX_LENGTH, user.displayName || 'Student');
  const safeCls = clampClass(profile.cls);
  const safeClassNo = clampClassNo(profile.classNo);
  const safeEmail = normalizeEmail(user.email || profile.email).slice(0, EMAIL_MAX_LENGTH);
  const safeScore = clampInt(state.score, 0, 100000);
  const safeExtraDone = clampInt(state.extraDone, 0, 2000);

  return {
    summaryUpdate: {
      name: safeName,
      cls: safeCls,
      classNo: safeClassNo,
      email: safeEmail,
      score: safeScore,
      doneCount,
      extraDone: safeExtraDone,
      wrongAttempts: clampInt(state.wrongAttempts, 0, 20000),
      hintsUsed: clampInt(state.hintsUsed, 0, 20000),
      completedIdsSec1: sec1,
      completedIdsSec2: sec2,
      completedIdsSec3: sec3,
      updatedAt: serverTimestamp(),
    },
    leaderboardUpdate: {
      name: safeName,
      cls: safeCls,
      classNo: safeClassNo,
      doneCount,
      score: safeScore,
      extraDone: safeExtraDone,
      updatedAt: serverTimestamp(),
    },
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
    const { summaryUpdate, leaderboardUpdate } = buildStudentSummaryFields(user, state, profile);
    const batch = writeBatch(db);

    if (studentSnap.exists()) {
      batch.update(studentRef, summaryUpdate);
    } else {
      batch.set(studentRef, {
        uid: user.uid,
        ...summaryUpdate,
        createdAt: serverTimestamp(),
      });
    }

    if (lbSnap.exists()) {
      batch.update(lbRef, leaderboardUpdate);
    } else {
      batch.set(lbRef, {
        uid: user.uid,
        ...leaderboardUpdate,
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
    const { summaryUpdate, leaderboardUpdate } = buildStudentSummaryFields(user, state, profile);
    const batch = writeBatch(db);

    if (studentSnap.exists()) {
      batch.update(studentRef, summaryUpdate);
    } else {
      batch.set(studentRef, {
        uid: user.uid,
        ...summaryUpdate,
        createdAt: serverTimestamp(),
      });
    }

    if (lbSnap.exists()) {
      batch.update(lbRef, leaderboardUpdate);
    } else {
      batch.set(lbRef, {
        uid: user.uid,
        ...leaderboardUpdate,
      });
    }

    batch.set(attemptRef, {
      uid: user.uid,
      studentName: clampText(record.studentName, NAME_MAX_LENGTH, summaryUpdate.name),
      studentCls: clampClass(record.studentCls),
      studentClassNo: clampClassNo(record.studentClassNo),
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
  return {
    id,
    timestamp: timestampToIso(d.createdAt),
    studentEmail: emailFallback,
    studentName: String(d.studentName || ''),
    studentCls: String(d.studentCls || '2A'),
    studentClassNo: Number(d.studentClassNo || 1),
    sectionId: (d.sectionId as AttemptRecord['sectionId']) || 'sec1',
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
    where('cls', 'in', ['2A', '2B', '2C', '2D', '2E']),
  );
  return onSnapshot(
    q,
    (snap) => {
      const rows: CloudLeaderboardRow[] = snap.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          uid: String(d.uid || docSnap.id),
          name: String(d.name || ''),
          cls: String(d.cls || '2A'),
          classNo: Number(d.classNo || 1),
          done: Number(d.doneCount || 0),
          score: Number(d.score || 0),
          extraDone: Number(d.extraDone || 0),
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
      const rows: CloudStudentSummary[] = snap.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          uid: String(d.uid || docSnap.id),
          name: String(d.name || 'Student'),
          cls: String(d.cls || '2A'),
          classNo: Number(d.classNo || 1),
          email: String(d.email || ''),
          score: Number(d.score || 0),
          doneCount: Number(d.doneCount || 0),
          extraDone: Number(d.extraDone || 0),
          wrongAttempts: Number(d.wrongAttempts || 0),
          hintsUsed: Number(d.hintsUsed || 0),
          completedIdsSec1: Array.isArray(d.completedIdsSec1) ? d.completedIdsSec1.map(String) : [],
          completedIdsSec2: Array.isArray(d.completedIdsSec2) ? d.completedIdsSec2.map(String) : [],
          completedIdsSec3: Array.isArray(d.completedIdsSec3) ? d.completedIdsSec3.map(String) : [],
          updatedAtIso: timestampToIso(d.updatedAt),
        };
      });
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
