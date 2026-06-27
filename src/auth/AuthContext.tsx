import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { login as apiLogin } from '../api/catalogApi';
import { clearAuthSession, getAuthSession, setAuthSession } from '../api/authSession';
import { clearAdminBranch } from '../api/adminBranchSession';
import { ApiError } from '../api/client';

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  authError: string | null;
  clearAuthError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(() => getAuthSession() !== null);
  const [authError, setAuthError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setAuthError(null);
    try {
      const res = await apiLogin(username.trim(), password);
      setAuthSession({ token: res.token, expiresAt: res.expiresAt });
      setAuthenticated(true);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'No se pudo iniciar sesión';
      setAuthError(msg);
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    clearAdminBranch();
    setAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: authenticated && getAuthSession() !== null,
      login,
      logout,
      authError,
      clearAuthError: () => setAuthError(null),
    }),
    [authenticated, login, logout, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth fuera de AuthProvider');
  return ctx;
}
