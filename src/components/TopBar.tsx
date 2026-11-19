import type { User } from 'firebase/auth';
import { LogIn, LogOut, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import type { ChapterId } from '../data/types';

export type ActiveView = 'hub' | 'play' | 'leaderboard' | 'teacher';

interface TopBarProps {
  view: ActiveView;
  activeChapterId: ChapterId;
  score: number;
  hasProfile: boolean;
  soundOn: boolean;
  darkMode: boolean;
  authUser: User | null;
  isTeacher: boolean;
  authBusy: boolean;
  onSelectChapter: (chapterId: ChapterId) => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onNavigate: (view: ActiveView) => void;
  onToggleSound: () => void;
  onToggleDark: () => void;
}

export function TopBar({
  view,
  activeChapterId,
  score,
  hasProfile,
  soundOn,
  darkMode,
  authUser,
  isTeacher,
  authBusy,
  onSelectChapter,
  onSignIn,
  onSignOut,
  onNavigate,
  onToggleSound,
  onToggleDark,
}: TopBarProps) {
  const showTeacherNav = !authUser || isTeacher;

  return (
    <header className="flex flex-wrap items-center justify-between gap-y-2.5 gap-x-4 border-b-2 border-[var(--ink)] pb-3 mb-5">
      {/* Zone 1: Brand wordmark + school attribution */}
      <button
        type="button"
        onClick={() => onNavigate('hub')}
        className="order-1 text-left cursor-pointer hover:opacity-85 transition-opacity shrink-0"
      >
        <div className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none whitespace-nowrap">
          Balance <span className="font-math italic font-semibold">Quest</span>
        </div>
        <div className="text-[11px] font-bold text-[var(--soft)] mt-0.5 whitespace-nowrap">
          S. K. H. Bishop Baker Secondary School
        </div>
      </button>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav
        aria-label="Primary navigation"
        className="order-3 sm:order-2 w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-center gap-x-3 gap-y-1.5 sm:gap-5 text-xs sm:text-sm font-semibold text-[var(--soft)]"
      >
        <button
          type="button"
          onClick={() => {
            onSelectChapter('s1-ch10');
            onNavigate('hub');
          }}
          className={`whitespace-nowrap shrink-0 cursor-pointer hover:text-[var(--ink)] transition-colors ${
            view === 'hub' && activeChapterId === 's1-ch10'
              ? 'text-[var(--ink)] underline underline-offset-4 decoration-2'
              : ''
          }`}
        >
          S.1 Ch.10
        </button>
        <button
          type="button"
          onClick={() => {
            onSelectChapter('s2-ch3');
            onNavigate('hub');
          }}
          className={`whitespace-nowrap shrink-0 cursor-pointer hover:text-[var(--ink)] transition-colors ${
            view === 'hub' && activeChapterId === 's2-ch3'
              ? 'text-[var(--ink)] underline underline-offset-4 decoration-2'
              : ''
          }`}
        >
          S.2 Ch.3
        </button>
        {(hasProfile || Boolean(authUser)) && (
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
        {showTeacherNav && (
          <button
            type="button"
            onClick={() => onNavigate('teacher')}
            className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer hover:text-[var(--ink)] transition-colors ${
              view === 'teacher' ? 'text-[var(--ink)] underline underline-offset-4 decoration-2' : ''
            }`}
          >
            {isTeacher && <ShieldCheck className="w-3.5 h-3.5 text-[var(--green)]" aria-hidden="true" />}
            <span>Teacher View</span>
          </button>
        )}
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundOn}
          className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer hover:text-[var(--ink)] transition-colors"
        >
          {soundOn ? (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
          )}
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
        {!authUser ? (
          <button
            type="button"
            disabled={authBusy}
            onClick={onSignIn}
            className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer text-[var(--ink)] hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{authBusy ? 'Signing in...' : 'Google Sign In'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onSignOut}
            title={`Signed in as ${authUser.email || 'Google user'} (click to log out)`}
            className="inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer text-[var(--ink)] hover:opacity-80 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Log out</span>
          </button>
        )}
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
