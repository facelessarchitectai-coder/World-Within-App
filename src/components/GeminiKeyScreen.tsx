import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { motion } from 'motion/react';
import {
  KeyRound,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  AlertCircle,
  ShieldAlert,
  LogOut,
  Sparkles,
  Info,
} from 'lucide-react';
import { validateGeminiKeyWithServer, isSharedFirebaseKey } from '../services/geminiKeyStore';
// @ts-ignore
import portalBg from '../assets/images/portal_landing_bg_1781878013871.jpg';

interface GeminiKeyScreenProps {
  user: User;
  onKeyValidated: (key: string) => void;
  onSignOut: () => Promise<void>;
  initialError?: string | null;
}

export default function GeminiKeyScreen({
  user,
  onKeyValidated,
  onSignOut,
  initialError,
}: GeminiKeyScreenProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(initialError || null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleValidateAndContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = apiKey.trim();

    if (!trimmed) {
      setValidationError('Please enter your Gemini API key to continue.');
      return;
    }

    // Client check: reject shared Firebase key immediately with clear explanation
    if (isSharedFirebaseKey(trimmed)) {
      setValidationError(
        'The shared Firebase app configuration key cannot be used as a Gemini API key. ' +
        'Please generate and provide your own personal Gemini API key from Google AI Studio (https://aistudio.google.com/apikey).'
      );
      return;
    }

    if (trimmed.length < 20 || !trimmed.startsWith('AIza')) {
      setValidationError(
        'Invalid key format. Google AI Studio Gemini API keys begin with "AIza" and are at least 39 characters long. ' +
        'Generate one at https://aistudio.google.com/apikey.'
      );
      return;
    }

    try {
      setIsValidating(true);
      setValidationError(null);

      const result = await validateGeminiKeyWithServer(trimmed);

      if (!result.valid) {
        setValidationError(result.error || 'Failed to validate Gemini API key with Google AI Studio. Please verify the key and retry.');
        return;
      }

      // Key validated successfully!
      onKeyValidated(trimmed);
    } catch (err: any) {
      setValidationError(err?.message || 'An unexpected error occurred during validation. Please retry.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSignOutClick = async () => {
    try {
      setIsSigningOut(true);
      await onSignOut();
    } catch (err) {
      console.error('Sign out error from Gemini Key Screen:', err);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex flex-col justify-between bg-[#121212] text-white overflow-y-auto p-4 md:p-8 select-none">
      {/* Background visual layer */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden">
        <img
          src={portalBg}
          alt="System Portal"
          className="w-full h-full object-cover brightness-[0.35] contrast-[1.1] filter blur-[2px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/65 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/75 to-transparent pointer-events-none" />
      </div>

      {/* Top Bar: Signed in identity & Sign out action */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between py-3 border-b border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-ww-cyan animate-pulse" />
          <span className="text-white/50 uppercase tracking-widest text-[10px]">Signed in as</span>
          <span className="text-white font-semibold text-xs truncate max-w-[200px] sm:max-w-xs md:max-w-md">
            {user.email || 'Google User'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSignOutClick}
          disabled={isSigningOut || isValidating}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-200 border border-white/15 hover:border-red-500/40 text-[10px] uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
        >
          {isSigningOut ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <LogOut className="w-3 h-3 text-red-400" />
              <span>Sign out</span>
            </>
          )}
        </button>
      </header>

      {/* Center Setup Form Card */}
      <main className="relative z-10 w-full max-w-xl mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-[#181818]/95 backdrop-blur-2xl border border-white/15 p-6 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.9)] text-left"
        >
          {/* Top Stage Indicator */}
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/10">
            <KeyRound className="w-4 h-4 text-ww-cyan" />
            <span className="text-[10px] font-mono tracking-[3px] text-ww-cyan uppercase font-bold">
              STEP 2 OF 2 // MANDATORY GEMINI KEY
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-white mb-3">
            Connect Your Gemini API Key
          </h1>

          {/* Usage Allowance & Billing Disclaimer */}
          <div className="bg-white/[0.03] border border-white/10 p-4 mb-6 text-xs text-white/80 space-y-2 leading-relaxed">
            <p>
              The World Within Method Engine requires a customer-supplied Google Gemini API key to review your architectural choices, enforce constraints, and generate feedback.
            </p>
            <div className="flex items-start gap-2 pt-2 border-t border-white/5 text-[11px] text-amber-200/90">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Usage Allowance Notice:</strong> Your personal key directly supplies your Google Cloud / Google AI Studio usage quota or paid billing tier. We do not provide a shared pool or promise unlimited free usage.
              </span>
            </div>
          </div>

          {/* Strict Form */}
          <form onSubmit={handleValidateAndContinue} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="gemini-api-key"
                  className="text-xs font-mono font-bold uppercase tracking-wider text-white/90"
                >
                  Customer Gemini API Key
                </label>
                <span className="text-[10px] font-mono text-white/40 tracking-wider">
                  STARTS WITH &ldquo;AIza...&rdquo;
                </span>
              </div>

              {/* Masked Input with Show/Hide Toggle */}
              <div className="relative">
                <input
                  id="gemini-api-key"
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Paste your AI Studio key here (AIzaSy...)"
                  autoComplete="off"
                  autoFocus
                  disabled={isValidating}
                  className="w-full bg-black/60 border border-white/20 focus:border-ww-cyan focus:ring-1 focus:ring-ww-cyan px-4 py-3.5 pr-12 text-sm font-mono text-white placeholder:text-white/25 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((prev) => !prev)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-white transition-colors cursor-pointer"
                  title={showKey ? 'Hide key' : 'Show key'}
                  aria-label={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px]">
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-ww-cyan hover:underline font-mono"
                >
                  <span>Get your Gemini API key from Google AI Studio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Validation Error Banner with Retry */}
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-950/70 border border-red-500/50 text-red-200 text-xs space-y-2"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{validationError}</div>
                </div>
                <div className="pt-2 border-t border-red-500/20 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleValidateAndContinue()}
                    className="text-[10px] font-mono uppercase tracking-wider bg-red-600/30 hover:bg-red-600/50 border border-red-400/40 text-white px-3 py-1 cursor-pointer"
                  >
                    Retry Validation
                  </button>
                </div>
              </motion.div>
            )}

            {/* Submit Action: "Validate key and continue" */}
            <button
              type="submit"
              disabled={isValidating || !apiKey.trim()}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-ww-cyan hover:bg-cyan-300 active:scale-[0.99] text-black font-black text-sm uppercase tracking-wider transition-all shadow-[0_4px_25px_rgba(0,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer touch-manipulation"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Validating key with Google Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Validate key and continue</span>
                </>
              )}
            </button>
          </form>

          {/* Security and isolation guarantee */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-start gap-2.5 text-[10px] font-mono text-white/40 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-ww-cyan shrink-0 mt-0.5" />
            <div>
              Your key is isolated per customer and retained in temporary session memory only. It is never logged, stored in public databases, exported, or shared. Sign out immediately clears your session key.
            </div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer Note */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto py-4 text-center text-[10px] font-mono text-white/30 tracking-widest uppercase">
        WORLD WITHIN ENGINE // VERIFIED GOOGLE ACCOUNT &bull; VALIDATED GEMINI API KEY REQUIRED
      </footer>
    </div>
  );
}
