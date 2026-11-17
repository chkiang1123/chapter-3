import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { ChapterHubView } from './components/ChapterHubView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LeaderboardView } from './components/LeaderboardView';
import { PlayView } from './components/PlayView';
import { TeacherView } from './components/TeacherView';
import { TopBar, type ActiveView } from './components/TopBar';
import { auth } from './firebase';
import {
  checkIsAuthorizedTeacher,
  loadStudentSummaryFromCloud,
  recordAttemptToCloud,
  saveStudentStateToCloud,
  signInWithGoogle,
  signOutGoogle,
  subscribeLeaderboardFromCloud,
  subscribeMyAttemptsFromCloud,
  type CloudLeaderboardRow,
} from './state/firebaseSync';
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

function AppShell() {
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

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [cloudLeaderboard, setCloudLeaderboard] = useState<CloudLeaderboardRow[]>([]);

  // Firebase Auth state & profile hydration
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      setAuthError('');
      if (!user) {
        setIsTeacher(false);
        setCloudLeaderboard([]);
        setAuthReady(true);
        return;
      }

      try {
        const [teacherFlag, cloudSummary] = await Promise.all([
          checkIsAuthorizedTeacher(user),
          loadStudentSummaryFromCloud(user),
        ]);
        setIsTeacher(teacherFlag);

        if (cloudSummary) {
          setState((prev) => {
            const mergeIds = (a: string[], b: string[]) => Array.from(new Set([...a, ...b]));
            const next: AppStorageState = {
              ...prev,
              profile: {
                name: cloudSummary.name,
                cls: cloudSummary.cls,
                classNo: cloudSummary.classNo,
                email: cloudSummary.email,
              },
              score: Math.max(prev.score, cloudSummary.score),
              extraDone: Math.max(prev.extraDone, cloudSummary.extraDone),
              wrongAttempts: Math.max(prev.wrongAttempts, cloudSummary.wrongAttempts),
              hintsUsed: Math.max(prev.hintsUsed, cloudSummary.hintsUsed),
              lastActive: cloudSummary.updatedAtIso || prev.lastActive,
              sections: {
                sec1: {
                  ...prev.sections.sec1,
                  completedIds: mergeIds(prev.sections.sec1.completedIds, cloudSummary.completedIdsSec1),
                },
                sec2: {
                  ...prev.sections.sec2,
                  completedIds: mergeIds(prev.sections.sec2.completedIds, cloudSummary.completedIdsSec2),
                },
                sec3: {
                  ...prev.sections.sec3,
                  completedIds: mergeIds(prev.sections.sec3.completedIds, cloudSummary.completedIdsSec3),
                },
              },
            };
            saveAppState(next);
            return next;
          });
        }
      } catch (err) {
        setAuthError(err instanceof Error ? err.message : String(err));
      } finally {
        setAuthReady(true);
      }
    });
    return () => unsub();
  }, []);

  // Subscribe to student's own cloud attempts & PII-free leaderboard once authenticated
  useEffect(() => {
    if (!authReady || !authUser) return;
    const unsubAttempts = subscribeMyAttemptsFromCloud(authUser, (cloudAttempts) => {
      setState((prev) => {
        const seen = new Set(cloudAttempts.map((a) => a.id));
        const localOnly = prev.results.filter((r) => !seen.has(r.id));
        const merged = [...cloudAttempts, ...localOnly].slice(0, 300);
        const next: AppStorageState = { ...prev, results: merged };
        saveAppState(next);
        return next;
      });
    });
    const unsubBoard = subscribeLeaderboardFromCloud(setCloudLeaderboard);
    return () => {
      unsubAttempts();
      unsubBoard();
    };
  }, [authReady, authUser]);

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

  async function handleSignIn() {
    setAuthBusy(true);
    setAuthError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : String(err));
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSignOut() {
    setAuthError('');
    await signOutGoogle();
    if (view === 'teacher') {
      setView('hub');
    }
  }

  function navigate(target: ActiveView) {
    if (target === 'leaderboard' || target === 'teacher') {
      setPreviousView(view === 'leaderboard' || view === 'teacher' ? 'hub' : view);
    }
    setView(target);
    window.scrollTo(0, 0);
  }

  function handleSaveProfile(profile: StudentProfile) {
    const mergedProfile: StudentProfile = authUser?.email
      ? { ...profile, email: authUser.email.trim().toLowerCase() }
      : profile;

    setState((prev) => {
      const next: AppStorageState = {
        ...prev,
        profile: mergedProfile,
        lastActive: new Date().toISOString(),
      };
      saveAppState(next);
      if (authUser) {
        void saveStudentStateToCloud(authUser, next, mergedProfile);
      }
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
      if (authUser && next.profile) {
        void recordAttemptToCloud(authUser, next, next.profile, payload.record);
      }
      return next;
    });
  }

  function handleResetProgress() {
    setState((prev) => {
      const next = resetStudentProgress(prev);
      if (authUser && next.profile) {
        void saveStudentStateToCloud(authUser, next, next.profile);
      }
      return next;
    });
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
        authUser={authUser}
        isTeacher={isTeacher}
        authBusy={authBusy}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onNavigate={navigate}
        onToggleSound={handleToggleSound}
        onToggleDark={() => setDarkMode((d) => !d)}
      />

      {view === 'hub' && (
        <ChapterHubView
          state={state}
          authUser={authUser}
          isTeacher={isTeacher}
          authBusy={authBusy}
          authError={authError}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
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
          cloudRows={cloudLeaderboard}
          onBack={() => navigate(previousView)}
        />
      )}

      {view === 'teacher' && (
        <TeacherView
          state={state}
          authUser={authUser}
          authReady={authReady}
          isTeacher={isTeacher}
          authBusy={authBusy}
          authError={authError}
          cloudLeaderboard={cloudLeaderboard}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          onResetProgress={handleResetProgress}
          onBack={() => navigate(previousView)}
        />
      )}
    </main>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppShell />
    </ErrorBoundary>
  );
}
