'use client';

import { useCallback, useEffect, useState } from 'react';

function readDarkMode() {
  if (typeof document === 'undefined') {
    return false;
  }

  return document.documentElement.classList.contains('dark');
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
  window.localStorage.setItem('theme', dark ? 'dark' : 'light');
}

export function useTheme() {
  const [isDark, setIsDark] = useState(readDarkMode);

  useEffect(() => {
    const update = () => setIsDark(readDarkMode());
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const next = !readDarkMode();
    applyTheme(next);
    setIsDark(next);
  }, []);

  return { isDark, toggle };
}
