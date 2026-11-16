import { Volume2, VolumeX } from 'lucide-react';

export type ActiveView = 'hub' | 'play' | 'leaderboard' | 'teacher';

interface TopBarProps {
  view: ActiveView;
  score: number;
  hasProfile: boolean;
  soundOn: boolean;
  darkMode: boolean;
  onNavigate: (view: ActiveView) => void;
  onToggleSound: () => void;
  onToggleDark: () => void;
}

export function TopBar({
  view,
  score,
  hasProfile,
  soundOn,
  darkMode,
  onNavigate,
  onToggleSound,
  onToggleDark,
}: TopBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-y-2.5 gap-x-4 border-b-2 border-[var(--ink)] pb-3 mb-5">
      {/* Zone 1: Brand wordmark */}
      <button
        type="button"
        onClick={() => onNavigate('hub')}
        className="order-1 text-left text-xl sm:text-2xl font-extrabold tracking-tight whitespace-nowrap shrink-0 cursor-pointer hover:opacity-85 transition-opacity"
      >
        Balance <span className="font-math italic font-semibold">Quest</span>
      </button>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav
        aria-label="Primary navigation"
        className="order-3 sm:order-2 w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-center gap-x-3 gap-y-1.5 sm:gap-6 text-xs sm:text-sm font-semibold text-[var(--soft)]"
      >
        <button
          type="button"
          onClick={() => onNavigate('hub')}
          className={`whitespace-nowrap shrink-0 cursor-pointer hover:text-[var(--ink)] transition-colors ${
            view === 'hub' ? 'text-[var(--ink)] underline underline-offset-4 decoration-2' : ''
          }`}
        >
          S.2 Chapter 3
        </button>
        {hasProfile && (
          <button
            type="button"
            onClick={() => onNavigate('leaderboard')}
            className={`whitespace-nowrap shrink-0 cursor-pointer hover:text-[var(--ink)] transition-colors ${
              view === 'leaderboard' ? 'text-[var(--ink)] underline underline-offset-4 decoration-2' : ''
            }`}
          >
            Leaderboard
          </button>
        )}
        <button
          type="button"
          onClick={() => onNavigate('teacher')}
          className={`whitespace-nowrap shrink-0 cursor-pointer hover:text-[var(--ink)] transition-colors ${
            view === 'teacher' ? 'text-[var(--ink)] underline underline-offset-4 decoration-2' : ''
          }`}
        >
          Teacher View
        </button>
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundOn}
          className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer hover:text-[var(--ink)] transition-colors"
        >
          {soundOn ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />}
          <span>{soundOn ? 'Sound On' : 'Sound Off'}</span>
        </button>
        <button
          type="button"
          onClick={onToggleDark}
          aria-pressed={darkMode}
          className="whitespace-nowrap shrink-0 cursor-pointer hover:text-[var(--ink)] transition-colors"
        >
          {darkMode ? 'Light Paper' : 'Night Ink'}
        </button>
      </nav>

      {/* Zone 3: Score / Status */}
      <div className="order-2 sm:order-3 flex items-center gap-3 shrink-0">
        <div
          className="flex items-baseline gap-2 px-3 sm:px-3.5 py-0.5 sm:py-1 border-2 border-[var(--ink)] rounded-[10px] bg-[var(--paper)]"
          aria-label={`Total score ${score} points`}
        >
          <span className="text-xs font-semibold text-[var(--soft)]">Score</span>
          <b className="text-base sm:text-xl font-extrabold tabular-nums min-w-[2.5ch] text-right">{score}</b>
        </div>
      </div>
    </header>
  );
}
