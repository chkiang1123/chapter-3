import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ALL_QUESTIONS,
  buildPlayableQuestion,
  getChapterForSection,
  getQuestionById,
  getQuestionsForSection,
} from '../data/curriculum';
import type { McqOption, PlayableQuestion, QuestionItem } from '../data/types';
import { checkStepAnswer, parseExpression, areExpressionsEquivalent } from '../engine/mathEngine';
import {
  buildLeaderboards,
  type AppStorageState,
  type AttemptRecord,
  type PlaySessionConfig,
} from '../state/storage';
import { soundManager } from '../utils/sound';
import { MathExpr } from './MathExpr';

interface PlayViewProps {
  state: AppStorageState;
  config: PlaySessionConfig;
  onRecordAttempt: (payload: {
    record: AttemptRecord;
    isExtra: boolean;
    hadError: boolean;
    baseQuestionId: string;
    variantIndexForExtra: number | null;
    practiceMode: boolean;
  }) => void;
  onBackToHub: () => void;
  onOpenLeaderboard: () => void;
}

interface HistoryRow {
  line: string;
  note: string;
  stepNumber: number;
}

function shuffleStrings(items: string[]): string[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

export function PlayView({
  state,
  config,
  onRecordAttempt,
  onBackToHub,
  onOpenLeaderboard,
}: PlayViewProps) {
  const chapter = getChapterForSection(config.sectionId);
  const section = chapter.sections.find((s) => s.id === config.sectionId) || chapter.sections[0];
  const sectionPool: QuestionItem[] = useMemo(() => {
    if (config.reviewMistakes && config.questionIds) {
      const idSet = new Set(config.questionIds);
      return ALL_QUESTIONS.filter((q) => idSet.has(q.id));
    }
    return getQuestionsForSection(config.sectionId, config.levelFilter);
  }, [config.levelFilter, config.questionIds, config.reviewMistakes, config.sectionId]);

  // Practice mode keeps an isolated local cursor so it doesn't alter saved progress
  const [practiceCursor, setPracticeCursor] = useState(0);
  const [practicePending, setPracticePending] = useState<{ forId: string; variantIndex: number } | null>(null);
  const [practiceScore, setPracticeScore] = useState(0);
  const [practiceExtraDone, setPracticeExtraDone] = useState(0);
  const [manualQuestionId, setManualQuestionId] = useState<string | null>(config.startQuestionId || null);

  useEffect(() => {
    setPracticeCursor(0);
    setPracticePending(null);
    setPracticeScore(0);
    setPracticeExtraDone(0);
    setManualQuestionId(config.startQuestionId || null);
  }, [config]);

  // Determine the next playable question
  const activeQuestion: PlayableQuestion | null = useMemo(() => {
    if (config.practiceMode) {
      if (practicePending) {
        const base = getQuestionById(practicePending.forId);
        if (base) return buildPlayableQuestion(base, practicePending.variantIndex);
      }
      if (practiceCursor >= sectionPool.length) return null;
      const item = sectionPool[practiceCursor];
      const randomVar =
        !config.reviewMistakes && item.sims.length > 0 && Math.random() < 0.4
          ? Math.floor(Math.random() * item.sims.length)
          : undefined;
      return buildPlayableQuestion(item, randomVar);
    }

    const secProgress = state.sections[config.sectionId];
    if (secProgress.pendingSimilar) {
      const base = getQuestionById(secProgress.pendingSimilar.forId);
      if (base) return buildPlayableQuestion(base, secProgress.pendingSimilar.variantIndex);
    }

    if (manualQuestionId) {
      const chosen = sectionPool.find((q) => q.id === manualQuestionId);
      if (chosen) return buildPlayableQuestion(chosen);
    }

    const nextPending = sectionPool.find((q) => !secProgress.completedIds.includes(q.id));
    if (!nextPending) return null;
    return buildPlayableQuestion(nextPending);
  }, [
    config.practiceMode,
    config.reviewMistakes,
    config.sectionId,
    manualQuestionId,
    practiceCursor,
    practicePending,
    sectionPool,
    state.sections,
  ]);

  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<'move' | 'line'>('move');
  const [selectedMove, setSelectedMove] = useState('');
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [answerInput, setAnswerInput] = useState('');
  const [changeDir, setChangeDir] = useState<'increase' | 'decrease'>('increase');
  const [feedback, setFeedback] = useState<{ text: string; type: 'note' | 'ok' | 'bad' }>({
    text: 'Choose a move to apply.',
    type: 'note',
  });
  const [hintOpen, setHintOpen] = useState(false);
  const [hintSeen, setHintSeen] = useState(false);
  const [highlightTerms, setHighlightTerms] = useState(false);
  const [tries, setTries] = useState(0);
  const [hadError, setHadError] = useState(false);
  const [earned, setEarned] = useState(0);
  const [wrongMoves, setWrongMoves] = useState(0);
  const [wrongLines, setWrongLines] = useState(0);
  const [hintsCount, setHintsCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [wrongInputs, setWrongInputs] = useState<string[]>([]);
  const [questionDone, setQuestionDone] = useState(false);
  const [shakePanel, setShakePanel] = useState(false);
  const [moveOptions, setMoveOptions] = useState<string[]>([]);

  const startedAtRef = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement | null>(null);
  const advanceTimerRef = useRef<number | null>(null);

  // Reset question state whenever activeQuestion changes
  useEffect(() => {
    if (!activeQuestion) return;
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setStepIndex(0);
    setPhase('move');
    setSelectedMove('');
    setHistory([
      {
        line: activeQuestion.promptEq,
        note: activeQuestion.mode === 'expression' ? 'Starting expression' : 'Starting formula / equation',
        stepNumber: 0,
      },
    ]);
    setAnswerInput('');
    setChangeDir('increase');
    setFeedback({ text: 'Choose a move to apply.', type: 'note' });
    setHintOpen(false);
    setHintSeen(false);
    setTries(0);
    setHadError(false);
    setEarned(0);
    setWrongMoves(0);
    setWrongLines(0);
    setHintsCount(0);
    setSkippedCount(0);
    setWrongInputs([]);
    setQuestionDone(false);
    startedAtRef.current = Date.now();
  }, [activeQuestion?.id]);

  // Shuffle move options whenever stepIndex or question changes
  useEffect(() => {
    if (!activeQuestion || stepIndex >= activeQuestion.steps.length) return;
    const step = activeQuestion.steps[stepIndex];
    setMoveOptions(shuffleStrings([step.move, ...step.wrongMoves]));
  }, [activeQuestion?.id, stepIndex]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
    };
  }, []);

  function triggerShake() {
    setShakePanel(false);
    window.requestAnimationFrame(() => {
      setShakePanel(true);
      window.setTimeout(() => setShakePanel(false), 350);
    });
  }

  function noteMistake(kind: 'move' | 'line', text: string) {
    setHadError(true);
    setTries((t) => t + 1);
    if (kind === 'move') setWrongMoves((w) => w + 1);
    else setWrongLines((w) => w + 1);
    setWrongInputs((prev) =>
      prev.length < 12 ? [...prev, `Step ${stepIndex + 1} ${kind}: ${text.slice(0, 60)}`] : prev,
    );
    soundManager.play('wrong');
    triggerShake();
  }

  function completeCurrentQuestion(finalEarned: number, finalHadError: boolean, finalWrongMoves: number, finalWrongLines: number, finalHints: number, finalSkipped: number, finalWrongInputs: string[]) {
    if (!activeQuestion) return;
    setQuestionDone(true);

    const maxPts = activeQuestion.isSimilar ? 0 : activeQuestion.steps.length * 10;
    const pts = activeQuestion.isSimilar ? 0 : Math.max(0, Math.min(maxPts, finalEarned));

    const record: AttemptRecord = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      studentEmail: state.profile?.email || 'guest@school.edu.hk',
      studentName: state.profile?.name || 'Student',
      studentCls: state.profile?.cls || (chapter.id === 's1-ch10' ? '1A' : '2A'),
      studentClassNo: state.profile?.classNo || 1,
      sectionId: activeQuestion.sectionId,
      questionId: activeQuestion.baseId,
      questionLabel: activeQuestion.numberLabel,
      type: activeQuestion.isSimilar ? 'Similar' : 'Main',
      promptEq: activeQuestion.promptEq,
      points: pts,
      maxPoints: maxPts,
      wrongMoves: finalWrongMoves,
      wrongLines: finalWrongLines,
      hints: finalHints,
      skipped: finalSkipped,
      seconds: Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)),
      wrongInputs: finalWrongInputs,
    };

    const baseQ = getQuestionById(activeQuestion.baseId);
    const variantIdx =
      finalHadError && !activeQuestion.isSimilar && baseQ && baseQ.sims.length > 0
        ? Math.floor(Math.random() * baseQ.sims.length)
        : null;

    if (finalHadError && !activeQuestion.isSimilar && variantIdx !== null) {
      setFeedback({
        text: 'Solved! Because of the mistake, you will now practise one similar question.',
        type: 'note',
      });
    }

    advanceTimerRef.current = window.setTimeout(() => {
      if (config.practiceMode) {
        if (!activeQuestion.isSimilar) {
          setPracticeScore((s) => s + pts);
          if (variantIdx !== null) {
            setPracticePending({ forId: activeQuestion.baseId, variantIndex: variantIdx });
          } else {
            setPracticeCursor((c) => c + 1);
          }
        } else {
          setPracticePending(null);
          setPracticeExtraDone((e) => e + 1);
          setPracticeCursor((c) => c + 1);
        }
      } else {
        setManualQuestionId(null);
      }
      onRecordAttempt({
        record,
        isExtra: activeQuestion.isSimilar,
        hadError: finalHadError,
        baseQuestionId: activeQuestion.baseId,
        variantIndexForExtra: variantIdx,
        practiceMode: config.practiceMode,
      });
    }, finalHadError && !activeQuestion.isSimilar ? 1650 : 1050);
  }

  function handleChooseMove(moveText: string) {
    if (!activeQuestion || questionDone) return;
    const currentStep = activeQuestion.steps[stepIndex];
    if (moveText === currentStep.move) {
      setPhase('line');
      setSelectedMove(moveText);
      setFeedback({
        text:
          currentStep.op === 'mcq'
            ? 'Choose the correct option A, B, C, or D.'
            : currentStep.op === 'change'
              ? 'Select increases or decreases and enter the exact change.'
              : currentStep.kind === 'balance'
                ? `Now apply ${currentStep.symbol || 'this move'} to both sides and simplify.`
                : 'Now write the simplified expression / equation after this step.',
        type: 'note',
      });
      window.setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      noteMistake('move', moveText);
      setFeedback({
        text: 'Not quite. That move does not help simplify or isolate the target cleanly. Try again!',
        type: 'bad',
      });
    }
  }

  function handleCorrectStep(acceptedIndex: number, displayLine: string, note: string) {
    if (!activeQuestion) return;
    const skippedSteps = acceptedIndex - stepIndex;
    const firstTry = tries === 0 && !hintSeen;
    const stepPoints = (firstTry ? 10 : 5) * (skippedSteps + 1);
    const nextEarned = earned + stepPoints;
    const nextSkipped = skippedCount + skippedSteps;

    setEarned(nextEarned);
    setSkippedCount(nextSkipped);
    setHistory((prev) => [...prev, { line: displayLine, note, stepNumber: acceptedIndex + 1 }]);
    setStepIndex(acceptedIndex + 1);
    setPhase('move');
    setSelectedMove('');
    setAnswerInput('');
    setTries(0);
    setHintSeen(false);
    setHintOpen(false);
    setFeedback({
      text: skippedSteps
        ? `Correct! Accepted with ${skippedSteps} intermediate step${skippedSteps === 1 ? '' : 's'} skipped.`
        : `Correct! ${selectedMove}.`,
      type: 'ok',
    });
    soundManager.play('correct');

    if (acceptedIndex + 1 >= activeQuestion.steps.length) {
      completeCurrentQuestion(
        nextEarned,
        hadError,
        wrongMoves,
        wrongLines,
        hintsCount,
        nextSkipped,
        wrongInputs,
      );
    }
  }

  function handleMcqPick(option: McqOption) {
    if (!activeQuestion || questionDone) return;
    const currentStep = activeQuestion.steps[stepIndex];
    if (option.label === currentStep.correctMcq) {
      handleCorrectStep(stepIndex, currentStep.line, `Selected Option ${option.label} (${option.text})`);
    } else {
      noteMistake('line', `Option ${option.label}: ${option.text}`);
      setFeedback({
        text: `Option ${option.label} is not right. Substitute back or solve the equation carefully.`,
        type: 'bad',
      });
    }
  }

  function handleSubmitLine(e: React.FormEvent) {
    e.preventDefault();
    if (!activeQuestion || questionDone) return;
    const currentStep = activeQuestion.steps[stepIndex];

    // Special handler for Q134(b) & Q135(b) change-in-value questions
    if (activeQuestion.mode === 'change' && currentStep.changeAnswer) {
      const cleanedVal = answerInput.trim().replace(/^\+/, '');
      if (!cleanedVal) return;
      try {
        const stuAst = parseExpression(cleanedVal);
        const expAst = parseExpression(currentStep.changeAnswer.amount);
        if (changeDir === currentStep.changeAnswer.direction && areExpressionsEquivalent(stuAst, expAst)) {
          const label = `${changeDir === 'increase' ? 'Increases' : 'Decreases'} by ${currentStep.changeAnswer.amount}`;
          handleCorrectStep(stepIndex, label, label);
        } else {
          noteMistake('line', `${changeDir} by ${cleanedVal}`);
          setFeedback({
            text: 'Check both the direction (increases / decreases) and the coefficient of the changing variable.',
            type: 'bad',
          });
        }
      } catch {
        noteMistake('line', cleanedVal);
        setFeedback({ text: 'Enter a valid number or fraction such as 4/3 or 3/2.', type: 'bad' });
      }
      return;
    }

    const trimmed = answerInput.trim();
    if (!trimmed) return;

    const prevLine = history[history.length - 1]?.line || activeQuestion.promptEq;
    const result = checkStepAnswer({
      input: trimmed,
      mode: activeQuestion.mode,
      steps: activeQuestion.steps,
      fromIndex: stepIndex,
      maxAhead: 2,
      previousLine: prevLine,
      targetVar: activeQuestion.targetVar,
      givenValues: activeQuestion.givenValues,
    });

    if (result.ok && result.index !== undefined) {
      const acceptedStep = activeQuestion.steps[result.index];
      const skipped = result.index - stepIndex;
      const note = skipped
        ? `Skipped ${skipped} intermediate step${skipped === 1 ? '' : 's'}`
        : acceptedStep.kind === 'balance'
          ? `${acceptedStep.symbol || ''} on both sides`.trim()
          : acceptedStep.move;
      handleCorrectStep(result.index, acceptedStep.line, note);
    } else {
      noteMistake('line', trimmed);
      setFeedback({
        text: result.message || 'That line is not balanced or simplified yet.',
        type: 'bad',
      });
      inputRef.current?.focus();
    }
  }

  function handlePadKey(val: string, action?: 'backspace' | 'clear') {
    const input = inputRef.current;
    if (action === 'clear') {
      setAnswerInput('');
      window.setTimeout(() => input?.focus(), 0);
      return;
    }
    if (action === 'backspace') {
      if (input && input.selectionStart !== null && input.selectionEnd !== null) {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        if (start !== end) {
          const next = answerInput.slice(0, start) + answerInput.slice(end);
          setAnswerInput(next);
          window.setTimeout(() => {
            input.focus();
            input.setSelectionRange(start, start);
          }, 0);
        } else if (start > 0) {
          const next = answerInput.slice(0, start - 1) + answerInput.slice(end);
          setAnswerInput(next);
          window.setTimeout(() => {
            input.focus();
            input.setSelectionRange(start - 1, start - 1);
          }, 0);
        }
      } else {
        setAnswerInput((v) => v.slice(0, -1));
      }
      return;
    }

    if (input && input.selectionStart !== null && input.selectionEnd !== null) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const next = answerInput.slice(0, start) + val + answerInput.slice(end);
      setAnswerInput(next);
      window.setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + val.length, start + val.length);
      }, 0);
    } else {
      setAnswerInput((v) => v + val);
      window.setTimeout(() => input?.focus(), 0);
    }
  }

  function handleToggleHint() {
    const nextOpen = !hintOpen;
    setHintOpen(nextOpen);
    if (nextOpen && !hintSeen) {
      setHintSeen(true);
      setHintsCount((h) => h + 1);
    }
  }

  // Section completed state -> Trophy view
  if (!activeQuestion) {
    soundManager.play('complete');
    const boards = buildLeaderboards(state, state.profile?.cls, undefined, chapter.id);
    return (
      <div className="space-y-6 pb-10">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToHub}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--soft)] hover:text-[var(--ink)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {chapter.form} {chapter.chapterLabel}</span>
          </button>
        </div>

        <section className="p-8 border-2 border-[var(--ink)] rounded-[16px] bg-[var(--paper)] text-center max-w-2xl mx-auto">
          <svg
            className="w-36 h-36 mx-auto text-[#e3a400] trophy-rise"
            viewBox="0 0 220 220"
            role="img"
            aria-label="Trophy"
          >
            <path
              fill="currentColor"
              d="M61 28h98v45c0 35-20 58-42 64v23h34v20H69v-20h34v-23C81 131 61 108 61 73V28zm18 18v27c0 24 12 40 31 46 19-6 31-22 31-46V46H79z"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="13"
              strokeLinecap="round"
              d="M61 48H35v23c0 25 15 39 37 39M159 48h26v23c0 25-15 39-37 39"
            />
            <path
              fill="currentColor"
              d="m110 59 8 16 18 3-13 12 3 18-16-9-16 9 3-18-13-12 18-3z"
            />
          </svg>

          <h1 className="text-3xl font-extrabold tracking-tight mt-2">
            {config.reviewMistakes ? 'Mistakes Review Complete!' : `Section ${section.number} Complete!`}
          </h1>
          <p className="text-[var(--soft)] mt-1">
            {config.reviewMistakes
              ? `You reviewed all ${sectionPool.length} previously missed question${sectionPool.length === 1 ? '' : 's'}.`
              : config.practiceMode
                ? `You finished all ${sectionPool.length} questions in practice mode.`
                : `You completed Section ${section.number}: ${section.title}.`}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="p-3 border-2 border-[var(--ink)] rounded-[12px] bg-[var(--panel)]">
              <b className="block text-2xl font-extrabold tabular-nums">
                {config.practiceMode ? practiceScore : state.score}
              </b>
              <span className="text-xs text-[var(--soft)]">Points</span>
            </div>
            <div className="p-3 border-2 border-[var(--ink)] rounded-[12px] bg-[var(--panel)]">
              <b className="block text-2xl font-extrabold tabular-nums">
                {sectionPool.length}
              </b>
              <span className="text-xs text-[var(--soft)]">Questions</span>
            </div>
            <div className="p-3 border-2 border-[var(--ink)] rounded-[12px] bg-[var(--panel)]">
              <b className="block text-2xl font-extrabold tabular-nums">
                {config.practiceMode ? practiceExtraDone : state.extraDone}
              </b>
              <span className="text-xs text-[var(--soft)]">Similar Qs</span>
            </div>
            <div className="p-3 border-2 border-[var(--ink)] rounded-[12px] bg-[var(--panel)]">
              <b className="block text-2xl font-extrabold tabular-nums">
                {boards.myClassRank ? `#${boards.myClassRank}` : '–'}
              </b>
              <span className="text-xs text-[var(--soft)]">Class rank</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={onBackToHub} className="bq-btn px-5 py-2.5">
              Back to {chapter.form} {chapter.chapterLabel} Hub
            </button>
            <button type="button" onClick={onOpenLeaderboard} className="bq-btn-ghost px-5 py-2.5">
              Leaderboard
            </button>
          </div>
        </section>
      </div>
    );
  }

  const currentStep = activeQuestion.steps[stepIndex];
  const latestLine = history[history.length - 1]?.line || activeQuestion.promptEq;
  const completedSet = new Set(state.sections[config.sectionId].completedIds);
  const currentIdxInPool = sectionPool.findIndex((q) => q.id === activeQuestion.baseId);

  return (
    <div className="space-y-4 pb-10">
      {/* Section context bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-2 border-[var(--ink)] rounded-[12px] bg-[var(--panel)]">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToHub}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ink)] hover:underline underline-offset-4 shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{chapter.form} {chapter.chapterLabel}</span>
          </button>
          <span className="text-[var(--soft)]" aria-hidden="true">/</span>
          <div className="text-sm font-extrabold truncate">
            {config.reviewMistakes
              ? `Review Mistakes · ${sectionPool.length} question${sectionPool.length === 1 ? '' : 's'} with previous errors`
              : `Section ${section.number}: ${section.title}${config.levelFilter !== 'ALL' ? ` · ${config.levelFilter}` : ''}${config.practiceMode ? ' · Practice' : ''}`}
          </div>
        </div>

        {/* Question Jump Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-bold text-[var(--soft)] flex items-center gap-2">
            <span>Jump to:</span>
            <select
              aria-label="Jump to question"
              value={activeQuestion.baseId}
              onChange={(e) => {
                const targetId = e.target.value;
                if (config.practiceMode) {
                  const idx = sectionPool.findIndex((q) => q.id === targetId);
                  if (idx >= 0) setPracticeCursor(idx);
                } else {
                  setManualQuestionId(targetId);
                }
              }}
              disabled={activeQuestion.isSimilar}
              className="px-2.5 py-1 border-2 border-[var(--key-edge)] rounded-[8px] bg-[var(--paper)] text-[var(--ink)] text-xs font-bold"
            >
              {sectionPool.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.numberLabel} ({q.level}) {completedSet.has(q.id) ? '✓' : ''}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Compact section progress strip with left/right scroll buttons */}
      <div className="flex items-center gap-1.5">
        {sectionPool.length > 18 && (
          <button
            type="button"
            aria-label="Scroll questions left"
            onClick={() => {
              const el = document.getElementById('bq-progress-strip');
              el?.scrollBy({ left: -260, behavior: 'smooth' });
            }}
            className="h-7 w-7 shrink-0 rounded-[7px] border-2 border-[var(--line)] bg-[var(--paper)] text-[var(--soft)] hover:text-[var(--ink)] hover:border-[var(--ink)] grid place-items-center cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        <ol
          id="bq-progress-strip"
          className="flex gap-1.5 overflow-x-auto pb-0.5 flex-1 min-w-0 scroll-smooth"
          aria-label="Question progress"
        >
        {sectionPool.map((q, idx) => {
          const isDone = config.practiceMode ? idx < practiceCursor : completedSet.has(q.id);
          const isNow = !activeQuestion.isSimilar && q.id === activeQuestion.baseId;
          return (
            <li key={q.id} className="shrink-0">
              <button
                type="button"
                disabled={activeQuestion.isSimilar}
                onClick={() => {
                  if (config.practiceMode) {
                    setPracticeCursor(idx);
                  } else {
                    setManualQuestionId(q.id);
                  }
                }}
                title={`${q.numberLabel} · ${q.topicTag}`}
                ref={(btn) => {
                  if (isNow && btn) {
                    btn.scrollIntoView({ inline: 'center', block: 'nearest' });
                  }
                }}
                className={`min-w-[30px] h-7 px-1.5 rounded-[7px] border-2 text-xs font-extrabold tabular-nums cursor-pointer transition-colors ${
                  isNow
                    ? 'border-[var(--ink)] bg-[var(--yellow)] text-[var(--yellow-ink)]'
                    : isDone
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                      : 'border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--panel)]'
                }`}
              >
                {isDone && !isNow ? '✓' : q.numberLabel.replace('Q', '')}
              </button>
            </li>
          );
        })}
        {activeQuestion.isSimilar && (
          <li className="shrink-0 px-2 h-7 rounded-[7px] border-2 border-[var(--ink)] bg-[var(--yellow)] text-[var(--yellow-ink)] text-xs font-extrabold grid place-items-center">
            + Similar
          </li>
        )}
        </ol>
        {sectionPool.length > 18 && (
          <button
            type="button"
            aria-label="Scroll questions right"
            onClick={() => {
              const el = document.getElementById('bq-progress-strip');
              el?.scrollBy({ left: 260, behavior: 'smooth' });
            }}
            className="h-7 w-7 shrink-0 rounded-[7px] border-2 border-[var(--line)] bg-[var(--paper)] text-[var(--soft)] hover:text-[var(--ink)] hover:border-[var(--ink)] grid place-items-center cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main 2-column Play Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Notebook Working Sheet */}
        <article
          className="lg:col-span-7 notebook-sheet p-5 sm:p-6 pl-[78px] sm:pl-[88px] min-h-[430px]"
          aria-label="Working area"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-extrabold tracking-tight">
              {activeQuestion.isSimilar
                ? `Similar Question · ${activeQuestion.numberLabel.replace(/\s*·\s*Similar$/i, '')}`
                : `${activeQuestion.numberLabel} (${currentIdxInPool + 1} of ${sectionPool.length})`}
            </h2>
            <span className="text-xs sm:text-sm font-semibold text-[var(--soft)]">
              {config.reviewMistakes
                ? `Sec ${getChapterForSection(activeQuestion.sectionId).sections.find((s) => s.id === activeQuestion.sectionId)?.number ?? ''} · `
                : ''}
              {activeQuestion.level} · {activeQuestion.topicTag}
              {activeQuestion.sourceTag ? ` · ${activeQuestion.sourceTag}` : ''}
            </span>
          </div>

          <p className="text-sm text-[var(--soft)] mt-1 mb-4">
            {activeQuestion.isSimilar
              ? 'You made a mistake in the previous question, so solve this similar one to lock in the method.'
              : chapter.id === 's1-ch10'
                ? 'Simplify step by step. Expand brackets completely, combine all like terms and indices, and check if ascending or descending order is requested.'
                : activeQuestion.mode === 'expression'
                  ? 'Simplify step by step. Factorize before cancelling, and use a common denominator when adding or subtracting.'
                  : activeQuestion.mode === 'substitution'
                    ? 'Substitute the given numbers in brackets first, then simplify and solve.'
                    : activeQuestion.mode === 'change'
                      ? 'Examine how changing one variable affects the subject in the formula.'
                      : 'Keep both sides balanced. Multiply out denominators, group terms with the subject, then factorize and divide.'}
          </p>
          {!questionDone && currentStep?.orderRule && (
            <div className="mb-3 px-3 py-1.5 border-2 border-[var(--ink)] rounded-[9px] bg-[var(--yellow)] text-[var(--yellow-ink)] text-xs font-extrabold inline-block">
              Order required: {currentStep.orderRule.direction === 'asc' ? 'Ascending' : 'Descending'} powers of{' '}
              {currentStep.orderRule.variable === 'any' ? (
                'the variable'
              ) : (
                <span className="font-math italic">{currentStep.orderRule.variable}</span>
              )}
            </div>
          )}

          {/* Question Prompt Box */}
          <div className="pb-4 border-b border-dashed border-[var(--line)]">
            <div className="text-base font-semibold">{activeQuestion.promptText}</div>
            <div className="mt-2 text-2xl sm:text-[1.75rem] leading-relaxed overflow-x-auto py-1">
              <MathExpr expr={activeQuestion.promptEq} highlight={highlightTerms} />
            </div>
            {activeQuestion.mode !== 'change' && (
              <div className="flex flex-wrap items-center gap-2.5 mt-2.5">
                <button
                  type="button"
                  onClick={() => setHighlightTerms((h) => !h)}
                  className="px-2.5 py-1 text-xs font-bold border border-[var(--line)] rounded-[8px] bg-[var(--panel)] hover:border-[var(--ink)] cursor-pointer"
                >
                  {highlightTerms ? 'Clear highlights' : 'Highlight all terms'}
                </button>
                <span className="text-xs text-[var(--soft)]" aria-live="polite">
                  {highlightTerms
                    ? 'Variable terms are yellow; constants are blue.'
                    : 'No terms highlighted.'}
                </span>
              </div>
            )}
          </div>

          {/* Step-by-Step Working Rows */}
          <div className="divide-y divide-dashed divide-[var(--line)]" aria-label="Solution steps">
            {history.map((entry, idx) => {
              const isStart = idx === 0;
              const isLatest = idx === history.length - 1;
              const label = isStart ? 'Start' : `Step ${entry.stepNumber}`;
              return (
                <div
                  key={`${idx}-${entry.stepNumber}`}
                  className={`relative py-3 min-h-[3.5rem] ${
                    isLatest && !questionDone ? 'border-b-2 border-solid border-[var(--ink)]' : ''
                  }`}
                >
                  <span
                    className={`absolute -left-[74px] sm:-left-[82px] top-3.5 w-[56px] sm:w-[62px] text-right text-xs font-extrabold ${
                      isLatest && !questionDone
                        ? 'inline-block px-1.5 py-0.5 rounded-[6px] bg-[var(--yellow)] text-[var(--yellow-ink)] text-center'
                        : 'text-[var(--green)]'
                    }`}
                  >
                    {label}
                  </span>
                  <div className="text-xl sm:text-2xl overflow-x-auto py-1.5 leading-relaxed">
                    {activeQuestion.mode === 'change' && idx > 0 ? (
                      <span className="font-ui font-bold text-lg">{entry.line}</span>
                    ) : (
                      <MathExpr expr={entry.line} highlight={highlightTerms} />
                    )}
                  </div>
                  {entry.note && (
                    <div className="text-xs text-[var(--soft)] mt-0.5">{entry.note}</div>
                  )}
                </div>
              );
            })}

            {!questionDone && (
              <div className="relative py-3 min-h-[3.5rem]">
                <span className="absolute -left-[74px] sm:-left-[82px] top-3.5 w-[56px] sm:w-[62px] text-center px-1.5 py-0.5 rounded-[6px] bg-[var(--yellow)] text-[var(--yellow-ink)] text-xs font-extrabold">
                  Step {stepIndex + 1}
                </span>
                <div className="text-xl text-[var(--soft)] tracking-[0.2em] font-math">……</div>
              </div>
            )}
          </div>
        </article>

        {/* Right: Sticky Control Panel & Math Keypad */}
        <aside className="lg:col-span-5 lg:sticky lg:top-4 space-y-3">
          {/* Current Line Display */}
          <div className="p-3.5 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--panel)]">
            <div className="text-xs font-semibold text-[var(--soft)]">
              {questionDone
                ? 'Solved!'
                : phase === 'line'
                  ? 'Now write the new line'
                  : `Step ${stepIndex + 1} of ${activeQuestion.steps.length} · choose a move`}
            </div>
            <div className="mt-1 min-h-[3.1rem] text-xl sm:text-2xl overflow-x-auto whitespace-nowrap py-1.5 leading-relaxed">
              {activeQuestion.mode === 'change' && questionDone ? (
                <span className="font-ui font-bold text-lg">{latestLine}</span>
              ) : (
                <MathExpr expr={latestLine} highlight={highlightTerms} />
              )}
            </div>
          </div>

          {/* Feedback line */}
          <p
            aria-live="polite"
            className={`text-sm font-bold min-h-[1.5rem] ${
              feedback.type === 'ok'
                ? 'text-[var(--green)]'
                : feedback.type === 'bad'
                  ? 'text-[var(--red)]'
                  : 'text-[var(--soft)]'
            }`}
          >
            {feedback.text}
          </p>

          {/* Interactive Controls */}
          <div className={shakePanel ? 'shake' : ''}>
            {questionDone ? (
              <div className="p-4 border-2 border-[var(--green)] rounded-[12px] bg-[var(--paper)]">
                <b className="block text-lg text-[var(--green)]">
                  {activeQuestion.mode === 'expression' ? 'Simplified and complete!' : 'Balanced and solved!'}
                </b>
                <span className="text-sm text-[var(--soft)]">Loading next question…</span>
              </div>
            ) : phase === 'move' ? (
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[var(--soft)]">
                  Choose the move you will apply next:
                </p>
                {moveOptions.map((moveText, idx) => (
                  <button
                    key={`${stepIndex}-${idx}-${moveText}`}
                    type="button"
                    onClick={() => handleChooseMove(moveText)}
                    className="bq-choice w-full min-h-[54px] px-3.5 py-2.5 text-left text-sm sm:text-base font-bold flex items-center gap-3"
                  >
                    <span
                      aria-hidden="true"
                      className="w-7 h-7 rounded-[6px] border border-[var(--line)] text-[var(--soft)] text-xs font-extrabold grid place-items-center shrink-0"
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{moveText}</span>
                  </button>
                ))}
              </div>
            ) : currentStep.op === 'mcq' && currentStep.mcqOptions ? (
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[var(--soft)]">
                  Select the correct option:
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {currentStep.mcqOptions.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleMcqPick(opt)}
                      className="bq-choice min-h-[54px] px-3.5 py-2.5 text-left font-bold flex items-center gap-2.5"
                    >
                      <span className="w-7 h-7 rounded-[6px] border border-[var(--line)] text-[var(--soft)] text-xs font-extrabold grid place-items-center shrink-0">
                        {opt.label}
                      </span>
                      <span className="font-math text-lg">
                        <MathExpr expr={opt.text} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Move reminder box */}
                {currentStep.kind === 'balance' && currentStep.symbol ? (
                  <div className="grid grid-cols-2 gap-2">
                    <p className="col-span-2 text-xs text-[var(--soft)]">
                      Do the same to both sides: <b className="text-[var(--ink)]">{selectedMove}</b>
                    </p>
                    <div className="p-2 border border-[var(--line)] rounded-[9px] bg-[var(--panel)]">
                      <small className="block text-[11px] text-[var(--soft)]">Left side</small>
                      <b className="font-math text-base">{currentStep.symbol}</b>
                    </div>
                    <div className="p-2 border border-[var(--line)] rounded-[9px] bg-[var(--panel)]">
                      <small className="block text-[11px] text-[var(--soft)]">Right side</small>
                      <b className="font-math text-base">{currentStep.symbol}</b>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 border border-[var(--line)] rounded-[9px] bg-[var(--panel)]">
                    <small className="block text-[11px] text-[var(--soft)]">Selected step</small>
                    <b className="text-sm">{selectedMove}</b>
                  </div>
                )}

                <form onSubmit={handleSubmitLine} className="space-y-2.5">
                  {activeQuestion.mode === 'change' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setChangeDir('increase')}
                        className={`py-2 px-3 rounded-[9px] border-2 text-sm font-bold cursor-pointer ${
                          changeDir === 'increase'
                            ? 'border-[var(--ink)] bg-[var(--yellow)] text-[var(--yellow-ink)]'
                            : 'border-[var(--key-edge)] bg-[var(--key)]'
                        }`}
                      >
                        Increases by
                      </button>
                      <button
                        type="button"
                        onClick={() => setChangeDir('decrease')}
                        className={`py-2 px-3 rounded-[9px] border-2 text-sm font-bold cursor-pointer ${
                          changeDir === 'decrease'
                            ? 'border-[var(--ink)] bg-[var(--yellow)] text-[var(--yellow-ink)]'
                            : 'border-[var(--key-edge)] bg-[var(--key)]'
                        }`}
                      >
                        Decreases by
                      </button>
                    </div>
                  )}

                  <label className="block text-sm font-bold">
                    {activeQuestion.mode === 'change'
                      ? 'Amount of change (number or fraction)'
                      : activeQuestion.mode === 'expression'
                        ? 'Type the new expression'
                        : 'Type the new equation'}
                    <input
                      ref={inputRef}
                      id="equationAnswer"
                      type="text"
                      value={answerInput}
                      onChange={(e) => setAnswerInput(e.target.value)}
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      placeholder={
                        activeQuestion.mode === 'change'
                          ? 'e.g. 4/3'
                          : activeQuestion.mode === 'expression'
                            ? chapter.id === 's1-ch10'
                              ? 'e.g. 4x^5 or 12 + 8e + e^2'
                              : 'e.g. 1/(7x) or a^3/2'
                            : 'e.g. x = (6 - 7y)/5'
                      }
                      className="mt-1 w-full min-h-[46px] px-3 py-2 border-2 border-[var(--key-edge)] rounded-[10px] bg-[var(--paper)] text-[var(--ink)] font-math text-xl"
                      required
                    />
                  </label>

                  {/* Built-in Math Keypad */}
                  <div className="grid grid-cols-6 gap-1.5" role="group" aria-label="Math keypad">
                    {['7', '8', '9', '−', '(', ')'].map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => handlePadKey(k)}
                        className="bq-padkey h-10 text-base font-bold font-math"
                      >
                        {k}
                      </button>
                    ))}
                    {['4', '5', '6', '+', '÷', '×'].map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => handlePadKey(k)}
                        className="bq-padkey h-10 text-base font-bold font-math"
                      >
                        {k}
                      </button>
                    ))}
                    {['1', '2', '3', '/', '=', '^'].map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => handlePadKey(k)}
                        className="bq-padkey h-10 text-base font-bold font-math"
                      >
                        {k}
                      </button>
                    ))}
                    <button type="button" onClick={() => handlePadKey('0')} className="bq-padkey h-10 text-base font-bold font-math">0</button>
                    <button type="button" onClick={() => handlePadKey('.')} className="bq-padkey h-10 text-base font-bold font-math">.</button>
                    <button type="button" onClick={() => handlePadKey('[')} className="bq-padkey h-10 text-base font-bold font-math">[</button>
                    <button type="button" onClick={() => handlePadKey(']')} className="bq-padkey h-10 text-base font-bold font-math">]</button>
                    <button
                      type="button"
                      onClick={() => handlePadKey('', 'backspace')}
                      aria-label="Backspace"
                      className="bq-padkey h-10 text-xs font-bold text-[var(--soft)]"
                    >
                      ⌫
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePadKey('', 'clear')}
                      className="bq-padkey h-10 text-xs font-bold text-[var(--soft)]"
                    >
                      Clear
                    </button>

                    {/* Dynamic variable keys for the active question */}
                    {activeQuestion.variables.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => handlePadKey(v)}
                        aria-label={`Variable ${v}`}
                        className="bq-padkey h-10 font-math italic font-bold text-lg !bg-[var(--yellow)] !text-[var(--yellow-ink)]"
                      >
                        {v}
                      </button>
                    ))}
                  </div>

                  <button type="submit" className="bq-btn w-full py-2.5 text-base">
                    Check my line
                  </button>
                  <p className="text-xs text-[var(--soft)]">
                    Tip: Put brackets around compound denominators like <span className="font-math">1/(7x)</span> or <span className="font-math">(7 - x)/2</span>. Use <span className="font-math">^</span> for powers like <span className="font-math">a^3</span>.
                  </p>
                </form>
              </div>
            )}
          </div>

          {/* Hint Toggle & Box */}
          {!questionDone && (
            <div>
              {hintOpen && currentStep && (
                <div className="my-2 p-3 border-2 border-[var(--yellow-ink)] rounded-[10px] bg-[var(--yellow)] text-[var(--yellow-ink)] text-sm">
                  <b className="block text-xs uppercase tracking-wide mb-0.5">
                    {currentStep.kind === 'balance' ? 'Balance reminder' : 'Algebra reminder'}
                  </b>
                  <p>{currentStep.hint}</p>
                </div>
              )}
              <button
                type="button"
                onClick={handleToggleHint}
                className="text-sm font-semibold text-[var(--soft)] underline underline-offset-3 hover:text-[var(--ink)] cursor-pointer"
              >
                {hintOpen ? 'Hide hint' : 'Show a hint'}
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
