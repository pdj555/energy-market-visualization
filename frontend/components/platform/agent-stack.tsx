import { AGENT_STACK, STACK_CATEGORY_LABEL, type StackCategory } from '@/lib/platform/stack';
import { Panel } from '@/components/ui/primitives';
import { SectionHeader } from '@/components/ui/section-header';

const ORDER: StackCategory[] = ['harness', 'models', 'evals', 'runtime'];

export function AgentStack() {
  return (
    <section id="platform" aria-labelledby="platform-heading" className="scroll-mt-28 border-t border-line/60 pt-10">
      <SectionHeader
        id="platform-heading"
        title="Platform"
        description="Agent harness, models, evals, and runtime."
      />
      <Panel className="mt-4 overflow-hidden">
        <div className="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {ORDER.map(category => (
            <div key={category} className="p-5">
              <p className="label-caps text-accent-warm">{STACK_CATEGORY_LABEL[category]}</p>
              <ul className="mt-4 space-y-4">
                {AGENT_STACK.filter(item => item.category === category).map(item => (
                  <li key={item.name}>
                    <p className="text-sm font-medium text-ink-primary">{item.name}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-tertiary">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}
