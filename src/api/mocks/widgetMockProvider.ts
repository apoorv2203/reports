import { myWidgets } from '@/data/homeData';
import type { HomeWidgetsResponse, WidgetData, WidgetMutationResponse, WidgetRecommendationsResponse } from '@/api/types/widget';

const homeDefaults = new Set(['approval', 'npa-trend', 'loan-region', 'branch-performance']);
let homeWidgetIds = [...homeDefaults];
const dataById: Record<string, WidgetData> = {
  approval: { type: 'TABLE', columns: ['Product', 'Approval', 'Trend'], rows: [['Personal Loan', '83.6%', '↗'], ['Home Loan', '76.4%', '↗'], ['Vehicle Loan', '72.1%', '↗'], ['Business Loan', '68.3%', '↗'], ['Loan Against Property', '55.2%', '↗']] },
  'branch-performance': { type: 'TABLE', columns: ['Branch', 'Disbursed', 'Growth'], rows: [['Mumbai Central', '₹85.6 Cr', '12.4%'], ['Bangalore Main', '₹67.3 Cr', '9.8%'], ['Pune East', '₹54.2 Cr', '8.1%'], ['Delhi North', '₹48.9 Cr', '6.7%'], ['Hyderabad Main', '₹42.1 Cr', '5.4%']] },
  'npa-trend': { type: 'CHART', chartType: 'LINE', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], series: [{ name: 'NPA %', data: [3.2, 3.4, 3.1, 3.6, 3.3, 3.8, 3.5] }] },
  'loan-region': { type: 'CHART', chartType: 'LINE', labels: ['North', 'West', 'South', 'East'], series: [{ name: 'Loan book', data: [42, 28, 19, 11] }] },
};
const recommendations: WidgetRecommendationsResponse = { widgets: [
  { id: 'emi-bucket', kind: 'CHART', title: 'EMI collection by bucket', description: 'Collection distribution by bucket.', owner: 'Risk analytics', initials: 'RA', updated: 'Updated today', privacy: 'Catalogue' },
  { id: 'recommended-region', kind: 'CHART', title: 'Loan book by region', description: 'Loan book distribution across regions.', owner: 'Finance team', initials: 'FT', updated: 'Updated today', privacy: 'Catalogue' },
  { id: 'risk-overview', kind: 'CHART', title: 'Credit risk overview', description: 'Portfolio risk distribution by risk band.', owner: 'Credit risk', initials: 'CR', updated: 'Updated today', privacy: 'Catalogue' },
] };
const readState = () => [...homeWidgetIds];
const writeState = (ids: string[]) => { homeWidgetIds = [...ids]; };
const response = (): HomeWidgetsResponse => { const ids = readState(); return { widgets: myWidgets.map(({ accent: _accent, preview: _preview, ...widget }) => ({ ...widget, isOnHome: ids.includes(widget.id) })) }; };
export const widgetMockProvider = { getHomeWidgets: async () => response(), getWidgetRecommendations: async () => recommendations, getWidgetData: async (widgetId: string) => { await new Promise((resolve) => setTimeout(resolve, 180 + Math.random() * 260)); const data = dataById[widgetId]; if (!data) throw new Error('Widget data unavailable'); return data; }, addWidgetToHome: async (widgetId: string): Promise<WidgetMutationResponse> => { const ids = readState(); if (!ids.includes(widgetId)) writeState([...ids, widgetId]); return response(); }, removeWidgetFromHome: async (widgetId: string): Promise<WidgetMutationResponse> => { writeState(readState().filter((id) => id !== widgetId)); return response(); } };
