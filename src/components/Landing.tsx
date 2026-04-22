import { useState } from 'react';
import { motion } from 'motion/react';
import { loginAnonymously } from '../services/firebase';
import { cn } from '../lib/utils';
import { User } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

export default function Landing({ onInitialize, initialUser }: { onInitialize: () => void, initialUser: User | null }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleInitialize = () => {
    // Immediate transition as requested (flip state first)
    onInitialize();

    // Trigger background synchronization without blocking the UI transition
    (async () => {
      try {
        let user = initialUser;
        if (!user) {
          user = await loginAnonymously();
        }
        
        if (user) {
          // Sync state in background
          const { doc, getDoc, setDoc, updateDoc, serverTimestamp } = await import('firebase/firestore');
          const { db } = await import('../services/firebase');
          const docRef = doc(db, 'systems', user.uid);
          
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            await setDoc(docRef, {
              userId: user.uid,
              currentPhase: 0,
              completed: false,
              initialized: true,
              updatedAt: serverTimestamp()
            });
          } else if (!docSnap.data().initialized) {
            await updateDoc(docRef, {
              initialized: true,
              updatedAt: serverTimestamp()
            });
          }
        }
      } catch (error: any) {
        console.error("Background initialization failed", error);
      }
    })();
  };

  return (
    <div className="h-screen w-screen flex bg-ww-charcoal min-h-[600px]">
      {/* Sidebar Mockup for Landing Page consistent with requested Design HTML */}
      <div className="w-[280px] bg-ww-sidebar-bg border-r border-[#444] hidden md:flex flex-col py-[30px] shrink-0">
        <div className="px-[30px] mb-[40px] font-extrabold tracking-[2px] text-white text-[1.2rem]">WW_ENGINE</div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center px-[30px] py-[12px] text-[0.85rem] font-medium text-ww-pink-extra-light bg-ww-active-bg border-r-[3px] border-ww-pink-rose uppercase">
            <div className="w-[8px] h-[8px] rounded-full bg-current mr-[15px]" />
            PHASE 1 — IDENTITY
          </div>
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <div key={i} className="flex items-center px-[30px] py-[12px] text-[0.85rem] font-medium text-ww-gray-medium/80 uppercase">
              <div className="w-[8px] h-[8px] rounded-full bg-current mr-[15px]" />
              PHASE {i} — {getPhaseTitle(i - 1).toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 bg-ww-gray-bg relative p-10 md:px-20 flex flex-col justify-center overflow-hidden">
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full relative z-[50]"
        >
          <span className="top-label">WORLD_WITHIN_ENGINE_V1.2</span>
          
          <h1 className="text-7xl md:text-[5rem] font-black leading-[0.85] mb-8 tracking-[-4px]">
            <span className="text-ww-pink-soft block drop-shadow-[0_2px_10px_rgba(255,202,216,0.1)]">Enter the</span>
            <span className="text-ww-pink-rose block mt-2">World Within.</span>
          </h1>

          <div className="flex flex-col gap-2 mb-12">
            <p className="text-xl md:text-[1.4rem] text-white/80 font-bold tracking-tight">This is not content creation.</p>
            <p className="text-xl md:text-[1.4rem] text-white/50 font-bold tracking-tight">
              This is <span className="text-ww-pink-rose italic decoration-ww-pink-rose/30 underline underline-offset-8">system construction.</span>
            </p>
            <p className="text-base md:text-[1.1rem] text-ww-pink-soft font-black mt-4 uppercase tracking-widest opacity-80">
              Build the structure that everything else follows.
            </p>
          </div>

          <div className="relative inline-block group">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleInitialize();
              }}
              className="initialize-btn flex items-center justify-center gap-3 min-w-[240px]"
            >
              INITIALIZE SYSTEM
            </motion.button>
            <span className="enforcement-text transition-opacity group-hover:opacity-80">
              ENFORCEMENT_PROTOCOL_ACTIVE // READ_READY
            </span>
          </div>
        </motion.div>

        {/* Technical Data Overlay */}
        <div className="absolute top-10 right-10 text-[8px] font-mono text-ww-cyan/20 space-y-1 text-right">
          <p>SYSTEM.ADDR :: 0x35F0E8</p>
          <p>LATENCY :: 12MS</p>
          <p>STATUS :: ARMED</p>
        </div>
      </main>
    </div>
  );
}

function getPhaseTitle(index: number) {
  const titles = [
    "Identity", "World", "Visuals", "Narrative", 
    "Patterns", "Engine", "Structure", 
    "Loop", "Conversion", "Control"
  ];
  return titles[index];
}
