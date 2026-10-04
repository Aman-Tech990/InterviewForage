import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, tokenStore } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [restoring, setRestoring] = useState(Boolean(tokenStore.get()));

  // Restore the session on first load if a token exists.
  useEffect(() => {
    if (!tokenStore.get()) return;
    api.get('/auth/me').then((data) => setUser(data.user)).catch(() => tokenStore.clear()).finally(() => setRestoring(false));
  }, []);

  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, []);

  const authenticate = useCallback(async (path, body) => {
    const data = await api.post(path, body);
    tokenStore.set(data.token);
    setUser(data.user);
  }, []);

  const value = useMemo(() => ({
    user,
    restoring,
    login: (body) => authenticate('/auth/login', body),
    register: (body) => authenticate('/auth/register', body),
    logout: () => { api.post('/auth/logout').catch(() => {}); tokenStore.clear(); setUser(null); },
  }), [user, restoring, authenticate]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
