'use client';

import { useTheme } from '@/lib/hooks/use-theme';

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="label-caps rounded-sm border border-primary bg-backdrop px-1.5 py-0.5 transition hover:nous-tint-4"
    >
      {isDark ? 'light' : 'dark'}
    </button>
  );
}
