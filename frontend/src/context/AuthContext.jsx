import { createContext, useContext, useEffect, useState } from 'react';
import { api, saveToken, clearToken } from '../api.js';

const AuthContext = createContext(null);
const SESSION_KEY = 'nexus_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      if (session) setUser(session);
    } catch {
      /* no session */
    }
    setReady(true);
  }, []);

  async function signup({ name, email, password }) {
    try {
      const { token, user: newUser } = await api.signup({ name, email, password });
      saveToken(token);
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  async function login({ email, password }) {
    try {
      const { token, user: loggedInUser } = await api.login({ email, password });
      saveToken(token);
      localStorage.setItem(SESSION_KEY, JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  function logout() {
    clearToken();
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
