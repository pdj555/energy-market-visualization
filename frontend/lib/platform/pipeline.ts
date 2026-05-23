export interface PipelineStep {
  step: string;
  label: string;
  detail: string;
}

export const AGENT_PIPELINE: PipelineStep[] = [
  { step: '01', label: 'Harness', detail: 'Claude Code + GitHub Actions' },
  { step: '02', label: 'Model', detail: 'Sonnet with repo skills' },
  { step: '03', label: 'Eval', detail: 'Maven · Vitest · TypeScript' },
  { step: '04', label: 'Ship', detail: 'Next.js 16 · Spring WebFlux' },
];

export const TOOLCHAIN_BADGES = [
  'Node 26',
  'pnpm 11',
  'Next.js 16',
  'React 19',
  'Java 22',
  'Claude Sonnet',
] as const;
