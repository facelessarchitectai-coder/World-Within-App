import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';
import Landing from './components/Landing';
import Engine from './components/Engine';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // We DO NOT block entire app on loading if initialized is true
  // to ensure immediate re-entry if needed, but usually loading is fast.
  if (loading && !initialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-ww-charcoal-dark">
        <Loader2 className="w-8 h-8 text-ww-pink-rose animate-spin" />
      </div>
    );
  }

  // Implementation of the requested state-driven switch
  return (
    <>
      {!initialized ? (
        <Landing 
          onInitialize={() => setInitialized(true)} 
          initialUser={user} 
        />
      ) : (
        <Engine 
          onBackToLanding={() => setInitialized(false)} 
          user={user}
        />
      )}
    </>
  );
}

