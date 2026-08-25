import properties from './api-config.properties?raw';

export type ApiMode = 'mock' | 'real';
export type ApiDefinition = { mode: ApiMode; path: string };
const parseProperties = (source: string) => Object.fromEntries(source.split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith('#')).map((line) => { const index = line.indexOf('='); return [line.slice(0, index).trim(), line.slice(index + 1).trim()]; }));
const values = parseProperties(properties);
const api = (name: string): ApiDefinition => { const path = values[`api.${name}.path`]; if (!path) throw new Error(`Missing API path configuration: ${name}`); return { mode: values[`api.${name}.mode`] === 'real' ? 'real' : 'mock', path }; };
const configuredWidgetIds = Object.keys(values).filter((key) => key.startsWith('api.widgetData.') && key.endsWith('.path')).map((key) => key.slice('api.widgetData.'.length, -'.path'.length));
export const apiConfig = {
  host: import.meta.env.VITE_API_HOST || values['api.host'] || 'localhost',
  port: import.meta.env.VITE_API_PORT || values['api.port'] || '8080',
  basePath: import.meta.env.VITE_API_BASE_PATH || values['api.basePath'] || '/api',
  homeWidgets: api('homeWidgets'),
  widgetData: api('widgetData'),
  widgetDataFor: (widgetId: string) => configuredWidgetIds.includes(widgetId) ? api(`widgetData.${widgetId}`) : api('widgetData'),
  widgetMutations: api('widgetMutations'),
};
export function resolveApiPath(definition: ApiDefinition, params: Record<string, string> = {}) { return Object.entries(params).reduce((path, [key, value]) => path.replace(`{${key}}`, encodeURIComponent(value)), definition.path); }
export function apiUrl(definition: ApiDefinition, params?: Record<string, string>) { const protocol = import.meta.env.VITE_API_PROTOCOL || (typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'https' : 'http'); return `${protocol}://${apiConfig.host}:${apiConfig.port}${apiConfig.basePath}${resolveApiPath(definition, params)}`; }
