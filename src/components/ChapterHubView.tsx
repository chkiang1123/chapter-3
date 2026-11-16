import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, FolderPlus, Check, RotateCcw } from 'lucide-react';
import {
  ALL_QUESTIONS,
  RESERVED_TOPIC_SLOTS,
  S2_CHAPTER_3,
  getQuestionById,
  getQuestionsForSection,
} from '../data/curriculum';
import type { QuestionLevel, SectionId } from '../data/types';
import {
  MAX_CLASS_NUMBER,
  S2_CLASSES,
  getMistakeQuestionIds,
  type AppStorageState,
  type PlaySessionConfig,
  type StudentProfile,
} from '../state/storage';
import { MathExpr } from './MathExpr';

interface ChapterHubViewProps {
  state: AppStorageState;
  onSaveProfile: (profile: StudentProfile) => void;
  onStartPlay: (config: PlaySessionConfig) => void;
  onOpenLeaderboard: () => void;
}

export function ChapterHubView({
  state,
  onSaveProfile,
  onStartPlay,
  onOpenLeaderboard,
}: ChapterHubViewProps) {
  const [editingProfile, setEditingProfile] = useState(!state.profile);
  const [name, setName] = useState(state.profile?.name || '');
  const [cls, setCls] = useState(state.profile?.cls || '');
  const [classNo, setClassNo] = useState(state.profile ? String(state.profile.classNo) : '');
  const [profileError, setProfileError] = useState('');
  const [expandedSection, setExpandedSection] = useState<SectionId | null>(null);

  const totalQuestions = ALL_QUESTIONS.length;
  const totalDone =
    state.sections.sec1.completedIds.length +
    state.sections.sec2.completedIds.length +
    state.sections.sec3.completedIds.length;
  const totalPct = totalQuestions > 0 ? Math.round((totalDone / totalQuestions) * 100) : 0;

  const mistakeQuestionIds = useMemo(
    () =>
      getMistakeQuestionIds(
        state.results,
        ALL_QUESTIONS.map((q) => q.id),
      ),
    [state.results],
  );

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = name.replace(/\s+/g, ' ').trim();
    const num = Number(classNo);
    if (!cleanName) {
      setProfileError('Please enter your full name.');
      return;
    }
    if (!cls) {
      setProfileError('Please choose your class.');
      return;
    }
    if (!Number.isInteger(num) || num < 1 || num > MAX_CLASS_NUMBER) {
      setProfileError(`Please enter a class number from 1 to ${MAX_CLASS_NUMBER}.`);
      return;
    }
    setProfileError('');
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '.');
    onSaveProfile({
      name: cleanName,
      cls,
      classNo: num,
      email: `${cls.toLowerCase()}.${num}.${slug}@school.edu.hk`,
    });
    setEditingProfile(false);
  }

  function handleLaunchSection(
    sectionId: SectionId,
    levelFilter: QuestionLevel | 'ALL' = 'ALL',
    practiceMode = false,
    startQuestionId?: string,
  ) {
    if (!state.profile) {
      setEditingProfile(true);
      setProfileError('Please enter your name, class, and class number above before starting.');
      document.getElementById('studentNameInput')?.focus();
      return;
    }
    onStartPlay({ sectionId, levelFilter, practiceMode, startQuestionId });
  }

  function handleLaunchReviewMistakes() {
    if (!mistakeQuestionIds.length) return;
    if (!state.profile) {
      setEditingProfile(true);
      setProfileError('Please enter your name, class, and class number above before starting.');
      document.getElementById('studentNameInput')?.focus();
      return;
    }
    const firstQ = getQuestionById(mistakeQuestionIds[0]);
    onStartPlay({
      sectionId: firstQ?.sectionId || 'sec1',
      levelFilter: 'ALL',
      practiceMode: true,
      reviewMistakes: true,
      questionIds: mistakeQuestionIds,
    });
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Hero + Rules Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        <div className="lg:col-span-7 space-y-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--soft)] mb-2">
              {S2_CHAPTER_3.form} · {S2_CHAPTER_3.chapterLabel} · Single Unit
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1] text-balance">
              {S2_CHAPTER_3.title}
            </h1>
            <p className="mt-3 text-[var(--soft)] max-w-[56ch]">
              Master algebraic fractions, formula substitution, and changing the subject one step at a time.
              Choose your move, simplify or balance both sides, and earn points for clean solutions.
            </p>
          </div>

          {/* Worked step preview matching Balance Quest hero */}
          <div
            className="p-4 sm:p-5 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--panel)] space-y-2.5"
            aria-label="Example solving steps"
          >
            <div className="text-xs font-extrabold uppercase tracking-[0.07em] text-[var(--soft)]">
              Step-by-step format
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2 text-lg sm:text-xl font-math">
              <div>
                <MathExpr expr="(y^2 - 6y)/(y^2 - 36)" />
              </div>
              <span className="text-[var(--soft)] font-ui text-sm font-bold">→ Factor &amp; Cancel →</span>
              <div>
                <MathExpr expr="y/(y + 6)" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2 text-lg sm:text-xl font-math pt-1 border-t border-dashed border-[var(--line)]">
              <div>
                <MathExpr expr="(6 - 5x)/y = 7" />
              </div>
              <span className="text-[var(--soft)] font-ui text-sm font-bold">→ Make <i>x</i> subject →</span>
              <div>
                <MathExpr expr="x = (6 - 7y)/5" />
              </div>
            </div>
          </div>

          {/* Student Profile / Progress Card */}
          <div className="p-5 sm:p-6 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)]">
            {!state.profile || editingProfile ? (
              <form onSubmit={handleProfileSubmit} noValidate>
                <h2 className="text-lg font-extrabold">
                  {state.profile ? 'Edit student details' : 'Before you start'}
                </h2>
                <p className="text-sm text-[var(--soft)] mt-1">
                  Enter your name, class, and class number so your section progress and leaderboard rank are recorded.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
                  <label className="sm:col-span-2 grid gap-1 text-sm font-bold">
                    Full name
                    <input
                      id="studentNameInput"
                      type="text"
                      maxLength={40}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Chan Tai Man"
                      className="min-h-[44px] px-3 py-2 border-2 border-[var(--key-edge)] rounded-[10px] bg-[var(--paper)] text-[var(--ink)] font-normal"
                      required
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-bold">
                    Class
                    <select
                      id="studentClassSelect"
                      value={cls}
                      onChange={(e) => setCls(e.target.value)}
                      className="min-h-[44px] px-3 py-2 border-2 border-[var(--key-edge)] rounded-[10px] bg-[var(--paper)] text-[var(--ink)] font-normal"
                      required
                    >
                      <option value="">Choose</option>
                      {S2_CLASSES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1 text-sm font-bold">
                    Class no.
                    <input
                      id="studentClassNoInput"
                      type="number"
                      min={1}
                      max={MAX_CLASS_NUMBER}
                      inputMode="numeric"
                      value={classNo}
                      onChange={(e) => setClassNo(e.target.value)}
                      placeholder="1–45"
                      className="min-h-[44px] px-3 py-2 border-2 border-[var(--key-edge)] rounded-[10px] bg-[var(--paper)] text-[var(--ink)] font-normal"
                      required
                    />
                  </label>
                </div>
                {profileError && (
                  <p className="text-sm font-bold text-[var(--red)] mt-2.5" role="alert">
                    {profileError}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <button type="submit" className="bq-btn px-5 py-2.5 text-sm sm:text-base">
                    {state.profile ? 'Save details' : 'Save details & begin'}
                  </button>
                  {state.profile && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProfile(false);
                        setProfileError('');
                      }}
                      className="bq-btn-ghost px-4 py-2.5 text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-extrabold">{state.profile.name}</h2>
                    <p className="text-sm text-[var(--soft)]">
                      Class {state.profile.cls} · No. {state.profile.classNo} ·{' '}
                      <button
                        type="button"
                        onClick={() => setEditingProfile(true)}
                        className="underline underline-offset-2 hover:text-[var(--ink)] cursor-pointer"
                      >
                        Edit details
                      </button>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenLeaderboard}
                    className="bq-btn-ghost px-4 py-2 text-sm whitespace-nowrap shrink-0"
                  >
                    Leaderboard
                  </button>
                </div>

                <div
                  className="h-3 mt-4 overflow-hidden border-2 border-[var(--ink)] rounded-[8px] bg-[var(--panel)]"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={totalQuestions}
                  aria-valuenow={totalDone}
                >
                  <div
                    className="h-full bg-[var(--green)] transition-[width] duration-300"
                    style={{ width: `${totalPct}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-sm text-[var(--soft)] tabular-nums">
                  <span>
                    <b className="text-[var(--ink)]">{totalDone}</b> / {totalQuestions} questions completed ({totalPct}%)
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    <b className="text-[var(--ink)]">{state.score}</b> points
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    <b className="text-[var(--ink)]">{state.extraDone}</b> similar questions practised
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How to Play Rules */}
        <aside className="lg:col-span-5 p-5 sm:p-6 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)]">
          <h2 className="text-lg font-extrabold mb-3">How to play</h2>
          <ul className="space-y-2 text-sm sm:text-[15px] list-disc pl-5">
            <li>Choose the correct algebraic or balance move, then write the new line after simplifying.</li>
            <li>
              Use the <b>^</b> key for powers (e.g. <span className="font-math">a^3/2</span>) and brackets for compound denominators (e.g. <span className="font-math">1/(7x)</span>).
            </li>
            <li>Use the highlight button to tell variable terms from constants, or open a hint if stuck.</li>
            <li>You may skip up to 2 intermediate steps if you simplify directly — skipped steps still earn points!</li>
            <li>
              If you make a mistake in any step, you will practise <b>one similar question</b> straight after to build mastery.
            </li>
            <li>
              <b className="text-[var(--green)]">10 points</b> per step solved cleanly on the first try;{' '}
              <b className="text-[var(--green)]">5 points</b> after a hint or retry. Similar questions give 0 points.
            </li>
          </ul>
          <div className="mt-4 pt-3 border-t border-dashed border-[var(--line)] text-xs text-[var(--soft)] space-y-1">
            <p>
              <b className="text-[var(--ink)]">3 Sections in S.2 Ch.3:</b> Work through each section in order, or select Level 1, Level 2, or MCQ sets below.
            </p>
          </div>
        </aside>
      </section>

      {/* S.2 Chapter 3 — The 3 Separated Sections */}
      <section aria-labelledby="ch3-sections-heading" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[var(--ink)] pb-2.5">
          <h2 id="ch3-sections-heading" className="text-2xl font-extrabold tracking-tight">
            Chapter 3 Sections · {S2_CHAPTER_3.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-[var(--soft)] tabular-nums">
              {totalQuestions} total questions across 3 sections
            </span>
            <button
              type="button"
              onClick={handleLaunchReviewMistakes}
              disabled={mistakeQuestionIds.length === 0}
              title={
                mistakeQuestionIds.length > 0
                  ? `Review ${mistakeQuestionIds.length} question${mistakeQuestionIds.length === 1 ? '' : 's'} you previously answered incorrectly`
                  : 'No mistakes recorded yet — solve questions and any missed ones will appear here'
              }
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] border-2 text-sm font-extrabold whitespace-nowrap shrink-0 transition-all ${
                mistakeQuestionIds.length > 0
                  ? 'border-[var(--ink)] bg-[var(--yellow)] text-[var(--yellow-ink)] shadow-[0_3px_0_var(--key-edge)] hover:brightness-95 active:translate-y-[2px] cursor-pointer'
                  : 'border-[var(--line)] bg-[var(--panel)] text-[var(--soft)] opacity-60 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Review Mistakes</span>
              <span className="tabular-nums">({mistakeQuestionIds.length})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {S2_CHAPTER_3.sections.map((sec) => {
            const secQuestions = getQuestionsForSection(sec.id);
            const prog = state.sections[sec.id];
            const doneCount = prog.completedIds.length;
            const secPct = secQuestions.length > 0 ? Math.round((doneCount / secQuestions.length) * 100) : 0;
            const isFinished = doneCount >= secQuestions.length && !prog.pendingSimilar;
            const isExpanded = expandedSection === sec.id;

            const startLabel = prog.pendingSimilar
              ? 'Continue · Similar Question'
              : isFinished
                ? `Practise Section ${sec.number} Again`
                : doneCount > 0
                  ? `Continue Section ${sec.number}`
                  : `Start Section ${sec.number}`;

            return (
              <article
                key={sec.id}
                className="p-5 sm:p-6 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="text-xs font-extrabold uppercase tracking-[0.07em] text-[var(--soft)]">
                      {sec.subtitle} · {secQuestions.length} questions · {sec.levels.join(' · ')}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                      Section {sec.number}: {sec.title}
                    </h3>
                    <p className="text-sm text-[var(--soft)]">{sec.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleLaunchSection(sec.id, 'ALL', isFinished)}
                      className="bq-btn px-5 py-2.5 text-sm sm:text-base whitespace-nowrap shrink-0"
                    >
                      {startLabel}
                    </button>
                  </div>
                </div>

                {/* Section Progress + Level Quick Filters */}
                <div className="mt-4 pt-4 border-t border-dashed border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 max-w-md">
                    <div
                      className="h-2.5 flex-1 overflow-hidden border border-[var(--ink)] rounded-md bg-[var(--panel)]"
                      role="progressbar"
                      aria-label={`Section ${sec.number} progress`}
                      aria-valuemin={0}
                      aria-valuemax={secQuestions.length}
                      aria-valuenow={doneCount}
                    >
                      <div
                        className="h-full bg-[var(--green)] transition-[width] duration-300"
                        style={{ width: `${secPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold tabular-nums text-[var(--soft)] whitespace-nowrap">
                      {doneCount} / {secQuestions.length} done
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {sec.levels.map((lvl) => {
                      const lvlCount = getQuestionsForSection(sec.id, lvl).length;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleLaunchSection(sec.id, lvl, false)}
                          className="px-3 py-1.5 text-xs font-bold border-2 border-[var(--key-edge)] rounded-[8px] bg-[var(--panel)] hover:border-[var(--ink)] cursor-pointer whitespace-nowrap shrink-0 transition-colors"
                        >
                          {lvl} ({lvlCount})
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() => setExpandedSection(isExpanded ? null : sec.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold border-2 border-[var(--line)] rounded-[8px] bg-[var(--paper)] hover:border-[var(--ink)] cursor-pointer whitespace-nowrap shrink-0 transition-colors"
                    >
                      <span>Browse questions</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expandable Question Browser Grid */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[var(--line)] space-y-4">
                    {sec.levels.map((lvl) => {
                      const lvlQs = getQuestionsForSection(sec.id, lvl);
                      if (!lvlQs.length) return null;
                      return (
                        <div key={lvl}>
                          <h4 className="text-xs font-extrabold uppercase tracking-[0.06em] text-[var(--soft)] mb-2">
                            {lvl} ({lvlQs.length})
                          </h4>
                          <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-1.5">
                            {lvlQs.map((q) => {
                              const done = prog.completedIds.includes(q.id);
                              return (
                                <button
                                  key={q.id}
                                  type="button"
                                  title={`${q.numberLabel}: ${q.topicTag}${q.sourceTag ? ` (${q.sourceTag})` : ''}`}
                                  onClick={() => handleLaunchSection(sec.id, 'ALL', false, q.id)}
                                  className={`h-9 px-1.5 rounded-[8px] border-2 text-xs font-bold tabular-nums flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                                    done
                                      ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                                      : 'border-[var(--key-edge)] bg-[var(--key)] hover:border-[var(--ink)]'
                                  }`}
                                >
                                  <span>{q.numberLabel}</span>
                                  {done && <Check className="w-3 h-3 shrink-0" aria-hidden="true" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Reserved Topic Vacancy Slots */}
      <section aria-labelledby="reserved-topics-heading" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-dashed border-[var(--line)] pb-2">
          <h2 id="reserved-topics-heading" className="text-lg font-extrabold text-[var(--soft)]">
            Future S.2 Topics · Reserved Vacancy
          </h2>
          <span className="text-xs text-[var(--soft)]">
            Space reserved for additional chapters and question sets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RESERVED_TOPIC_SLOTS.map((slot) => (
            <div
              key={slot.id}
              className="p-5 border-2 border-dashed border-[var(--line)] rounded-[14px] bg-[var(--panel)]/55 flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-[10px] border border-dashed border-[var(--line)] text-[var(--soft)] shrink-0">
                <FolderPlus className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-extrabold uppercase tracking-[0.06em] text-[var(--soft)]">
                  {slot.form} · {slot.chapterLabel}
                </div>
                <h3 className="text-base font-extrabold text-[var(--ink)]">{slot.title}</h3>
                <p className="text-xs text-[var(--soft)]">{slot.reservedNote}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
