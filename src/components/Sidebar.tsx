import { PHASES } from '../types';
import { cn } from '../lib/utils';
import { Lock, X, CheckCircle2, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentPhase: number;
  activePhase: number;
  onSelect: (index: number) => void;
  isMobile?: boolean;
  isDevMode?: boolean;
  navMode: 'REVIEW' | 'BUILD';
  onClose: () => void;
}

export default function Sidebar({ currentPhase, activePhase, onSelect, isMobile, isDevMode, navMode, onClose }: SidebarProps) {
  return (
    <aside className={cn(
      "bg-ww-sidebar-bg flex flex-col shrink-0 h-full border-r border-white/5 py-10 w-full",
    )}>
      <div className="px-8 mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-black tracking-[4px] text-white text-[1.4rem]">WW_ENGINE</h2>
          <p className="font-mono text-[8px] tracking-[2px] text-ww-cyan opacity-40 mt-1 uppercase">v1.2.x // {navMode} Mode</p>
        </div>
        <button onClick={onClose} className="p-2 text-white/20 hover:text-white group">
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar">
        {PHASES.map((name, index) => {
          const isActive = index === activePhase;
          const isCompleted = index < currentPhase;
          const isCurrent = index === currentPhase;
          const isLocked = navMode === 'BUILD' && !isDevMode && index > currentPhase;

          return (
            <div
              key={name}
              onClick={() => !isLocked && onSelect(index)}
              className={cn(
                "phase-sidebar-item group relative",
                isActive ? "active bg-ww-cyan/5" : "inactive hover:bg-white/5",
                isLocked && "opacity-20 cursor-not-allowed",
                isCompleted && !isActive && "opacity-60"
              )}
            >
              <div className={cn(
                "indicator absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
                isActive ? "bg-ww-pink-rose h-full scale-y-100" : "bg-transparent h-0 scale-y-0"
              )} />
              
              <div className="flex flex-col">
                <span className={cn(
                  "text-[8px] font-mono tracking-[2px] uppercase opacity-40 group-hover:opacity-100 transition-opacity",
                  isLocked ? "text-white" : "text-ww-cyan"
                )}>
                  PHA_{String(index + 1).padStart(2, '0')}
                </span>
                <span className={cn(
                  "text-[0.75rem] uppercase tracking-widest font-black truncate",
                  isActive ? "text-ww-pink-rose" : "text-white/80"
                )}>
                  {name}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                {isLocked ? (
                  <div className="flex flex-col items-end">
                    <Lock className="w-3 h-3 opacity-40" />
                    <span className="text-[6px] font-mono opacity-40 uppercase tracking-tighter mt-1">Locked</span>
                  </div>
                ) : isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-ww-cyan" />
                ) : isCurrent ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-ww-pink-rose animate-pulse" />
                ) : null}
              </div>
              
              {isLocked && (
                <div className="absolute inset-0 bg-ww-charcoal/40 pointer-events-none" />
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-8 pt-8 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            navMode === 'BUILD' ? "bg-ww-cyan" : "bg-ww-pink-rose"
          )} />
          <span className="font-mono text-[9px] tracking-[1px] text-ww-cyan opacity-60 uppercase">
            {navMode} System Loaded
          </span>
        </div>
      </div>
    </aside>
  );
}
