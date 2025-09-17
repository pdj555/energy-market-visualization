import type { FC } from 'react';
import type { MarketMetadata } from '@/types/api';
import { formatDateTime } from '@/utils/format';

interface DashboardHeaderProps {
  markets: MarketMetadata[];
  selectedMarket: string;
  onSelectMarket: (marketCode: string) => void;
  lastUpdated: string;
  isRefreshing: boolean;
  historyHours: number;
  onHistoryHoursChange: (value: number) => void;
  historyResolutionMinutes: number;
  onHistoryResolutionChange: (value: number) => void;
  forecastHours: number;
  onForecastHoursChange: (value: number) => void;
  onRefresh: () => void;
}

const HISTORY_OPTIONS = [24, 48, 72, 168];
const HISTORY_RESOLUTION_OPTIONS = [15, 30, 60];
const FORECAST_OPTIONS = [12, 24, 36];

const selectClassName =
  'mt-1 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 shadow-inner shadow-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60';

export const DashboardHeader: FC<DashboardHeaderProps> = ({
  markets,
  selectedMarket,
  onSelectMarket,
  lastUpdated,
  isRefreshing,
  historyHours,
  onHistoryHoursChange,
  historyResolutionMinutes,
  onHistoryResolutionChange,
  forecastHours,
  onForecastHoursChange,
  onRefresh,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/95">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">Energy Market Intelligence Console</h1>
          <p className="text-sm text-slate-400">
            Live synthetic telemetry highlighting price formation, demand pressure, and grid health.
          </p>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Last updated {formatDateTime(lastUpdated)}
            {isRefreshing ? ' • refreshing…' : ''}
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-end">
          <div className="flex flex-1 flex-col md:flex-none">
            <label htmlFor="market" className="text-xs font-semibold uppercase text-slate-400">
              Market
            </label>
            <select
              id="market"
              value={selectedMarket}
              onChange={(event) => onSelectMarket(event.target.value)}
              className={selectClassName}
            >
              {markets.map((market) => (
                <option key={market.code} value={market.code}>
                  {market.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-500">
              {markets.find((market) => market.code === selectedMarket)?.description}
            </p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-4 md:flex-none md:grid-cols-3">
            <div className="flex flex-col">
              <label htmlFor="history-hours" className="text-xs font-semibold uppercase text-slate-400">
                History
              </label>
              <select
                id="history-hours"
                value={historyHours}
                onChange={(event) => onHistoryHoursChange(Number(event.target.value))}
                className={selectClassName}
              >
                {HISTORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}h
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="history-resolution"
                className="text-xs font-semibold uppercase text-slate-400"
              >
                Resolution
              </label>
              <select
                id="history-resolution"
                value={historyResolutionMinutes}
                onChange={(event) => onHistoryResolutionChange(Number(event.target.value))}
                className={selectClassName}
              >
                {HISTORY_RESOLUTION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}m
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="forecast-hours" className="text-xs font-semibold uppercase text-slate-400">
                Forecast
              </label>
              <select
                id="forecast-hours"
                value={forecastHours}
                onChange={(event) => onForecastHoursChange(Number(event.target.value))}
                className={selectClassName}
              >
                {FORECAST_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}h
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center justify-center rounded-lg border border-sky-500/80 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
          >
            Refresh data
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
