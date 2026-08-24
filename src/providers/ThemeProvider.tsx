import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ThemeMode } from '@/theme/theme';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

/**
 * ThemeProvider manages the active theme mode.
 *
 * Currently only 'light' is supported. When dark mode is implemented,
 * setting mode to 'dark' will apply [data-theme="dark"] to the document
 * element, and the CSS custom properties in tokens.css will override
 * the light values — no component code needs to change.
 */
export function ThemeProvider({ children, defaultMode = 'light' }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  const value = useMemo<ThemeContextValue>(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
    }
    return { mode, setMode };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
