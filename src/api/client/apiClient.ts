import { apiConfig, apiUrl, type ApiDefinition } from '@/api/config/apiConfig';
import { mockProviderRegistry } from '@/api/client/apiProviders';

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

function getDefinition(name: string): ApiDefinition {
  const definition = apiConfig[name];
  if (!definition) throw new ApiError(`Missing API configuration: ${name}`);
  return definition;
}

export async function request<T>(
  name: string,
  params: Record<string, string> = {},
  options: { body?: unknown; timeoutMs?: number } = {},
): Promise<T> {
  const definition = getDefinition(name);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? 10000);
  try {
    if (definition.mode === 'mock') {
      const provider = mockProviderRegistry[name];
      if (!provider) throw new ApiError(`Missing mock provider registration: ${name}`);
      return (await provider({ params, body: options.body })) as T;
    }
    const response = await fetch(apiUrl(definition, params), {
      method: options.body ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
    if (!response.ok) throw new ApiError(`API request failed with status ${response.status}`, response.status);
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') throw new ApiError(`API request timed out: ${name}`);
    throw new ApiError(error instanceof Error ? error.message : `Unknown API error: ${name}`);
  } finally {
    clearTimeout(timeoutId);
  }
}
