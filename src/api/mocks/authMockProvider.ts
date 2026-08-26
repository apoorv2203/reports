import { apiConfig } from '@/api/config/apiConfig';
import type { AuthLoginResponse, AuthSession } from '@/api/types/auth';

const mockUsers: Record<string, { id: string; full_name: string; is_new_user: boolean; role: 'admin' | 'user'; password: string }> = {
  'rahul.new@reportiq.dev': {
    id: 'demo-new',
    full_name: 'Rahul',
    is_new_user: true,
    role: 'user',
    password: 'welcome123',
  },
  'admin@reportiq.dev': {
    id: 'demo-admin',
    full_name: 'Admin User',
    is_new_user: false,
    role: 'admin',
    password: 'welcome123',
  },
  'anita.experienced@reportiq.dev': {
    id: 'demo-experienced',
    full_name: 'Anita Gupta',
    is_new_user: false,
    role: 'user',
    password: 'welcome123',
  },
};

export const authMockProvider = {
  login: async (body: unknown): Promise<AuthLoginResponse> => {
    const payload = (body ?? {}) as { userId?: string; username?: string; email?: string; password?: string };
    const userId = (payload.userId ?? payload.username ?? payload.email ?? '').trim().toLowerCase();
    const password = payload.password ?? '';
    const user = mockUsers[userId];
    if (!user || user.password !== password) {
      throw new Error('Invalid user ID or password. Try one of the demo accounts below.');
    }

    return {
      profile: {
        id: user.id,
        full_name: user.full_name,
        email: userId,
        roles: [user.role === 'admin' ? 'BANK_ADMIN' : 'ANALYST'],
        is_new_user: user.is_new_user,
        role: user.role,
      },
      session: {
        accessToken: `mock_access_${user.id}`,
        refreshToken: `mock_refresh_${user.id}`,
        expiresIn: apiConfig.authSessionExpiresIn,
        refreshExpiresIn: apiConfig.authSessionRefreshExpiresIn,
      },
    };
  },
  refresh: async (body: unknown): Promise<{ session: AuthSession }> => {
    const payload = (body ?? {}) as { refreshToken?: string };
    const refreshToken = (payload.refreshToken ?? '').trim();
    if (!refreshToken.startsWith('mock_refresh_')) {
      throw new Error('Invalid refresh token.');
    }
    return {
      session: {
        accessToken: `mock_access_${Date.now()}`,
        refreshToken,
        expiresIn: apiConfig.authSessionExpiresIn,
        refreshExpiresIn: apiConfig.authSessionRefreshExpiresIn,
      },
    };
  },
  logout: async (): Promise<{ success: true }> => ({ success: true }),
};
