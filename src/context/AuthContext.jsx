import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, getToken, TOKEN_KEY } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken);
  const [user, setUser] = useState(null);
  // 'loading' while we validate a stored token, then 'authed' or 'anon'.
  const [status, setStatus] = useState(token ? 'loading' : 'anon');

  useEffect(() => {
    if (!token) {
      setStatus('anon');
      return;
    }
    let cancelled = false;
    api
      .get('/auth/me')
      .then(({ user }) => {
        if (cancelled) return;
        setUser(user);
        setStatus('authed');
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        setStatus('anon');
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const signup = useCallback(async (email, password) => {
    const { token: newToken, user: newUser } = await api.post('/auth/signup', { email, password });
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
    setStatus('authed');
  }, []);

  const signin = useCallback(async (email, password) => {
    const { token: newToken, user: newUser } = await api.post('/auth/signin', { email, password });
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
    setStatus('authed');
  }, []);

  const signout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setStatus('anon');
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, signup, signin, signout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
