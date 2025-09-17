import type { FC } from 'react';

interface ErrorStateProps {
  onRetry?: () => void;
}

const ErrorState: FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
      <div className="max-w-md space-y-4 text-center">
        <h2 className="text-2xl font-semibold text-rose-300">We lost the market feed</h2>
        <p className="text-sm text-slate-400">
          The intelligence service could not load the latest curves. Please verify the backend is
          running and try again.
        </p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-lg border border-rose-400/60 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/20"
          >
            Retry request
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ErrorState;
