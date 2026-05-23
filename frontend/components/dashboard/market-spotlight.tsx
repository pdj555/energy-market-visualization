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
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4 nous-divider-strong pb-4">
        <div>
          <p className="label-caps">{overview.code}</p>
          <p className="mt-1 text-lg sm:text-xl">{overview.name}</p>
          <p className="nous-muted mt-1 text-xs sm:text-sm">{overview.region}</p>
        </div>
        <div className="text-right">
          <p className="label-caps">Spot price</p>
          <p className="metric-value mt-1">{formatPrice(overview.currentPrice)}</p>
          <PriceChange value={overview.priceChangePercent} className="mt-1 text-sm" />
        </div>
      </div>

      <div className="nous-stat-grid">
        <StatCell label="Demand" value={formatMegawatts(overview.demandMw)} />
        <StatCell label="Renewables" value={formatRenewablesShare(overview.renewablesShare)} />
        <StatCell label="Carbon" value={formatCarbonIntensity(overview.carbonIntensity)} />
        <StatCell label="Avg price" value={formatPrice(overview.averagePrice)} />
      </div>

      <p className="nous-muted text-xs sm:text-sm">
        {isRefreshing ? 'Syncing' : 'Updated'} {formatDateTime(overview.lastUpdated)}
      </p>
    </div>
  );
}
