import { useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Cloud,
  FolderPlus,
  LogIn,
  RotateCcw,
} from 'lucide-react';
import {
  ACTIVE_CHAPTERS,
  RESERVED_TOPIC_SLOTS,
  getChapterById,
  getQuestionById,
  getQuestionsForChapter,
  getQuestionsForSection,
} from '../data/curriculum';
import type { ChapterId, QuestionLevel, SectionId } from '../data/types';
import {
  MAX_CLASS_NUMBER,
  S1_CLASSES,
  S2_CLASSES,
  getChapterProgress,
  getMistakeQuestionIds,
  type AppStorageState,
  type PlaySessionConfig,
  type StudentProfile,
} from '../state/storage';
import { MathExpr } from './MathExpr';

interface ChapterHubViewProps {
  state: AppStorageState;
  activeChapterId: ChapterId;
  authUser: User | null;
  isTeacher: boolean;
  authBusy: boolean;
  authError: string;
  onSelectChapter: (chapterId: ChapterId) => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onSaveProfile: (profile: StudentProfile) => void;
  onStartPlay: (config: PlaySessionConfig) => void;
  onOpenLeaderboard: () => void;
}

export function ChapterHubView({
  state,
  activeChapterId,
  authUser,
  isTeacher,
  authBusy,
  authError,
  onSelectChapter,
  onSignIn,
  onSignOut,
  onSaveProfile,
  onStartPlay,
  onOpenLeaderboard,
}: ChapterHubViewProps) {
  const [editingProfile, setEditingProfile] = useState(!state.profile);
  const [name, setName] = useState(state.profile?.name || authUser?.displayName || '');
  const [cls, setCls] = useState(state.profile?.cls || '');
  const [classNo, setClassNo] = useState(state.profile ? String(state.profile.classNo) : '');
  const [profileError, setProfileError] = useState('');
  const [expandedSection, setExpandedSection] = useState<SectionId | null>(null);

  useEffect(() => {
    if (state.profile) {
      setName(state.profile.name);
      setCls(state.profile.cls);
      setClassNo(String(state.profile.classNo));
      setEditingProfile(false);
    } else if (authUser?.displayName && !name) {
      setName(authUser.displayName);
    }
  }, [state.profile, authUser]);

  const activeChapter = getChapterById(activeChapterId);
  const chapterQuestions = useMemo(() => getQuestionsForChapter(activeChapterId), [activeChapterId]);
  const chapterProgress = useMemo(
    () => getChapterProgress(state, activeChapterId),
    [state, activeChapterId],
  );

  const mistakeQuestionIds = useMemo(
    () =>
      getMistakeQuestionIds(
        state.results,
        chapterQuestions.map((q) => q.id),
        activeChapterId,
      ),
    [state.results, chapterQuestions, activeChapterId],
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
    const email = authUser?.email?.trim().toLowerCase() || `${cls.toLowerCase()}.${num}.${slug}@school.edu.hk`;
    onSaveProfile({
      name: cleanName,
      cls,
      classNo: num,
      email,
    });
    if (cls.startsWith('1')) {
      onSelectChapter('s1-ch10');
    } else if (cls.startsWith('2')) {
      onSelectChapter('s2-ch3');
    }
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
      sectionId: firstQ?.sectionId || activeChapter.sections[0].id,
      levelFilter: 'ALL',
      practiceMode: true,
      reviewMistakes: true,
      questionIds: mistakeQuestionIds,
    });
  }

  const isS1 = activeChapterId === 's1-ch10';

  return (
    <div className="space-y-10 pb-10">
      {/* Separate Chapter Category Selector */}
      <section aria-label="Chapter category switcher" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ACTIVE_CHAPTERS.map((ch) => {
          const prog = getChapterProgress(state, ch.id);
          const isSelected = ch.id === activeChapterId;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => {
                onSelectChapter(ch.id);
                setExpandedSection(null);
              }}
              aria-pressed={isSelected}
              className={`text-left p-4 border-2 border-[var(--ink)] rounded-[14px] cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[var(--yellow)] text-[var(--yellow-ink)] shadow-[0_4px_0_var(--key-edge)]'
                  : 'bg-[var(--paper)] hover:bg-[var(--panel)]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs font-extrabold uppercase tracking-[0.07em]">
                <span>
                  {ch.form} · {ch.chapterLabel}
                </span>
                <span className="tabular-nums">
                  {prog.doneCount}/{prog.totalCount} Qs · {prog.score} pts
                </span>
              </div>
              <div className="text-lg font-extrabold tracking-tight mt-1">{ch.title}</div>
              <div className="text-xs opacity-80 mt-0.5">
                {ch.sections.length} sections · Separate progress &amp; leaderboard
              </div>
            </button>
          );
        })}
      </section>

      {/* Hero + Rules Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--soft)] mb-2">
              S. K. H. Bishop Baker Secondary School · {activeChapter.form} · {activeChapter.chapterLabel}
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-[1.1] text-balance">
              {activeChapter.title}
            </h1>
            <p className="mt-3 text-[var(--soft)] max-w-[56ch]">
              {isS1
                ? 'Practise laws of positive integral indices, degree & constant identification, polynomial addition/subtraction, and expanding brackets in ascending or descending powers.'
                : 'Master algebraic fractions, formula substitution, and changing the subject one step at a time. Choose your move, simplify or balance both sides, and earn points for clean solutions.'}
            </p>
          </div>

          {/* Worked step preview */}
          <div
            className="p-4 sm:p-5 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--panel)] space-y-2.5"
            aria-label="Example solving steps"
          >
            <div className="text-xs font-extrabold uppercase tracking-[0.07em] text-[var(--soft)]">
              Step-by-step format ({activeChapter.form} {activeChapter.chapterLabel})
            </div>
            {isS1 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2 text-lg sm:text-xl font-math">
                  <div>
                    <MathExpr expr="(2x^3)^4/(4x^2)" />
                  </div>
                  <span className="text-[var(--soft)] font-ui text-sm font-bold">→ Index Laws →</span>
                  <div>
                    <MathExpr expr="4x^10" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2 text-lg sm:text-xl font-math pt-1 border-t border-dashed border-[var(--line)]">
                  <div>
                    <MathExpr expr="(e + 2)(e + 6)" />
                  </div>
                  <span className="text-[var(--soft)] font-ui text-sm font-bold">→ Expand (Asc.) →</span>
                  <div>
                    <MathExpr expr="12 + 8e + e^2" />
                  </div>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Student Profile / Progress Card */}
          <div className="p-5 sm:p-6 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)] space-y-4">
            {/* Google Account Sync Status Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-dashed border-[var(--line)]">
              {authUser ? (
                <>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Cloud className="w-4 h-4 text-[var(--green)] shrink-0" aria-hidden="true" />
                    <span className="text-[var(--soft)]">
                      Signed in as <b className="text-[var(--ink)]">{authUser.email}</b>
                      {isTeacher ? ' · Teacher access enabled' : ' · Syncing to teacher'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="text-xs font-bold underline underline-offset-2 text-[var(--soft)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    Switch account
                  </button>
                </>
              ) : (
                <>
                  <div className="text-xs sm:text-sm text-[var(--soft)]">
                    Sign in with your Google account so your progress syncs to your teacher across devices.
                  </div>
                  <button
                    type="button"
                    disabled={authBusy}
                    onClick={onSignIn}
                    className="bq-btn-ghost inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold whitespace-nowrap shrink-0"
                  >
                    <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{authBusy ? 'Signing in...' : 'Sign in with Google'}</span>
                  </button>
                </>
              )}
            </div>

            {authError && (
              <p className="text-xs sm:text-sm font-bold text-[var(--red)]" role="alert">
                {authError}
              </p>
            )}

            {!state.profile || editingProfile ? (
              <form onSubmit={handleProfileSubmit} noValidate>
                <h2 className="text-lg font-extrabold">
                  {state.profile ? 'Edit student details' : 'Before you start'}
                </h2>
                <p className="text-sm text-[var(--soft)] mt-1">
                  Enter your name, class (S.1 or S.2), and class number so your section progress and leaderboard rank are recorded.
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
                  aria-label={`${activeChapter.form} ${activeChapter.chapterLabel} completion`}
                  aria-valuemin={0}
                  aria-valuemax={chapterProgress.totalCount}
                  aria-valuenow={chapterProgress.doneCount}
                >
                  <div
                    className="h-full bg-[var(--green)] transition-[width] duration-300"
                    style={{ width: `${chapterProgress.pct}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-sm text-[var(--soft)] tabular-nums">
                  <span>
                    <b className="text-[var(--ink)]">{chapterProgress.doneCount}</b> / {chapterProgress.totalCount}{' '}
                    {activeChapter.form} questions ({chapterProgress.pct}%)
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    <b className="text-[var(--ink)]">{chapterProgress.score}</b> chapter pts
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    <b className="text-[var(--ink)]">{state.extraDone}</b> similar practised
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
            {isS1 ? (
              <li>
                Write polynomials in <b>completely expanded</b> form with all like terms and indices combined (e.g. <span className="font-math">6a^5</span>, not <span className="font-math">2a^2*3a^3</span>).
              </li>
            ) : (
              <li>
                Use the <b>^</b> key for powers (e.g. <span className="font-math">a^3/2</span>) and brackets for compound denominators (e.g. <span className="font-math">1/(7x)</span>).
              </li>
            )}
            {isS1 && (
              <li>
                Watch for <b>ascending</b> or <b>descending</b> power questions — terms must follow the requested degree order!
              </li>
            )}
            <li>Use the highlight button to tell variable terms from constants, or open a hint if stuck.</li>
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
              <b className="text-[var(--ink)]">
                {activeChapter.sections.length} Sections in {activeChapter.form} {activeChapter.chapterLabel}:
              </b>{' '}
              Work through each section in order, or select Level 1, Level 2, Level 3, or MCQ sets below.
            </p>
          </div>
        </aside>
      </section>

      {/* Active Chapter Sections */}
      <section aria-labelledby="chapter-sections-heading" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[var(--ink)] pb-2.5">
          <h2 id="chapter-sections-heading" className="text-2xl font-extrabold tracking-tight">
            {activeChapter.form} {activeChapter.chapterLabel} · {activeChapter.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-[var(--soft)] tabular-nums">
              {chapterProgress.totalCount} total questions across {activeChapter.sections.length} sections
            </span>
            <button
              type="button"
              onClick={handleLaunchReviewMistakes}
              disabled={mistakeQuestionIds.length === 0}
              title={
                mistakeQuestionIds.length > 0
                  ? `Review ${mistakeQuestionIds.length} question${mistakeQuestionIds.length === 1 ? '' : 's'} you previously answered incorrectly in ${activeChapter.chapterLabel}`
                  : 'No mistakes recorded in this chapter yet'
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
          {activeChapter.sections.map((sec) => {
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
            Reserved Question Banks &amp; Future Chapters
          </h2>
          <span className="text-xs text-[var(--soft)]">
            Space reserved for missing S.1 Ch.10 pages &amp; additional chapters
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
