import { request } from '@/api/client/apiClient';
import type { PinnedReportsResponse } from '@/api/types/report';

export const getPinnedReports = async (): Promise<PinnedReportsResponse> => {
  const response = await request<unknown>('pinnedReports');
  if (!response || typeof response !== 'object' || !Array.isArray((response as { reports?: unknown }).reports)) throw new Error('Invalid pinned reports response');
  return response as PinnedReportsResponse;
};
