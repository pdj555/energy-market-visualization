import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getMarketCatalog, getMarketOverview, getMarketSnapshot } from '@/api/client';
import type { SnapshotRequestParams } from '@/types/api';

const CATALOG_QUERY_KEY = ['markets', 'catalog'] as const;
const OVERVIEW_QUERY_KEY = ['markets', 'overview'] as const;

function snapshotQueryKey(marketCode: string | undefined, params: SnapshotRequestParams) {
  return [
    'markets',
    'snapshot',
    marketCode ?? 'unknown',
    params.historyHours,
    params.historyResolutionMinutes,
    params.forecastHours,
    params.forecastResolutionMinutes,
  ] as const;
}

export function useMarketCatalog() {
  return useQuery({
    queryKey: CATALOG_QUERY_KEY,
    queryFn: getMarketCatalog,
    staleTime: 10 * 60 * 1000,
  });
}

export function useMarketOverview() {
  return useQuery({
    queryKey: OVERVIEW_QUERY_KEY,
    queryFn: getMarketOverview,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useMarketSnapshot(
  marketCode: string | undefined,
  params: SnapshotRequestParams,
) {
  return useQuery({
    queryKey: snapshotQueryKey(marketCode, params),
    queryFn: () => {
      if (!marketCode) {
        throw new Error('A market code is required to fetch a snapshot');
      }
      return getMarketSnapshot(marketCode, params);
    },
    enabled: Boolean(marketCode),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
