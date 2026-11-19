import { useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Lock,
  LogIn,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserPlus,
} from 'lucide-react';
import {
  ACTIVE_CHAPTERS,
  ALL_QUESTIONS,
  S1_CHAPTER_10,
  S2_CHAPTER_3,
  getChapterById,
  getChapterForSection,
  getQuestionsForChapter,
  getQuestionsForSection,
} from '../data/curriculum';
import type { ChapterId, SectionId } from '../data/types';
import {
  PRIMARY_TEACHER_EMAILS,
  isValidEmailAddress,
  normalizeEmail,
} from '../state/firebaseSchemaConstants';
import {
  addTeacherAllowlistEmail,
  clearSheetsAccessToken,
  connectGoogleSheetsScope,
  fetchAllStudentsAttemptsForTeacher,
  getSheetsAccessToken,
  removeTeacherAllowlistEmail,
  subscribeAllStudentsForTeacher,
  subscribeStudentAttemptsForTeacher,
  subscribeTeacherAllowlist,
  type CloudLeaderboardRow,
  type CloudStudentSummary,
  type TeacherAllowlistItem,
} from '../state/firebaseSync';
import {
  SHEET_TABS,
  createTeacherSpreadsheet,
  inspectSpreadsheet,
  parseSpreadsheetId,
  syncAllDataToSpreadsheet,
  type SheetMetadata,
  type SyncResult,
} from '../state/googleSheetsSync';
import {
  S1_CLASSES,
  S2_CLASSES,
  buildLeaderboards,
  formatDuration,
  formatShortTime,
  type AppStorageState,
  type AttemptRecord,
} from '../state/storage';
import { MathExpr } from './MathExpr';

interface TeacherViewProps {
  state: AppStorageState;
  activeChapterId: ChapterId;
  authUser: User | null;
  authReady: boolean;
  isTeacher: boolean;
  authBusy: boolean;
  authError: string;
  cloudLeaderboard: CloudLeaderboardRow[];
  onSignIn: () => void;
  onSignOut: () => void;
  onResetProgress: () => void;
  onBack: () => void;
}

type TeacherTab = 'students' | 'questions' | 'board' | 'teachers';
type ChapterFilter = ChapterId | 'ALL';

const SHEETS_ID_STORAGE_KEY = 'skhbbss_teacher_sheet_id_v1';

interface PendingSheetConfirm {
  meta: SheetMetadata;
  students: CloudStudentSummary[];
  attempts: AttemptRecord[];
}

