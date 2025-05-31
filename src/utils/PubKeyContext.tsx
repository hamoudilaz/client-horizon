import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type PubKeyContextType = {
  pubKey: string | null;
  setPubKey: (key: string | null) => void;
  authenticated: boolean | null;
  setAuthenticated: (auth: boolean | null) => void;
};

const PubKeyContext = createContext<PubKeyContextType>({
  pubKey: null,
  setPubKey: () => {},
  authenticated: null,
  setAuthenticated: () => {},
});

export const PubKeyProvider = ({ children }: { children: ReactNode }) => {
  const [pubKey, setPubKey] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/session`, {
          credentials: 'include',
        });
        if (!res.ok) {
          setAuthenticated(false);
          return;
        }
        const data = await res.json();
        setPubKey(data.pubKey);
        setAuthenticated(true);
      } catch {
        // silent fail
      }
    };

    checkSession();
  }, []);

  return (
    <PubKeyContext.Provider value={{ pubKey, setPubKey, authenticated, setAuthenticated }}>
      {children}
    </PubKeyContext.Provider>
  );
};

export default PubKeyContext;
