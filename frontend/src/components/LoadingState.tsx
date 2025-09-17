const LoadingState = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
        <h2 className="text-lg font-semibold">Streaming market intelligence…</h2>
        <p className="mt-2 text-sm text-slate-400">
          Building the price curve, balancing demand, and calibrating renewable signals.
        </p>
      </div>
    </div>
  );
};

export default LoadingState;
