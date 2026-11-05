import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Check, Trash2 } from 'lucide-react';
import { SystemState } from '../types';

interface DraftMigrationModalProps {
  userEmail: string;
  draftData: SystemState;
  hasExistingAccountData: boolean;
  onMigrate: () => void;
  onDiscard: () => void;
}

export default function DraftMigrationModal({
  userEmail,
  draftData,
  hasExistingAccountData,
  onMigrate,
  onDiscard,
}: DraftMigrationModalProps) {
  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-ww-charcoal border border-ww-pink-rose/40 p-6 md:p-8 text-white shadow-2xl text-left"
      >
        <div className="flex items-center gap-3 text-ww-pink-rose mb-4">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="text-xs font-mono tracking-[3px] uppercase font-bold">
            UNRESOLVED LOCAL WORK DETECTED
          </span>
        </div>

        <h3 className="text-xl font-black uppercase tracking-tight mb-2">
          Preserve Local Workspace?
        </h3>

        <p className="text-sm text-white/80 leading-relaxed mb-4">
          An unassigned session draft was found in this browser (Phase {draftData.currentPhase + 1}). 
          {hasExistingAccountData ? (
            <>
              {" "}Your account (<span className="text-ww-cyan font-bold">{userEmail}</span>) already has verified saved work in the database.
              Would you like to migrate and overwrite your account with this local draft, or keep your verified account data?
            </>
          ) : (
            <>
              {" "}Would you like to migrate this draft to your Google account (<span className="text-ww-cyan font-bold">{userEmail}</span>) so it saves permanently to your private workspace?
            </>
          )}
        </p>

        <div className="bg-white/5 border border-white/10 p-3 mb-6 text-xs font-mono text-white/70 space-y-1">
          <div>UNASSIGNED DRAFT PROGRESS: Phase {draftData.currentPhase + 1}</div>
          <div>STATUS: Unresolved browser cache</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={onDiscard}
            className="px-4 py-2.5 bg-transparent border border-white/20 hover:border-white/40 text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Discard Local Draft
          </button>

          <button
            type="button"
            onClick={onMigrate}
            className="px-5 py-2.5 bg-ww-pink-rose hover:bg-ww-pink-deep text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Check className="w-4 h-4" />
            Migrate to My Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
