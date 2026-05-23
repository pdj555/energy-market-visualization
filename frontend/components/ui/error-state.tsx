import { Button } from '@/components/ui/primitives';
import { NousSection } from '@/components/ui/nous-section';

interface ErrorStateProps {
  onRetry?: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <NousSection title="Connection failed">
      <div className="py-4 text-center">
        <p className="nous-muted">
          Unable to reach the market API. Verify the backend is running on port 8080.
        </p>
        {onRetry ? (
          <div className="mt-4">
            <Button onClick={onRetry}>Retry</Button>
          </div>
        ) : null}
      </div>
    </NousSection>
  );
}
