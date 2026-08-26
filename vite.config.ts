import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const parseProperties = (source: string) => Object.fromEntries(
  source
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
);
const propertiesPath = resolve(process.cwd(), 'src/api/config/api-config.properties');
const apiProperties = parseProperties(readFileSync(propertiesPath, 'utf-8'));
const apiHost = apiProperties['api.host'] || 'localhost';
const apiPort = apiProperties['api.port'] || '8080';
const apiBasePath = apiProperties['api.basePath'] || '';
const useDevProxy = (apiProperties['api.useDevProxy'] || 'true').toLowerCase() === 'true';
const apiTarget = `http://${apiHost}:${apiPort}`;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: useDevProxy && apiBasePath
      ? {
          [apiBasePath]: {
            target: apiTarget,
            changeOrigin: true,
            secure: false,
          },
        }
      : undefined,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
