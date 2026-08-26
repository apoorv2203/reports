import { apiConfig } from '@/api/config/apiConfig';

export const appConfig = {
  sessionTimeoutEnabled: true,
  sessionTimeoutMs: apiConfig.sessionTimeoutMs,
  sessionWarningMs: apiConfig.sessionWarningMs,
  sessionExpiredLogoutDelayMs: apiConfig.sessionExpiredLogoutDelayMs,
  autoUpdateEnabled: apiConfig.autoUpdateEnabled,
  versionCheckInterval: apiConfig.versionCheckIntervalMs,
  showUpdateNotification: apiConfig.showUpdateNotification,
  roleBasedLanding: apiConfig.roleBasedLanding,
} as const;

export function resolveLandingByRole(role: string | undefined): 'home' | 'admin' {
  if (!role) return 'home';
  if (appConfig.roleBasedLanding[role]) return appConfig.roleBasedLanding[role];
  const normalized = role.toLowerCase();
  if (appConfig.roleBasedLanding[normalized]) return appConfig.roleBasedLanding[normalized];
  return normalized.includes('admin') ? 'admin' : 'home';
}
