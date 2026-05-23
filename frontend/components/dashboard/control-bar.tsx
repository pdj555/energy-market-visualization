import type { MarketMetadata } from '@/types/api';
import {
  FORECAST_HOURS_OPTIONS,
  HISTORY_HOURS_OPTIONS,
  HISTORY_RESOLUTION_OPTIONS,
} from '@/lib/constants/dashboard';
import { Button, SelectField } from '@/components/ui/primitives';

interface ControlBarProps {
  markets: MarketMetadata[];
  selectedMarket: string;
  onSelectMarket: (code: string) => void;
  historyHours: number;
  onHistoryHoursChange: (value: number) => void;
  historyResolutionMinutes: number;
  onHistoryResolutionChange: (value: number) => void;
  forecastHours: number;
  onForecastHoursChange: (value: number) => void;
  onRefresh: () => void;
}

export function ControlBar({
  markets,
  selectedMarket,
  onSelectMarket,
  historyHours,
  onHistoryHoursChange,
  historyResolutionMinutes,
  onHistoryResolutionChange,
  forecastHours,
  onForecastHoursChange,
  onRefresh,
}: ControlBarProps) {
  const activeMarket = markets.find(m => m.code === selectedMarket);

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SelectField
          id="market"
          label="Market"
          className="sm:col-span-2"
          value={selectedMarket}
          onChange={onSelectMarket}
          hint={activeMarket?.description}
          options={markets.map(market => ({ value: market.code, label: market.name }))}
        />
        <SelectField
          id="history-hours"
          label="History"
          value={historyHours}
          onChange={value => onHistoryHoursChange(Number(value))}
          options={HISTORY_HOURS_OPTIONS}
        />
        <SelectField
          id="history-resolution"
          label="Resolution"
          value={historyResolutionMinutes}
          onChange={value => onHistoryResolutionChange(Number(value))}
          options={HISTORY_RESOLUTION_OPTIONS}
        />
        <SelectField
          id="forecast-hours"
          label="Forecast"
          value={forecastHours}
          onChange={value => onForecastHoursChange(Number(value))}
          options={FORECAST_HOURS_OPTIONS}
        />
      </div>
      <Button variant="primary" onClick={onRefresh} className="shrink-0 self-end">
        Refresh
      </Button>
    </div>
  );
}
