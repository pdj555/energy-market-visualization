'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_FORECAST_HOURS,
  DEFAULT_HISTORY_HOURS,
  DEFAULT_HISTORY_RESOLUTION,
  FORECAST_RESOLUTION_MINUTES,
} from '@/lib/constants/dashboard';
import { useMarketCatalog, useMarketOverview, useMarketSnapshot } from '@/lib/api/hooks';

export function useDashboard() {
  const catalogQuery = useMarketCatalog();
  const overviewQuery = useMarketOverview();

  const [selectedMarket, setSelectedMarket] = useState<string>();
  const [historyHours, setHistoryHours] = useState(DEFAULT_HISTORY_HOURS);
  const [historyResolutionMinutes, setHistoryResolutionMinutes] = useState(DEFAULT_HISTORY_RESOLUTION);
  const [forecastHours, setForecastHours] = useState(DEFAULT_FORECAST_HOURS);

  useEffect(() => {
    if (!selectedMarket && catalogQuery.data?.length) {
      setSelectedMarket(catalogQuery.data[0]?.code);
    }
  }, [catalogQuery.data, selectedMarket]);

  const snapshotParams = useMemo(
    () => ({
      historyHours,
      historyResolutionMinutes,
      forecastHours,
      forecastResolutionMinutes: FORECAST_RESOLUTION_MINUTES,
    }),
    [historyHours, historyResolutionMinutes, forecastHours]
  );

  const snapshotQuery = useMarketSnapshot(selectedMarket, snapshotParams);

  const isLoading =
    catalogQuery.isLoading || overviewQuery.isLoading || snapshotQuery.isLoading || !selectedMarket;

  const hasError = catalogQuery.isError || overviewQuery.isError || snapshotQuery.isError;

  const refresh = () => {
    void catalogQuery.refetch();
    void overviewQuery.refetch();
    void snapshotQuery.refetch();
  };

  const isRefreshing = snapshotQuery.isFetching || overviewQuery.isFetching;

  return {
    catalog: catalogQuery.data,
    overview: overviewQuery.data,
    snapshot: snapshotQuery.data,
    selectedMarket,
    setSelectedMarket,
    historyHours,
    setHistoryHours,
    historyResolutionMinutes,
    setHistoryResolutionMinutes,
    forecastHours,
    setForecastHours,
    isLoading,
    hasError,
    isRefreshing,
    refresh,
  };
}
