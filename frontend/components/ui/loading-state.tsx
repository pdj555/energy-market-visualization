import { NousSection } from '@/components/ui/nous-section';

export function LoadingState() {
  return (
    <NousSection title="Loading">
      <div className="space-y-5 py-2">
        <div className="nous-skeleton h-8 w-48" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="nous-skeleton h-20 rounded-sm border-2 border-primary" />
          ))}
        </div>
        <p className="nous-muted text-center text-xs sm:text-sm">Loading markets…</p>
      </div>
    </NousSection>
  );
}
