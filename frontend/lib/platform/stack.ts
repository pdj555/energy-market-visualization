export type StackCategory = 'harness' | 'models' | 'evals' | 'runtime';

export interface StackItem {
  category: StackCategory;
  name: string;
  detail: string;
}

export const AGENT_STACK: StackItem[] = [
  { category: 'harness', name: 'Claude Code', detail: 'PR review & @claude workflows' },
  { category: 'harness', name: 'GitHub Actions', detail: 'Agent-native CI pipeline' },
  { category: 'models', name: 'Claude Sonnet', detail: 'Primary coding model' },
  { category: 'models', name: 'Skills & CLAUDE.md', detail: 'Repo-grounded playbooks' },
  { category: 'evals', name: 'Maven + Spotless', detail: 'Backend unit & format gates' },
  { category: 'evals', name: 'Vitest + TypeScript', detail: 'Frontend coverage CI' },
  { category: 'runtime', name: 'Next.js 16', detail: 'React 19 dashboard' },
  { category: 'runtime', name: 'Spring WebFlux', detail: 'Java 22 reactive API' },
];

export const STACK_CATEGORY_LABEL: Record<StackCategory, string> = {
  harness: 'Harness',
  models: 'Models & skills',
  evals: 'Evals',
  runtime: 'Runtime',
};
