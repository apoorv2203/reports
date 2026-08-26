import { apiConfig } from '@/api/config/apiConfig';
import { request } from '@/api/client/apiClient';
import type { AuthLoginResponse, AuthProfile, AuthSession, LoginCredentials } from '@/api/types/auth';

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object';

const asRole = (value: unknown): 'admin' | 'user' => {
  const normalized = String(value ?? '').toLowerCase();
  return normalized.includes('admin') ? 'admin' : 'user';
};

const parseSession = (value: unknown, fallbackId: string): AuthSession => {
  const data = isRecord(value) ? value : {};
  const accessToken = (data.accessToken ?? data.token ?? `token_${fallbackId}`).toString();
  const refreshToken = (data.refreshToken ?? `refresh_${fallbackId}`).toString();
  const expiresIn = Number(data.expiresIn ?? apiConfig.authSessionExpiresIn);
  const refreshExpiresIn = Number(data.refreshExpiresIn ?? apiConfig.authSessionRefreshExpiresIn);
  return { accessToken, refreshToken, expiresIn, refreshExpiresIn };
};

const parseProfile = (value: unknown): AuthProfile | null => {
  if (!isRecord(value)) return null;
  if (!('id' in value) || !('full_name' in value)) return null;
  const roles = Array.isArray(value.roles) ? value.roles.map((role) => String(role)) : [];
  return {
    id: String(value.id),
    full_name: String(value.full_name),
    email: String(value.email ?? ''),
    roles,
    is_new_user: Boolean(value.is_new_user),
    role: asRole(value.role),
  };
};

const parseSuccessPayload = (value: unknown): AuthLoginResponse => {
  if (!isRecord(value)) throw new Error('Login failed - invalid server response.');

  const directProfile = parseProfile((value as { profile?: unknown }).profile);
  if (directProfile) {
    return {
      profile: directProfile,
      session: parseSession(value, directProfile.id),
    };
  }

  const status = (value as { status?: unknown }).status;
  if (status === 'fail') {
    const errors = (value as { errors?: unknown }).errors;
    const first = Array.isArray(errors) ? errors[0] : undefined;
    const message = isRecord(first) ? first.message : undefined;
    throw new Error(typeof message === 'string' && message ? message : 'Login failed.');
  }

  const data = (value as { data?: unknown }).data;
  if (isRecord(data)) {
    const user = (data as { user?: unknown }).user;
    if (isRecord(user)) {
      const roles = (data as { roles?: unknown[] }).roles;
      const roleEntries = Array.isArray(roles) ? roles : [];
      const roleEntry = roleEntries[0];
      const roleCode = isRecord(roleEntry) ? roleEntry.roleCode : undefined;
      const roleCodes = roleEntries
        .map((entry) => (isRecord(entry) ? entry.roleCode : entry))
        .filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0)
        .map((entry) => entry.trim());
      const fullName = (user.displayName ?? user.full_name ?? user.username ?? user.email ?? '').toString().trim();
      const id = (user.userId ?? user.id ?? user.username ?? user.email ?? '').toString().trim();
      if (!id || !fullName) throw new Error('Login failed - missing profile information.');
      return {
        profile: {
          id,
          full_name: fullName,
          email: (user.email ?? '').toString(),
          roles: roleCodes,
          is_new_user: Boolean(user.is_new_user),
          role: asRole(roleCode ?? user.role ?? roleCodes[0]),
        },
        session: parseSession(data, id),
      };
    }
  }

  throw new Error('Login failed - unsupported response shape.');
};

export const loginWithCredentials = async ({ userId, password }: LoginCredentials): Promise<AuthLoginResponse> => {
  const identifier = userId.trim();
  const response = await request<unknown>('authLogin', {}, {
    body: {
      loginType: apiConfig.authLoginType,
      bankId: apiConfig.authBankId,
      username: identifier,
      password,
    },
  });
  return parseSuccessPayload(response);
};

export const logoutSession = async (session?: AuthSession): Promise<void> => {
  await request<unknown>('authLogout', {}, {
    method: 'POST',
    headers: session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : undefined,
    body: session?.accessToken ? { refreshToken: session.accessToken } : {},
  });
};

export const refreshSession = async (session: AuthSession): Promise<AuthSession> => {
  const response = await request<unknown>('authRefreshToken', {}, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.accessToken}` },
    body: { refreshToken: session.refreshToken },
  });

  if (isRecord(response) && response.status === 'success' && isRecord(response.data)) {
    return parseSession(response.data, 'refresh');
  }

  if (isRecord(response) && isRecord(response.session)) {
    return parseSession(response.session, 'refresh');
  }

  return parseSession(response, 'refresh');
};
