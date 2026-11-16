import { useEffect, useState } from 'react';
import { ChapterHubView } from './components/ChapterHubView';
import { LeaderboardView } from './components/LeaderboardView';
import { PlayView } from './components/PlayView';
import { TeacherView } from './components/TeacherView';
import { TopBar, type ActiveView } from './components/TopBar';
import {
  loadAppState,
  resetStudentProgress,
  saveAppState,
  type AppStorageState,
  type AttemptRecord,
  type PlaySessionConfig,
  type StudentProfile,
} from './state/storage';
import { soundManager } from './utils/sound';

export default function App() {
  const [state, setState] = useState<AppStorageState>(() => loadAppState());
  const [view, setView] = useState<ActiveView>('hub');
  const [previousView, setPreviousView] = useState<ActiveView>('hub');
  const [playConfig, setPlayConfig] = useState<PlaySessionConfig>({
    sectionId: 'sec1',
    levelFilter: 'ALL',
    practiceMode: false,
  });
  const [soundOn, setSoundOn] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Support ?autostart=1 for automated journeys & quick preview
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setState((prev) => {
        if (prev.profile) return prev;
        const next: AppStorageState = {
          ...prev,
          profile: {
            name: 'Chan Tai Man',
            cls: '2A',
            classNo: 1,
            email: '2a.1.chan.tai.man@school.edu.hk',
          },
        };
        saveAppState(next);
        return next;
      });
      setPlayConfig({
        sectionId: 'sec1',
        levelFilter: 'ALL',
        practiceMode: false,
      });
      setView('play');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  function navigate(target: ActiveView) {
    if (target === 'leaderboard' || target === 'teacher') {
      setPreviousView(view === 'leaderboard' || view === 'teacher' ? 'hub' : view);
    }
    setView(target);
    window.scrollTo(0, 0);
  }

  function handleSaveProfile(profile: StudentProfile) {
    setState((prev) => {
      const next: AppStorageState = {
        ...prev,
        profile,
        lastActive: new Date().toISOString(),
      };
      saveAppState(next);
      return next;
    });
  }

  function handleStartPlay(config: PlaySessionConfig) {
    setPlayConfig(config);
    setView('play');
    window.scrollTo(0, 0);
  }

  function handleRecordAttempt(payload: {
    record: AttemptRecord;
    isExtra: boolean;
    hadError: boolean;
    baseQuestionId: string;
    variantIndexForExtra: number | null;
    practiceMode: boolean;
  }) {
    if (payload.practiceMode) return;

    setState((prev) => {
      const secId = payload.record.sectionId;
      const curSec = prev.sections[secId];
      const nextCompleted = payload.isExtra
        ? curSec.completedIds
        : curSec.completedIds.includes(payload.baseQuestionId)
          ? curSec.completedIds
          : [...curSec.completedIds, payload.baseQuestionId];

      const nextPending = payload.isExtra
        ? null
        : payload.hadError && payload.variantIndexForExtra !== null
          ? { forId: payload.baseQuestionId, variantIndex: payload.variantIndexForExtra }
          : null;

      const next: AppStorageState = {
        ...prev,
        score: prev.score + payload.record.points,
        extraDone: prev.extraDone + (payload.isExtra ? 1 : 0),
        wrongAttempts:
          prev.wrongAttempts + payload.record.wrongMoves + payload.record.wrongLines,
        hintsUsed: prev.hintsUsed + payload.record.hints,
        lastActive: new Date().toISOString(),
        sections: {
          ...prev.sections,
          [secId]: {
            completedIds: nextCompleted,
            pendingSimilar: nextPending,
          },
        },
        results: [payload.record, ...prev.results].slice(0, 300),
      };
      saveAppState(next);
      return next;
    });
  }

  function handleResetProgress() {
    setState((prev) => resetStudentProgress(prev));
  }

  function handleToggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.setEnabled(next);
  }

  return (
    <main className="w-full max-w-[1160px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <TopBar
        view={view}
        score={state.score}
        hasProfile={Boolean(state.profile)}
        soundOn={soundOn}
        darkMode={darkMode}
        onNavigate={navigate}
        onToggleSound={handleToggleSound}
        onToggleDark={() => setDarkMode((d) => !d)}
      />

      {view === 'hub' && (
        <ChapterHubView
          state={state}
          onSaveProfile={handleSaveProfile}
          onStartPlay={handleStartPlay}
          onOpenLeaderboard={() => navigate('leaderboard')}
        />
      )}

      {view === 'play' && (
        <PlayView
          state={state}
          config={playConfig}
          onRecordAttempt={handleRecordAttempt}
          onBackToHub={() => navigate('hub')}
          onOpenLeaderboard={() => navigate('leaderboard')}
        />
      )}

      {view === 'leaderboard' && (
        <LeaderboardView
          state={state}
          onBack={() => navigate(previousView)}
        />
      )}

      {view === 'teacher' && (
        <TeacherView
          state={state}
          onResetProgress={handleResetProgress}
          onBack={() => navigate(previousView)}
        />
      )}
    </main>
  );
}
