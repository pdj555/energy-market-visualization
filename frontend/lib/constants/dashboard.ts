export const HISTORY_HOURS_OPTIONS = [24, 48, 72, 168].map(h => ({ value: h, label: `${h}h` }));
export const HISTORY_RESOLUTION_OPTIONS = [15, 30, 60].map(m => ({ value: m, label: `${m}m` }));
export const FORECAST_HOURS_OPTIONS = [12, 24, 36].map(h => ({ value: h, label: `${h}h` }));

export const DEFAULT_HISTORY_HOURS = 24;
export const DEFAULT_HISTORY_RESOLUTION = 15;
export const DEFAULT_FORECAST_HOURS = 12;
export const FORECAST_RESOLUTION_MINUTES = 60;
