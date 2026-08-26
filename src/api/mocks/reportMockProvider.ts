import type { PinnedReportsResponse, ReportParameterFieldsResponse, ReportRecord, ReportTemplateRenderResponse, ReportsResponse, ReportTemplatesResponse } from '@/api/types/report';
import type { ReportTemplateResponse } from '@/api/types/report';

const templates: ReportTemplateResponse[] = [
  { id: 'branch', masterTemplateId: 'JR_BRANCH_SUMMARY', name: 'Branch Summary', category: 'Most Used', description: 'Branch performance report', preview: '/templates/branch-summary.png', updated: 'Used 28 times this month' },
  { id: 'portfolio', masterTemplateId: 'JR_PORTFOLIO_OVERVIEW', name: 'Portfolio Overview', category: 'Most Used', description: 'Portfolio health and movement report', preview: '/templates/portfolio-overview.png', updated: 'Used 21 times this month' },
  { id: 'operations', masterTemplateId: 'JR_OPERATIONS_PULSE', name: 'Operations Pulse', category: 'Recommended', description: 'Operational performance report', preview: '/templates/operations-pulse.png', updated: 'Used 14 times this month' },
  { id: 'blank', masterTemplateId: 'JR_BLANK_SHELL', name: 'Start from blank', category: 'Other', description: 'Build a report from a blank canvas', preview: '/templates/blank.png', updated: 'New template' },
];

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
  renderReportTemplate: async ({ params = {} }: { params?: Record<string, string> } = {}): Promise<ReportTemplateRenderResponse> => {
    const masterTemplateId = params.masterTemplateId ?? '';
    const html = masterTemplateId === 'JR_BRANCH_SUMMARY' ? `
      <style>
        .report-render{box-sizing:border-box;max-width:900px;margin:0 auto;padding:40px;color:#17324d;background:#fff;font-family:Arial,Helvetica,sans-serif;line-height:1.5}.report-render *{box-sizing:border-box}.report-render header{border-bottom:2px solid #dce7ee;padding-bottom:24px;margin-bottom:28px}.report-render .eyebrow{margin:0 0 8px;color:#16845f;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}.report-render h1{margin:0;font-size:30px;line-height:1.2}.report-render .description{margin:12px 0 0;color:#60758a;font-size:15px}.report-render section{margin-top:28px}.report-render h2{margin:0 0 16px;font-size:18px}.report-render .kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.report-render .kpi{border:1px solid #dce7ee;border-radius:10px;padding:18px;background:#f8fbfc}.report-render .kpi-label{display:block;color:#60758a;font-size:12px}.report-render .kpi-value{display:block;margin-top:6px;color:#17324d;font-size:24px;font-weight:700}.report-render .chart{display:flex;align-items:end;gap:18px;height:190px;border:1px solid #dce7ee;border-radius:10px;padding:20px 24px 24px;background:#f8fbfc}.report-render .bar-wrap{display:flex;flex:1;height:100%;align-items:end;justify-content:center;gap:8px}.report-render .bar{width:32px;border-radius:5px 5px 0 0;background:#16845f}.report-render .bar.secondary{background:#8bcab0}.report-render .bar-label{color:#60758a;font-size:11px}.report-render table{width:100%;border-collapse:collapse;border:1px solid #dce7ee;border-radius:10px;overflow:hidden;font-size:13px}.report-render th{background:#f0f6f8;color:#17324d;text-align:start;font-size:12px}.report-render td,.report-render th{padding:13px 16px;border-bottom:1px solid #dce7ee}.report-render tbody tr:last-child td{border-bottom:0}.report-render .positive{color:#16845f;font-weight:700}@media(max-width:640px){.report-render{padding:24px}.report-render .kpis{grid-template-columns:1fr}.report-render .chart{gap:8px;padding-inline:10px}.report-render .bar{width:22px}}
      </style>
      <article class="report-render" aria-labelledby="branch-report-title">
        <header><p class="eyebrow">ReportIQ preview</p><h1 id="branch-report-title">Branch Performance Summary</h1><p class="description">A concise view of branch performance, lending activity, and portfolio health for the current reporting period.</p></header>
        <section aria-labelledby="kpi-heading"><h2 id="kpi-heading">Key performance indicators</h2><div class="kpis"><div class="kpi"><span class="kpi-label">Outstanding balance</span><strong class="kpi-value">97.9 Cr</strong></div><div class="kpi"><span class="kpi-label">Active loans</span><strong class="kpi-value">1,284</strong></div><div class="kpi"><span class="kpi-label">Growth this quarter</span><strong class="kpi-value positive">+7.2%</strong></div></div></section>
        <section aria-labelledby="chart-heading"><h2 id="chart-heading">Branch performance</h2><div class="chart" role="img" aria-label="Bar chart comparing branch performance"><div class="bar-wrap"><div class="bar" style="height:76%"></div><span class="bar-label">Central</span></div><div class="bar-wrap"><div class="bar secondary" style="height:58%"></div><span class="bar-label">North</span></div><div class="bar-wrap"><div class="bar" style="height:88%"></div><span class="bar-label">South</span></div><div class="bar-wrap"><div class="bar secondary" style="height:68%"></div><span class="bar-label">West</span></div></div></section>
        <section aria-labelledby="table-heading"><h2 id="table-heading">Summary table</h2><table><thead><tr><th scope="col">Branch</th><th scope="col">Active loans</th><th scope="col">Outstanding balance</th><th scope="col">Change</th></tr></thead><tbody><tr><td>Central</td><td>412</td><td>31.4 Cr</td><td class="positive">+8.4%</td></tr><tr><td>North</td><td>286</td><td>21.8 Cr</td><td class="positive">+5.1%</td></tr><tr><td>South</td><td>356</td><td>27.6 Cr</td><td class="positive">+9.7%</td></tr><tr><td>West</td><td>230</td><td>17.1 Cr</td><td class="positive">+4.2%</td></tr></tbody></table></section>
      </article>` : `<article class="report-render"><header><p class="eyebrow">ReportIQ preview</p><h1>Report preview</h1><p class="description">Rendered template: ${masterTemplateId}</p></header><section><h2>Report content</h2><p>This Jasper template is ready for report data.</p></section></article>`;
    return { masterTemplateId, generatedAt: new Date().toISOString(), html };
  },
  getReportParameterFields: async ({ params = {} }: { params?: Record<string, string> } = {}): Promise<ReportParameterFieldsResponse> => {
    const search = (params.search ?? '').toLowerCase();
    return { items: parameterFields.filter((field) => !search || `${field.displayName} ${field.group}`.toLowerCase().includes(search)) };
  },
  getReportTemplates: async ({ params = {} }: { params?: Record<string, string> } = {}): Promise<ReportTemplatesResponse> => {
    const search = (params.search ?? '').toLowerCase();
    const items = templates.filter((template) => !search || `${template.name} ${template.category} ${template.description}`.toLowerCase().includes(search));
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
