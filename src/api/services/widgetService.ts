import { request } from '@/api/client/apiClient';
import type { HomeWidgetsResponse, WidgetData, WidgetRecommendationsResponse } from '@/api/types/widget';

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object';
const requireResponse = <T>(value: unknown, valid: (value: unknown) => boolean, name: string): T => { if (!valid(value)) throw new Error(`Invalid ${name} response`); return value as T; };
const widgetsResponse = (value: unknown) => isRecord(value) && Array.isArray(value.widgets);
const widgetDataResponse = (value: unknown) => isRecord(value) && (value.type === 'TABLE' || value.type === 'CHART');

export const getHomeWidgets = async () => requireResponse<HomeWidgetsResponse>(await request<unknown>('homeWidgets'), widgetsResponse, 'home widgets');
export const getWidgetRecommendations = async () => requireResponse<WidgetRecommendationsResponse>(await request<unknown>('widgetRecommendations'), widgetsResponse, 'widget recommendations');
export const getWidgetData = async (widgetId: string) => requireResponse<WidgetData>(await request<unknown>('widgetData', { widgetId }), widgetDataResponse, `widget data for ${widgetId}`);
export const addWidgetToHome = (widgetId: string) => request<HomeWidgetsResponse>('widgetMutations', { widgetId }, { body: { action: 'add' } });
export const removeWidgetFromHome = (widgetId: string) => request<HomeWidgetsResponse>('widgetMutations', { widgetId }, { body: { action: 'remove' } });
export const isWidgetOnHome = async (widgetId: string) => (await getHomeWidgets()).widgets.some((widget) => widget.id === widgetId && widget.isOnHome);
export type { HomeWidget, Widget, WidgetData, WidgetKind, WidgetRecommendation } from '@/api/types/widget';
