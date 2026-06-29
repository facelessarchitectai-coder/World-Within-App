import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';
import Landing from './components/Landing';
import Engine from './components/Engine';
// @ts-ignore
import fingerprintBg from './assets/images/fingerprint_bg_1781843080679.jpg';
// @ts-ignore
import portalBg from './assets/images/portal_landing_bg_1781878013871.jpg';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#121212] text-white font-mono text-[10px] tracking-[2px] uppercase">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#f06292] mr-4" />
        Loading WW_ENGINE...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-screen text-white overflow-x-hidden bg-[#121212]">
      {/* Immersive background component switcher based on experience state */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden">
        {!isInitialized ? (
          <>
            <img 
              src={portalBg} 
              alt="System Portal Entrance" 
              className="w-full h-full object-cover brightness-[0.6] contrast-[1.05]"
              referrerPolicy="no-referrer"
            />
            {/* Soft high-contrast atmospheric dark layer to preserve text readability over gold/cyan details */}
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
            {/* Consistent dark, premium technical overlays */}
            <div className="absolute inset-0 bg-black/45 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-transparent to-[#121212]/90 pointer-events-none" />
          </>
        )}
      </div>

      <div className="relative z-10 w-full min-h-screen bg-transparent">
        {!isInitialized ? (
          <Landing onInitialize={() => setIsInitialized(true)} initialUser={user} />
        ) : (
          <Engine onBackToLanding={() => setIsInitialized(false)} user={user} />
        )}
      </div>
    </div>
  );
}
