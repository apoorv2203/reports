import type { ReportTemplate } from '@/data/reportTemplates';

export type PinnedReport = {
  id: string;
  title: string;
  updatedAt: string;
  isPinned: boolean;
};

export type PinnedReportsResponse = { reports: PinnedReport[] };
export type ReportApi = { getPinnedReports(): Promise<PinnedReportsResponse> };
export type HomeReport = ReportTemplate & { id: string; title: string; updatedAt: string; isPinned: boolean };
