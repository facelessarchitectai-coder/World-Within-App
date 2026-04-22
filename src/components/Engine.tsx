import { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { PHASES, SystemState } from '../types';
import Sidebar from './Sidebar';
import PhaseContent from './PhaseContent';
import { Loader2, Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Engine({ onBackToLanding, user }: { onBackToLanding: () => void, user: User | null }) {
  const [system, setSystem] = useState<SystemState>(() => ({
    userId: user?.uid || 'anonymous',
    currentPhase: 0,
    completed: false,
    initialized: true,
    updatedAt: new Date().toISOString()
  } as SystemState));
  const [loading, setLoading] = useState(false);
  const [localViewPhase, setLocalViewPhase] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [navMode, setNavMode] = useState<'REVIEW' | 'BUILD'>('REVIEW');
  
  const isBuilder = user?.email === 'thefacelessprodigy4@gmail.com';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('dev') === 'true' && isBuilder) {
      setIsDevMode(true);
    }
  }, [isBuilder]);

  useEffect(() => {
    if (!user) return;

    const docRef = doc(db, 'systems', user.uid);
    const unsubscribe = onSnapshot(docRef, 
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SystemState;
          if (!data.initialized && !isDevMode) {
            onBackToLanding();
            return;
          }
          setSystem(data);
        } else {
          // In dev mode, we can mock a system if none exists
          if (isDevMode) {
            setSystem({
              userId: user.uid,
              currentPhase: 0,
              completed: false,
              initialized: true,
              updatedAt: new Date().toISOString()
            } as any);
          } else {
            onBackToLanding();
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firestore snapshot error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isDevMode]);

  const updatePhase = async (phaseIndex: number, data: any) => {
    if (!user || !system) return;

    if (isDevMode) {
      // Session only state update
      setSystem(prev => {
        if (!prev) return null;
        let nextPhase = prev.currentPhase;
        if (phaseIndex === prev.currentPhase) {
          nextPhase = prev.currentPhase + 1;
        }
        return {
          ...prev,
          ...data,
          currentPhase: nextPhase,
          updatedAt: new Date().toISOString()
        };
      });
      return;
    }

    const docRef = doc(db, 'systems', user.uid);
    
    let updateData: any = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    // Auto-advance if completing current phase
    if (phaseIndex === system.currentPhase) {
      updateData.currentPhase = system.currentPhase + 1;
    }

    await updateDoc(docRef, updateData);
  };

  const setViewPhase = (phaseIndex: number) => {
    if (!system) return;
    const isLocked = navMode === 'BUILD' && !isDevMode && phaseIndex > system.currentPhase;
    
    if (!isLocked) {
      setLocalViewPhase(phaseIndex);
      setIsSidebarOpen(false); // Close sidebar on mobile after selection
    }
  };

  // Sync local view phase with current phase on load or progression
  useEffect(() => {
    if (system && !isDevMode) {
      if (localViewPhase < system.currentPhase) {
        setLocalViewPhase(system.currentPhase);
      }
    }
  }, [system?.currentPhase, isDevMode]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-ww-gray-bg text-ww-pink-rose font-black italic tracking-tighter text-4xl">
        INITIALIZING...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden relative bg-ww-gray-bg">
      {isDevMode && (
        <div className="absolute top-0 left-0 right-0 z-[100] bg-ww-cyan text-ww-charcoal text-[10px] font-black tracking-[4px] py-2 text-center uppercase pointer-events-none">
          BUILDER MODE ACTIVE — TESTING ONLY — NO DATA SAVED
        </div>
      )}

      {isBuilder && (
        <div className={cn(
          "fixed top-14 right-4 z-[200]",
          isDevMode ? "mt-8" : ""
        )}>
          <button
            onClick={() => setIsDevMode(!isDevMode)}
            className={cn(
              "px-3 py-1.5 font-mono text-[9px] font-black tracking-[2px] uppercase border transition-all shadow-xl bg-ww-charcoal",
              isDevMode 
                ? "text-ww-cyan border-ww-cyan" 
                : "text-white/40 border-white/10 hover:border-white/30 hover:text-white"
            )}
          >
            DEV_MODE: {isDevMode ? "ON" : "OFF"}
          </button>
        </div>
      )}

      {/* Global Mode Toggle & Phase Menu */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-[80] border-b border-white/5 bg-ww-sidebar-bg/95 backdrop-blur-md px-4 md:px-8 flex items-center justify-between transition-all duration-300",
        isDevMode ? "h-14 mt-8" : "h-14"
      )}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-3 group transition-all"
          >
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono tracking-[4px] text-ww-cyan opacity-40 group-hover:opacity-100 transition-opacity uppercase">
                PHA_{String(localViewPhase + 1).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-[2px] text-white uppercase truncate max-w-[120px] md:max-w-none">
                  {PHASES[localViewPhase]}
                </span>
                <ChevronDown className="w-3 h-3 text-ww-cyan opacity-40 group-hover:opacity-100" />
              </div>
            </div>
          </button>
        </div>

        <div className="flex bg-ww-charcoal p-1 border border-white/5">
          <button
            onClick={() => setNavMode('REVIEW')}
            className={cn(
              "px-3 md:px-6 py-1.5 text-[9px] font-black tracking-[2px] uppercase transition-all",
              navMode === 'REVIEW' ? "bg-ww-pink-rose text-white shadow-lg" : "text-white/30 hover:text-white/60"
            )}
          >
            Review Mode
          </button>
          <button
            onClick={() => setNavMode('BUILD')}
            className={cn(
              "px-3 md:px-6 py-1.5 text-[9px] font-black tracking-[2px] uppercase transition-all",
              navMode === 'BUILD' ? "bg-ww-cyan text-ww-charcoal shadow-lg" : "text-white/30 hover:text-white/60"
            )}
          >
            Build Mode
          </button>
        </div>
      </div>

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
                currentPhase={system.currentPhase} 
                activePhase={localViewPhase} 
                onSelect={(idx) => {
                  setViewPhase(idx);
                  setIsSidebarOpen(false);
                }} 
                isDevMode={isDevMode}
                navMode={navMode}
                onClose={() => setIsSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Optional, maybe we just use the overlay for both now for consistent UI) */}
      {/* Hidden for now to favor the new Phase Menu dropdown pattern */}
      
      <main className="flex-1 overflow-y-auto relative scroll-smooth flex flex-col bg-ww-gray-bg mt-14">
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
                      The document explains the method.<br/>
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

              <div className="flex flex-col items-center gap-8 text-center max-w-md mx-auto">
                <h4 className="text-[10px] font-black tracking-[4px] text-white/30 uppercase">How to use it:</h4>
                <div className="grid grid-cols-1 gap-4 w-full text-[10px] font-black tracking-[2px] uppercase">
                  <div className="p-4 border border-white/5 bg-white/2 flex items-center justify-center gap-4">
                    <span className="text-ww-cyan">1. Read</span>
                    <span className="text-white/20">→</span>
                    <span className="opacity-40 italic">understand the system</span>
                  </div>
                  <div className="p-4 border border-white/5 bg-white/2 flex items-center justify-center gap-4">
                    <span className="text-ww-pink-rose">2. Return</span>
                    <span className="text-white/20">→</span>
                    <span className="opacity-40 italic">apply inside the app</span>
                  </div>
                  <div className="p-4 border border-white/5 bg-white/2 flex items-center justify-center gap-4">
                    <span className="text-ww-yellow">3. Refine</span>
                    <span className="text-white/20">→</span>
                    <span className="opacity-40 italic">use the bot if needed</span>
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
              <PhaseContent 
                phaseIndex={localViewPhase} 
                data={system as any} 
                onSave={(data) => updatePhase(localViewPhase, data)} 
                onNavigate={setLocalViewPhase}
                isLocked={navMode === 'BUILD' && localViewPhase > system.currentPhase && !isDevMode}
                canAdvance={localViewPhase === system.currentPhase}
                isDevMode={isDevMode}
                navMode={navMode}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
