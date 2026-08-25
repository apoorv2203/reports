import { request } from '@/api/client/apiClient';
import type { PinnedReportsResponse } from '@/api/types/report';

export const getPinnedReports = () => request<PinnedReportsResponse>('pinnedReports');
