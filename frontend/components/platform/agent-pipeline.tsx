import { AGENT_PIPELINE } from '@/lib/platform/pipeline';

export function AgentPipeline() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {AGENT_PIPELINE.map((item, index) => (
        <li
          key={item.step}
          className="relative rounded-xl border border-line bg-canvas/60 px-4 py-3"
        >
          {index < AGENT_PIPELINE.length - 1 ? (
            <span
              className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-line lg:block"
              aria-hidden
            />
          ) : null}
          <p className="text-[10px] font-medium tabular-nums tracking-widest text-accent-warm">
            {item.step}
          </p>
          <p className="mt-1 text-sm font-medium text-ink-primary">{item.label}</p>
          <p className="mt-0.5 text-xs text-ink-tertiary">{item.detail}</p>
        </li>
      ))}
    </ol>
  );
}
