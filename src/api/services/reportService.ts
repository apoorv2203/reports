import { request } from '@/api/client/apiClient';
import type { PinnedReportsResponse, ReportRecord, ReportsResponse } from '@/api/types/report';

export type GetReportsOptions = { search?: string; scope?: string; page?: number; pageSize?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' };
export const getReports = async (options: GetReportsOptions = {}): Promise<ReportsResponse> => {
  const response = await request<unknown>('reports', Object.fromEntries(Object.entries(options).filter(([, value]) => value !== undefined).map(([key, value]) => [key, String(value)])));
  if (!response || typeof response !== 'object' || !Array.isArray((response as { items?: unknown }).items)) throw new Error('Invalid reports response');
  return response as ReportsResponse;
};
export const getReport = async (reportId: string): Promise<ReportRecord> => request<ReportRecord>('reportDetails', { reportId });
export const runReport = async (reportId: string, parameters: Record<string, unknown>) => request<unknown>('reportRun', { reportId }, { body: parameters });
export const exportReport = async (reportId: string, payload: Record<string, unknown>) => request<unknown>('reportExport', { reportId }, { body: payload });

export const getPinnedReports = async (): Promise<PinnedReportsResponse> => {
  const response = await request<unknown>('pinnedReports');
  if (!response || typeof response !== 'object' || !Array.isArray((response as { reports?: unknown }).reports)) throw new Error('Invalid pinned reports response');
  return response as PinnedReportsResponse;
};
