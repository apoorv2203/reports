/**
 * Locale-aware formatting utilities.
 *
 * These helpers wrap Intl APIs so that dates, times, relative times,
 * numbers, percentages and currencies are formatted according to the
 * active locale. Components should call these instead of producing
 * presentation-formatted strings manually.
 */

export type Locale = 'en' | 'hi' | 'ar';

const DEFAULT_LOCALE: Locale = 'en';

/** Store the active locale so non-React code can access it */
let activeLocale: Locale = DEFAULT_LOCALE;

export function setLocale(locale: Locale): void {
  activeLocale = locale;
}

export function getLocale(): Locale {
  return activeLocale;
}

/** BCP-47 tag for Intl APIs */
function intlLocale(locale: Locale): string {
  switch (locale) {
    case 'hi': return 'hi-IN';
    case 'ar': return 'ar-SA';
    default: return 'en-IN';
  }
}

/**
 * Format a date as "20 Aug 2025" (en-IN style).
 * Falls back to the raw value if it can't be parsed.
 */
export function formatDate(
  value: string | Date,
  locale: Locale = activeLocale,
): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Format a date+time as "22 Aug 2026, 09:30 AM" (en-IN style).
 */
export function formatDateTime(
  value: string | Date,
  locale: Locale = activeLocale,
): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  const dateStr = new Intl.DateTimeFormat(intlLocale(locale), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
  const timeStr = new Intl.DateTimeFormat(intlLocale(locale), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
  return `${dateStr}, ${timeStr}`;
}

/**
 * Format a time only as "09:00 AM" (en-IN style).
 */
export function formatTime(
  value: string | Date,
  locale: Locale = activeLocale,
): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(intlLocale(locale), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Format a relative time like "2h ago", "1d ago", "Just now".
 * Uses Intl.RelativeTimeFormat for the locale-aware base, with
 * a "Just now" special case for < 1 minute.
 */
export function formatRelativeTime(
  value: string | Date,
  locale: Locale = activeLocale,
): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return String(value);

  const diffMs = date.getTime() - Date.now();
  const absMs = Math.abs(diffMs);
  const seconds = Math.round(diffMs / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  const rtf = new Intl.RelativeTimeFormat(intlLocale(locale), { numeric: 'auto' });

  if (absMs < 60_000) return locale === 'en' ? 'Just now' : rtf.format(0, 'second');
  if (absMs < 3_600_000) return rtf.format(minutes, 'minute');
  if (absMs < 86_400_000) return rtf.format(hours, 'hour');
  if (absMs < 604_800_000) return rtf.format(days, 'day');
  if (absMs < 2_419_200_000) return rtf.format(Math.round(days / 7), 'week');
  return rtf.format(Math.round(days / 30), 'month');
}

/** Convert legacy labels such as "Updated 2h ago" through Intl formatting. */
export function formatRelativeLabel(label: string, locale: Locale = activeLocale): string {
  const match = label.match(/(?:Updated )?(\\d+)(m|h|d|w) ago/i);
  if (!match) return label;
  const value = Number(match[1]);
  const unit = { m: 'minute', h: 'hour', d: 'day', w: 'week' }[match[2].toLowerCase() as 'm' | 'h' | 'd' | 'w'] as Intl.RelativeTimeFormatUnit;
  return new Intl.RelativeTimeFormat(intlLocale(locale), { numeric: 'auto' }).format(-value, unit);
}

/**
 * Format a number with grouping (e.g. 8,642).
 */
export function formatNumber(
  value: number | string,
  locale: Locale = activeLocale,
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat(intlLocale(locale)).format(num);
}

/**
 * Format a percentage value (pass 83.6 for "83.6%").
 */
export function formatPercentage(
  value: number | string,
  locale: Locale = activeLocale,
  fractionDigits = 1,
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat(intlLocale(locale), {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(num / 100);
}

/**
 * Format a currency value in INR (₹) with crore formatting for large amounts.
 * For values >= 1 crore (10,000,000), formats as "₹125.4 Cr".
 * For smaller values, formats as "₹85.6 Cr" / "₹1,284" etc.
 *
 * Pass the raw number (in rupees). The helper decides the scale.
 */
export function formatCurrency(
  value: number | string,
  locale: Locale = activeLocale,
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return String(value);

  // Values expressed in crores directly (e.g. 125.4 means ₹125.4 Cr)
  // are handled by the caller passing a string. For raw rupee amounts,
  // we scale to crores if >= 1 crore.
  const crore = 10_000_000;
  if (num >= crore) {
    const crValue = num / crore;
    const formatted = new Intl.NumberFormat(intlLocale(locale), {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(crValue);
    return `₹${formatted} Cr`;
  }

  return new Intl.NumberFormat(intlLocale(locale), {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format a value that is already in crores (e.g. 125.4 → "₹125.4 Cr").
 * Use this when the data source stores the number in crore units.
 */
export function formatCrore(
  value: number | string,
  locale: Locale = activeLocale,
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return String(value);
  const formatted = new Intl.NumberFormat(intlLocale(locale), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);
  return `₹${formatted} Cr`;
}
