const FALLBACKS: Record<string, string> = {
  '--color-primary': '#1769ff',
  '--color-grid': '#74a7ff',
  '--color-tooltip-bg': '#1769ff',
  '--color-tooltip-text': '#ffffff',
};

function hexToRgba(hex: string, alpha: number) {
  const value = hex.slice(1);
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function readCssColor(name: string, alpha = 1) {
  const fallback = (FALLBACKS[name] ?? FALLBACKS['--color-primary']) as string;

  if (typeof window === 'undefined') {
    return alpha === 1 ? fallback : hexToRgba(fallback, alpha);
  }

  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = raw || fallback;

  if (value.startsWith('#')) {
    return alpha === 1 ? value : hexToRgba(value, alpha);
  }

  return value;
}

export function chartColor(token: 'primary' | 'grid', alpha = 1) {
  return readCssColor(token === 'primary' ? '--color-primary' : '--color-grid', alpha);
}
