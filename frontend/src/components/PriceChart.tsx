import { useMemo } from 'react';
import type { FC } from 'react';
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
import { formatTimeLabel } from '@/utils/format';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface PriceChartProps {
  priceSeries: PricePoint[];
  selectedMarketName: string;
}

const PriceChart: FC<PriceChartProps> = ({ priceSeries, selectedMarketName }) => {
  const chartData = useMemo<ChartData<'line'>>(() => {
    if (priceSeries.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = priceSeries.map((point) => formatTimeLabel(point.timestamp));

    return {
      labels,
      datasets: [
        {
          label: `${selectedMarketName} price ($/MWh)`,
          data: priceSeries.map((point) => Number(point.priceMwh.toFixed(2))),
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.2)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
          yAxisID: 'y',
        },
        {
          label: 'Demand (MW)',
          data: priceSeries.map((point) => Number(point.demandMw.toFixed(0))),
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
          yAxisID: 'y1',
        },
      ],
    };
  }, [priceSeries, selectedMarketName]);

  const options = useMemo<ChartOptions<'line'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#e2e8f0',
            boxWidth: 16,
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          ticks: {
            color: '#94a3b8',
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10,
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.12)',
          },
        },
        y: {
          position: 'left',
          ticks: {
            color: '#cbd5f5',
            callback: (value) => `$${value}`,
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.08)',
          },
        },
        y1: {
          position: 'right',
          ticks: {
            color: '#cbd5f5',
            callback: (value) => `${value} MW`,
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    }),
    [],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Price &amp; demand dynamics</h3>
          <p className="text-xs text-slate-400">{selectedMarketName}</p>
        </div>
      </div>
      <div className="flex-1">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PriceChart;
