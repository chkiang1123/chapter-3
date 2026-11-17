import { ArrowLeft } from 'lucide-react';
import { ALL_QUESTIONS } from '../data/curriculum';
import {
  buildLeaderboards,
  type AppStorageState,
  type CloudBoardInput,
  type LeaderboardEntry,
} from '../state/storage';

interface LeaderboardViewProps {
  state: AppStorageState;
  cloudRows?: CloudBoardInput[];
  onBack: () => void;
}

function BoardTable({
  rows,
  title,
  subtitle,
}: {
  rows: LeaderboardEntry[];
  title: string;
  subtitle: string;
}) {
  return (
    <section className="p-5 sm:p-6 border-2 border-[var(--ink)] rounded-[14px] bg-[var(--paper)]">
      <h2 className="text-lg font-extrabold">{title}</h2>
      <p className="text-sm text-[var(--soft)] mt-0.5">{subtitle}</p>
      {!rows.length ? (
        <p className="py-6 text-sm text-[var(--soft)]">No scores yet. Be the first!</p>
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
                      {r.done} / {ALL_QUESTIONS.length}
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

export function LeaderboardView({ state, cloudRows, onBack }: LeaderboardViewProps) {
  const cls = state.profile?.cls || '2A';
  const { classTop, formTop, myClassRank, myFormRank } = buildLeaderboards(state, cls, cloudRows);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Leaderboard</h1>
          <p className="text-sm text-[var(--soft)]">
            S.2 Chapter 3 · Algebraic Fractions and Formulas
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <BoardTable
          rows={classTop}
          title={`Class ${cls} · Top 10`}
          subtitle="Ranked by points, then by questions completed."
        />
        <BoardTable
          rows={formTop}
          title="Form S.2 · Top 20"
          subtitle="All S.2 classes combined."
        />
      </div>

      {state.profile && (
        <p className="text-sm text-[var(--soft)] tabular-nums">
          Your rank: <b className="text-[var(--ink)]">#{myClassRank ?? '–'}</b> in {cls} ·{' '}
          <b className="text-[var(--ink)]">#{myFormRank ?? '–'}</b> in S.2 ·{' '}
          <b className="text-[var(--ink)]">{state.score}</b> points
        </p>
      )}
    </div>
  );
}
