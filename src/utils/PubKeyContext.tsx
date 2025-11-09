import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import ws from '../services/wsClient';
import { useLocation } from 'react-router-dom';
import { checkDemo } from '../services/demo/api';

type PubKeyContextType = {
  pubKey: string | null;
  setPubKey: (key: string | null) => void;
  authenticated: boolean | null;
  setAuthenticated: (auth: boolean | null) => void;
  setValidDemo: (auth: boolean | null) => void;
  demo: boolean | null;
};

const PubKeyContext = createContext<PubKeyContextType>({
  pubKey: null,
  setPubKey: () => {},
  authenticated: null,
  setAuthenticated: () => {},
  setValidDemo: () => {},
  demo: null,
});

const API_BASE = import.meta.env.VITE_API_URL || '';

export const PubKeyProvider = ({ children }: { children: ReactNode }) => {
  const [pubKey, setPubKey] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [demo, setValidDemo] = useState<boolean | null>(null);

  const location = useLocation();
  const isDemo = location.pathname === '/demo';

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/session`, {
          credentials: 'include',
        });
        if (!res.ok) {
          setAuthenticated(false);
          return;
        }
        const data = await res.json();
        setPubKey(data.pubKey);
        setAuthenticated(true);
      } catch (err) {
        console.error('Session check failed:', err);
        setAuthenticated(false);
      }
    };
    if (!isDemo) checkSession();
  }, [isDemo]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await checkDemo();
        console.log(data);
        if (data.valid) {
          setValidDemo(true);
        } else {
          setValidDemo(false);
        }
      } catch (err) {
        console.error('Session check failed:', err);
        setValidDemo(false);
      }
    };
    if (isDemo) checkSession();
  }, [isDemo]);

  useEffect(() => {
    const authenticateWebSocket = () => {
      if (authenticated && pubKey && ws.readyState === WebSocket.OPEN) {
        const clientId = sessionStorage.getItem('clientId') ?? crypto.randomUUID();
        sessionStorage.setItem('clientId', clientId);

        ws.send(JSON.stringify({ type: 'auth', pubKey, clientId }));
        console.log('WebSocket authenticated with pubKey:', pubKey);
      }
    };

    if (ws.readyState === WebSocket.OPEN) {
      authenticateWebSocket();
    }

    ws.addEventListener('open', authenticateWebSocket);

    return () => {
      ws.removeEventListener('open', authenticateWebSocket);
    };
  }, [authenticated, pubKey]);

  return (
    <PubKeyContext.Provider value={{ pubKey, setPubKey, authenticated, setAuthenticated, setValidDemo, demo }}>
      {children}
    </PubKeyContext.Provider>
  );
};

export default PubKeyContext;
