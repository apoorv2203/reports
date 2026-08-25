import type { ReportTemplate } from '@/data/reportTemplates';

export type PinnedReport = {
  id: string;
  title: string;
  updatedAt: string;
  isPinned: boolean;
};

export type PinnedReportsResponse = { reports: PinnedReport[] };
export type ReportRecord = { id: string; title: string; description: string; owner: string; initials: string; status: 'PUBLISHED' | 'DRAFT'; privacy: 'PRIVATE' | 'SHARED'; updatedAt: string; isPinned?: boolean; templateId?: string };
export type ReportsResponse = { items: ReportRecord[]; page: number; pageSize: number; total: number };
export type ReportApi = { getPinnedReports(): Promise<PinnedReportsResponse>; getReports(options?: Record<string, unknown>): Promise<ReportsResponse> };
export type HomeReport = ReportTemplate & { id: string; title: string; updatedAt: string; isPinned: boolean };
