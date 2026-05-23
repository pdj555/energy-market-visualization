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
      <aside className="border-l-2 border-primary pl-4 lg:min-h-full">
        <p className="label-caps">Alerts · {marketName}</p>
        {insights.alerts.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {insights.alerts.map(alert => (
              <li key={alert} className="flex items-start gap-3 text-xs sm:text-sm">
                <span
                  className="mt-1 h-2 w-2 flex-none rounded-full border border-primary bg-primary"
                  aria-hidden
                />
                <span>{alert}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="nous-muted mt-4">No anomalies.</p>
        )}
      </aside>
    </div>
  );
}
