import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getChapterById, getQuestionsForChapter } from '../data/curriculum';
import type { ChapterId } from '../data/types';
import {
  S1_CLASSES,
  S2_CLASSES,
  buildLeaderboards,
  getChapterProgress,
  type AppStorageState,
  type CloudBoardInput,
  type LeaderboardEntry,
} from '../state/storage';

interface LeaderboardViewProps {
  state: AppStorageState;
  activeChapterId: ChapterId;
  cloudRows?: CloudBoardInput[];
  onBack: () => void;
}

function BoardTable({
  rows,
  title,
  subtitle,
  totalChapterQuestions,
}: {
  rows: LeaderboardEntry[];
  title: string;
  subtitle: string;
  totalChapterQuestions: number;
}) {
  return (
    <section className="p-5 sm:p-6 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)]">
      <h2 className="text-lg font-extrabold">{title}</h2>
      <p className="text-sm text-[var(--soft)] mt-0.5">{subtitle}</p>
      {!rows.length ? (
        <p className="py-6 text-sm text-[var(--soft)]">No scores yet in this category. Be the first!</p>
      ) : (
        <div className="overflow-x-auto mt-3">
          <table className="w-full border-collapse tabular-nums text-sm">
            <thead>
              <tr className="border-b-2 border-[var(--ink)] text-left text-xs uppercase tracking-wider text-[var(--soft)]">
                <th className="py-2 px-2">#</th>
                <th className="py-2 px-2">Name</th>
                <th className="py-2 px-2">Class</th>
                <th className="py-2 px-2 text-right">Done</th>
                <th className="py-2 px-2 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const medalClass =
                  r.rank === 1
                    ? 'border-[#e3a400] bg-[#ffe9a8] text-[#6a4a00]'
                    : r.rank === 2
                      ? 'border-[#9aa7bf] bg-[#e7ecf5] text-[#2d3a55]'
                      : r.rank === 3
                        ? 'border-[#c47b3a] bg-[#f8dcc2] text-[#5a320d]'
                        : 'border-[var(--line)]';
                return (
                  <tr
                    key={`${r.cls}-${r.classNo}-${r.name}`}
                    className={`border-b border-dashed border-[var(--line)] ${
                      r.isMe ? 'bg-[var(--yellow)] text-[var(--yellow-ink)] font-extrabold' : ''
                    }`}
                  >
                    <td className="py-2 px-2">
                      <span
                        className={`inline-grid w-7 h-7 place-items-center border-2 rounded-full text-xs font-extrabold ${medalClass}`}
                      >
                        {r.rank}
                      </span>
                    </td>
                    <td className="py-2 px-2">{r.name}</td>
                    <td className="py-2 px-2">
                      {r.cls} ({r.classNo})
                    </td>
                    <td className="py-2 px-2 text-right">
                      {r.done} / {totalChapterQuestions}
                    </td>
                    <td className="py-2 px-2 text-right font-extrabold">{r.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function LeaderboardView({
  state,
  activeChapterId,
  cloudRows,
  onBack,
}: LeaderboardViewProps) {
  const [boardChapter, setBoardChapter] = useState<ChapterId>(activeChapterId);
  const formClasses = boardChapter === 's1-ch10' ? S1_CLASSES : S2_CLASSES;
  const defaultCls =
    state.profile?.cls && (formClasses as readonly string[]).includes(state.profile.cls)
      ? state.profile.cls
      : formClasses[0];
  const [selectedCls, setSelectedCls] = useState<string>(defaultCls);

  const effectiveCls = (formClasses as readonly string[]).includes(selectedCls)
    ? selectedCls
    : formClasses[0];

  const chapter = getChapterById(boardChapter);
  const totalChapterQuestions = getQuestionsForChapter(boardChapter).length;
  const { classTop, formTop, myClassRank, myFormRank } = buildLeaderboards(
    state,
    effectiveCls,
    cloudRows,
    boardChapter,
  );
  const myChapterProgress = getChapterProgress(state, boardChapter);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Leaderboard</h1>
          <p className="text-sm text-[var(--soft)]">
            {chapter.form} {chapter.chapterLabel} · {chapter.title}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="bq-btn-ghost inline-flex items-center gap-1.5 px-4 py-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Chapter Category Switcher + Class Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Leaderboard chapter category">
          {(
            [
              { id: 's1-ch10', label: 'S.1 Ch.10 · Polynomials' },
              { id: 's2-ch3', label: 'S.2 Ch.3 · Algebraic Fractions' },
            ] as Array<{ id: ChapterId; label: string }>
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={boardChapter === item.id}
              onClick={() => {
                setBoardChapter(item.id);
                const nextFormClasses = item.id === 's1-ch10' ? S1_CLASSES : S2_CLASSES;
                setSelectedCls(
                  state.profile?.cls && (nextFormClasses as readonly string[]).includes(state.profile.cls)
                    ? state.profile.cls
                    : nextFormClasses[0],
                );
              }}
              className={`px-4 py-2 border-2 border-[var(--ink)] rounded-[10px] text-sm font-extrabold cursor-pointer transition-colors ${
                boardChapter === item.id
                  ? 'bg-[var(--yellow)] text-[var(--yellow-ink)]'
                  : 'bg-[var(--paper)] hover:bg-[var(--panel)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="text-sm font-bold flex items-center gap-2">
          <span>Class</span>
          <select
            value={effectiveCls}
            onChange={(e) => setSelectedCls(e.target.value)}
            className="min-h-[38px] px-3 border-2 border-[var(--key-edge)] rounded-[9px] bg-[var(--paper)] font-bold"
          >
            {formClasses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <BoardTable
          rows={classTop}
          title={`Class ${effectiveCls} · Top 10`}
          subtitle="Ranked by chapter points, then by questions completed."
          totalChapterQuestions={totalChapterQuestions}
        />
        <BoardTable
          rows={formTop}
          title={`Form ${chapter.form} · Top 20`}
          subtitle={`All ${chapter.form} classes combined (${chapter.chapterLabel}).`}
          totalChapterQuestions={totalChapterQuestions}
        />
      </div>

      {state.profile && (
        <p className="text-sm text-[var(--soft)] tabular-nums">
          Your {chapter.form} rank: <b className="text-[var(--ink)]">#{myClassRank ?? '–'}</b> in {effectiveCls} ·{' '}
          <b className="text-[var(--ink)]">#{myFormRank ?? '–'}</b> in {chapter.form} ·{' '}
          <b className="text-[var(--ink)]">{myChapterProgress.score}</b> points in {chapter.chapterLabel}
        </p>
      )}
    </div>
  );
}
