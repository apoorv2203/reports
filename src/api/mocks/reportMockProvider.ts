import type { PinnedReportsResponse, ReportParameterFieldsResponse, ReportRecord, ReportTemplateRenderResponse, ReportsResponse, ReportTemplatesResponse, ReportParametersResponse } from '@/api/types/report';
import { defaultReportParameters } from '@/data/reportTemplates';
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
    const base = `<style>.jasper-report{font-family:Arial,sans-serif;max-width:900px;margin:auto;padding:32px;color:#17324d}.jasper-report header{border-bottom:2px solid #dce7ee;padding-bottom:18px}.jasper-report h1{margin:0 0 8px}.jasper-report h2{margin-top:24px}.jasper-report p{color:#60758a}.jasper-report .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.jasper-report .metric,.jasper-report .panel{border:1px solid #dce7ee;border-radius:10px;padding:16px;background:#f8fbfc}.jasper-report .metric strong{display:block;font-size:24px;margin-top:6px}.jasper-report table{width:100%;border-collapse:collapse}.jasper-report th,.jasper-report td{text-align:left;padding:10px;border-bottom:1px solid #dce7ee}</style>`;
    const reports: Record<string, string> = {
      JR_BRANCH_SUMMARY: `${base}<article class="jasper-report"><header><h1>Branch Performance Summary</h1><p>Branch lending activity and portfolio health for the current reporting period.</p></header><section><h2>Key performance indicators</h2><div class="grid"><div class="metric"><span>Outstanding balance</span><strong>97.9 Cr</strong></div><div class="metric"><span>Active loans</span><strong>1,284</strong></div><div class="metric"><span>Quarterly growth</span><strong>+7.2%</strong></div></div></section><section><h2>Branch performance</h2><div class="panel"><!-- Inline SVG bar chart for branch performance -->
        <svg role="img" aria-label="Branch performance chart" width="100%" height="180" viewBox="0 0 600 180" preserveAspectRatio="xMidYMid meet">
          <style>
            .label { font: 12px/1.2 Arial, sans-serif; fill: #17324d; }
            .value { font: 11px/1 Arial, sans-serif; fill: #ffffff; font-weight:700 }
            .bar-bg { fill: #e9f5f7; }
            .bar-fill { fill: #2aa7a1; }
            .axis { stroke: #dce7ee; stroke-width:1; }
          </style>
          <!-- Background rows -->
          <rect x="0" y="0" width="600" height="180" fill="transparent" />
          <!-- Row 1: Central 76% -->
          <text x="8" y="26" class="label">Central</text>
          <rect x="100" y="12" width="480" height="24" class="bar-bg" rx="6" />
          <rect x="100" y="12" width="365" height="24" class="bar-fill" rx="6" />
          <text x="480" y="30" class="value">76%</text>
          <!-- Row 2: North 58% -->
          <text x="8" y="68" class="label">North</text>
          <rect x="100" y="54" width="480" height="24" class="bar-bg" rx="6" />
          <rect x="100" y="54" width="278" height="24" class="bar-fill" rx="6" />
          <text x="388" y="72" class="value">58%</text>
          <!-- Row 3: South 88% -->
          <text x="8" y="110" class="label">South</text>
          <rect x="100" y="96" width="480" height="24" class="bar-bg" rx="6" />
          <rect x="100" y="96" width="422" height="24" class="bar-fill" rx="6" />
          <text x="522" y="114" class="value">88%</text>
          <!-- Row 4: West 68% -->
          <text x="8" y="152" class="label">West</text>
          <rect x="100" y="138" width="480" height="24" class="bar-bg" rx="6" />
          <rect x="100" y="138" width="326" height="24" class="bar-fill" rx="6" />
          <text x="426" y="156" class="value">68%</text>
        </svg>
      </div></section><section><h2>Summary table</h2><table><thead><tr><th>Branch</th><th>Active loans</th><th>Balance</th></tr></thead><tbody><tr><td>Central</td><td>412</td><td>31.4 Cr</td></tr><tr><td>North</td><td>286</td><td>21.8 Cr</td></tr><tr><td>South</td><td>356</td><td>27.6 Cr</td></tr></tbody></table></section></article>`,
      JR_PORTFOLIO_OVERVIEW: `${base}<article class="jasper-report"><header><h1>Portfolio Overview</h1><p>Portfolio composition, exposure, and risk distribution.</p></header><section><h2>Portfolio health</h2><div class="grid"><div class="metric"><span>Total exposure</span><strong>184.6 Cr</strong></div><div class="metric"><span>Accounts</span><strong>8,942</strong></div><div class="metric"><span>At risk</span><strong>4.8%</strong></div></div></section><section><h2>Risk distribution</h2><div class="panel"><p>Low risk 62% · Medium risk 29% · High risk 9%</p></div></section></article>`,
      JR_OPERATIONS_PULSE: `${base}<article class="jasper-report"><header><h1>Operations Pulse</h1><p>Daily operational throughput and exceptions requiring attention.</p></header><section><h2>Today at a glance</h2><div class="grid"><div class="metric"><span>Applications processed</span><strong>642</strong></div><div class="metric"><span>Approval rate</span><strong>81.4%</strong></div><div class="metric"><span>Open exceptions</span><strong>18</strong></div></div></section><section><h2>Exceptions to review</h2><div class="panel"><p>Documentation delays, approval escalations, and pending verifications.</p></div></section></article>`,
      JR_BLANK_SHELL: `${base}<article class="jasper-report"><header><h1>Untitled Report</h1><p>Jasper report shell ready for data.</p></header><section><h2>Report content</h2><p>No content has been configured yet.</p></section></article>`,
    };
    const html = reports[masterTemplateId] ?? reports.JR_BLANK_SHELL;
    return { masterTemplateId, generatedAt: new Date().toISOString(), html };
  },
  getReportParameterFields: async ({ params = {} }: { params?: Record<string, string> } = {}): Promise<ReportParameterFieldsResponse> => {
    const search = (params.search ?? '').toLowerCase();
    return { items: parameterFields.filter((field) => !search || `${field.displayName} ${field.group}`.toLowerCase().includes(search)) };
  },
  getReportParameters: async ({ params = {} }: { params?: Record<string, string> } = {}): Promise<ReportParametersResponse> => {
    // Return parameters for a report. Use defaultReportParameters as mock data.
    return { items: defaultReportParameters };
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
