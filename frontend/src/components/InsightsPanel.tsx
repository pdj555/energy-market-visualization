import type { FC } from 'react';
import type { MarketInsights } from '@/types/api';
import {
  formatDateTime,
  formatMegawatts,
  formatPrice,
  formatRenewablesShare,
  formatTrend,
} from '@/utils/format';

interface InsightsPanelProps {
  insights: MarketInsights;
  marketName: string;
}

const InsightsPanel: FC<InsightsPanelProps> = ({ insights, marketName }) => {
  const metrics = [
    {
      label: 'Average Price',
      value: formatPrice(insights.averagePrice),
      description: 'Mean value across the selected history window.',
    },
    {
      label: 'Volatility (σ)',
      value: formatPrice(insights.priceStandardDeviation),
      description: 'Standard deviation captures realised volatility.',
    },
    {
      label: 'Price Range',
      value: `${formatPrice(insights.minPrice)} – ${formatPrice(insights.maxPrice)}`,
      description: 'Observed minimum and maximum price in the window.',
    },
    {
      label: 'Average Demand',
      value: formatMegawatts(insights.averageDemand),
      description: 'Mean system load over the analysis horizon.',
    },
    {
      label: 'Peak Demand',
      value: formatMegawatts(insights.peakDemand),
      description: 'Maximum observed load for the period.',
    },
    {
      label: 'Renewable Share',
      value: formatRenewablesShare(insights.averageRenewablesShare),
      description: 'Average share of supply met by renewables.',
    },
    {
      label: 'Carbon Trend',
      value: `${formatTrend(insights.carbonIntensityTrendPerHour)}%/h`,
      description: 'Directional slope of carbon intensity per hour.',
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-4 flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-slate-100">Market quality metrics</h3>
          <p className="text-xs text-slate-400">
            Sampling window {formatDateTime(insights.windowStart)} → {formatDateTime(insights.windowEnd)}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-inner shadow-slate-950/50"
            >
              <p className="text-xs uppercase tracking-wide text-slate-400">{metric.label}</p>
              <p className="mt-1 text-xl font-semibold text-slate-100">{metric.value}</p>
              <p className="mt-2 text-xs text-slate-500">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Operational alerts</h3>
          <p className="text-xs text-slate-400">
            Prioritised signals for {marketName.toLowerCase()} traders and system operators.
          </p>
        </div>
        <div className="flex-1 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
          {insights.alerts.length > 0 ? (
            <ul className="space-y-3 text-sm text-slate-200">
              {insights.alerts.map((alert) => (
                <li key={alert} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-amber-400" aria-hidden="true" />
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">
              No anomalies detected — market conditions remain within expected bands.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