export function TeacherView({
  state,
  activeChapterId,
  authUser,
  authReady,
  isTeacher,
  authBusy,
  authError,
  cloudLeaderboard,
  onSignIn,
  onSignOut,
  onResetProgress,
  onBack,
}: TeacherViewProps) {
  const [tab, setTab] = useState<TeacherTab>('students');
  const [chapterFilter, setChapterFilter] = useState<ChapterFilter>('ALL');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState<SectionId | 'ALL'>('ALL');
  const [boardChapter, setBoardChapter] = useState<ChapterId>(activeChapterId);
  const [search, setSearch] = useState('');
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const [cloudStudents, setCloudStudents] = useState<CloudStudentSummary[]>([]);
  const [selectedAttempts, setSelectedAttempts] = useState<AttemptRecord[]>([]);
  const [allowlist, setAllowlist] = useState<TeacherAllowlistItem[]>([]);
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherNote, setNewTeacherNote] = useState('');
  const [allowlistMsg, setAllowlistMsg] = useState('');
  const [allowlistErr, setAllowlistErr] = useState('');
  const [savingAllowlist, setSavingAllowlist] = useState(false);

  // Google Sheets Sync (Option B) — non-sensitive spreadsheet ID only in localStorage; token strictly in memory
  const [spreadsheetInput, setSpreadsheetInput] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(SHEETS_ID_STORAGE_KEY) || '';
  });
  const [hasSheetsToken, setHasSheetsToken] = useState<boolean>(() => Boolean(getSheetsAccessToken()));
  const [sheetsBusy, setSheetsBusy] = useState(false);
  const [sheetsErr, setSheetsErr] = useState('');
  const [sheetsResult, setSheetsResult] = useState<SyncResult | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<PendingSheetConfirm | null>(null);

  useEffect(() => {
    setHasSheetsToken(Boolean(getSheetsAccessToken()));
  }, [authUser]);

  useEffect(() => {
    if (!authReady || !authUser || !isTeacher) {
      setCloudStudents([]);
      setAllowlist([]);
      return;
    }
    const unsubStudents = subscribeAllStudentsForTeacher((rows) => {
      setCloudStudents(rows);
      setSelectedUid((prev) => {
        if (prev && rows.some((r) => r.uid === prev)) return prev;
        return rows[0]?.uid || null;
      });
    });
    const unsubTeachers = subscribeTeacherAllowlist(setAllowlist);
    return () => {
      unsubStudents();
      unsubTeachers();
    };
  }, [authReady, authUser, isTeacher]);

  const selectedStudent = cloudStudents.find((s) => s.uid === selectedUid) || null;

  useEffect(() => {
    if (!authReady || !authUser || !isTeacher || !selectedStudent) {
      setSelectedAttempts([]);
      return;
    }
    const unsubAttempts = subscribeStudentAttemptsForTeacher(
      selectedStudent.uid,
      selectedStudent.email,
      setSelectedAttempts,
    );
    return () => unsubAttempts();
  }, [authReady, authUser, isTeacher, selectedStudent?.uid, selectedStudent?.email]);

  const totalQs = useMemo(() => {
    if (chapterFilter === 's1-ch10') return getQuestionsForChapter('s1-ch10').length;
    if (chapterFilter === 's2-ch3') return getQuestionsForChapter('s2-ch3').length;
    return ALL_QUESTIONS.length;
  }, [chapterFilter]);

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cloudStudents.filter((s) => {
      if (classFilter && s.cls !== classFilter) return false;
      if (chapterFilter === 's1-ch10' && !s.cls.startsWith('1') && s.doneCountS1C10 === 0 && s.scoreS1C10 === 0) {
        return false;
      }
      if (chapterFilter === 's2-ch3' && !s.cls.startsWith('2') && s.doneCountS2C3 === 0 && s.scoreS2C3 === 0) {
        return false;
      }
      if (
        q &&
        !s.name.toLowerCase().includes(q) &&
        !s.email.toLowerCase().includes(q) &&
        !`${s.cls} ${s.classNo}`.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [cloudStudents, classFilter, chapterFilter, search]);

  function getStudentDisplayStats(s: CloudStudentSummary): { done: number; score: number } {
    if (chapterFilter === 's1-ch10') {
      return { done: s.doneCountS1C10, score: s.scoreS1C10 };
    }
    if (chapterFilter === 's2-ch3') {
      return { done: s.doneCountS2C3, score: s.scoreS2C3 };
    }
    return { done: s.doneCount, score: s.score };
  }

  const completedCount = filteredStudents.filter((s) => getStudentDisplayStats(s).done >= totalQs).length;
  const startedCount = filteredStudents.filter(
    (s) => getStudentDisplayStats(s).done > 0 || s.extraDone > 0,
  ).length;
  const avgDone = filteredStudents.length
    ? filteredStudents.reduce((a, s) => a + getStudentDisplayStats(s).done, 0) / filteredStudents.length
    : 0;
  const avgScore = filteredStudents.length
    ? Math.round(
        filteredStudents.reduce((a, s) => a + getStudentDisplayStats(s).score, 0) / filteredStudents.length,
      )
    : 0;

  const availableSections = useMemo(() => {
    if (chapterFilter === 's1-ch10') return S1_CHAPTER_10.sections;
    if (chapterFilter === 's2-ch3') return S2_CHAPTER_3.sections;
    return [...S1_CHAPTER_10.sections, ...S2_CHAPTER_3.sections];
  }, [chapterFilter]);

  const filteredQuestions = useMemo(() => {
    const base =
      sectionFilter !== 'ALL'
        ? getQuestionsForSection(sectionFilter)
        : chapterFilter === 'ALL'
          ? ALL_QUESTIONS
          : getQuestionsForChapter(chapterFilter);
    const q = search.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (item) =>
        item.numberLabel.toLowerCase().includes(q) ||
        item.topicTag.toLowerCase().includes(q) ||
        item.promptEq.toLowerCase().includes(q),
    );
  }, [sectionFilter, chapterFilter, search]);

  // --- Access Gate for unauthenticated or non-teacher users ---
  if (!authReady) {
    return (
      <div className="p-8 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)] text-center space-y-3">
        <p className="text-sm font-bold text-[var(--soft)]">Verifying teacher account access...</p>
      </div>
    );
  }

  if (!authUser || !isTeacher) {
    return (
      <div className="max-w-xl mx-auto my-8 p-6 sm:p-8 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)] space-y-5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 border-2 border-[var(--ink)] rounded-[10px] bg-[var(--panel)] shrink-0">
            <Lock className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight">Teacher View · Restricted Access</h1>
            <p className="text-sm text-[var(--soft)]">
              Only authorized teacher Google accounts at S. K. H. Bishop Baker Secondary School can view student records and sync to Google Sheets.
            </p>
          </div>
        </div>

        {authUser && !isTeacher && (
          <div className="p-4 border-2 border-[var(--red)] rounded-[10px] bg-[var(--red)]/5 space-y-1 text-sm">
            <p className="font-extrabold text-[var(--red)]">Access denied for {authUser.email}</p>
            <p className="text-[var(--soft)]">
              This Google account is not on the authorized teacher list. Sign in with an authorized
              teacher account (or ask a primary teacher to add your email in the Authorized Teachers tab).
            </p>
          </div>
        )}

        {authError && (
          <p className="text-sm font-bold text-[var(--red)]" role="alert">
            {authError}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {!authUser ? (
            <button
              type="button"
              disabled={authBusy}
              onClick={onSignIn}
              className="bq-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              <span>{authBusy ? 'Signing in...' : 'Sign in with Teacher Google Account'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onSignOut}
              className="bq-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Log out &amp; switch Google account</span>
            </button>
          )}
          <button
            type="button"
            onClick={onBack}
            className="bq-btn-ghost inline-flex items-center gap-1.5 px-4 py-2.5 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hub</span>
          </button>
        </div>
      </div>
    );
  }

  function handleSaveSpreadsheetInput(value: string) {
    setSpreadsheetInput(value);
    setSheetsErr('');
    if (typeof window !== 'undefined') {
      const parsed = parseSpreadsheetId(value);
      if (parsed) {
        window.localStorage.setItem(SHEETS_ID_STORAGE_KEY, parsed);
      } else if (!value.trim()) {
        window.localStorage.removeItem(SHEETS_ID_STORAGE_KEY);
      }
    }
  }

  async function handleConnectSheets() {
    setSheetsBusy(true);
    setSheetsErr('');
    try {
      await connectGoogleSheetsScope();
      setHasSheetsToken(true);
    } catch (err) {
      setSheetsErr(err instanceof Error ? err.message : String(err));
    } finally {
      setSheetsBusy(false);
    }
  }

  async function handleCreateNewSheet() {
    const token = getSheetsAccessToken();
    if (!token) {
      setSheetsErr('Please click "Connect Google Sheets" first to authorize spreadsheet creation.');
      return;
    }
    setSheetsBusy(true);
    setSheetsErr('');
    try {
      const meta = await createTeacherSpreadsheet(token);
      handleSaveSpreadsheetInput(meta.spreadsheetId);
      const attempts = await fetchAllStudentsAttemptsForTeacher(cloudStudents);
      setPendingConfirm({
        meta,
        students: cloudStudents,
        attempts,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('expired')) {
        clearSheetsAccessToken();
        setHasSheetsToken(false);
      }
      setSheetsErr(msg);
    } finally {
      setSheetsBusy(false);
    }
  }

  async function handlePrepareSyncToSheets() {
    const token = getSheetsAccessToken();
    if (!token) {
      setSheetsErr('Please click "Connect Google Sheets" first.');
      return;
    }
    const id = parseSpreadsheetId(spreadsheetInput);
    if (!id) {
      setSheetsErr('Paste a valid Google Spreadsheet URL or Spreadsheet ID, or click "Create New Sheet".');
      return;
    }
    setSheetsBusy(true);
    setSheetsErr('');
    try {
      const [meta, attempts] = await Promise.all([
        inspectSpreadsheet(token, id),
        fetchAllStudentsAttemptsForTeacher(cloudStudents),
      ]);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SHEETS_ID_STORAGE_KEY, meta.spreadsheetId);
      }
      setPendingConfirm({
        meta,
        students: cloudStudents,
        attempts,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('expired')) {
        clearSheetsAccessToken();
        setHasSheetsToken(false);
      }
      setSheetsErr(msg);
    } finally {
      setSheetsBusy(false);
    }
  }

  async function handleConfirmWriteSheets() {
    if (!pendingConfirm) return;
    const token = getSheetsAccessToken();
    if (!token) {
      setPendingConfirm(null);
      setHasSheetsToken(false);
      setSheetsErr('Google Sheets authorization expired. Please reconnect and try again.');
      return;
    }
    setSheetsBusy(true);
    setSheetsErr('');
    try {
      const res = await syncAllDataToSpreadsheet(
        token,
        pendingConfirm.meta.spreadsheetId,
        pendingConfirm.students,
        pendingConfirm.attempts,
      );
      setSheetsResult(res);
      setPendingConfirm(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('expired')) {
        clearSheetsAccessToken();
        setHasSheetsToken(false);
      }
      setSheetsErr(msg);
      setPendingConfirm(null);
    } finally {
      setSheetsBusy(false);
    }
  }

  function handleExportCsv() {
    if (selectedStudent && selectedAttempts.length > 0) {
      const header = [
        'Timestamp',
        'Chapter',
        'Section',
        'Name',
        'Email',
        'Class',
        'ClassNo',
        'Question',
        'Type',
        'Points',
        'MaxPoints',
        'WrongMoves',
        'WrongLines',
        'Hints',
        'Seconds',
        'WrongInputs',
      ];
      const rows = selectedAttempts.map((r) => [
        r.timestamp,
        getChapterById(r.chapterId || getChapterForSection(r.sectionId).id).chapterLabel,
        r.sectionId,
        r.studentName,
        r.studentEmail,
        r.studentCls,
        r.studentClassNo,
        r.questionLabel,
        r.type,
        r.points,
        r.maxPoints,
        r.wrongMoves,
        r.wrongLines,
        r.hints,
        r.seconds,
        r.wrongInputs.join(' | '),
      ]);
      const csv = [header, ...rows]
        .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `skhbbss_${selectedStudent.cls}_${selectedStudent.classNo}_attempts.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const header = [
      'Class',
      'ClassNo',
      'Name',
      'Email',
      'S1_Ch10_Done',
      'S1_Ch10_Score',
      'S2_Ch3_Done',
      'S2_Ch3_Score',
      'TotalDone',
      'TotalPoints',
      'SimilarQs',
      'WrongAttempts',
      'HintsUsed',
      'LastUpdated',
    ];
    const rows = filteredStudents.map((s) => [
      s.cls,
      s.classNo,
      s.name,
      s.email,
      s.doneCountS1C10,
      s.scoreS1C10,
      s.doneCountS2C3,
      s.scoreS2C3,
      s.doneCount,
      s.score,
      s.extraDone,
      s.wrongAttempts,
      s.hintsUsed,
      s.updatedAtIso,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skhbbss_balance_quest_summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleAddTeacher(e: React.FormEvent) {
    e.preventDefault();
    setAllowlistErr('');
    setAllowlistMsg('');
    const target = normalizeEmail(newTeacherEmail);
    if (!isValidEmailAddress(target)) {
      setAllowlistErr('Please enter a valid Google account email (e.g. name@skhbbss.edu.hk).');
      return;
    }
    if (!authUser?.email) return;
    setSavingAllowlist(true);
    try {
      await addTeacherAllowlistEmail(authUser.email, target, newTeacherNote);
      setNewTeacherEmail('');
      setNewTeacherNote('');
      setAllowlistMsg(`Added ${target} to authorized teachers.`);
    } catch (err) {
      setAllowlistErr(err instanceof Error ? err.message : String(err));
    } finally {
      setSavingAllowlist(false);
    }
  }

  async function handleRemoveTeacher(email: string) {
    setAllowlistErr('');
    setAllowlistMsg('');
    try {
      await removeTeacherAllowlistEmail(email);
      setAllowlistMsg(`Removed ${email} from authorized teachers.`);
    } catch (err) {
      setAllowlistErr(err instanceof Error ? err.message : String(err));
    }
  }

  const boardFormClasses = boardChapter === 's1-ch10' ? S1_CLASSES : S2_CLASSES;
  const boardCls =
    classFilter && (boardFormClasses as readonly string[]).includes(classFilter)
      ? classFilter
      : state.profile?.cls && (boardFormClasses as readonly string[]).includes(state.profile.cls)
        ? state.profile.cls
        : boardFormClasses[0];
  const boardData = buildLeaderboards(state, boardCls, cloudLeaderboard, boardChapter);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.07em] text-[var(--green)] mb-1">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Authorized Teacher · {authUser.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Teacher Dashboard · S.1 Ch.10 &amp; S.2 Ch.3
          </h1>
          <p className="text-sm text-[var(--soft)]">
            S. K. H. Bishop Baker Secondary School · Firestore live database + Google Sheets sync
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredStudents.length === 0 && selectedAttempts.length === 0}
            className="bq-btn-ghost inline-flex items-center gap-1.5 px-3.5 py-2 text-sm disabled:opacity-45"
          >
            <Download className="w-4 h-4" />
            <span>{selectedAttempts.length > 0 ? 'Export Student CSV' : 'Export Summary CSV'}</span>
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="bq-btn-ghost inline-flex items-center gap-1.5 px-3.5 py-2 text-sm"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Log out</span>
          </button>
          <button
            type="button"
            onClick={onBack}
            className="bq-btn inline-flex items-center gap-1.5 px-4 py-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hub</span>
          </button>
        </div>
      </div>

      {/* Google Sheets Sync Panel (Option B) */}
      <section
        aria-label="Google Sheets Synchronization"
        className="p-4 sm:p-5 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--panel)] space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-[var(--green)] shrink-0" aria-hidden="true" />
            <div>
              <h2 className="text-base font-extrabold">Google Sheets Sync (Firebase → Google Sheets)</h2>
              <p className="text-xs text-[var(--soft)]">
                Export all S.1 Ch.10 &amp; S.2 Ch.3 student summaries and attempt logs directly to your Google Spreadsheet.
              </p>
            </div>
          </div>

          {!hasSheetsToken && (
            <button
              type="button"
              disabled={sheetsBusy}
              onClick={handleConnectSheets}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[var(--ink)] rounded-[10px] bg-white text-[#1f1f1f] text-xs sm:text-sm font-extrabold shadow-[0_2px_0_var(--key-edge)] hover:bg-gray-50 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z" />
                <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z" />
              </svg>
              <span>{sheetsBusy ? 'Connecting...' : 'Connect Google Sheets'}</span>
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          <input
            type="text"
            value={spreadsheetInput}
            onChange={(e) => handleSaveSpreadsheetInput(e.target.value)}
            placeholder="Paste Google Spreadsheet URL or ID (e.g. https://docs.google.com/spreadsheets/d/...)"
            aria-label="Target Google Spreadsheet URL or ID"
            className="flex-1 min-h-[40px] px-3 py-1.5 border-2 border-[var(--key-edge)] rounded-[9px] bg-[var(--paper)] text-[var(--ink)] text-xs sm:text-sm"
          />
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={sheetsBusy || !hasSheetsToken}
              onClick={handleCreateNewSheet}
              className="bq-btn-ghost px-3.5 py-2 text-xs sm:text-sm font-bold disabled:opacity-45"
            >
              Create New Sheet
            </button>
            <button
              type="button"
              disabled={sheetsBusy || !hasSheetsToken || !parseSpreadsheetId(spreadsheetInput)}
              onClick={handlePrepareSyncToSheets}
              className="bq-btn inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm disabled:opacity-45"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${sheetsBusy ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>Sync to Google Sheets</span>
            </button>
          </div>
        </div>

        {sheetsErr && (
          <p className="text-xs sm:text-sm font-bold text-[var(--red)]" role="alert">
            {sheetsErr}
          </p>
        )}

        {sheetsResult && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-2 border-[var(--green)] rounded-[10px] bg-[var(--paper)] text-xs sm:text-sm">
            <div>
              <b className="text-[var(--green)]">Synced {sheetsResult.studentsWritten} students &amp; {sheetsResult.attemptsWritten} attempts</b>{' '}
              to <span className="font-bold">{sheetsResult.spreadsheetTitle}</span> ({formatShortTime(sheetsResult.syncedAtIso)})
            </div>
            <a
              href={sheetsResult.spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-extrabold underline underline-offset-2 text-[var(--ink)] hover:opacity-80"
            >
              <span>Open Google Sheet</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        )}
      </section>

      {/* Controls & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Dashboard sections">
          {(
            [
              { id: 'students', label: 'Students' },
              { id: 'questions', label: 'Questions' },
              { id: 'board', label: 'Leaderboard' },
              { id: 'teachers', label: 'Authorized Teachers' },
            ] as Array<{ id: TeacherTab; label: string }>
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 border-2 border-[var(--ink)] rounded-[9px] text-sm font-extrabold cursor-pointer transition-colors ${
                tab === t.id
                  ? 'bg-[var(--yellow)] text-[var(--yellow-ink)]'
                  : 'bg-[var(--paper)] hover:bg-[var(--panel)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab !== 'teachers' && (
          <div className="flex flex-wrap items-center gap-2.5">
            {tab !== 'board' && (
              <label className="text-sm font-bold flex items-center gap-1.5">
                <span>Chapter</span>
                <select
                  value={chapterFilter}
                  onChange={(e) => {
                    setChapterFilter(e.target.value as ChapterFilter);
                    setSectionFilter('ALL');
                  }}
                  className="min-h-[38px] px-2.5 border-2 border-[var(--line)] rounded-[9px] bg-[var(--paper)] font-normal"
                >
                  <option value="ALL">All chapters</option>
                  {ACTIVE_CHAPTERS.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.form} {ch.chapterLabel}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="text-sm font-bold flex items-center gap-1.5">
              <span>Class</span>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="min-h-[38px] px-2.5 border-2 border-[var(--line)] rounded-[9px] bg-[var(--paper)] font-normal"
              >
                <option value="">All classes</option>
                <optgroup label="S.1 Classes">
                  {S1_CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="S.2 Classes">
                  {S2_CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>
            {tab === 'questions' && (
              <label className="text-sm font-bold flex items-center gap-1.5">
                <span>Section</span>
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value as SectionId | 'ALL')}
                  className="min-h-[38px] px-2.5 border-2 border-[var(--line)] rounded-[9px] bg-[var(--paper)] font-normal"
                >
                  <option value="ALL">All sections</option>
                  {availableSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {getChapterForSection(s.id).form} Sec {s.number}: {s.title}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {tab !== 'board' && (
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tab === 'questions' ? 'Filter Q# or topic' : 'Search name or email'}
                aria-label={tab === 'questions' ? 'Filter questions' : 'Search students'}
                className="min-h-[38px] w-52 sm:w-56 px-3 border-2 border-[var(--line)] rounded-[9px] bg-[var(--paper)] text-sm"
              />
            )}
          </div>
        )}
      </div>

      {tab === 'students' && (
        <div className="space-y-5">
          {/* KPI Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 border-2 border-[var(--ink)] rounded-[12px] bg-[var(--paper)]">
              <b className="block text-2xl font-extrabold tabular-nums">{filteredStudents.length}</b>
              <span className="text-xs text-[var(--soft)]">Students synced</span>
            </div>
            <div className="p-3.5 border-2 border-[var(--ink)] rounded-[12px] bg-[var(--paper)]">
              <b className="block text-2xl font-extrabold tabular-nums">{startedCount}</b>
              <span className="text-xs text-[var(--soft)]">Started</span>
            </div>
            <div className="p-3.5 border-2 border-[var(--ink)] rounded-[12px] bg-[var(--paper)]">
              <b className="block text-2xl font-extrabold tabular-nums">{completedCount}</b>
              <span className="text-xs text-[var(--soft)]">Completed all {totalQs}</span>
            </div>
            <div className="p-3.5 border-2 border-[var(--ink)] rounded-[12px] bg-[var(--paper)]">
              <b className="block text-2xl font-extrabold tabular-nums">{avgDone.toFixed(1)}</b>
              <span className="text-xs text-[var(--soft)]">Avg. questions done</span>
            </div>
            <div className="p-3.5 border-2 border-[var(--ink)] rounded-[12px] bg-[var(--paper)]">
              <b className="block text-2xl font-extrabold tabular-nums">{avgScore}</b>
              <span className="text-xs text-[var(--soft)]">Avg. points</span>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)]">
            {filteredStudents.length === 0 ? (
              <div className="p-6 text-sm text-[var(--soft)]">
                No synced student records found for this filter yet. Once students sign in with Google, enter their Class &amp; Class No., and save or answer questions, their live progress appears here automatically.
              </div>
            ) : (
              <table className="w-full border-collapse text-sm tabular-nums">
                <thead>
                  <tr className="border-b-2 border-[var(--ink)] bg-[var(--panel)] text-left text-xs uppercase tracking-wider text-[var(--soft)]">
                    <th className="py-2.5 px-3">Class / No.</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Progress</th>
                    <th className="py-2.5 px-3 text-right">S.1 / S.2 Split</th>
                    <th className="py-2.5 px-3 text-right">Points</th>
                    <th className="py-2.5 px-3 text-right">Wrong</th>
                    <th className="py-2.5 px-3 text-right">Hints</th>
                    <th className="py-2.5 px-3">Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => {
                    const stats = getStudentDisplayStats(s);
                    const pct = totalQs > 0 ? Math.min(100, Math.round((stats.done / totalQs) * 100)) : 0;
                    const isSelected = s.uid === selectedUid;
                    return (
                      <tr
                        key={s.uid}
                        onClick={() => setSelectedUid(s.uid)}
                        className={`border-b border-dashed border-[var(--line)] cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[var(--yellow)] text-[var(--yellow-ink)]'
                            : 'hover:bg-[var(--panel)]'
                        }`}
                      >
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {s.cls} ({s.classNo})
                        </td>
                        <td className="py-2.5 px-3">
                          <b className="block">
                            {s.name}
                            {s.uid === authUser.uid ? ' (You)' : ''}
                          </b>
                          <span className="text-xs opacity-75">{s.email}</span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="inline-block w-20 h-2.5 mr-2 overflow-hidden align-middle border border-[var(--ink)] rounded bg-[var(--paper)]">
                            <span className="block h-full bg-[var(--green)]" style={{ width: `${pct}%` }} />
                          </span>
                          {stats.done} / {totalQs}
                        </td>
                        <td className="py-2.5 px-3 text-right text-xs whitespace-nowrap">
                          S1: {s.doneCountS1C10} ({s.scoreS1C10}) · S2: {s.doneCountS2C3} ({s.scoreS2C3})
                        </td>
                        <td className="py-2.5 px-3 text-right font-extrabold">{stats.score}</td>
                        <td className="py-2.5 px-3 text-right">{s.wrongAttempts}</td>
                        <td className="py-2.5 px-3 text-right">{s.hintsUsed}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-xs">{formatShortTime(s.updatedAtIso)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Selected Student Detail Panel */}
          {selectedStudent && (
            <div className="p-5 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold">{selectedStudent.name}</h2>
                  <p className="text-sm text-[var(--soft)]">
                    {selectedStudent.cls} ({selectedStudent.classNo}) · {selectedStudent.email} · S.1 Ch.10:{' '}
                    {selectedStudent.doneCountS1C10} Qs ({selectedStudent.scoreS1C10} pts) · S.2 Ch.3:{' '}
                    {selectedStudent.doneCountS2C3} Qs ({selectedStudent.scoreS2C3} pts)
                  </p>
                </div>
                {selectedStudent.uid === authUser.uid && (
                  <div className="flex items-center gap-2">
                    {!confirmReset ? (
                      <button
                        type="button"
                        onClick={() => setConfirmReset(true)}
                        className="px-3.5 py-1.5 border-2 border-[var(--red)] rounded-[9px] text-sm font-extrabold text-[var(--red)] cursor-pointer hover:bg-[var(--red)]/10"
                      >
                        Reset my progress
                      </button>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-[var(--red)]">Reset your own score?</span>
                        <button
                          type="button"
                          onClick={() => {
                            onResetProgress();
                            setConfirmReset(false);
                          }}
                          className="px-3 py-1.5 rounded-[8px] bg-[var(--red)] text-white text-xs font-extrabold cursor-pointer"
                        >
                          Confirm Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmReset(false)}
                          className="px-3 py-1.5 border border-[var(--line)] rounded-[8px] text-xs font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {selectedAttempts.length === 0 ? (
                <p className="text-sm text-[var(--soft)]">No completed question attempts recorded for this student yet.</p>
              ) : (
                <div className="overflow-x-auto border border-[var(--line)] rounded-[10px]">
                  <table className="w-full border-collapse text-xs sm:text-sm tabular-nums">
                    <thead>
                      <tr className="border-b-2 border-[var(--ink)] bg-[var(--panel)] text-left text-xs uppercase text-[var(--soft)]">
                        <th className="py-2 px-2.5">Time</th>
                        <th className="py-2 px-2.5">Chapter</th>
                        <th className="py-2 px-2.5">Question</th>
                        <th className="py-2 px-2.5">Prompt</th>
                        <th className="py-2 px-2.5 text-right">Points</th>
                        <th className="py-2 px-2.5 text-right">Wrong</th>
                        <th className="py-2 px-2.5 text-right">Hints</th>
                        <th className="py-2 px-2.5 text-right">Duration</th>
                        <th className="py-2 px-2.5">Wrong answers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAttempts.map((r) => {
                        const ch = getChapterById(r.chapterId || getChapterForSection(r.sectionId).id);
                        return (
                          <tr key={r.id} className="border-b border-dashed border-[var(--line)]">
                            <td className="py-2 px-2.5 whitespace-nowrap">{formatShortTime(r.timestamp)}</td>
                            <td className="py-2 px-2.5 whitespace-nowrap text-xs font-bold">
                              {ch.form} {ch.chapterLabel}
                            </td>
                            <td className="py-2 px-2.5 whitespace-nowrap font-bold">
                              {r.questionLabel} {r.type === 'Similar' ? '· Remediation' : ''}
                            </td>
                            <td className="py-2 px-2.5">
                              <MathExpr expr={r.promptEq} />
                            </td>
                            <td className="py-2 px-2.5 text-right">
                              {r.type === 'Similar' ? '–' : `${r.points} / ${r.maxPoints}`}
                            </td>
                            <td className="py-2 px-2.5 text-right">{r.wrongMoves + r.wrongLines}</td>
                            <td className="py-2 px-2.5 text-right">{r.hints}</td>
                            <td className="py-2 px-2.5 text-right">{formatDuration(r.seconds)}</td>
                            <td className="py-2 px-2.5 text-xs text-[var(--soft)]">
                              {r.wrongInputs.join(' | ') || '–'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'questions' && (
        <div className="overflow-x-auto border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)]">
          <table className="w-full border-collapse text-sm tabular-nums">
            <thead>
              <tr className="border-b-2 border-[var(--ink)] bg-[var(--panel)] text-left text-xs uppercase tracking-wider text-[var(--soft)]">
                <th className="py-2.5 px-3">Q#</th>
                <th className="py-2.5 px-3">Chapter &amp; Section</th>
                <th className="py-2.5 px-3">Problem</th>
                <th className="py-2.5 px-3 text-right">Steps</th>
                <th className="py-2.5 px-3 text-right">Attempts</th>
                <th className="py-2.5 px-3 text-right">Clean %</th>
                <th className="py-2.5 px-3 text-right">Avg Wrong</th>
                <th className="py-2.5 px-3 text-right">Similar Qs</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((q) => {
                const ch = getChapterForSection(q.sectionId);
                const sec = ch.sections.find((s) => s.id === q.sectionId)!;
                const mainRuns = selectedAttempts.filter((r) => r.questionId === q.id && r.type === 'Main');
                const simRuns = selectedAttempts.filter((r) => r.questionId === q.id && r.type === 'Similar');
                const cleanCount = mainRuns.filter((r) => r.wrongMoves + r.wrongLines === 0).length;
                const cleanPct = mainRuns.length ? Math.round((cleanCount / mainRuns.length) * 100) : null;
                const avgWrong = mainRuns.length
                  ? (mainRuns.reduce((a, r) => a + r.wrongMoves + r.wrongLines, 0) / mainRuns.length).toFixed(1)
                  : '–';

                return (
                  <tr key={q.id} className="border-b border-dashed border-[var(--line)]">
                    <td className="py-2.5 px-3 font-extrabold whitespace-nowrap">{q.numberLabel}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold">
                        {ch.form} {ch.chapterLabel} · Sec {sec.number}
                      </span>{' '}
                      · {q.level}
                      <div className="text-xs text-[var(--soft)]">
                        {q.topicTag}
                        {q.sourceTag ? ` · ${q.sourceTag}` : ''}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-base">
                      <MathExpr expr={q.promptEq} />
                    </td>
                    <td className="py-2.5 px-3 text-right">{q.steps.length}</td>
                    <td className="py-2.5 px-3 text-right">{mainRuns.length}</td>
                    <td className="py-2.5 px-3 text-right font-bold">
                      {cleanPct === null ? (
                        '–'
                      ) : (
                        <span
                          className={
                            cleanPct >= 75
                              ? 'text-[var(--green)]'
                              : cleanPct >= 50
                                ? 'text-[var(--amber)]'
                                : 'text-[var(--red)]'
                          }
                        >
                          {cleanPct}%
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">{avgWrong}</td>
                    <td className="py-2.5 px-3 text-right">{simRuns.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'board' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {ACTIVE_CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setBoardChapter(ch.id)}
                className={`px-3.5 py-1.5 border-2 border-[var(--ink)] rounded-[9px] text-xs font-extrabold cursor-pointer ${
                  boardChapter === ch.id
                    ? 'bg-[var(--yellow)] text-[var(--yellow-ink)]'
                    : 'bg-[var(--paper)] hover:bg-[var(--panel)]'
                }`}
              >
                {ch.form} {ch.chapterLabel}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { title: `Class ${boardCls} · Top 10`, rows: boardData.classTop },
              {
                title: `Form ${boardChapter === 's1-ch10' ? 'S.1' : 'S.2'} · Top 20`,
                rows: boardData.formTop,
              },
            ].map((b) => (
              <div key={b.title} className="p-5 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)]">
                <h2 className="text-lg font-extrabold mb-3">{b.title}</h2>
                <table className="w-full border-collapse text-sm tabular-nums">
                  <thead>
                    <tr className="border-b-2 border-[var(--ink)] text-left text-xs uppercase text-[var(--soft)]">
                      <th className="py-2 px-2">#</th>
                      <th className="py-2 px-2">Name</th>
                      <th className="py-2 px-2">Class</th>
                      <th className="py-2 px-2 text-right">Done</th>
                      <th className="py-2 px-2 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r) => (
                      <tr key={`${r.cls}-${r.classNo}-${r.name}`} className="border-b border-dashed border-[var(--line)]">
                        <td className="py-2 px-2 font-extrabold">{r.rank}</td>
                        <td className="py-2 px-2">{r.name}</td>
                        <td className="py-2 px-2">
                          {r.cls} ({r.classNo})
                        </td>
                        <td className="py-2 px-2 text-right">{r.done}</td>
                        <td className="py-2 px-2 text-right font-extrabold">{r.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'teachers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleAddTeacher}
            className="lg:col-span-5 p-5 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)] space-y-4"
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" aria-hidden="true" />
              <h2 className="text-lg font-extrabold">Add Authorized Teacher</h2>
            </div>
            <p className="text-sm text-[var(--soft)]">
              Add colleague Google account emails below. Only these Google accounts can open Teacher View and read student records.
            </p>
            <label className="grid gap-1 text-sm font-bold">
              Teacher Google email
              <input
                type="email"
                required
                value={newTeacherEmail}
                onChange={(e) => setNewTeacherEmail(e.target.value)}
                placeholder="e.g. teacher@skhbbss.edu.hk"
                className="min-h-[42px] px-3 py-2 border-2 border-[var(--key-edge)] rounded-[10px] bg-[var(--paper)] font-normal"
              />
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Note (optional)
              <input
                type="text"
                maxLength={100}
                value={newTeacherNote}
                onChange={(e) => setNewTeacherNote(e.target.value)}
                placeholder="e.g. S.1 & S.2 Math teacher"
                className="min-h-[42px] px-3 py-2 border-2 border-[var(--key-edge)] rounded-[10px] bg-[var(--paper)] font-normal"
              />
            </label>
            {allowlistErr && (
              <p className="text-xs font-bold text-[var(--red)]" role="alert">
                {allowlistErr}
              </p>
            )}
            {allowlistMsg && (
              <p className="text-xs font-bold text-[var(--green)]" role="status">
                {allowlistMsg}
              </p>
            )}
            <button
              type="submit"
              disabled={savingAllowlist}
              className="bq-btn px-4 py-2 text-sm disabled:opacity-50"
            >
              {savingAllowlist ? 'Saving...' : 'Grant Teacher View Access'}
            </button>
          </form>

          <div className="lg:col-span-7 p-5 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)] space-y-3">
            <h2 className="text-lg font-extrabold">Authorized Google Accounts</h2>
            <div className="divide-y divide-dashed divide-[var(--line)]">
              {PRIMARY_TEACHER_EMAILS.map((email) => (
                <div key={email} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <b className="text-sm">{email}</b>
                    <div className="text-xs text-[var(--soft)]">Built-in Primary Teacher (protected)</div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-extrabold rounded-[8px] border border-[var(--green)] text-[var(--green)]">
                    Primary
                  </span>
                </div>
              ))}
              {allowlist.map((item) => (
                <div key={item.email} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <b className="text-sm">{item.email}</b>
                    <div className="text-xs text-[var(--soft)]">
                      {item.note ? `${item.note} · ` : ''}Added by {item.addedBy || 'teacher'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeacher(item.email)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold border border-[var(--red)] text-[var(--red)] rounded-[8px] hover:bg-[var(--red)]/10 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Remove</span>
                  </button>
                </div>
              ))}
              {allowlist.length === 0 && (
                <p className="pt-3 text-xs text-[var(--soft)]">
                  No additional teacher emails added yet. Add colleagues using the form on the left.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Confirmation Modal before writing Google Sheets */}
      {pendingConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sheets-confirm-title"
        >
          <div className="w-full max-w-lg p-6 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)] space-y-4 shadow-xl">
            <h2 id="sheets-confirm-title" className="text-xl font-extrabold tracking-tight">
              Confirm Google Sheets Sync
            </h2>
            <p className="text-sm text-[var(--soft)]">
              Review the details below before writing Firestore student records to your Google Spreadsheet:
            </p>
            <div className="p-4 border-2 border-[var(--line)] rounded-[10px] bg-[var(--panel)] space-y-2 text-sm">
              <div>
                <span className="text-[var(--soft)]">Spreadsheet:</span>{' '}
                <b>{pendingConfirm.meta.title}</b>
              </div>
              <div className="text-xs text-[var(--soft)] break-all">
                ID: {pendingConfirm.meta.spreadsheetId}
              </div>
              <div>
                <span className="text-[var(--soft)]">Tabs to update:</span>{' '}
                <b>
                  {SHEET_TABS.SUMMARIES}, {SHEET_TABS.S1_PROGRESS}, {SHEET_TABS.S2_PROGRESS},{' '}
                  {SHEET_TABS.ATTEMPTS}
                </b>
              </div>
              <div>
                <span className="text-[var(--soft)]">Rows to write:</span>{' '}
                <b>{pendingConfirm.students.length}</b> student summaries &amp;{' '}
                <b>{pendingConfirm.attempts.length}</b> attempt records
              </div>
            </div>
            <p className="text-xs text-[var(--soft)]">
              Missing tabs will be created automatically, and existing contents on these four tabs will be refreshed with the latest Firestore data.
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={sheetsBusy}
                onClick={() => setPendingConfirm(null)}
                className="bq-btn-ghost px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={sheetsBusy}
                onClick={handleConfirmWriteSheets}
                className="bq-btn px-5 py-2 text-sm"
              >
                {sheetsBusy ? 'Syncing...' : 'Confirm & Sync Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
