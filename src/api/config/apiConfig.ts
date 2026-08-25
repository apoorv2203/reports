import properties from './api-config.properties?raw';

export type ApiMode = 'mock' | 'real';
export type ApiDefinition = { mode: ApiMode; path: string };
const parseProperties = (source: string) => Object.fromEntries(source.split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith('#')).map((line) => { const index = line.indexOf('='); if (index < 1) throw new Error(`Invalid API configuration line: ${line}`); return [line.slice(0, index).trim(), line.slice(index + 1).trim()]; }));
const values = parseProperties(properties);
const api = (name: string): ApiDefinition => { const mode = values[`api.${name}.mode`]; const path = values[`api.${name}.path`]; if (mode !== 'mock' && mode !== 'real') throw new Error(`Invalid API mode for ${name}: ${mode ?? '<missing>'}. Expected "mock" or "real".`); if (!path) throw new Error(`Missing API path configuration: ${name}`); return { mode, path }; };
export const apiConfig: Record<string, ApiDefinition> & { host: string; port: string; basePath: string } = {
  host: import.meta.env.VITE_API_HOST || values['api.host'] || 'localhost',
  port: import.meta.env.VITE_API_PORT || values['api.port'] || '8080',
  basePath: import.meta.env.VITE_API_BASE_PATH || values['api.basePath'] || '/api',
  homeWidgets: api('homeWidgets'), widgetData: api('widgetData'), widgetMutations: api('widgetMutations'), pinnedReports: api('pinnedReports'), widgetRecommendations: api('widgetRecommendations'), scheduledDeliveries: api('scheduledDeliveries'), scheduledDeliveryDownload: api('scheduledDeliveryDownload'),
};
export function resolveApiPath(definition: ApiDefinition, params: Record<string, string> = {}) { return Object.entries(params).reduce((path, [key, value]) => path.replace(`{${key}}`, encodeURIComponent(value)), definition.path); }
export function apiUrl(definition: ApiDefinition, params?: Record<string, string>) { const protocol = import.meta.env.VITE_API_PROTOCOL || (typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'https' : 'http'); return `${protocol}://${apiConfig.host}:${apiConfig.port}${apiConfig.basePath}${resolveApiPath(definition, params)}`; }
