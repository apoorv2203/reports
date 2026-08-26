import type { PinnedReportsResponse, ReportParameterFieldsResponse, ReportRecord, ReportTemplateRenderResponse, ReportsResponse, ReportTemplatesResponse } from '@/api/types/report';
import { reportTemplates } from '@/data/reportTemplates';

const records: ReportRecord[] = [
  { id: 'q2', title: 'Q2 branch review', description: 'Comprehensive review of branch performance and key metrics for Q2.', owner: 'You', initials: 'RA', status: 'PUBLISHED', privacy: 'PRIVATE', updatedAt: '2026-08-25T07:00:00Z', templateId: 'branch' },
  { id: 'loan', title: 'Loan portfolio summary', description: 'Summary of loan portfolio performance and key trends.', owner: 'You', initials: 'RA', status: 'DRAFT', privacy: 'PRIVATE', updatedAt: '2026-08-24T07:00:00Z', templateId: 'loan' },
  { id: 'npa', title: 'NPA trend analysis', description: 'Trend of gross and net NPA across time periods.', owner: 'Anita Gupta', initials: 'AG', status: 'PUBLISHED', privacy: 'SHARED', updatedAt: '2026-08-23T07:00:00Z', templateId: 'npa' },
  { id: 'collections', title: 'Collection efficiency report', description: 'Analysis of collection efficiency and bucket performance.', owner: 'Rohit Mehta', initials: 'RM', status: 'PUBLISHED', privacy: 'SHARED', updatedAt: '2026-08-22T07:00:00Z', templateId: 'collections' },
  { id: 'segments', title: 'Customer segment performance', description: 'Performance of customer segments across key metrics.', owner: 'Sneha Banerjee', initials: 'SB', status: 'DRAFT', privacy: 'SHARED', updatedAt: '2026-08-21T07:00:00Z', templateId: 'segments' },
  { id: 'risk', title: 'High risk accounts overview', description: 'Overview of high risk accounts and outstanding amounts.', owner: 'Rohit Mehta', initials: 'RM', status: 'PUBLISHED', privacy: 'SHARED', updatedAt: '2026-08-20T07:00:00Z', templateId: 'risk' },
  { id: 'mix', title: 'Product mix analysis', description: 'Distribution of disbursals by product category.', owner: 'Anita Gupta', initials: 'AG', status: 'PUBLISHED', privacy: 'SHARED', updatedAt: '2026-08-19T07:00:00Z', templateId: 'mix' },
  { id: 'ops', title: 'Operational KPI dashboard', description: 'Key operational KPIs and performance tracker.', owner: 'You', initials: 'RA', status: 'DRAFT', privacy: 'PRIVATE', updatedAt: '2026-08-18T07:00:00Z', templateId: 'ops' },
];

const parameterFields: ReportParameterFieldsResponse['items'] = [
  { id: 'disbursed_at', displayName: 'Disbursement period', dataType: 'DATE', group: 'Loans' },
  { id: 'risk_level', displayName: 'Risk level', dataType: 'STRING', group: 'Loans' },
  { id: 'product', displayName: 'Loan product', dataType: 'STRING', group: 'Loans' },
  { id: 'minimum_balance', displayName: 'Minimum outstanding balance', dataType: 'NUMBER', group: 'Loans' },
  { id: 'region', displayName: 'Region', dataType: 'STRING', group: 'Branches' },
  { id: 'branch_name', displayName: 'Branch', dataType: 'STRING', group: 'Branches' },
  { id: 'audit_date', displayName: 'Audit date', dataType: 'DATE', group: 'Audit records' },
  { id: 'status', displayName: 'Audit status', dataType: 'STRING', group: 'Audit records' },
  { id: 'owner', displayName: 'Owner contains', dataType: 'STRING', group: 'Audit records' },
];

