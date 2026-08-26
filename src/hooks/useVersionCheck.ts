import { useCallback, useEffect, useRef, useState } from 'react';

type VersionCheckOptions = {
  enabled: boolean;
  intervalMs: number;
  onVersionChanged: () => void;
  showNotification?: boolean;
};

function extractBuildHash(html: string): string | null {
  const scriptMatch = html.match(/\/assets\/index-([a-zA-Z0-9_-]+)\.js/);
  if (scriptMatch?.[1]) return scriptMatch[1];
  const anyAsset = html.match(/\/assets\/[^"']*-([a-zA-Z0-9_-]{8,})\.(js|css)/);
  return anyAsset?.[1] ?? null;
}

export function useVersionCheck({ enabled, intervalMs, onVersionChanged, showNotification = true }: VersionCheckOptions) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const initialHash = useRef<string | null>(null);
  const running = useRef(false);

  const check = useCallback(async () => {
    if (!enabled || running.current || isUpdating) return;
    running.current = true;
    try {
      const response = await fetch(`/index.html?t=${Date.now()}`, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', Pragma: 'no-cache' },
      });
      if (!response.ok) return;
      const html = await response.text();
      const hash = extractBuildHash(html);
      if (!hash) return;
      if (!initialHash.current) {
        initialHash.current = hash;
        return;
      }
      if (hash !== initialHash.current) {
        setIsUpdating(true);
        if (showNotification) setMessage('A new version is available. Updating now...');
        onVersionChanged();
      }
    } finally {
      running.current = false;
    }
  }, [enabled, isUpdating, onVersionChanged, showNotification]);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => { void check(); }, intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs, check]);

  return { isUpdating, message };
}
