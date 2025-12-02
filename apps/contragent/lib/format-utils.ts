// Centralized formatting utilities for currency, numbers, and percentages
// NOTE: DataNewton API returns financial values in thousands (тыс ₽), so we multiply by 1000 before formatting

export function formatCurrency(value: number): string {
  if (value === 0) return '0 ₽';

  const absValue = Math.abs(value);
  const isNegative = value < 0;
  const prefix = isNegative ? '-' : '';

  if (absValue >= 1_000_000_000) {
    return `${prefix}${(absValue / 1_000_000_000).toFixed(2)} млрд ₽`;
  } else if (absValue >= 1_000_000) {
    return `${prefix}${(absValue / 1_000_000).toFixed(2)} млн ₽`;
  } else if (absValue >= 1_000) {
    const thousands = Math.floor(absValue / 1_000);
    const remainder = Math.floor(absValue % 1_000);
    if (remainder === 0) {
      return `${prefix}${thousands.toLocaleString('ru-RU')} тыс ₽`;
    }
    return `${prefix}${thousands.toLocaleString('ru-RU')} ${remainder.toString().padStart(3, '0')} ₽`;
  }

  return `${prefix}${absValue.toFixed(0)} ₽`;
}

export function formatCurrencyCompact(value: number): string {
  if (value === 0) return '0 ₽';

  const realValue = value * 1000;
  const absValue = Math.abs(realValue);
  const isNegative = realValue < 0;
  const prefix = isNegative ? '-' : '';

  if (absValue >= 1_000_000_000) {
    return `${prefix}${(absValue / 1_000_000_000).toFixed(2)} млрд ₽`;
  } else if (absValue >= 1_000_000) {
    return `${prefix}${(absValue / 1_000_000).toFixed(2)} млн ₽`;
  } else if (absValue >= 1_000) {
    return `${prefix}${(absValue / 1_000).toFixed(2)} тыс ₽`;
  }

  return `${prefix}${absValue.toFixed(0)} ₽`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('ru-RU');
}

export function formatNumberWithSpaces(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatPercentageChange(current: number, previous: number): string {
  if (!previous || previous === 0) return '—';

  const change = ((current - previous) / previous) * 100;
  const prefix = change > 0 ? '+' : '';

  return `${prefix}${change.toFixed(1)}%`;
}
