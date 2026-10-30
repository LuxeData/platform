/**
 * Locale-independent number and currency formatter.
 * Avoids React hydration mismatch across different client/server locales (e.g. en-US vs en-IN).
 */
export function formatUSD(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

