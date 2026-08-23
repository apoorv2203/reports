import { myWidgets, type Widget, type WidgetKind } from '@/data/homeData';

export type HomeWidget = Widget & { isOnHome: boolean; dataApi: string };
export type TableWidgetData = { type: 'TABLE'; columns: string[]; rows: (string | number)[][] };
export type ChartWidgetData = { type: 'CHART'; chartType: 'LINE'; labels: string[]; series: { name: string; data: number[] }[] };
export type WidgetData = TableWidgetData | ChartWidgetData;

const STORAGE_KEY = 'reportiq-home-widget-state';
const homeDefaults = new Set(['approval', 'npa-trend', 'loan-region', 'branch-performance']);
const dataById: Record<string, WidgetData> = {
  'approval': { type: 'TABLE', columns: ['Product', 'Approval', 'Trend'], rows: [['Personal Loan', '83.6%', '↗'], ['Home Loan', '76.4%', '↗'], ['Vehicle Loan', '72.1%', '↗'], ['Business Loan', '68.3%', '↗'], ['Loan Against Property', '55.2%', '↗']] },
  'branch-performance': { type: 'TABLE', columns: ['Branch', 'Disbursed', 'Growth'], rows: [['Mumbai Central', '₹85.6 Cr', '12.4%'], ['Bangalore Main', '₹67.3 Cr', '9.8%'], ['Pune East', '₹54.2 Cr', '8.1%'], ['Delhi North', '₹48.9 Cr', '6.7%'], ['Hyderabad Main', '₹42.1 Cr', '5.4%']] },
  'npa-trend': { type: 'CHART', chartType: 'LINE', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], series: [{ name: 'NPA %', data: [3.2, 3.4, 3.1, 3.6, 3.3, 3.8, 3.5] }] },
  'loan-region': { type: 'CHART', chartType: 'LINE', labels: ['North', 'West', 'South', 'East'], series: [{ name: 'Loan book', data: [42, 28, 19, 11] }] },
};

function readState(): string[] { if (typeof window === 'undefined') return [...homeDefaults]; try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify([...homeDefaults])); } catch { return [...homeDefaults]; } }
function writeState(ids: string[]) { if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); }
export async function getHomeWidgets(): Promise<{ widgets: HomeWidget[] }> { const ids = readState(); return { widgets: myWidgets.filter((widget) => widget.kind !== 'KPI').map((widget) => ({ ...widget, isOnHome: ids.includes(widget.id), dataApi: `/api/widgets/${widget.id}/data` })) }; }
export async function addWidgetToHome(widgetId: string) { const ids = readState(); if (!ids.includes(widgetId)) writeState([...ids, widgetId]); return getHomeWidgets(); }
export async function removeWidgetFromHome(widgetId: string) { writeState(readState().filter((id) => id !== widgetId)); return getHomeWidgets(); }
export function isWidgetOnHome(widgetId: string) { return readState().includes(widgetId); }
export async function getWidgetData(widgetId: string): Promise<WidgetData> { await new Promise((resolve) => setTimeout(resolve, 180 + Math.random() * 260)); const data = dataById[widgetId]; if (!data) throw new Error('Widget data unavailable'); return data; }
export function widgetDataFor(widgetId: string) { return dataById[widgetId]; }
export type { WidgetKind };
