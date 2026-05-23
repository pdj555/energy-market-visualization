import { NousSection } from '@/components/ui/nous-section';

export function LoadingState() {
  return (
    <NousSection title="Loading">
      <p className="nous-muted py-10 text-center">Loading markets…</p>
    </NousSection>
  );
}
