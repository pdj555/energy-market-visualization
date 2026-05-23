const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const wholeNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatMegawatts(value: number): string {
  return `${wholeNumberFormatter.format(value)} MW`;
}

export function formatPercent(value: number, options: { showSign?: boolean } = {}): string {
  const formatted = `${decimalFormatter.format(value)}%`;
  if (options.showSign && value > 0) {
    return `+${formatted}`;
  }
  return formatted;
}

export function formatTrend(value: number): string {
  const formatted = decimalFormatter.format(value);
  if (value > 0) {
    return `+${formatted}`;
  }
  if (value < 0) {
    return formatted;
  }
  return '0.0';
}

export function formatRenewablesShare(value: number): string {
  return `${decimalFormatter.format(value)}%`;
}

export function formatCarbonIntensity(value: number): string {
  return `${wholeNumberFormatter.format(value)} gCO₂/kWh`;
}

export function formatDateTime(isoDate: string): string {
  return dateTimeFormatter.format(new Date(isoDate));
}

export function formatTimeLabel(isoDate: string): string {
  return timeFormatter.format(new Date(isoDate));
}