export const reportMockProvider = {
  renderReportTemplate: async ({ params = {} }: { params?: Record<string, string> } = {}): Promise<ReportTemplateRenderResponse> => ({ masterTemplateId: params.masterTemplateId ?? '', generatedAt: new Date().toISOString(), html: '<article class="report-render"><header><p>ReportIQ preview</p><h2>Branch performance summary</h2></header><section><h3>Key performance indicators</h3><div><strong>97.9 Cr</strong><span>Outstanding balance</span></div><div><strong>1,284</strong><span>Active loans</span></div></section><section><h3>Branch performance</h3><p>Rendered Jasper report preview</p></section></article>' }),
  getReportParameterFields: async ({ params = {} }: { params?: Record<string, string> } = {}): Promise<ReportParameterFieldsResponse> => {
    const search = (params.search ?? '').toLowerCase();
    return { items: parameterFields.filter((field) => !search || `${field.displayName} ${field.group}`.toLowerCase().includes(search)) };
  },
  getReportTemplates: async ({ params = {} }: { params?: Record<string, string> } = {}): Promise<ReportTemplatesResponse> => {
    const search = (params.search ?? '').toLowerCase();
    const items = reportTemplates
      .filter((template) => !search || `${template.name} ${template.category} ${template.description}`.toLowerCase().includes(search))
      .map((template) => ({ ...template, description: template.description }));
    return { items, page: Number(params.page ?? 0), pageSize: Number(params.pageSize ?? items.length), total: items.length };
  },
  createReport: async (payload: { title: string; description: string; masterTemplateId: string; templateId: string; definition: Record<string, unknown> }) => ({ id: `rpt-${Date.now()}`, title: payload.title, status: 'DRAFT' as const, createdAt: new Date().toISOString() }),
  getReports: async ({ params = {} }: { params?: Record<string, string> } = {}): Promise<ReportsResponse> => {
    const search = (params.search ?? '').toLowerCase();
    const scope = params.scope;
    const filtered = records.filter((report) => (!search || `${report.title} ${report.owner} ${report.description}`.toLowerCase().includes(search)) && (scope !== 'MY_REPORTS' || report.owner === 'You') && (scope !== 'SHARED_WITH_ME' || report.owner !== 'You'));
    const page = Number(params.page ?? 0); const pageSize = Number(params.pageSize ?? 20);
    return { items: filtered.slice(page * pageSize, (page + 1) * pageSize), page, pageSize, total: filtered.length };
  },
  getPinnedReports: async (): Promise<PinnedReportsResponse> => ({
    reports: [
      { id: 'rpt-1001', title: 'Loan Portfolio Summary', updatedAt: '2026-08-25T07:00:00Z', isPinned: true },
      { id: 'rpt-1002', title: 'Delinquency Analysis', updatedAt: '2026-08-24T07:00:00Z', isPinned: true },
      { id: 'rpt-1003', title: 'Branch Performance', updatedAt: '2026-08-22T07:00:00Z', isPinned: true },
      { id: 'rpt-1004', title: 'Collection Performance', updatedAt: '2026-08-20T07:00:00Z', isPinned: false },
      { id: 'rpt-1005', title: 'Credit Risk Overview', updatedAt: '2026-08-19T07:00:00Z', isPinned: false },
      { id: 'rpt-1006', title: 'Portfolio Vintage Analysis', updatedAt: '2026-08-18T07:00:00Z', isPinned: false },
      { id: 'rpt-1007', title: 'Regional Disbursement', updatedAt: '2026-08-16T07:00:00Z', isPinned: false },
      { id: 'rpt-1008', title: 'Loan Aging Summary', updatedAt: '2026-08-13T07:00:00Z', isPinned: false },
      { id: 'rpt-1009', title: 'Branch Target Tracker', updatedAt: '2026-08-11T07:00:00Z', isPinned: false },
      { id: 'rpt-1010', title: 'Customer Segmentation', updatedAt: '2026-08-04T07:00:00Z', isPinned: false },
    ],
  }),
};
