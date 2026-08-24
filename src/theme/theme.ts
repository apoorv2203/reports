/**
 * ReportIQ Theme TypeScript definitions
 *
 * Provides typed access to the semantic theme tokens defined in tokens.css.
 * The ThemeProvider exposes these via React context; components should use
 * the useTheme() hook or Tailwind utility classes that reference the CSS
 * custom properties.
 */

export type ThemeMode = 'light' | 'dark';

/** Read a CSS custom property from :root at runtime */
function cssVar(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** All semantic token names available as CSS variables */
export const TOKEN_NAMES = {
  background: '--color-background',
  surface: '--color-surface',
  surfaceSecondary: '--color-surface-secondary',
  surfaceTertiary: '--color-surface-tertiary',
  textPrimary: '--color-text-primary',
  textSecondary: '--color-text-secondary',
  textMuted: '--color-text-muted',
  border: '--color-border',
  borderLight: '--color-border-light',
  borderSubtle: '--color-border-subtle',
  primary: '--color-primary',
  primaryHover: '--color-primary-hover',
  primaryLight: '--color-primary-light',
  primaryLighter: '--color-primary-lighter',
  primaryMedium: '--color-primary-medium',
  primaryAccent: '--color-primary-accent',
  success: '--color-success',
  warning: '--color-warning',
  danger: '--color-danger',
  chartAccent: '--color-chart-accent',
  chartAccentLight: '--color-chart-accent-light',
  chartAccentLighter: '--color-chart-accent-lighter',
  tableAccent: '--color-table-accent',
} as const;

export type TokenName = keyof typeof TOKEN_NAMES;

/** Get a single token value at runtime */
export function getToken(name: TokenName): string {
  return cssVar(TOKEN_NAMES[name]);
}

/** Get multiple token values as a plain object */
export function getTokens<N extends TokenName>(names: N[]): Record<N, string> {
  const result = {} as Record<N, string>;
  for (const name of names) {
    result[name] = cssVar(TOKEN_NAMES[name]);
  }
  return result;
}
