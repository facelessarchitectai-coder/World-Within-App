import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../services/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { PHASES, SystemState } from '../types';
import Sidebar from './Sidebar';
import PhaseContent from './PhaseContent';
import AccountMenu from './AccountMenu';
import { Loader2, ChevronDown, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../services/firebase';

interface EngineProps {
  onBackToLanding: () => void;
  user: User;
  onSignOut: () => Promise<void>;
  onUpdateKey?: () => void;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function Engine({ onBackToLanding, user, onSignOut, onUpdateKey }: EngineProps) {
  const [system, setSystem] = useState<SystemState | null>(null);
  const [loading, setLoading] = useState(true);
  const [localViewPhase, setLocalViewPhase] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // navMode controls Review vs Build mode:
  // - 'BUILD': Normal building/editing. Saving to private database is active.
  // - 'REVIEW': Testing only. Banner displayed. No data saved to database. No "Saved" status.
  const [navMode, setNavMode] = useState<'BUILD' | 'REVIEW'>('BUILD');

  // Keep a reference to the verified database state so Review mode testing never overwrites it
  const savedDatabaseDocRef = useRef<SystemState | null>(null);

  // Saving status & retry state (used in BUILD mode)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pendingRetry, setPendingRetry] = useState<{ phaseIndex: number; data: any } | null>(null);
  const inFlightSavePromiseRef = useRef<Promise<boolean> | null>(null);
  const hasInitializedPhaseRef = useRef(false);

  // Active user reference to prevent cross-account writes and race conditions
  const activeUserIdRef = useRef<string>(user.uid);
  useEffect(() => {
    activeUserIdRef.current = user.uid;
    return () => {
      activeUserIdRef.current = '';
    };
  }, [user.uid]);

  // Firestore real-time listener for current user's private workspace
  useEffect(() => {
    if (!user?.uid) return;

    const docRef = doc(db, 'systems', user.uid);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        // Discard snapshot if user has switched accounts
        if (activeUserIdRef.current !== user.uid) return;

        if (snapshot.exists()) {
          const data = snapshot.data() as SystemState;
          savedDatabaseDocRef.current = data;

          // Only update active UI state from Firestore if not in temporary Review mode
          setSystem((current) => {
            if (navMode === 'REVIEW' && current) {
              return current;
            }
            return data;
          });

          if (!hasInitializedPhaseRef.current) {
            hasInitializedPhaseRef.current = true;
            setLocalViewPhase(data.currentPhase || 0);
          }
        } else {
          // If no system document exists yet, initialize a clean private document for this user
          const initialDoc: SystemState = {
            userId: user.uid,
            currentPhase: 0,
            completed: false,
            initialized: true,
            updatedAt: new Date().toISOString()
          };
          savedDatabaseDocRef.current = initialDoc;
          setSystem(initialDoc);

          if (!hasInitializedPhaseRef.current) {
            hasInitializedPhaseRef.current = true;
            setLocalViewPhase(0);
          }

          // Persist the initial document to Firestore
          setDoc(docRef, {
            ...initialDoc,
            updatedAt: serverTimestamp()
          }).catch((err) => {
            console.error("Error creating initial user document:", err);
          });
        }
        setLoading(false);
      },
      (error) => {
        if (activeUserIdRef.current !== user.uid) return;
        console.error("Firestore snapshot error:", error);
        setLoading(false);
        try {
          handleFirestoreError(error, OperationType.GET, `systems/${user.uid}`);
        } catch {
          // Handled and logged
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user.uid, navMode]);

  // Switching modes:
  // When switching from Review mode back to Build mode, restore the real saved database record
  // so temporary review testing never overwrote or deleted existing saved work.
  const handleModeChange = (newMode: 'BUILD' | 'REVIEW') => {
    if (newMode === navMode) return;

    if (newMode === 'BUILD') {
      // Restore verified database records when returning to Build mode
      if (savedDatabaseDocRef.current) {
        setSystem(savedDatabaseDocRef.current);
      }
      setSaveStatus('idle');
      setSaveError(null);
    } else {
      // Entering Review mode: testing only
      setSaveStatus('idle');
      setSaveError(null);
    }

    setNavMode(newMode);
  };

  const updatePhase = useCallback(
    async (phaseIndex: number, data: any) => {
      if (!user?.uid) return;
      const currentUserId = user.uid;

      // 1. REVIEW MODE: Testing only
      // Keep review inputs and results temporary in memory.
      // Do not write review activity to anyone's saved archive or account records.
      // Do not display a successful "Saved" status.
      if (navMode === 'REVIEW') {
        setSystem((prev) => {
          if (!prev) return null;
          const nextPhase = phaseIndex === prev.currentPhase ? prev.currentPhase + 1 : prev.currentPhase;
          return {
            ...prev,
            ...data,
            currentPhase: nextPhase,
            updatedAt: new Date().toISOString()
          };
        });

        setLocalViewPhase((prev) => {
          if (system && phaseIndex === system.currentPhase) {
            return phaseIndex + 1;
          }
          return prev;
        });

        // Ensure "Saved" status is NEVER shown in Review mode
        setSaveStatus('idle');
        return;
      }

      // 2. BUILD MODE: Normal persistent saving to user's private database account
      setSystem((prev) => {
        if (!prev) return null;
        const nextPhase = phaseIndex === prev.currentPhase ? prev.currentPhase + 1 : prev.currentPhase;
        return {
          ...prev,
          ...data,
          currentPhase: nextPhase,
          updatedAt: new Date().toISOString()
        };
      });

      setLocalViewPhase((prev) => {
        if (system && phaseIndex === system.currentPhase) {
          return phaseIndex + 1;
        }
        return prev;
      });

      // Indicate saving in Build mode
      setSaveStatus('saving');
      setSaveError(null);

      const docRef = doc(db, 'systems', currentUserId);
      const nextPhase = system ? (phaseIndex === system.currentPhase ? system.currentPhase + 1 : system.currentPhase) : phaseIndex;
      const updateData: any = {
        ...data,
        userId: currentUserId,
        initialized: true,
        currentPhase: nextPhase,
        updatedAt: serverTimestamp()
      };

      const saveOperation = async (): Promise<boolean> => {
        try {
          await setDoc(docRef, updateData, { merge: true });

          // Verify that user didn't switch accounts during in-flight network save
          if (activeUserIdRef.current !== currentUserId) {
            console.warn("Save completed after session changed; discarding state update.");
            return true;
          }

          // Confirmed saved by database
          setSaveStatus('saved');
          setPendingRetry(null);
          setSaveError(null);
          return true;
        } catch (err: any) {
          if (activeUserIdRef.current !== currentUserId) return false;

          console.error("Database save error:", err);
          setSaveStatus('error');
          setSaveError(err?.message || "Failed to save work to database");
          setPendingRetry({ phaseIndex, data });

          try {
            handleFirestoreError(err, OperationType.WRITE, `systems/${currentUserId}`);
          } catch {
            // Handled
          }
          return false;
        } finally {
          if (inFlightSavePromiseRef.current === savePromise) {
            inFlightSavePromiseRef.current = null;
          }
        }
      };

      const savePromise = saveOperation();
      inFlightSavePromiseRef.current = savePromise;
      await savePromise;
    },
    [system, user?.uid, navMode]
  );

  const ensureSaved = useCallback(async (): Promise<boolean> => {
    // If in Review mode, there are no pending persistent database saves
    if (navMode === 'REVIEW') {
      return true;
    }

    if (inFlightSavePromiseRef.current) {
      const ok = await inFlightSavePromiseRef.current;
      if (!ok) return false;
    }
    if (saveStatus === 'error') {
      return false;
    }
    return true;
  }, [saveStatus, navMode]);

  const handleRetrySave = () => {
    if (pendingRetry && navMode === 'BUILD') {
      updatePhase(pendingRetry.phaseIndex, pendingRetry.data);
    }
  };

  const setViewPhase = (phaseIndex: number) => {
    if (!system) return;
    const isLocked = navMode === 'BUILD' && phaseIndex > system.currentPhase;

    if (!isLocked) {
      setLocalViewPhase(phaseIndex);
      setIsSidebarOpen(false);
    }
  };

  if (loading && !system) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#121212] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-ww-pink-rose mb-4" />
        <div className="text-ww-pink-rose font-black italic tracking-tighter text-2xl uppercase">
          Loading Workspace...
        </div>
        <div className="text-[10px] font-mono tracking-[3px] text-white/40 mt-2 uppercase">
          Verifying Private Database State
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden relative bg-transparent">
      {/* Global Header Bar with Review Notice, Mode Toggles, Save Status, and In-App Account Menu */}
      <header className="fixed top-0 left-0 right-0 z-[80] flex flex-col border-b border-white/10 bg-ww-sidebar-bg/95 backdrop-blur-md transition-all duration-300">
        {/* Required Notice: Displayed ONLY in Review mode. Clearly styled, visible without covering buttons/content */}
        {navMode === 'REVIEW' && (
          <div className="w-full bg-amber-500/15 border-b border-amber-500/30 text-amber-300 text-[11px] font-mono tracking-[2px] py-1.5 px-4 text-center uppercase font-bold flex items-center justify-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Review mode — no data is saved.</span>
          </div>
        )}

        <div className="h-14 px-3 md:px-6 flex items-center justify-between gap-2">
          {/* Left: Phase Selector */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 group transition-all text-left cursor-pointer"
            >
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono tracking-[3px] text-ww-cyan opacity-50 group-hover:opacity-100 transition-opacity uppercase">
                  PHA_{String(localViewPhase + 1).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-[1.5px] text-white uppercase truncate max-w-[110px] sm:max-w-[180px] md:max-w-none">
                    {PHASES[localViewPhase]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-ww-cyan opacity-50 group-hover:opacity-100 shrink-0" />
                </div>
              </div>
            </button>
          </div>

          {/* Right: Review/Build Mode Toggles + Saving Status + In-App Account Menu */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Mode Toggles */}
            <div className="flex bg-ww-charcoal p-1 border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => handleModeChange('BUILD')}
                className={cn(
                  "px-2.5 sm:px-3 py-1 text-[9px] font-black tracking-[1.5px] uppercase transition-all cursor-pointer",
                  navMode === 'BUILD' ? "bg-ww-cyan text-ww-charcoal shadow-lg font-extrabold" : "text-white/40 hover:text-white/70"
                )}
              >
                Build
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('REVIEW')}
                className={cn(
                  "px-2.5 sm:px-3 py-1 text-[9px] font-black tracking-[1.5px] uppercase transition-all cursor-pointer",
                  navMode === 'REVIEW' ? "bg-amber-400 text-black shadow-lg font-extrabold" : "text-white/40 hover:text-white/70"
                )}
              >
                Review
              </button>
            </div>

            {/* Saving Status Indicator: Active in BUILD mode; strictly NEVER displays "Saved" in Review mode */}
            <div className="shrink-0 flex items-center min-w-[70px] sm:min-w-[80px]">
              {navMode === 'REVIEW' ? (
                <div className="px-2 py-0.5 text-[9px] font-mono text-amber-300/80 uppercase tracking-wider">
                  Testing
                </div>
              ) : (
                <>
                  {saveStatus === 'saving' && (
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono text-ww-cyan bg-ww-cyan/10 border border-ww-cyan/30 uppercase animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                      <span className="hidden sm:inline">Saving...</span>
                    </div>
                  )}
                  {saveStatus === 'saved' && (
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 uppercase">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span className="hidden sm:inline">Saved</span>
                    </div>
                  )}
                  {saveStatus === 'error' && (
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/40 uppercase">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span className="hidden sm:inline">Save Failed</span>
                      <button
                        type="button"
                        onClick={handleRetrySave}
                        className="ml-1 underline font-bold hover:text-white cursor-pointer flex items-center gap-1"
                        title="Retry saving unsaved changes"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        Retry
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Top Corner: In-App Account Menu */}
            <div className="relative z-[200] border-l border-white/10 pl-2 sm:pl-3 shrink-0">
              <AccountMenu
                user={user}
                onSignOut={onSignOut}
                isSaving={saveStatus === 'saving'}
                saveError={saveError}
                onRetrySave={handleRetrySave}
                ensureSaved={ensureSaved}
                onUpdateKey={onUpdateKey}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay (Nav Selection) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-ww-charcoal/80 backdrop-blur-sm z-[90]"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] z-[100] shadow-2xl"
            >
              <Sidebar
                currentPhase={system ? system.currentPhase : 0}
                activePhase={localViewPhase}
                onSelect={(idx) => {
                  setViewPhase(idx);
                  setIsSidebarOpen(false);
                }}
                isDevMode={false}
                navMode={navMode}
                onClose={() => setIsSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content: margin-top smoothly accommodates the Review mode notice banner without covering content */}
      <main
        className={cn(
          "flex-1 overflow-y-auto relative scroll-smooth flex flex-col bg-transparent transition-all duration-200",
          navMode === 'REVIEW' ? "mt-[5.25rem]" : "mt-14"
        )}
      >
        <div className="w-full max-w-4xl mx-auto px-5 py-8 md:p-20 relative z-10 flex-1">
          {localViewPhase <= 3 && (
            <div className="mb-20 space-y-16 animate-in fade-in slide-in-from-top-6 duration-1000">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="text-white/20 font-mono tracking-widest leading-none">━━━━━━━━━━━━━━━━━━━</div>
                <div className="text-ww-cyan font-black text-xs tracking-[8px] uppercase">🪞 START HERE</div>
                <div className="text-white/20 font-mono tracking-widest leading-none">━━━━━━━━━━━━━━━━━━━</div>

                <div className="max-w-md space-y-4 pt-6">
                  <p className="text-xl md:text-2xl font-black italic tracking-tighter uppercase leading-tight text-white/90">
                    This app is where you build your system.
                  </p>
                  <p className="text-[10px] font-black tracking-[4px] text-ww-cyan uppercase">
                    You can start immediately.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 text-center">
                <div className="text-white/20 font-mono tracking-widest leading-none">━━━━━━━━━━━━━━━━━━━</div>
                <div className="text-ww-pink-rose font-black text-xs tracking-[4px] uppercase">METHOD DOCUMENT (OPTIONAL)</div>
                <div className="text-white/20 font-mono tracking-widest leading-none">━━━━━━━━━━━━━━━━━━━</div>

                <div className="max-w-lg space-y-8 pt-6">
                  <p className="text-sm font-bold opacity-60 uppercase tracking-tight">
                    This system also exists as a full method document.
                  </p>

                  <div className="space-y-4 text-[10px] font-black tracking-widest text-left max-w-sm mx-auto p-8 bg-white/2 border border-white/5 uppercase">
                    <p className="text-ww-cyan mb-2">Use it if you want to:</p>
                    <div className="space-y-4 text-white/70">
                      <p>• understand the full system in one place</p>
                      <p>• review definitions without interaction</p>
                      <p>• study before rebuilding or refining</p>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6">
                    <p className="text-xs font-bold opacity-40 uppercase tracking-widest italic leading-relaxed">
                      The document explains the method.<br />
                      The app is where you build it.
                    </p>

                    <div className="text-center py-8">
                      <div className="text-white/20 font-mono tracking-widest mb-8">━━━━━━━━━━━━━━━━━━━</div>
                      <a
                        href="https://meteor-epoxy-afc.notion.site/World-Within-Method-334e96ae423480ddaca2e265f61d014d?source=copy_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="initialize-btn w-full md:w-[450px] mx-auto flex items-center justify-center gap-3 uppercase no-underline shadow-[0_0_30px_rgba(240,98,146,0.1)] hover:shadow-[0_0_50px_rgba(240,98,146,0.2)] transition-all"
                      >
                        VIEW FULL METHOD DOCUMENT
                      </a>
                      <div className="text-white/20 font-mono tracking-widest mt-8">━━━━━━━━━━━━━━━━━━━</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-8 text-center max-w-sm mx-auto">
                <h4 className="text-[10px] font-black tracking-[4px] text-white/30 uppercase">How to use it:</h4>
                <div className="grid grid-cols-1 gap-4 w-full text-[10px] font-black tracking-[2px] uppercase text-left">
                  <div className="p-4 border border-white/5 bg-white/2 flex items-center gap-4">
                    <span className="text-ww-cyan min-w-[50px] shrink-0 font-black">1. READ</span>
                    <span className="text-white/20">→</span>
                    <span className="opacity-40 italic">Understand the system concept</span>
                  </div>
                  <div className="p-4 border border-white/5 bg-white/2 flex items-center gap-4">
                    <span className="text-ww-pink-rose min-w-[50px] shrink-0 font-black">2. DEFINE</span>
                    <span className="text-white/20">→</span>
                    <span className="opacity-40 italic">Use the World Architect™ Bot & app together to design</span>
                  </div>
                  <div className="p-4 border border-white/5 bg-white/2 flex items-center gap-4">
                    <span className="text-ww-yellow min-w-[50px] shrink-0 font-black">3. RETAIN</span>
                    <span className="text-white/20">→</span>
                    <span className="opacity-40 italic">Save rules in the app so the World Architect™ Bot doesn't forget them</span>
                  </div>
                </div>
                <div className="text-white/20 font-mono tracking-widest leading-none">━━━━━━━━━━━━━━━━━━━</div>
              </div>

              <div className="max-w-lg mx-auto text-center space-y-12">
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-[4px] opacity-70">
                    You do NOT need to read the document to begin.
                  </p>
                  <p className="text-sm font-black text-ww-cyan italic uppercase">
                    The system will guide you as you build.
                  </p>
                </div>

                <div className="p-10 border border-ww-pink-deep/30 bg-ww-pink-deep/5 space-y-8">
                  <h5 className="text-[10px] font-black tracking-[8px] text-ww-pink-deep uppercase animate-pulse">WARNING:</h5>
                  <div className="space-y-4 text-xl md:text-2xl font-black italic tracking-tighter uppercase leading-tight text-white/90">
                    <p>"Do not replace building with reading."</p>
                    <p className="opacity-40 text-sm normal-case font-medium">Understanding without applying will not create a system.</p>
                  </div>
                </div>

                <div className="text-[9px] font-black tracking-[10px] text-white/20 uppercase pb-12 animate-bounce">
                  ↓ SCROLL TO BEGIN ↓
                </div>

                <div className="text-white/10 font-mono tracking-[12px] leading-none opacity-50">━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
              </div>
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={localViewPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {system && (
                <PhaseContent
                  phaseIndex={localViewPhase}
                  data={system as any}
                  onSave={(data) => updatePhase(localViewPhase, data)}
                  onNavigate={setLocalViewPhase}
                  isLocked={navMode === 'BUILD' && localViewPhase > system.currentPhase}
                  canAdvance={localViewPhase === system.currentPhase}
                  isDevMode={false}
                  navMode={navMode}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
