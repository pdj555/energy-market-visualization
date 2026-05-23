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
    <header className="relative pb-1 pt-2">
      <div className="absolute left-0 top-3 z-10 w-full -translate-y-1/2 px-1 sm:px-4">
        <div className="flex items-center justify-between gap-4 bg-backdrop">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="nous-muted hidden truncate text-[11px] sm:inline sm:text-xs">
              five ISO regions · synthetic telemetry
            </span>
            <ThemeToggle />
          </div>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
            {LINKS.map(link => (
              <a key={link.href} href={link.href} className="nous-link text-[11px] sm:text-xs">
                {link.label}
              </a>
            ))}
          </nav>
          <StatusPill label={isLive ? 'Live' : 'Syncing'} active={isLive} />
        </div>
      </div>
      <div className="nous-frame px-5 py-6 sm:px-8 sm:py-8">
        <p className="label-caps mb-3 sm:mb-4">Wholesale telemetry</p>
        <h1 className="nous-display">Energy Intelligence</h1>
      </div>
    </header>
  );
}
