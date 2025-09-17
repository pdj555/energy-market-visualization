import type {
  MarketMetadata,
  MarketOverview,
  MarketSnapshot,
  SnapshotRequestParams,
} from '@/types/api';

const DEFAULT_HEADERS: HeadersInit = {
  Accept: 'application/json',
};

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      ...DEFAULT_HEADERS,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Request failed with status ${response.status}: ${message || response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

export function getMarketCatalog(): Promise<MarketMetadata[]> {
  return fetchJson<MarketMetadata[]>('/api/markets/catalog');
}

export function getMarketOverview(): Promise<MarketOverview[]> {
  return fetchJson<MarketOverview[]>('/api/markets/overview');
}

export function getMarketSnapshot(
  marketCode: string,
  params: SnapshotRequestParams,
): Promise<MarketSnapshot> {
  const searchParams = new URLSearchParams({
    historyHours: params.historyHours.toString(),
    historyResolutionMinutes: params.historyResolutionMinutes.toString(),
    forecastHours: params.forecastHours.toString(),
    forecastResolutionMinutes: params.forecastResolutionMinutes.toString(),
  });

  return fetchJson<MarketSnapshot>(
    `/api/markets/${encodeURIComponent(marketCode)}/snapshot?${searchParams.toString()}`,
  );
}
