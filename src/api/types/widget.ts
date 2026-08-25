import type { Widget, WidgetKind } from '@/data/homeData';

export type HomeWidget = Widget & { isOnHome: boolean; dataApi: string };
export type TableWidgetData = { type: 'TABLE'; columns: string[]; rows: (string | number)[][] };
export type ChartWidgetData = { type: 'CHART'; chartType: 'LINE'; labels: string[]; series: { name: string; data: number[] }[] };
export type WidgetData = TableWidgetData | ChartWidgetData;
export type HomeWidgetsResponse = { widgets: HomeWidget[] };
export type WidgetMutationResponse = HomeWidgetsResponse;
export type WidgetApi = { getHomeWidgets(): Promise<HomeWidgetsResponse>; getWidgetData(widgetId: string): Promise<WidgetData>; addWidgetToHome(widgetId: string): Promise<WidgetMutationResponse>; removeWidgetFromHome(widgetId: string): Promise<WidgetMutationResponse> };
export type { WidgetKind };
