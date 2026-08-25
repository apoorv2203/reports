import { request } from '@/api/client/apiClient';
import type { HomeWidgetsResponse, WidgetData } from '@/api/types/widget';

export const getHomeWidgets = () => request<HomeWidgetsResponse>('homeWidgets');
export const getWidgetData = (widgetId: string) => request<WidgetData>('widgetData', { widgetId });
export const addWidgetToHome = (widgetId: string) => request<HomeWidgetsResponse>('widgetMutations', { widgetId }, { body: { action: 'add' } });
export const removeWidgetFromHome = (widgetId: string) => request<HomeWidgetsResponse>('widgetMutations', { widgetId }, { body: { action: 'remove' } });
export const isWidgetOnHome = async (widgetId: string) => (await getHomeWidgets()).widgets.some((widget) => widget.id === widgetId && widget.isOnHome);
export type { HomeWidget, WidgetData, WidgetKind } from '@/api/types/widget';
