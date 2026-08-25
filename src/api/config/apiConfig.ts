import properties from './api-config.properties?raw';

export type ApiMode = 'mock' | 'real';
export type ApiDefinition = { mode: ApiMode; path: string };

const parseProperties = (source: string) => Object.fromEntries(source.split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith('#')).map((line) => { const index = line.indexOf('='); return [line.slice(0, index).trim(), line.slice(index + 1).trim()]; }));
const values = parseProperties(properties);
const api = (name: string): ApiDefinition => ({ mode: values[`api.${name}.mode`] === 'real' ? 'real' : 'mock', path: values[`api.${name}.path`] || '' });

export const apiConfig = {
  host: values['api.host'] || 'localhost',
  port: values['api.port'] || '8080',
  basePath: values['api.basePath'] || '/api',
  homeWidgets: api('homeWidgets'),
  widgetData: api('widgetData'),
  widgetDataFor: (widgetId: string) => api(`widgetData.${widgetId}`),
  widgetMutations: api('widgetMutations'),
};

export function resolveApiPath(definition: ApiDefinition, params: Record<string, string> = {}) { return Object.entries(params).reduce((path, [key, value]) => path.replace(`{${key}}`, encodeURIComponent(value)), definition.path); }
export function apiUrl(definition: ApiDefinition, params?: Record<string, string>) { return `http://${apiConfig.host}:${apiConfig.port}${apiConfig.basePath}${resolveApiPath(definition, params)}`; }
