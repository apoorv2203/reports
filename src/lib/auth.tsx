import { createContext, useContext, useState, type ReactNode } from 'react';

export type Profile = {
  id: string;
  full_name: string;
  is_new_user: boolean;
};

type AuthContextValue = {
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const mockUsers: Record<string, Profile & { password: string }> = {
  'rahul.new@reportiq.dev': {
    id: 'demo-new',
    full_name: 'Rahul',
    is_new_user: true,
    password: 'welcome123',
  },
  'anita.experienced@reportiq.dev': {
    id: 'demo-experienced',
    full_name: 'Anita Gupta',
    is_new_user: false,
    password: 'welcome123',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  async function signIn(email: string, password: string): Promise<{ error: string | null }> {
    const key = email.trim().toLowerCase();
    const user = mockUsers[key];
    if (!user || user.password !== password) {
      return { error: 'Invalid email or password. Try one of the demo accounts below.' };
    }
    setProfile({ id: user.id, full_name: user.full_name, is_new_user: user.is_new_user });
    return { error: null };
  }

  function signOut() {
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ profile, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
