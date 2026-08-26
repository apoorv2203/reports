export type AuthRole = 'admin' | 'user';

export type AuthProfile = {
  id: string;
  full_name: string;
  email: string;
  roles: string[];
  is_new_user: boolean;
  role: AuthRole;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
};

export type LoginCredentials = {
  userId: string;
  password: string;
};

export type AuthLoginResponse = {
  profile: AuthProfile;
  session: AuthSession;
};
