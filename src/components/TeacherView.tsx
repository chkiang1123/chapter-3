import { useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { ArrowLeft, Download, Lock, LogIn, ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import { ALL_QUESTIONS, S2_CHAPTER_3, getQuestionsForSection } from '../data/curriculum';
import type { SectionId } from '../data/types';
import {
  PRIMARY_TEACHER_EMAILS,
  isValidEmailAddress,
  normalizeEmail,
} from '../state/firebaseSchemaConstants';
import {
  addTeacherAllowlistEmail,
  removeTeacherAllowlistEmail,
  subscribeAllStudentsForTeacher,
  subscribeStudentAttemptsForTeacher,
  subscribeTeacherAllowlist,
  type CloudLeaderboardRow,
  type CloudStudentSummary,
  type TeacherAllowlistItem,
} from '../state/firebaseSync';
import {
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

export function TeacherView({
  state,
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
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState<SectionId | 'ALL'>('ALL');
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

  const totalQs = ALL_QUESTIONS.length;

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

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cloudStudents.filter(
      (s) =>
        (!classFilter || s.cls === classFilter) &&
        (!q ||
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          `${s.cls} ${s.classNo}`.toLowerCase().includes(q)),
    );
  }, [cloudStudents, classFilter, search]);

  const completedCount = filteredStudents.filter((s) => s.doneCount >= totalQs).length;
  const startedCount = filteredStudents.filter((s) => s.doneCount > 0 || s.extraDone > 0).length;
  const avgDone = filteredStudents.length
    ? filteredStudents.reduce((a, s) => a + s.doneCount, 0) / filteredStudents.length
    : 0;
  const avgScore = filteredStudents.length
    ? Math.round(filteredStudents.reduce((a, s) => a + s.score, 0) / filteredStudents.length)
    : 0;

  const filteredQuestions = useMemo(() => {
    const base = sectionFilter === 'ALL' ? ALL_QUESTIONS : getQuestionsForSection(sectionFilter);
    const q = search.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (item) =>
        item.numberLabel.toLowerCase().includes(q) ||
        item.topicTag.toLowerCase().includes(q) ||
        item.promptEq.toLowerCase().includes(q),
    );
  }, [sectionFilter, search]);

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
              Only authorized teacher Google accounts can view student records and class analytics.
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
              <span>Sign out &amp; switch Google account</span>
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

  function handleExportCsv() {
    if (selectedStudent && selectedAttempts.length > 0) {
      const header = [
        'Timestamp',
        'Name',
        'Email',
        'Class',
        'ClassNo',
        'Section',
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
        r.studentName,
        r.studentEmail,
        r.studentCls,
        r.studentClassNo,
        r.sectionId,
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
      a.download = `s2_ch3_${selectedStudent.cls}_${selectedStudent.classNo}_attempts.csv`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const header = [
      'Class',
      'ClassNo',
      'Name',
      'Email',
      'Done',
      'TotalQuestions',
      'Points',
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
      s.doneCount,
      totalQs,
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
    a.download = 's2_ch3_all_students_summary.csv';
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

  const boardCls = classFilter || state.profile?.cls || '2A';
  const boardData = buildLeaderboards(state, boardCls, cloudLeaderboard);

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
            Teacher Dashboard · {S2_CHAPTER_3.form} {S2_CHAPTER_3.chapterLabel}
          </h1>
          <p className="text-sm text-[var(--soft)]">
            {S2_CHAPTER_3.title} · Live student records &amp; authorized teacher access control
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
            onClick={onBack}
            className="bq-btn inline-flex items-center gap-1.5 px-4 py-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Hub</span>
          </button>
        </div>
      </div>

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
            <label className="text-sm font-bold flex items-center gap-1.5">
              <span>Class</span>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="min-h-[38px] px-2.5 border-2 border-[var(--line)] rounded-[9px] bg-[var(--paper)] font-normal"
              >
                <option value="">All classes</option>
                {S2_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
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
                  <option value="ALL">All 3 sections</option>
                  {S2_CHAPTER_3.sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      Section {s.number}: {s.title}
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
                className="min-h-[38px] w-56 sm:w-60 px-3 border-2 border-[var(--line)] rounded-[9px] bg-[var(--paper)] text-sm"
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
                No synced student records found yet. Once students sign in with Google, enter their Class &amp; Class No., and save or answer questions, their live progress appears here automatically.
              </div>
            ) : (
              <table className="w-full border-collapse text-sm tabular-nums">
                <thead>
                  <tr className="border-b-2 border-[var(--ink)] bg-[var(--panel)] text-left text-xs uppercase tracking-wider text-[var(--soft)]">
                    <th className="py-2.5 px-3">Class / No.</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Progress</th>
                    <th className="py-2.5 px-3 text-right">Points</th>
                    <th className="py-2.5 px-3 text-right">Similar Qs</th>
                    <th className="py-2.5 px-3 text-right">Wrong</th>
                    <th className="py-2.5 px-3 text-right">Hints</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => {
                    const pct = Math.round((s.doneCount / totalQs) * 100);
                    const status =
                      s.doneCount >= totalQs
                        ? 'Completed'
                        : s.doneCount > 0 || s.extraDone > 0
                          ? 'In progress'
                          : 'Not started';
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
                          {s.doneCount} / {totalQs}
                        </td>
                        <td className="py-2.5 px-3 text-right font-extrabold">{s.score}</td>
                        <td className="py-2.5 px-3 text-right">{s.extraDone}</td>
                        <td className="py-2.5 px-3 text-right">{s.wrongAttempts}</td>
                        <td className="py-2.5 px-3 text-right">{s.hintsUsed}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-bold">{status}</td>
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
                    {selectedStudent.cls} ({selectedStudent.classNo}) · {selectedStudent.email} ·{' '}
                    {selectedStudent.doneCount} / {totalQs} questions · {selectedStudent.score} points
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
                      {selectedAttempts.map((r) => (
                        <tr key={r.id} className="border-b border-dashed border-[var(--line)]">
                          <td className="py-2 px-2.5 whitespace-nowrap">{formatShortTime(r.timestamp)}</td>
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
                      ))}
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
                <th className="py-2.5 px-3">Section &amp; Level</th>
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
                const sec = S2_CHAPTER_3.sections.find((s) => s.id === q.sectionId)!;
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
                      <span className="font-bold">Section {sec.number}</span> · {q.level}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { title: `Class ${boardCls} · Top 10`, rows: boardData.classTop },
            { title: 'Form S.2 · Top 20', rows: boardData.formTop },
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
                placeholder="e.g. S.2 Math teacher"
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
    </div>
  );
}
