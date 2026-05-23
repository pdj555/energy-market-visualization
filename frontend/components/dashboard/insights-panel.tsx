import type { MarketInsights } from '@/types/api';
import {
  formatDateTime,
  formatMegawatts,
  formatPrice,
  formatRenewablesShare,
  formatTrend,
} from '@/lib/format';
import { StatCell } from '@/components/ui/stat-cell';

interface InsightsPanelProps {
  insights: MarketInsights;
  marketName: string;
}

export function InsightsPanel({ insights, marketName }: InsightsPanelProps) {
  const metrics = [
    { label: 'Average price', value: formatPrice(insights.averagePrice) },
    { label: 'Volatility σ', value: formatPrice(insights.priceStandardDeviation) },
    {
      label: 'Price range',
      value: `${formatPrice(insights.minPrice)} – ${formatPrice(insights.maxPrice)}`,
    },
    { label: 'Avg demand', value: formatMegawatts(insights.averageDemand) },
    { label: 'Peak demand', value: formatMegawatts(insights.peakDemand) },
    { label: 'Renewables', value: formatRenewablesShare(insights.averageRenewablesShare) },
    { label: 'Carbon trend', value: `${formatTrend(insights.carbonIntensityTrendPerHour)}%/h` },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-3">
        <p className="nous-muted text-xs sm:text-sm">
          {formatDateTime(insights.windowStart)} → {formatDateTime(insights.windowEnd)}
        </p>
        <div className="nous-metric-grid">
          {metrics.map(metric => (
            <StatCell key={metric.label} label={metric.label} value={metric.value} className="nous-metric-cell" />
          ))}
        </div>
      </div>
      <aside className="border-l border-primary/30 pl-5 lg:min-h-full">
        <p className="label-caps">Alerts · {marketName}</p>
        {insights.alerts.length > 0 ? (
          <ul className="mt-4 space-y-2.5">
            {insights.alerts.map(alert => (
              <li key={alert} className="nous-tint-4 flex items-start gap-3 rounded-sm px-3 py-2.5 text-xs sm:text-sm">
                <span
                  className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-primary"
                  aria-hidden
                />
                <span>{alert}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="nous-muted mt-4 text-xs sm:text-sm">No anomalies in this window.</p>
        )}
      </aside>
    </div>
  );
}
