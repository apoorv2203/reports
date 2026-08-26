export type PinnedReport = {
  id: string;
  title: string;
  updatedAt: string;
  isPinned: boolean;
};

export type PinnedReportsResponse = { reports: PinnedReport[] };
export type ReportRecord = { id: string; title: string; description: string; owner: string; initials: string; status: 'PUBLISHED' | 'DRAFT'; privacy: 'PRIVATE' | 'SHARED'; updatedAt: string; isPinned?: boolean; templateId?: string };
export type ReportsResponse = { items: ReportRecord[]; page: number; pageSize: number; total: number };
export type ReportTemplateResponse = {
  id: string;
  masterTemplateId: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  updated: string;
};
export type ReportTemplatesResponse = { items: ReportTemplateResponse[]; page: number; pageSize: number; total: number };
export type ReportTemplateRenderResponse = { masterTemplateId: string; html: string; generatedAt: string };
export type ReportParameterField = { id: string; displayName: string; dataType: 'DATE' | 'STRING' | 'NUMBER'; group: string };
export type ReportParameterFieldsResponse = { items: ReportParameterField[] };
export type ReportParameter = { id: string; table: string; column: string; label: string; type: 'date' | 'date-range' | 'single-select' | 'multi-select' | 'number' | 'text'; required: boolean; defaultValue?: string | string[]; options?: string[] };
export type ReportParametersResponse = { items: ReportParameter[] };
export type CreateReportPayload = { title: string; description: string; masterTemplateId: string; templateId: string; definition: Record<string, unknown> };
export type CreateReportResponse = { id: string; title: string; status: 'DRAFT'; createdAt: string };
export type ReportApi = { getPinnedReports(): Promise<PinnedReportsResponse>; getReports(options?: Record<string, unknown>): Promise<ReportsResponse>; getReportTemplates(options?: Record<string, unknown>): Promise<ReportTemplatesResponse> };
export type HomeReport = ReportTemplateResponse & { title: string; updatedAt: string; isPinned: boolean };
