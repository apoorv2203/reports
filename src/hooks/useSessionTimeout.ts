import { useEffect, useMemo, useRef, useState } from 'react';

type SessionTimeoutOptions = {
  enabled: boolean;
  expiresAt: number | null;
  fallbackTimeoutMs: number;
  warningMs?: number;
  onExpire: () => void;
};

export function useSessionTimeout({ enabled, expiresAt, fallbackTimeoutMs, warningMs = 15000, onExpire }: SessionTimeoutOptions) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const firedRef = useRef(false);

  const deadline = useMemo(() => {
    if (!enabled) return null;
    if (expiresAt && Number.isFinite(expiresAt)) return expiresAt;
    return Date.now() + fallbackTimeoutMs;
  }, [enabled, expiresAt, fallbackTimeoutMs]);

  useEffect(() => {
    firedRef.current = false;
  }, [deadline]);

  useEffect(() => {
    if (!enabled || !deadline) {
      setRemainingSeconds(0);
      return;
    }

    const tick = () => {
      const remainingMs = Math.max(0, deadline - Date.now());
      const seconds = Math.ceil(remainingMs / 1000);
      setRemainingSeconds(seconds);
      if (remainingMs <= 0 && !firedRef.current) {
        firedRef.current = true;
        onExpire();
      }
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [enabled, deadline, onExpire]);

  return {
    remainingSeconds,
    expired: enabled && remainingSeconds <= 0,
    warning: enabled && remainingSeconds > 0 && remainingSeconds <= Math.ceil(warningMs / 1000),
  };
}
