import { cn } from '@/lib/cn';
import type { MarketOverview } from '@/types/api';
import {
  formatCarbonIntensity,
  formatMegawatts,
  formatPrice,
  formatRenewablesShare,
} from '@/lib/format';
import { PriceChange } from '@/components/ui/price-change';

interface MarketGridProps {
  overviews: MarketOverview[];
  selectedMarket: string;
  onSelectMarket: (code: string) => void;
}

export function MarketGrid({ overviews, selectedMarket, onSelectMarket }: MarketGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {overviews.map((overview, index) => (
        <button
          key={overview.code}
          type="button"
          onClick={() => onSelectMarket(overview.code)}
          aria-pressed={overview.code === selectedMarket}
          className={cn(
            'nous-frame p-4 text-left transition duration-200 animate-fade-up sm:p-5',
            'hover:nous-tint-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            overview.code === selectedMarket && 'nous-tint-8 ring-1 ring-inset ring-primary/40'
          )}
          style={{ animationDelay: `${index * 35}ms` }}
        >
          <div className="flex items-start justify-between gap-3 nous-divider pb-3">
            <div className="min-w-0">
              <p className="label-caps">{overview.code}</p>
              <p className="mt-1 truncate">{overview.name}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="tabular-nums">{formatPrice(overview.currentPrice)}</p>
              <PriceChange value={overview.priceChangePercent} className="text-xs" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            <GridStat label="Avg" value={formatPrice(overview.averagePrice)} />
            <GridStat label="Demand" value={formatMegawatts(overview.demandMw)} />
            <GridStat label="Renewables" value={formatRenewablesShare(overview.renewablesShare)} />
            <GridStat label="Carbon" value={formatCarbonIntensity(overview.carbonIntensity)} />
          </div>
        </button>
      ))}
    </div>
  );
}

function GridStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="spec-row py-1.5">
      <span className="label-caps">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
