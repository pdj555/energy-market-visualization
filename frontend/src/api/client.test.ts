import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadClientWithApiBaseUrl(apiBaseUrl: string) {
  vi.resetModules();
  vi.stubEnv('VITE_API_BASE_URL', apiBaseUrl);

  return import('./client');
}

describe('API client', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('uses same-origin API paths when no base URL is configured', async () => {
    const { getMarketCatalog } = await loadClientWithApiBaseUrl('');
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await expect(getMarketCatalog()).resolves.toEqual([]);

    expect(fetchMock).toHaveBeenCalledWith('/api/markets/catalog', {
      headers: { Accept: 'application/json' },
    });
  });

  it('prefixes API paths with the configured deployment origin', async () => {
    const { getMarketSnapshot } = await loadClientWithApiBaseUrl('https://api.example.com///');
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          overview: {},
          priceSeries: [],
          forecast: [],
          insights: {},
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    await getMarketSnapshot('NE ISO', {
      historyHours: 24,
      historyResolutionMinutes: 15,
      forecastHours: 12,
      forecastResolutionMinutes: 60,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/api/markets/NE%20ISO/snapshot?historyHours=24&historyResolutionMinutes=15&forecastHours=12&forecastResolutionMinutes=60',
      { headers: { Accept: 'application/json' } }
    );
  });

  it('throws rich API errors with status and response body context', async () => {
    const { ApiRequestError, getMarketOverview } = await loadClientWithApiBaseUrl('');
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response('market feed unavailable', {
        status: 503,
        statusText: 'Service Unavailable',
      })
    );

    const request = getMarketOverview();

    await expect(request).rejects.toMatchObject({
      name: 'ApiRequestError',
      status: 503,
      statusText: 'Service Unavailable',
      responseBody: 'market feed unavailable',
    });
    await expect(request).rejects.toBeInstanceOf(ApiRequestError);
  });
});
