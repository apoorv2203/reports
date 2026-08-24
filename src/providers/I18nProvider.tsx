import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { setLocale, type Locale, formatDate, formatDateTime, formatRelativeTime, formatRelativeLabel, formatNumber, formatCurrency, formatPercentage } from '@/utils/formatting';

// Import the English translation resource
import en from '@/i18n/en.json';

/**
 * Translation resource map. Adding a new locale is as simple as:
 *   import hi from '@/i18n/hi.json';
 *   resources: { en, hi, ar }
 *
 * No component code needs to change.
 */
const resources: Partial<Record<Locale, Record<string, string>>> = {
  en: en as Record<string, string>,
};

export function registerLocale(locale: Locale, dictionary: Record<string, string>): void {
  resources[locale] = dictionary;
}

export type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
  /** Whether the current locale is right-to-left */
  isRTL: boolean;
  formatters: {
    date: typeof formatDate;
    dateTime: typeof formatDateTime;
    relativeTime: typeof formatRelativeTime;
    relativeLabel: typeof formatRelativeLabel;
    number: typeof formatNumber;
    currency: typeof formatCurrency;
    percentage: typeof formatPercentage;
  };
}

const I18nContext = createContext<I18nContextValue | null>(null);

const RTL_LOCALES: Locale[] = ['ar'];

/**
 * Resolve a dotted key path (e.g. "home.welcomeNew") against a flat
 * object whose keys already contain dots. We store keys flat in the JSON
 * so lookup is a simple property access.
 */
function resolveKey(dict: Record<string, string>, key: string): string | undefined {
  return dict[key];
}

/**
 * Replace {placeholder} tokens in a string with provided params.
 */
function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const val = params[name];
    return val !== undefined ? String(val) : `{${name}}`;
  });
}

function createTranslator(locale: Locale): TranslateFn {
  const dict = resources[locale] ?? resources.en ?? {};
  return (key: string, params?: Record<string, string | number>) => {
    const template = resolveKey(dict, key) ?? resolveKey(resources.en ?? {}, key) ?? key;
    return interpolate(template, params);
  };
}

interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export function I18nProvider({ children, defaultLocale = 'en' }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setLocale(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    const isRTL = RTL_LOCALES.includes(locale);
    return {
      locale,
      setLocale: (newLocale: Locale) => {
        setLocaleState(newLocale);
        setLocale(newLocale);
      },
      t: createTranslator(locale),
      isRTL,
      formatters: {
        date: (value) => formatDate(value, locale),
        dateTime: (value) => formatDateTime(value, locale),
        relativeTime: (value) => formatRelativeTime(value, locale),
        relativeLabel: (value) => formatRelativeLabel(value, locale),
        number: (value) => formatNumber(value, locale),
        currency: (value) => formatCurrency(value, locale),
        percentage: (value, _locale, fractionDigits) => formatPercentage(value, locale, fractionDigits),
      },
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

/**
 * Convenience hook that returns just the translate function.
 */
export function useT(): TranslateFn {
  return useI18n().t;
}

export function useFormat() {
  return useI18n().formatters;
}
