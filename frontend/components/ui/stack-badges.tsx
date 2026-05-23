import { TOOLCHAIN_BADGES } from '@/lib/platform/pipeline';

export function StackBadges() {
  return (
    <ul className="flex flex-wrap justify-center gap-2">
      {TOOLCHAIN_BADGES.map(badge => (
        <li
          key={badge}
          className="rounded-sm border-2 border-primary px-2 py-0.5 text-[11px] sm:text-xs"
        >
          {badge}
        </li>
      ))}
    </ul>
  );
}
