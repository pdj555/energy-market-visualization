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
      className="label-caps rounded-sm border border-primary/30 bg-surface px-2 py-0.5 transition hover:nous-tint-4"
    >
      {isDark ? 'light' : 'dark'}
    </button>
  );
}
