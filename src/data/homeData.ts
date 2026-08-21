export type WidgetKind = 'KPI' | 'TABLE' | 'CHART';

export type Widget = {
  id: string;
  kind: WidgetKind;
  title: string;
  description: string;
  owner: string;
  initials: string;
  updated: string;
  privacy: 'Private' | 'Catalogue';
  value?: string;
  change?: string;
  changeDirection?: 'up' | 'down';
  preview: 'line' | 'bars' | 'donut' | 'table';
  accent: 'mint' | 'blue' | 'violet' | 'amber';
};

export const pinnedReports = [
  { name: 'Loan Portfolio Summary', updated: 'Updated 2h ago', pinned: true },
  { name: 'Delinquency Analysis', updated: 'Updated 1d ago', pinned: true },
  { name: 'Branch Performance', updated: 'Updated 3d ago', pinned: false },
  { name: 'Credit Risk Overview', updated: 'Updated 5d ago', pinned: false },
];

export const recentSessions = [
  { name: 'Top 5 products by approval rate', time: 'Just now', kind: 'TABLE' as const },
  { name: 'NPA trend over last 12 months', time: '15m ago', kind: 'CHART' as const },
  { name: 'Collection efficiency by bucket', time: '1h ago', kind: 'CHART' as const },
  { name: 'Overdue accounts by region', time: '2h ago', kind: 'TABLE' as const },
  { name: 'Active loan accounts summary', time: '3h ago', kind: 'TABLE' as const },
];

export const myWidgets: Widget[] = [
  { id: 'disbursed', kind: 'KPI', title: 'Total disbursed amount', description: 'This month', owner: 'Anita Gupta', initials: 'AG', updated: 'Updated 1h ago', privacy: 'Private', value: '₹ 125.4 Cr', change: '12.4% vs last month', changeDirection: 'up', preview: 'line', accent: 'mint' },
  { id: 'active-loans', kind: 'KPI', title: 'Active loan accounts', description: 'As of today', owner: 'Rohit Mehta', initials: 'RM', updated: 'Updated 2h ago', privacy: 'Private', value: '8,642', change: '8.7% vs last month', changeDirection: 'up', preview: 'line', accent: 'mint' },
  { id: 'npa', kind: 'KPI', title: 'NPA %', description: 'As of today', owner: 'Rohit Mehta', initials: 'RM', updated: 'Updated 3d ago', privacy: 'Private', value: '2.35%', change: '0.32% vs last month', changeDirection: 'down', preview: 'line', accent: 'mint' },
  { id: 'collection', kind: 'KPI', title: 'Collection efficiency', description: 'This month', owner: 'S. Banerjee', initials: 'SB', updated: 'Updated 5d ago', privacy: 'Catalogue', value: '78.6%', change: '5.1% vs last month', changeDirection: 'up', preview: 'line', accent: 'mint' },
  { id: 'approval', kind: 'TABLE', title: 'Top 5 products by approval rate', description: 'This month', owner: 'You', initials: 'RA', updated: 'Updated 1h ago', privacy: 'Private', preview: 'table', accent: 'mint' },
  { id: 'npa-trend', kind: 'CHART', title: 'NPA trend over time', description: 'Gross NPA (%) trend over the last 12 months.', owner: 'Anita Gupta', initials: 'AG', updated: 'Updated 2h ago', privacy: 'Private', preview: 'line', accent: 'violet' },
  { id: 'loan-region', kind: 'CHART', title: 'Loan book by region', description: 'Loan book (₹ Cr) distribution across regions.', owner: 'Anita Gupta', initials: 'AG', updated: 'Updated 3h ago', privacy: 'Catalogue', preview: 'donut', accent: 'violet' },
  { id: 'branch-performance', kind: 'TABLE', title: 'Branch performance summary', description: 'This month', owner: 'Rohit Mehta', initials: 'RM', updated: 'Updated 7h ago', privacy: 'Private', preview: 'table', accent: 'mint' },
];

export const recommendedWidgets: Widget[] = [
  { id: 'emi-bucket', kind: 'CHART', title: 'EMI collection by bucket', description: 'Collection distribution by bucket.', owner: 'Risk analytics', initials: 'RA', updated: 'Updated today', privacy: 'Catalogue', preview: 'bars', accent: 'blue' },
  { id: 'recommended-region', kind: 'CHART', title: 'Loan book by region', description: 'Loan book (₹ Cr) distribution across regions.', owner: 'Finance team', initials: 'FT', updated: 'Updated today', privacy: 'Catalogue', preview: 'donut', accent: 'violet' },
  { id: 'recommended-active', kind: 'KPI', title: 'Active loan accounts', description: 'Count of active loan accounts.', owner: 'Lending team', initials: 'LT', updated: 'Updated today', privacy: 'Catalogue', value: '8,642', preview: 'line', accent: 'mint' },
  { id: 'risk-overview', kind: 'CHART', title: 'Credit risk overview', description: 'Portfolio risk distribution by risk band.', owner: 'Credit risk', initials: 'CR', updated: 'Updated today', privacy: 'Catalogue', preview: 'donut', accent: 'amber' },
];
