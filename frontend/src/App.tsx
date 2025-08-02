import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWebSocket } from './hooks/useWebSocket';
import { EnergyPriceCard } from './components/EnergyPriceCard';
import { MarketStatsCard } from './components/MarketStatsCard';
import { EnergyPriceChart } from './components/EnergyPriceChart';
import { ConnectionStatus } from './components/ConnectionStatus';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Dashboard() {
  const { energyPrices, marketStats, isConnected } = useWebSocket();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Energy Market Visualization
              </h1>
              <span className="ml-3 text-sm text-gray-500">
                Real-time market data
              </span>
            </div>
            <ConnectionStatus isConnected={isConnected} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Stats and Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            {marketStats && <MarketStatsCard stats={marketStats} />}
          </div>
          <div className="lg:col-span-2">
            {energyPrices.length > 0 && <EnergyPriceChart prices={energyPrices} />}
          </div>
        </div>

        {/* Energy Prices Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Current Energy Prices
          </h2>
          {energyPrices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {energyPrices.map((price) => (
                <EnergyPriceCard key={price.energyType} price={price} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-500">
                {isConnected ? 'Loading energy market data...' : 'Connecting to market data stream...'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Energy Market Visualization © {new Date().getFullYear()} • Premium real-time data
          </p>
        </footer>
      </main>
    </div>
  );
}

/**
 * Main App component for Energy Market Visualization.
 *
 * @returns JSX element representing the main application
 */
const App: React.FC = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
};

export default App;
