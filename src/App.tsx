import { useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, logout, testFirestoreConnection, handleFirestoreError, OperationType } from './services/firebase';
import {
  initSessionKeyForUser,
  clearActiveGeminiKey,
  onKeyInvalidated,
  validateGeminiKeyWithServer,
} from './services/geminiKeyStore';
import Landing from './components/Landing';
import Engine from './components/Engine';
import SignInScreen from './components/SignInScreen';
import GeminiKeyScreen from './components/GeminiKeyScreen';
import DraftMigrationModal from './components/DraftMigrationModal';
import { SystemState } from './types';
// @ts-ignore
import fingerprintBg from './assets/images/fingerprint_bg_1781843080679.jpg';
// @ts-ignore
import portalBg from './assets/images/portal_landing_bg_1781878013871.jpg';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isKeyValidated, setIsKeyValidated] = useState(false);
  const [keyInvalidationMessage, setKeyInvalidationMessage] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [systemLoading, setSystemLoading] = useState(false);

  // Track the currently active UID to prevent unnecessary remounts or reloading loops on token refreshes
  const activeUidRef = useRef<string | null>(null);

  // Unresolved draft state for migration safety
  const [unresolvedDraft, setUnresolvedDraft] = useState<{
    data: SystemState;
    hasExistingAccountData: boolean;
  } | null>(null);

  // Initial boot: validate connection to Firestore
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Subscribe to key invalidation events across the app
  useEffect(() => {
    const unsubscribe = onKeyInvalidated((reason) => {
      setIsKeyValidated(false);
      setKeyInvalidationMessage(reason || 'Your Gemini API key was rejected or is no longer valid. Please re-enter a valid key.');
    });
    return () => unsubscribe();
  }, []);

  // Monitor auth state and restore session automatically
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // 1. If user signed out
      if (!currentUser) {
        if (activeUidRef.current) {
          clearActiveGeminiKey(activeUidRef.current);
        }
        activeUidRef.current = null;
        setUser(null);
        setIsKeyValidated(false);
        setKeyInvalidationMessage(null);
        setIsInitialized(false);
        setUnresolvedDraft(null);
        setSystemLoading(false);
        setAuthChecking(false);
        return;
      }

      // 2. If the user session is already verified for this UID (e.g. background token refresh)
      if (activeUidRef.current === currentUser.uid) {
        // Keep user object fresh without triggering page/component reload
        setUser(currentUser);
        return;
      }

      // 3. New sign-in or initial session restoration for this UID
      activeUidRef.current = currentUser.uid;
      setUser(currentUser);

      // Check if this user has an active session key in sessionStorage
      const existingSessionKey = initSessionKeyForUser(currentUser.uid);
      if (existingSessionKey) {
        // Proactively validate the existing session key
        try {
          const valRes = await validateGeminiKeyWithServer(existingSessionKey);
          if (valRes.valid) {
            setIsKeyValidated(true);
            setKeyInvalidationMessage(null);
          } else {
            setIsKeyValidated(false);
            setKeyInvalidationMessage(valRes.error || 'Please re-validate your Gemini API key.');
          }
        } catch {
          setIsKeyValidated(false);
        }
      } else {
        setIsKeyValidated(false);
        setKeyInvalidationMessage(null);
      }

      try {
        setSystemLoading(true);
        const docRef = doc(db, 'systems', currentUser.uid);
        let docSnap;
        try {
          docSnap = await getDoc(docRef);
        } catch (err) {
          console.error("Firestore getDoc error during auth check:", err);
          setSystemLoading(false);
          setAuthChecking(false);
          return;
        }

        const hasAccountData = docSnap.exists() && !!docSnap.data()?.initialized;

        // Check if there is an unassigned legacy browser draft from an offline session
        const rawLocalDraft = localStorage.getItem('system_state_anonymous');
        if (rawLocalDraft) {
          try {
            const parsedDraft = JSON.parse(rawLocalDraft);
            if (parsedDraft && typeof parsedDraft === 'object') {
              setUnresolvedDraft({
                data: parsedDraft,
                hasExistingAccountData: hasAccountData
              });
            }
          } catch (e) {
            console.error("Error reading legacy browser draft:", e);
            localStorage.removeItem('system_state_anonymous');
          }
        }

        // If the user already has initialized their workspace, restore directly to Engine
        if (hasAccountData) {
          setIsInitialized(true);
        } else {
          setIsInitialized(false);
        }
      } catch (error) {
        console.error("Error loading user system state:", error);
      } finally {
        setSystemLoading(false);
        setAuthChecking(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      if (activeUidRef.current) {
        clearActiveGeminiKey(activeUidRef.current);
      }
      activeUidRef.current = null;
      setIsKeyValidated(false);
      setKeyInvalidationMessage(null);
      await logout();
      setUser(null);
      setIsInitialized(false);
      setUnresolvedDraft(null);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }, []);

  const handleKeyValidated = useCallback((_validatedKey: string) => {
    setIsKeyValidated(true);
    setKeyInvalidationMessage(null);
  }, []);

  const handlePromptUpdateKey = useCallback(() => {
    setIsKeyValidated(false);
    setKeyInvalidationMessage(null);
  }, []);

  const handleInitialize = useCallback(() => {
    setIsInitialized(true);
  }, []);

  const handleBackToLanding = useCallback(() => {
    setIsInitialized(false);
  }, []);

  const handleMigrateDraft = async () => {
    if (!user || !unresolvedDraft) return;
    try {
      const docRef = doc(db, 'systems', user.uid);
      const migratedState: SystemState = {
        ...unresolvedDraft.data,
        userId: user.uid,
        initialized: true,
        updatedAt: new Date().toISOString()
      };

      await setDoc(docRef, {
        ...migratedState,
        updatedAt: serverTimestamp()
      }, { merge: true });

      localStorage.removeItem('system_state_anonymous');
      setUnresolvedDraft(null);
      setIsInitialized(true);
    } catch (err) {
      console.error("Error migrating draft:", err);
      try {
        handleFirestoreError(err, OperationType.WRITE, `systems/${user.uid}`);
      } catch {
        // Handled
      }
    }
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem('system_state_anonymous');
    setUnresolvedDraft(null);
  };

  // 1. Initial auth restoration loading state
  if (authChecking || (systemLoading && !user)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#121212] text-white font-mono text-[11px] tracking-[3px] uppercase">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent border-ww-pink-rose mb-4" />
        <div className="text-white/80">Checking Google Session...</div>
        <div className="text-white/30 text-[9px] mt-2">Connecting to WW_ENGINE Database</div>
      </div>
    );
  }

  // 2. First requirement: strictly require Google sign-in
  if (!user) {
    return <SignInScreen />;
  }

  // 3. Second requirement: strictly require valid customer-supplied Gemini key
  if (!isKeyValidated) {
    return (
      <GeminiKeyScreen
        user={user}
        onKeyValidated={handleKeyValidated}
        onSignOut={handleSignOut}
        initialError={keyInvalidationMessage}
      />
    );
  }

  // 4. Third requirement: Authenticated & Validated -> render Main App (Landing or Engine)
  return (
    <div className="relative min-h-screen w-screen text-white overflow-x-hidden bg-[#121212]">
      {/* Background layer */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden">
        {!isInitialized ? (
          <>
            <img 
              src={portalBg} 
              alt="System Portal Entrance" 
              className="w-full h-full object-cover brightness-[0.6] contrast-[1.05]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/35 pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-full md:w-[600px] bg-gradient-to-r from-black/80 via-black/45 to-transparent pointer-events-none shadow-[20px_0_50px_rgba(0,0,0,0.8)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none" />
          </>
        ) : (
          <>
            <img 
              src={fingerprintBg} 
              alt="System Fingerprint Background" 
              className="w-full h-full object-cover filter blur-[2px] brightness-[0.45] contrast-[1.05]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/45 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-transparent to-[#121212]/90 pointer-events-none" />
          </>
        )}
      </div>

      {/* Draft migration prompt if unassigned local draft detected */}
      {unresolvedDraft && (
        <DraftMigrationModal
          userEmail={user.email || 'your account'}
          draftData={unresolvedDraft.data}
          hasExistingAccountData={unresolvedDraft.hasExistingAccountData}
          onMigrate={handleMigrateDraft}
          onDiscard={handleDiscardDraft}
        />
      )}

      {/* Main app content */}
      <div className="relative z-10 w-full min-h-screen bg-transparent">
        {!isInitialized ? (
          <Landing 
            onInitialize={handleInitialize} 
            user={user} 
            onSignOut={handleSignOut}
            onUpdateKey={handlePromptUpdateKey}
          />
        ) : (
          <Engine 
            onBackToLanding={handleBackToLanding} 
            user={user} 
            onSignOut={handleSignOut}
            onUpdateKey={handlePromptUpdateKey}
          />
        )}
      </div>
    </div>
  );
}
