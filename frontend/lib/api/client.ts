import type {
  MarketMetadata,
  MarketOverview,
  MarketSnapshot,
  SnapshotRequestParams,
} from '@/types/api';

const DEFAULT_HEADERS: HeadersInit = {
  Accept: 'application/json',
};

const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);

export class ApiRequestError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
  readonly responseBody: string;

  constructor(response: Response, responseBody: string) {
    const message = responseBody.trim() || response.statusText || 'Unknown API error';

    super(`Energy API request failed (${response.status} ${response.statusText}): ${message}`);
    this.name = 'ApiRequestError';
    this.status = response.status;
    this.statusText = response.statusText;
    this.url = response.url;
    this.responseBody = responseBody;
  }
}

function normalizeApiBaseUrl(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue === '/') {
    return '';
  }

  return trimmedValue.replace(/\/+$/, '');
}

function buildApiUrl(path: string): string {
  if (!path.startsWith('/')) {
    throw new Error(`API paths must start with "/". Received: ${path}`);
  }

  return `${API_BASE_URL}${path}`;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      ...DEFAULT_HEADERS,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiRequestError(response, await response.text());
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
  params: SnapshotRequestParams
): Promise<MarketSnapshot> {
  const searchParams = new URLSearchParams({
    historyHours: params.historyHours.toString(),
    historyResolutionMinutes: params.historyResolutionMinutes.toString(),
    forecastHours: params.forecastHours.toString(),
    forecastResolutionMinutes: params.forecastResolutionMinutes.toString(),
  });

  return fetchJson<MarketSnapshot>(
    `/api/markets/${encodeURIComponent(marketCode)}/snapshot?${searchParams.toString()}`
  );
}
