import type { MarketOverview } from '@/types/api';
import {
  formatCarbonIntensity,
  formatDateTime,
  formatMegawatts,
  formatPrice,
  formatRenewablesShare,
} from '@/lib/format';
import { PriceChange } from '@/components/ui/price-change';
import { StatCell } from '@/components/ui/stat-cell';

interface MarketSpotlightProps {
  overview: MarketOverview;
  isRefreshing: boolean;
}

export function MarketSpotlight({ overview, isRefreshing }: MarketSpotlightProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end nous-divider-strong pb-5">
        <div>
          <p className="label-caps">{overview.code}</p>
          <p className="mt-2 text-xl leading-tight sm:text-2xl">{overview.name}</p>
          <p className="nous-muted mt-2 text-xs sm:text-sm">{overview.region}</p>
        </div>
        <div className="lg:text-right">
          <p className="label-caps">Spot price</p>
          <p className="metric-value mt-2">{formatPrice(overview.currentPrice)}</p>
          <PriceChange value={overview.priceChangePercent} className="mt-2 text-sm" />
        </div>
      </div>

      <div className="nous-stat-grid">
        <StatCell label="Demand" value={formatMegawatts(overview.demandMw)} emphasize />
        <StatCell label="Renewables" value={formatRenewablesShare(overview.renewablesShare)} emphasize />
        <StatCell label="Carbon" value={formatCarbonIntensity(overview.carbonIntensity)} emphasize />
        <StatCell label="Avg price" value={formatPrice(overview.averagePrice)} emphasize />
      </div>

      <p className="nous-muted text-[11px] uppercase tracking-[0.12em] sm:text-xs">
        {isRefreshing ? 'Syncing' : 'Updated'} · {formatDateTime(overview.lastUpdated)}
      </p>
    </div>
  );
}
