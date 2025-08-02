import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock the hooks and components
vi.mock('./hooks/useWebSocket', () => ({
  useWebSocket: () => ({
    energyPrices: [],
    marketStats: null,
    isConnected: false,
  }),
}));

vi.mock('./components/ConnectionStatus', () => ({
  ConnectionStatus: ({ isConnected }: { isConnected: boolean }) => (
    <div data-testid="connection-status">{isConnected ? 'Live' : 'Disconnected'}</div>
  ),
}));

vi.mock('./components/EnergyPriceCard', () => ({
  EnergyPriceCard: () => <div data-testid="energy-price-card">Energy Price Card</div>,
}));

vi.mock('./components/MarketStatsCard', () => ({
  MarketStatsCard: () => <div data-testid="market-stats-card">Market Stats Card</div>,
}));

vi.mock('./components/EnergyPriceChart', () => ({
  EnergyPriceChart: () => <div data-testid="energy-price-chart">Energy Price Chart</div>,
}));

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(() => ({})),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main heading', () => {
    render(<App />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Energy Market Visualization');
  });

  it('displays real-time market data subtitle', () => {
    render(<App />);

    const subtitle = screen.getByText('Real-time market data');
    expect(subtitle).toBeInTheDocument();
  });

  it('renders connection status', () => {
    render(<App />);

    const connectionStatus = screen.getByTestId('connection-status');
    expect(connectionStatus).toBeInTheDocument();
    expect(connectionStatus).toHaveTextContent('Disconnected');
  });

  it('has proper semantic structure', () => {
    render(<App />);

    // Check for proper semantic elements
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument(); // main
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument(); // h1
  });

  it('shows loading state when not connected', () => {
    render(<App />);

    const loadingMessage = screen.getByText('Connecting to market data stream...');
    expect(loadingMessage).toBeInTheDocument();
  });

  it('renders footer with current year', () => {
    render(<App />);

    const currentYear = new Date().getFullYear();
    const footer = screen.getByText(new RegExp(`Energy Market Visualization © ${currentYear}`));
    expect(footer).toBeInTheDocument();
  });
});
