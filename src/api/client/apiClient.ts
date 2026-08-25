import { apiConfig, apiUrl, type ApiDefinition } from '@/api/config/apiConfig';
import { widgetMockProvider } from '@/api/mocks/widgetMockProvider';
import type { HomeWidgetsResponse, WidgetData, WidgetMutationResponse } from '@/api/types/widget';

type ApiName = 'homeWidgets' | 'widgetData' | 'widgetMutations';
type ApiResult = HomeWidgetsResponse | WidgetData | WidgetMutationResponse;
const providers = { homeWidgets: () => widgetMockProvider.getHomeWidgets(), widgetData: (params: Record<string, string>) => widgetMockProvider.getWidgetData(params.widgetId), widgetMutations: (params: Record<string, string>, body?: unknown) => body && (body as { action?: string }).action === 'remove' ? widgetMockProvider.removeWidgetFromHome(params.widgetId) : widgetMockProvider.addWidgetToHome(params.widgetId) };

export class ApiError extends Error { constructor(message: string, public readonly status?: number) { super(message); this.name = 'ApiError'; } }
export async function request<T extends ApiResult>(name: ApiName, params: Record<string, string> = {}, options: { body?: unknown; timeoutMs?: number } = {}): Promise<T> {
  const definition: ApiDefinition = name === 'widgetData' ? apiConfig.widgetDataFor(params.widgetId) : apiConfig[name];
  const task = definition.mode === 'mock' ? providers[name](params, options.body) : fetch(apiUrl(definition, params), { method: options.body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: options.body ? JSON.stringify(options.body) : undefined }).then(async (response) => { if (!response.ok) throw new ApiError(`API request failed with status ${response.status}`, response.status); return response.json() as Promise<T>; });
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new ApiError(`API request timed out: ${name}`)), options.timeoutMs ?? 10000); });
  try { const result = await Promise.race([task, timeout]); if (!result) throw new ApiError(`Invalid empty response from ${name}`); return result as T; } catch (error) { throw error instanceof ApiError ? error : new ApiError(error instanceof Error ? error.message : `Unknown API error: ${name}`); } finally { if (timer) clearTimeout(timer); }
}
