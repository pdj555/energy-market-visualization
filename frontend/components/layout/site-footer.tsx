import { StackBadges } from '@/components/ui/stack-badges';

export function SiteFooter() {
  return (
    <footer className="mt-4 border-t-2 border-primary py-6">
      <div className="space-y-4">
        <StackBadges />
        <p className="nous-muted text-center text-[11px] sm:text-xs">
          Deterministic synthetic telemetry · MIT
        </p>
      </div>
    </footer>
  );
}
