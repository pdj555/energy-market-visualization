export interface MarketMetadata {
  code: string;
  name: string;
  region: string;
  timezone: string;
  description: string;
  typicalPrice: number;
}

export interface MarketOverview extends MarketMetadata {
  currentPrice: number;
  priceChangePercent: number;
  averagePrice: number;
  demandMw: number;
  renewablesShare: number;
  carbonIntensity: number;
  lastUpdated: string;
}

export interface PricePoint {
  timestamp: string;
  priceMwh: number;
  demandMw: number;
  carbonIntensity: number;
  renewablesShare: number;
}

export interface ForecastPoint {
  timestamp: string;
  projectedPriceMwh: number;
  lowerBound: number;
  upperBound: number;
}

export interface MarketInsights {
  windowStart: string;
  windowEnd: string;
  averagePrice: number;
  priceStandardDeviation: number;
  minPrice: number;
  maxPrice: number;
  averageDemand: number;
  peakDemand: number;
  averageRenewablesShare: number;
  carbonIntensityTrendPerHour: number;
  alerts: string[];
}

export interface MarketSnapshot {
  overview: MarketOverview;
  priceSeries: PricePoint[];
  forecast: ForecastPoint[];
  insights: MarketInsights;
}

export interface SnapshotRequestParams {
  historyHours: number;
  historyResolutionMinutes: number;
  forecastHours: number;
  forecastResolutionMinutes: number;
}
