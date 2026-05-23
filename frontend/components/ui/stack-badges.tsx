import { TOOLCHAIN_BADGES } from '@/lib/platform/pipeline';

export function StackBadges() {
  return (
    <ul className="flex flex-wrap justify-center gap-2">
      {TOOLCHAIN_BADGES.map(badge => (
        <li
          key={badge}
          className="rounded-sm border border-primary/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] sm:text-xs"
        >
          {badge}
        </li>
      ))}
    </ul>
  );
}
