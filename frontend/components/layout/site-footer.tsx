import { StackBadges } from '@/components/ui/stack-badges';

export function SiteFooter() {
  return (
    <footer className="mt-6 border-t border-primary/30 pt-6 sm:mt-8 sm:pt-8">
      <StackBadges />
      <p className="nous-muted mt-5 text-center text-[11px] uppercase tracking-[0.14em] sm:text-xs">
        Deterministic synthetic telemetry · MIT
      </p>
    </footer>
  );
}
