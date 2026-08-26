import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { apiConfig, apiDefinitions } from '@/api/config/apiConfig';
import { setSessionExpiredHandler } from '@/api/client/apiClient';
import { logoutSession, loginWithCredentials, refreshSession } from '@/api/services/authService';
import type { AuthSession } from '@/api/types/auth';
import { appConfig } from '@/config/appConfig';
import { getSecureItem, removeSecureItem, removeSecureItemSync, setSecureItem } from '@/lib/secureStorage';

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  roles: string[];
  is_new_user: boolean;
  role: 'admin' | 'user';
};

type AuthContextValue = {
  profile: Profile | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  sessionExpiryAt: number | null;
  signIn: (userId: string, password: string) => Promise<{ error: string | null }>;
  refreshNow: () => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const AUTH_STORAGE_KEY = 'reportiq_auth';

type StoredAuth = {
  profile: Profile;
  session: AuthSession;
  sessionUpdatedAt: number;
  sessionExpiryAt: number | null;
};

const shouldBypassSessionTimeout = () => apiDefinitions.authLogin.mode === 'mock' && apiConfig.sessionTimeoutBypassWhenMock;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [sessionUpdatedAt, setSessionUpdatedAt] = useState<number>(Date.now());
  const [sessionExpiryAt, setSessionExpiryAt] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const signingOutRef = useRef(false);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const parsed = await getSecureItem<Partial<StoredAuth>>(AUTH_STORAGE_KEY);
        if (!parsed?.profile || !parsed.session) return;
        const expiryAt = typeof parsed.sessionExpiryAt === 'number' ? parsed.sessionExpiryAt : null;
        if (!shouldBypassSessionTimeout() && (!expiryAt || expiryAt <= Date.now())) {
          removeSecureItemSync(AUTH_STORAGE_KEY);
          return;
        }
        if (!active) return;
        setProfile(parsed.profile);
        setSession(parsed.session);
        setSessionUpdatedAt(typeof parsed.sessionUpdatedAt === 'number' ? parsed.sessionUpdatedAt : Date.now());
        setSessionExpiryAt(expiryAt);
      } catch {
        removeSecureItemSync(AUTH_STORAGE_KEY);
      } finally {
        if (active) setIsHydrated(true);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!profile) return;
    const handlePageExit = () => {
      removeSecureItemSync(AUTH_STORAGE_KEY);
    };

    window.addEventListener('beforeunload', handlePageExit);
    window.addEventListener('pagehide', handlePageExit);
    return () => {
      window.removeEventListener('beforeunload', handlePageExit);
      window.removeEventListener('pagehide', handlePageExit);
    };
  }, [profile?.id]);

  const signOut = useCallback(async ({ skipRemote = false }: { skipRemote?: boolean } = {}) => {
    if (signingOutRef.current) return;
    signingOutRef.current = true;
    try {
      if (!skipRemote) {
        try { await logoutSession(session ?? undefined); } catch { /* ignore logout API failures */ }
      }
      setProfile(null);
      setSession(null);
      setSessionUpdatedAt(Date.now());
      setSessionExpiryAt(null);
      await removeSecureItem(AUTH_STORAGE_KEY);
    } finally {
      signingOutRef.current = false;
    }
  }, [session]);

  const refreshNow = useCallback(async (): Promise<boolean> => {
    if (!profile || !session || signingOutRef.current) return false;
    try {
      const refreshed = await refreshSession(session);
      const now = Date.now();
      const expiryAt = now + (refreshed.expiresIn > 0 ? refreshed.expiresIn * 1000 : appConfig.sessionTimeoutMs);
      setSession(refreshed);
      setSessionUpdatedAt(now);
      setSessionExpiryAt(expiryAt);
      await setSecureItem(AUTH_STORAGE_KEY, { profile, session: refreshed, sessionUpdatedAt: now, sessionExpiryAt: expiryAt } satisfies StoredAuth);
      return true;
    } catch {
      return false;
    }
  }, [profile, session]);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      if (signingOutRef.current) return;
      void signOut({ skipRemote: true });
    });
    return () => setSessionExpiredHandler(undefined);
  }, [signOut]);

  async function signIn(userId: string, password: string): Promise<{ error: string | null }> {
    try {
      const { profile: nextProfile, session: nextSession } = await loginWithCredentials({ userId, password });
      const now = Date.now();
      const expiryAt = shouldBypassSessionTimeout()
        ? null
        : now + (nextSession.expiresIn > 0 ? nextSession.expiresIn * 1000 : appConfig.sessionTimeoutMs);
      setProfile(nextProfile);
      setSession(nextSession);
      setSessionUpdatedAt(now);
      setSessionExpiryAt(expiryAt);
      await setSecureItem(AUTH_STORAGE_KEY, { profile: nextProfile, session: nextSession, sessionUpdatedAt: now, sessionExpiryAt: expiryAt } satisfies StoredAuth);
      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unable to sign in right now. Please try again.',
      };
    }
  }


  return (
    <AuthContext.Provider value={{ profile, isAuthenticated: Boolean(profile), isHydrated, sessionExpiryAt, signIn, refreshNow, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
