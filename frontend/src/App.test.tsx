import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const mockCatalog = [
  {
    code: 'NEISO',
    name: 'ISO New England Hub',
    region: 'New England',
    timezone: 'America/New_York',
    description: 'Tight reserve margins and winter risk.',
    typicalPrice: 85,
  },
  {
    code: 'ERCOT',
    name: 'ERCOT Real-Time Hub',
    region: 'Texas',
    timezone: 'America/Chicago',
    description: 'Weather-sensitive grid.',
    typicalPrice: 72,
  },
];

const mockOverview = [
  {
    code: 'NEISO',
    name: 'ISO New England Hub',
    region: 'New England',
    timezone: 'America/New_York',
    description: 'Tight reserve margins and winter risk.',
    typicalPrice: 85,
    currentPrice: 88.2,
    priceChangePercent: 3.5,
    averagePrice: 82.1,
    demandMw: 18500,
    renewablesShare: 52.4,
    carbonIntensity: 290.2,
    lastUpdated: '2025-01-15T12:00:00Z',
  },
  {
    code: 'ERCOT',
    name: 'ERCOT Real-Time Hub',
    region: 'Texas',
    timezone: 'America/Chicago',
    description: 'Weather-sensitive grid.',
    typicalPrice: 72,
    currentPrice: 64.3,
    priceChangePercent: -1.2,
    averagePrice: 66.8,
    demandMw: 52000,
    renewablesShare: 34.7,
    carbonIntensity: 410.4,
    lastUpdated: '2025-01-15T12:00:00Z',
  },
];

const mockSnapshot = {
  overview: {
    code: 'NEISO',
    name: 'ISO New England Hub',
    region: 'New England',
    timezone: 'America/New_York',
    description: 'Tight reserve margins and winter risk.',
    typicalPrice: 85,
    currentPrice: 88.2,
    priceChangePercent: 3.5,
    averagePrice: 82.1,
    demandMw: 18500,
    renewablesShare: 52.4,
    carbonIntensity: 290.2,
    lastUpdated: '2025-01-15T12:00:00Z',
  },
  priceSeries: [
    {
      timestamp: '2025-01-15T08:00:00Z',
      priceMwh: 80.2,
      demandMw: 15000,
      carbonIntensity: 300,
      renewablesShare: 48,
    },
    {
      timestamp: '2025-01-15T09:00:00Z',
      priceMwh: 82.5,
      demandMw: 15850,
      carbonIntensity: 298,
      renewablesShare: 49,
    },
    {
      timestamp: '2025-01-15T10:00:00Z',
      priceMwh: 85.1,
      demandMw: 16600,
      carbonIntensity: 295,
      renewablesShare: 50,
    },
    {
      timestamp: '2025-01-15T11:00:00Z',
      priceMwh: 87.3,
      demandMw: 17250,
      carbonIntensity: 292,
      renewablesShare: 51,
    },
    {
      timestamp: '2025-01-15T12:00:00Z',
      priceMwh: 88.2,
      demandMw: 18500,
      carbonIntensity: 290,
      renewablesShare: 52.4,
    },
  ],
  forecast: [
    {
      timestamp: '2025-01-15T13:00:00Z',
      projectedPriceMwh: 90.1,
      lowerBound: 85.2,
      upperBound: 95.4,
    },
    {
      timestamp: '2025-01-15T14:00:00Z',
      projectedPriceMwh: 91.2,
      lowerBound: 86.1,
      upperBound: 96.8,
    },
    {
      timestamp: '2025-01-15T15:00:00Z',
      projectedPriceMwh: 92.5,
      lowerBound: 87.4,
      upperBound: 98.3,
    },
    {
      timestamp: '2025-01-15T16:00:00Z',
      projectedPriceMwh: 93.1,
      lowerBound: 88.0,
      upperBound: 99.2,
    },
  ],
  insights: {
    windowStart: '2025-01-15T08:00:00Z',
    windowEnd: '2025-01-15T12:00:00Z',
    averagePrice: 84.7,
    priceStandardDeviation: 3.1,
    minPrice: 80.2,
    maxPrice: 88.2,
    averageDemand: 16640,
    peakDemand: 18500,
    averageRenewablesShare: 50.5,
    carbonIntensityTrendPerHour: -1.2,
    alerts: [
      'Price spike detected: +4.1% vs average',
      'Renewable output is significantly below typical levels',
    ],
  },
};

describe('App Component', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString();
      if (url.endsWith('/api/markets/catalog')) {
        return Promise.resolve(
          new Response(JSON.stringify(mockCatalog), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      }
      if (url.endsWith('/api/markets/overview')) {
        return Promise.resolve(
          new Response(JSON.stringify(mockOverview), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      }
      if (url.includes('/api/markets/NEISO/snapshot')) {
        return Promise.resolve(
          new Response(JSON.stringify(mockSnapshot), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      }
      return Promise.reject(new Error(`Unhandled request: ${url}`));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderApp = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );
  };

  it('renders the intelligence dashboard with loaded data', async () => {
    renderApp();

    expect(await screen.findByText('Energy Market Intelligence Console')).toBeInTheDocument();
    expect(await screen.findByText('ISO New England Hub')).toBeInTheDocument();
    expect(await screen.findByText('$88.20')).toBeInTheDocument();

    const chart = await screen.findByTestId('mock-line-chart');
    expect(chart).toHaveAttribute('data-point-count', '5');

    expect(await screen.findByText('Forward price envelope')).toBeInTheDocument();
    expect(await screen.findByText('Projected Price')).toBeInTheDocument();
    expect(await screen.findByText('Price spike detected: +4.1% vs average')).toBeInTheDocument();
  });
});
