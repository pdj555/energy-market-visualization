import clsx from 'clsx';
import type { FC } from 'react';
import type { MarketOverview } from '@/types/api';
import {
  formatCarbonIntensity,
  formatMegawatts,
  formatPercent,
  formatPrice,
  formatRenewablesShare,
} from '@/utils/format';

interface MarketSummaryGridProps {
  overviews: MarketOverview[];
  selectedMarket: string;
  onSelectMarket: (marketCode: string) => void;
}

const MarketSummaryGrid: FC<MarketSummaryGridProps> = ({
  overviews,
  selectedMarket,
  onSelectMarket,
}) => {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {overviews.map((overview) => {
        const isSelected = overview.code === selectedMarket;
        return (
          <button
            key={overview.code}
            type="button"
            onClick={() => onSelectMarket(overview.code)}
            aria-pressed={isSelected}
            className={clsx(
              'rounded-2xl border px-5 py-4 text-left transition shadow-lg shadow-slate-950/40',
              isSelected
                ? 'border-sky-500/80 bg-sky-500/10'
                : 'border-slate-800/80 bg-slate-800/60 hover:border-sky-500/40 hover:bg-slate-800/80',
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">{overview.name}</h3>
                <p className="text-xs uppercase tracking-wide text-slate-400">{overview.region}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-100">{formatPrice(overview.currentPrice)}</p>
                <p
                  className={clsx(
                    'text-sm font-semibold',
                    overview.priceChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400',
                  )}
                >
                  {formatPercent(overview.priceChangePercent, { showSign: true })}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-300">
              <div>
                <p className="text-xs uppercase text-slate-400">Avg Price</p>
                <p className="font-semibold text-slate-100">{formatPrice(overview.averagePrice)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Demand</p>
                <p className="font-semibold text-slate-100">{formatMegawatts(overview.demandMw)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Renewables</p>
                <p className="font-semibold text-emerald-300">
                  {formatRenewablesShare(overview.renewablesShare)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Carbon Intensity</p>
                <p className="font-semibold text-amber-200">
                  {formatCarbonIntensity(overview.carbonIntensity)}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MarketSummaryGrid;
