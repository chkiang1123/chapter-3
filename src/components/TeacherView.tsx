import { useMemo, useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { ALL_QUESTIONS, S2_CHAPTER_3, getQuestionsForSection } from '../data/curriculum';
import type { SectionId } from '../data/types';
import {
  S2_CLASSES,
  buildLeaderboards,
  formatDuration,
  formatShortTime,
  getSeedClassmates,
  type AppStorageState,
} from '../state/storage';
import { MathExpr } from './MathExpr';

interface TeacherViewProps {
  state: AppStorageState;
  onResetProgress: () => void;
  onBack: () => void;
}

type TeacherTab = 'students' | 'questions' | 'board';

export function TeacherView({ state, onResetProgress, onBack }: TeacherViewProps) {
  const [tab, setTab] = useState<TeacherTab>('students');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState<SectionId | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(
    state.profile?.email || null,
  );
  const [confirmReset, setConfirmReset] = useState(false);

  const totalQs = ALL_QUESTIONS.length;

  const allStudents = useMemo(() => {
    const seeds = getSeedClassmates().map((c) => ({
      email: `${c.cls.toLowerCase()}.${c.classNo}@school.edu.hk`,
      name: c.name,
      cls: c.cls,
      classNo: c.classNo,
      done: c.done,
      score: c.score,
      extraDone: c.extraDone,
      wrong: c.wrong,
      hints: c.hints,
      status: c.done >= totalQs ? 'Completed' : c.done > 0 ? 'In progress' : 'Not started',
      lastActive: 'Sample class data',
      isCurrent: false,
    }));

    if (state.profile) {
      const meDone =
        state.sections.sec1.completedIds.length +
        state.sections.sec2.completedIds.length +
        state.sections.sec3.completedIds.length;
      seeds.unshift({
        email: state.profile.email,
        name: state.profile.name,
        cls: state.profile.cls,
        classNo: state.profile.classNo,
        done: meDone,
        score: state.score,
        extraDone: state.extraDone,
        wrong: state.wrongAttempts,
        hints: state.hintsUsed,
        status: meDone >= totalQs ? 'Completed' : meDone > 0 || state.extraDone > 0 ? 'In progress' : 'Not started',
        lastActive: formatShortTime(state.lastActive),
        isCurrent: true,
      });
    }
    return seeds;
  }, [state, totalQs]);

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allStudents.filter(
      (s) =>
        (!classFilter || s.cls === classFilter) &&
        (!q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)),
    );
  }, [allStudents, classFilter, search]);

  const completedCount = filteredStudents.filter((s) => s.status === 'Completed').length;
  const startedCount = filteredStudents.filter((s) => s.done > 0 || s.extraDone > 0).length;
  const avgDone = filteredStudents.length
    ? filteredStudents.reduce((a, s) => a + s.done, 0) / filteredStudents.length
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

  function handleExportCsv() {
    const header = [
      'Timestamp',
      'Name',
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
    ];
    const rows = state.results.map((r) => [
      r.timestamp,
      r.studentName,
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
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 's2_ch3_balance_quest_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const selectedStudent = allStudents.find((s) => s.email === selectedEmail);
  const selectedAttempts = selectedStudent?.isCurrent ? state.results : [];
  const boardCls = classFilter || state.profile?.cls || '2A';
  const boardData = buildLeaderboards(state, boardCls);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Teacher Dashboard · {S2_CHAPTER_3.form} {S2_CHAPTER_3.chapterLabel}
          </h1>
          <p className="text-sm text-[var(--soft)]">
            {S2_CHAPTER_3.title} · Section breakdown and student attempt analytics
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!state.results.length}
            className="bq-btn-ghost inline-flex items-center gap-1.5 px-3.5 py-2 text-sm disabled:opacity-45"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
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
        <div className="flex gap-1.5" role="tablist" aria-label="Dashboard sections">
          {(['students', 'questions', 'board'] as TeacherTab[]).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 border-2 border-[var(--ink)] rounded-[9px] text-sm font-extrabold cursor-pointer capitalize transition-colors ${
                tab === t
                  ? 'bg-[var(--yellow)] text-[var(--yellow-ink)]'
                  : 'bg-[var(--paper)] hover:bg-[var(--panel)]'
              }`}
            >
              {t === 'board' ? 'Leaderboard' : t}
            </button>
          ))}
        </div>

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
      </div>

      {tab === 'students' && (
        <div className="space-y-5">
          {/* KPI Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 border-2 border-[var(--ink)] rounded-[12px] bg-[var(--paper)]">
              <b className="block text-2xl font-extrabold tabular-nums">{filteredStudents.length}</b>
              <span className="text-xs text-[var(--soft)]">Students tracked</span>
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
                  const pct = Math.round((s.done / totalQs) * 100);
                  const isSelected = s.email === selectedEmail;
                  return (
                    <tr
                      key={s.email}
                      onClick={() => setSelectedEmail(s.email)}
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
                        <b className="block">{s.name}{s.isCurrent ? ' (You)' : ''}</b>
                        <span className="text-xs opacity-75">{s.email}</span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="inline-block w-20 h-2.5 mr-2 overflow-hidden align-middle border border-[var(--ink)] rounded bg-[var(--paper)]">
                          <span className="block h-full bg-[var(--green)]" style={{ width: `${pct}%` }} />
                        </span>
                        {s.done} / {totalQs}
                      </td>
                      <td className="py-2.5 px-3 text-right font-extrabold">{s.score}</td>
                      <td className="py-2.5 px-3 text-right">{s.extraDone}</td>
                      <td className="py-2.5 px-3 text-right">{s.wrong}</td>
                      <td className="py-2.5 px-3 text-right">{s.hints}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap font-bold">{s.status}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-xs">{s.lastActive}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Selected Student Detail Panel */}
          {selectedStudent && (
            <div className="p-5 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold">{selectedStudent.name}</h2>
                  <p className="text-sm text-[var(--soft)]">
                    {selectedStudent.cls} ({selectedStudent.classNo}) · {selectedStudent.done} / {totalQs} questions ·{' '}
                    {selectedStudent.score} points
                  </p>
                </div>
                {selectedStudent.isCurrent && (
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
                        <span className="text-xs font-bold text-[var(--red)]">Delete all saved attempts?</span>
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

              {selectedStudent.isCurrent ? (
                selectedAttempts.length === 0 ? (
                  <p className="text-sm text-[var(--soft)]">No completed questions recorded yet on this device.</p>
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
                )
              ) : (
                <p className="text-sm text-[var(--soft)]">
                  Sample classmate summary row for leaderboard comparison. Detailed step logs are recorded locally for the active student.
                </p>
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
                const mainRuns = state.results.filter((r) => r.questionId === q.id && r.type === 'Main');
                const simRuns = state.results.filter((r) => r.questionId === q.id && r.type === 'Similar');
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
    </div>
  );
}
