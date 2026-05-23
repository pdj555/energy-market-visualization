'use client';

import { StatusPill } from '@/components/ui/primitives';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const LINKS = [
  { href: '#markets', label: 'Markets' },
  { href: '#analytics', label: 'Analytics' },
  { href: '#insights', label: 'Insights' },
] as const;

interface SiteNavProps {
  isLive: boolean;
}

export function SiteNav({ isLive }: SiteNavProps) {
  return (
    <header className="relative py-3">
      <div className="absolute left-0 top-3 z-10 w-full -translate-y-1/2 px-1 sm:px-4">
        <div className="flex items-center justify-between gap-3 bg-backdrop">
          <div className="flex min-w-0 items-center gap-3">
            <span className="nous-muted truncate text-[11px] sm:text-xs">
              five ISO regions · synthetic telemetry
            </span>
            <ThemeToggle />
          </div>
          <nav className="hidden items-center gap-4 md:flex" aria-label="Sections">
            {LINKS.map(link => (
              <a key={link.href} href={link.href} className="nous-link text-[11px] sm:text-xs">
                {link.label}
              </a>
            ))}
          </nav>
          <StatusPill label={isLive ? 'Live' : 'Syncing'} active={isLive} />
        </div>
      </div>
      <div className="nous-frame px-4 py-5 sm:px-6 sm:py-6">
        <h1 className="nous-display">Energy Intelligence</h1>
      </div>
    </header>
  );
}
