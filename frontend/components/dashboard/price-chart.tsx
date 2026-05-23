'use client';

import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import type { PricePoint } from '@/types/api';
import { chartColor, readCssColor } from '@/lib/chart-theme';
import { formatTimeLabel } from '@/lib/format';
import { useTheme } from '@/lib/hooks/use-theme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface PriceChartProps {
  priceSeries: PricePoint[];
  marketName: string;
}

export function PriceChart({ priceSeries, marketName }: PriceChartProps) {
  const { isDark } = useTheme();

  const chartData = useMemo<ChartData<'line'>>(() => {
    if (priceSeries.length === 0) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: priceSeries.map(point => formatTimeLabel(point.timestamp)),
      datasets: [
        {
          label: 'Price ($/MWh)',
          data: priceSeries.map(point => Number(point.priceMwh.toFixed(2))),
          borderColor: chartColor('primary'),
          backgroundColor: chartColor('primary', 0.08),
          fill: true,
          tension: 0.2,
          pointRadius: 0,
          borderWidth: 2,
          yAxisID: 'y',
        },
        {
          label: 'Demand (MW)',
          data: priceSeries.map(point => Number(point.demandMw.toFixed(0))),
          borderColor: chartColor('grid'),
          backgroundColor: chartColor('grid', 0.06),
          fill: false,
          tension: 0.2,
          pointRadius: 0,
          borderWidth: 1.5,
          yAxisID: 'y1',
        },
      ],
    };
  }, [priceSeries, isDark]);

  const options = useMemo<ChartOptions<'line'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: chartColor('primary'),
            boxWidth: 10,
            font: { size: 11, family: 'var(--font-mono)', weight: 'bold' },
            padding: 16,
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: readCssColor('--color-tooltip-bg'),
          titleColor: readCssColor('--color-tooltip-text'),
          bodyColor: readCssColor('--color-tooltip-text'),
          borderColor: chartColor('primary'),
          borderWidth: 2,
          titleFont: { size: 11, family: 'var(--font-mono)', weight: 'bold' },
          bodyFont: { size: 12, family: 'var(--font-mono)', weight: 'bold' },
          padding: 10,
        },
      },
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          ticks: {
            color: chartColor('primary'),
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 7,
            font: { family: 'var(--font-mono)', weight: 'bold' },
          },
          grid: { color: chartColor('grid', 0.35) },
          border: { color: chartColor('primary') },
        },
        y: {
          position: 'left',
          ticks: {
            color: chartColor('primary'),
            callback: value => `$${value}`,
            font: { family: 'var(--font-mono)', weight: 'bold' },
          },
          grid: { color: chartColor('grid', 0.35) },
          border: { color: chartColor('primary') },
        },
        y1: {
          position: 'right',
          ticks: {
            color: chartColor('primary'),
            font: { family: 'var(--font-mono)', weight: 'bold' },
          },
          grid: { drawOnChartArea: false },
          border: { color: chartColor('primary') },
        },
      },
    }),
    [isDark]
  );

  if (priceSeries.length === 0) {
    return <p className="nous-muted py-12 text-center">No price data.</p>;
  }

  return (
    <div className="flex h-full min-h-[320px] flex-col">
      <div className="flex items-baseline justify-between gap-4 nous-divider-strong pb-3">
        <span className="label-caps">Series</span>
        <span className="nous-muted truncate text-right text-xs sm:text-sm">{marketName}</span>
      </div>
      <div className="mt-3 min-h-0 flex-1">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
