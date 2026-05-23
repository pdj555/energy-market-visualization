import { AgentPipeline } from '@/components/platform/agent-pipeline';

export function AgentExcellenceHero() {
  return (
    <section className="relative border-b border-line/60 pb-12 pt-14">
      <div className="mx-auto max-w-6xl px-6">
        <p className="label-caps text-accent-warm">Applied AI · Agent-native delivery</p>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.1] tracking-tight text-ink-primary sm:text-5xl lg:text-[3.25rem]">
          Wholesale market intelligence, built by agents end to end.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-secondary">
          Harness, model, eval, ship — a production reference for agentic systems on modern
          frameworks.
        </p>
        <div className="mt-10">
          <AgentPipeline />
        </div>
      </div>
    </section>
  );
}
