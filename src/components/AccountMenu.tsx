import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { LogOut, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AccountMenuProps {
  user: User;
  onSignOut: () => Promise<void>;
  isSaving?: boolean;
  saveError?: string | null;
  onRetrySave?: () => void;
  // Optional callback to flush or await pending saves before signing out
  ensureSaved?: () => Promise<boolean>;
  onUpdateKey?: () => void;
}

export default function AccountMenu({
  user,
  onSignOut,
  isSaving = false,
  saveError = null,
  onRetrySave,
  ensureSaved,
  onUpdateKey,
}: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on click or touch outside
  useEffect(() => {
    if (!isOpen) return;

    function handleOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    // Delay attaching listener by 10ms to prevent the opening tap from immediately triggering outside close
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleOutside);
      document.addEventListener('touchstart', handleOutside, { passive: true });
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isOpen]);

  const handleToggle = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const handleSignOutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setSigningOut(true);
      setSignOutError(null);

      // Finish any pending saves and wait for confirmation before signing out
      if (ensureSaved) {
        const success = await ensureSaved();
        if (!success) {
          setSignOutError("Could not confirm your saved work with the database. Please retry before signing out.");
          setSigningOut(false);
          return;
        }
      }

      // If there is an unresolved save error, block sign-out so data isn't silently lost
      if (saveError) {
        setSignOutError("You have unsaved changes that failed to save. Please retry saving before signing out.");
        setSigningOut(false);
        return;
      }

      await onSignOut();
      setIsOpen(false);
    } catch (err: any) {
      console.error("Sign out error:", err);
      setSignOutError(err?.message || "Failed to sign out safely. Please try again.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Account Icon Button - strictly toggles in-app menu (no external links, forms, or reloads) */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 border border-white/20 hover:border-white/50 transition-all cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-ww-pink-rose/50 touch-manipulation select-none active:scale-95"
        title="Account Menu"
        aria-label="Account Menu"
        aria-expanded={isOpen}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.email || 'User Account'}
            className="w-full h-full object-cover rounded-full pointer-events-none"
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg className="w-4 h-4 shrink-0 pointer-events-none" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
      </button>

      {/* In-App Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] bg-[#181818]/95 backdrop-blur-xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-4 z-[9999] text-left text-white rounded-none"
          >
            {/* Header: Signed in as + Actual Google Email (NOT an external link) */}
            <div className="pb-3 border-b border-white/10">
              <span className="block text-[10px] font-mono tracking-[2px] text-white/50 uppercase mb-1">
                Signed in as
              </span>
              <span
                className="block text-sm font-mono font-medium text-white break-all leading-snug select-text"
                title={user.email || ''}
              >
                {user.email || 'Unknown Google Account'}
              </span>
            </div>

            {/* Error or in-progress save notices before sign-out */}
            {(signOutError || saveError) && (
              <div className="mt-3 p-2.5 bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">{signOutError || saveError}</span>
                </div>
                {onRetrySave && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSignOutError(null);
                      onRetrySave();
                    }}
                    className="self-start text-[10px] font-mono uppercase tracking-wider text-white bg-red-600/40 hover:bg-red-600/60 border border-red-400/50 px-2 py-1 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry Database Save
                  </button>
                )}
              </div>
            )}

            {isSaving && !signOutError && !saveError && (
              <div className="mt-3 p-2 bg-ww-cyan/10 border border-ww-cyan/20 text-ww-cyan text-xs font-mono flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>Saving work to database...</span>
              </div>
            )}

            {/* Sign Out Button directly below the email */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleSignOutClick}
                disabled={signingOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-red-500/20 text-white hover:text-red-200 border border-white/10 hover:border-red-500/40 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group touch-manipulation"
              >
                {signingOut ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Confirming save & signing out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-3.5 h-3.5 text-red-400 group-hover:text-red-300" />
                    <span>Sign out</span>
                  </>
                )}
              </button>
            </div>

            {onUpdateKey && (
              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/40 uppercase tracking-wider">Gemini API Key</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(false);
                    onUpdateKey();
                  }}
                  className="text-ww-cyan hover:underline uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Manage / Update
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
