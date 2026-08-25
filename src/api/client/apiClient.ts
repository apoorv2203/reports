import { apiConfig, apiUrl, type ApiDefinition } from '@/api/config/apiConfig';
import { widgetMockProvider } from '@/api/mocks/widgetMockProvider';
import type { HomeWidgetsResponse, WidgetData, WidgetMutationResponse } from '@/api/types/widget';

type ApiName = 'homeWidgets' | 'widgetData' | 'widgetMutations';
type ApiResult = HomeWidgetsResponse | WidgetData | WidgetMutationResponse;
const providers = { homeWidgets: () => widgetMockProvider.getHomeWidgets(), widgetData: (params: Record<string, string>) => widgetMockProvider.getWidgetData(params.widgetId), widgetMutations: (params: Record<string, string>, body?: unknown) => body && (body as { action?: string }).action === 'remove' ? widgetMockProvider.removeWidgetFromHome(params.widgetId) : widgetMockProvider.addWidgetToHome(params.widgetId) };

export class ApiError extends Error { constructor(message: string, public readonly status?: number) { super(message); this.name = 'ApiError'; } }
function isValidResult(name: ApiName, value: unknown): value is ApiResult { if (!value || typeof value !== 'object') return false; if (name === 'widgetData') return 'type' in value; return 'widgets' in value && Array.isArray((value as { widgets?: unknown }).widgets); }
function getDefinition(name: ApiName, params: Record<string, string>): ApiDefinition { const definition = name === 'widgetData' ? apiConfig.widgetDataFor(params.widgetId) : apiConfig[name]; if (!definition.path) throw new ApiError(`Missing API path configuration: ${name}`); return definition; }
export async function request<T extends ApiResult>(name: ApiName, params: Record<string, string> = {}, options: { body?: unknown; timeoutMs?: number } = {}): Promise<T> {
  const definition = getDefinition(name, params);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? 10000);
  try {
    const result = definition.mode === 'mock'
      ? await providers[name](params, options.body)
      : await fetch(apiUrl(definition, params), { method: options.body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: options.body ? JSON.stringify(options.body) : undefined, signal: controller.signal }).then(async (response) => { if (!response.ok) throw new ApiError(`API request failed with status ${response.status}`, response.status); return response.json(); });
    if (!isValidResult(name, result)) throw new ApiError(`Invalid response from ${name}`);
    return result as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') throw new ApiError(`API request timed out: ${name}`);
    throw new ApiError(error instanceof Error ? error.message : `Unknown API error: ${name}`);
  } finally { clearTimeout(timeoutId); }
}
