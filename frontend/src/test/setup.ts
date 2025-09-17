import '@testing-library/jest-dom';
import React from 'react';
import type { ChartData } from 'chart.js';
import { vi } from 'vitest';

vi.mock('react-chartjs-2', () => ({
  Line: ({ data }: { data: ChartData<'line'> }) => (
    <div
      data-testid="mock-line-chart"
      data-point-count={String(data.datasets?.[0]?.data?.length ?? 0)}
    />
  ),
}));
