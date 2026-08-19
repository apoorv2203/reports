export type TemplateKind = 'branch' | 'portfolio' | 'operations' | 'blank';

export type TemplateSection = {
  id: string;
  title: string;
  kind: 'title' | 'kpi' | 'chart' | 'table' | 'empty';
  body?: string;
};

export type ReportTemplate = {
  id: TemplateKind;
  name: string;
  category: string;
  description: string;
  updated: string;
  sections: TemplateSection[];
};

export const reportTemplates: ReportTemplate[] = [
  {
    id: 'branch',
    name: 'Branch summary',
    category: 'Most used',
    description: 'A clean branch performance review with KPIs, trends, and room for a detailed table.',
    updated: 'Used 28 times this month',
    sections: [
      { id: '1', title: 'Q2 branch review', kind: 'title' },
      { id: '2', title: 'Key performance indicators', kind: 'kpi' },
      { id: '3', title: 'Branch performance', kind: 'chart' },
      { id: '4', title: 'Detailed breakdown', kind: 'empty' },
    ],
  },
  {
    id: 'portfolio',
    name: 'Portfolio overview',
    category: 'Most used',
    description: 'Summarise portfolio health, outstanding balances, and year-over-year movement.',
    updated: 'Used 19 times this month',
    sections: [
      { id: '1', title: 'Portfolio overview', kind: 'title' },
      { id: '2', title: 'Portfolio health', kind: 'kpi' },
      { id: '3', title: 'Balance movement', kind: 'chart' },
      { id: '4', title: 'Accounts by risk', kind: 'table' },
    ],
  },
  {
    id: 'operations',
    name: 'Operations pulse',
    category: 'Team favourite',
    description: 'Track operational volumes, service levels, and the work that needs attention.',
    updated: 'Used 12 times this month',
    sections: [
      { id: '1', title: 'Operations pulse', kind: 'title' },
      { id: '2', title: 'Today at a glance', kind: 'kpi' },
      { id: '3', title: 'Volume by channel', kind: 'chart' },
      { id: '4', title: 'Exceptions to review', kind: 'empty' },
    ],
  },
  {
    id: 'blank',
    name: 'Start from blank',
    category: 'Custom',
    description: 'A blank four-section shell. Tell ReportIQ what to add in each section.',
    updated: 'Build something from scratch',
    sections: [
      { id: '1', title: 'Untitled section', kind: 'title' },
      { id: '2', title: 'Empty section', kind: 'empty' },
      { id: '3', title: 'Empty section', kind: 'empty' },
      { id: '4', title: 'Empty section', kind: 'empty' },
    ],
  },
];

export const catalogueReports = [
  { id: 'monthly-statement', title: 'Monthly account statement', category: 'Statements', description: 'Full transaction listing for the previous calendar month — ideal for reconciliation and record keeping.', cadence: 'Last month', format: 'PDF', owner: 'Finance team' },
  { id: 'quarterly-statement', title: 'Quarterly statement', category: 'Statements', description: 'Three-month account activity overview used for quarterly reviews and audit submissions.', cadence: 'Last 3 months', format: 'PDF', owner: 'Finance team' },
  { id: 'credit-card', title: 'Credit card statement', category: 'Statements', description: 'Complete credit card transaction history with outstanding balance summary.', cadence: 'Last month', format: 'PDF', owner: 'Retail banking' },
  { id: 'branch-performance', title: 'Branch performance review', category: 'Performance', description: 'Branch-level KPIs, product approvals, and operational movement for leadership review.', cadence: 'Monthly', format: 'HTML', owner: 'Branch network' },
  { id: 'risk-watchlist', title: 'Risk watchlist', category: 'Risk', description: 'Accounts and exposures that need attention, grouped by risk level and relationship manager.', cadence: 'Daily', format: 'XLSX', owner: 'Credit risk' },
  { id: 'lending-pipeline', title: 'Lending pipeline', category: 'Performance', description: 'A live view of applications, approvals, and outstanding lending decisions.', cadence: 'Live', format: 'HTML', owner: 'Lending team' },
];

export type LibraryReport = {
  id: string;
  title: string;
  category: 'Sales' | 'Delinquency' | 'Compliance' | 'Operations';
  description: string;
  cadence: string;
  publisher: string;
  ownedByYou: boolean;
  published: boolean;
  favourite: boolean;
  templateId: TemplateKind;
};

export const libraryReports: LibraryReport[] = [
  { id: 'delinquency-branch', title: 'Monthly delinquency by branch', category: 'Delinquency', description: 'Delinquent loans by branch and risk level, compared year over year.', cadence: 'Runs monthly', publisher: 'A. Rao', ownedByYou: false, published: true, favourite: false, templateId: 'branch' },
  { id: 'approval-leaderboard', title: 'Product approval leaderboard', category: 'Sales', description: 'Top products by approval rate across all regions.', cadence: 'On demand', publisher: 'G. Desai', ownedByYou: true, published: true, favourite: true, templateId: 'portfolio' },
  { id: 'quarterly-audit', title: 'Quarterly audit summary', category: 'Compliance', description: 'Corporate segment audit trail, with written-off accounts excluded.', cadence: 'Runs quarterly', publisher: 'S. Iyer', ownedByYou: false, published: true, favourite: false, templateId: 'operations' },
  { id: 'branch-pipeline', title: 'Branch lending pipeline', category: 'Sales', description: 'Applications, approvals, and pending lending decisions grouped by branch.', cadence: 'Updates daily', publisher: 'N. Kapoor', ownedByYou: true, published: false, favourite: false, templateId: 'branch' },
  { id: 'exceptions-register', title: 'Operational exceptions register', category: 'Operations', description: 'Open exceptions by owner, priority, and service-level status.', cadence: 'Live', publisher: 'Operations team', ownedByYou: false, published: true, favourite: true, templateId: 'operations' },
  { id: 'risk-movement', title: 'Portfolio risk movement', category: 'Delinquency', description: 'Month-over-month migration across risk bands and lending segments.', cadence: 'Runs monthly', publisher: 'Credit risk', ownedByYou: false, published: true, favourite: false, templateId: 'portfolio' },
];

export const myReports = [
  { id: 'approval-rate', title: 'Top products by approval rate', description: 'Monthly product approval performance with anomaly flags.', updated: 'Updated today · 09:42', status: 'Published', type: 'Table' },
  { id: 'branch-q2', title: 'Q2 branch review', description: 'Branch KPIs and performance movement across the network.', updated: 'Updated yesterday · 16:10', status: 'Draft', type: 'Dashboard' },
  { id: 'loan-risk', title: 'Loan risk overview', description: 'Portfolio risk levels and outstanding balances by segment.', updated: 'Updated 12 Aug · 11:25', status: 'Published', type: 'Chart' },
];
