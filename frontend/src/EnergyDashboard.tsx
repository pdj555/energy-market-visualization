import React, { useEffect, useState, useRef } from 'react';

interface Price {
  type: string;
  price: number;
  change: number;
  future: boolean;
}

const ENERGY_CONFIG = {
  SOLAR: { name: 'Solar', icon: '☀️', description: 'The future is bright' },
  WIND: { name: 'Wind', icon: '💨', description: 'Clean and infinite' },
  GAS: { name: 'Natural Gas', icon: '🔥', description: 'Bridge to tomorrow' },
  COAL: { name: 'Coal', icon: '⚫', description: 'Yesterday\'s fuel' }
};

export function EnergyDashboard() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Use Server-Sent Events - simpler, more reliable
    const eventSource = new EventSource('http://localhost:8080/stream');
    eventSourceRef.current = eventSource;
    
    eventSource.onopen = () => setConnected(true);
    eventSource.onerror = () => setConnected(false);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrices(data.prices);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Split into future and past
  const futureEnergy = prices.filter(p => p.future);
  const pastEnergy = prices.filter(p => !p.future);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Dynamic gradient background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-black to-gray-900/10 animate-gradient" />
      </div>

      <div className="relative z-10 p-8 md:p-16 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-20 text-center">
          <h1 className="text-7xl md:text-8xl font-extralight tracking-tighter mb-4">
            Energy Transition
          </h1>
          <p className="text-xl text-white/60 font-light">
            Watch the future unfold in real-time
          </p>
        </header>

        {/* The Story */}
        <div className="space-y-16">
          {/* Future Energy */}
          <section>
            <h2 className="text-3xl font-light mb-8 text-green-400">The Future</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {futureEnergy.map(({ type, price, change }) => {
                const config = ENERGY_CONFIG[type as keyof typeof ENERGY_CONFIG];
                const trend = change > 0 ? '📈' : '📉';
                
                return (
                  <div
                    key={type}
                    className="group relative bg-gradient-to-br from-green-500/10 to-transparent backdrop-blur-xl rounded-3xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all duration-500 hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-4xl">{config.icon}</span>
                          <h3 className="text-2xl font-light">{config.name}</h3>
                        </div>
                        <p className="text-sm text-white/50">{config.description}</p>
                      </div>
                      {connected && (
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-5xl font-extralight">
                        ${price.toFixed(2)}
                        <span className="text-lg text-white/50 ml-2">per MWh</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-green-400">
                        <span className="text-2xl">{trend}</span>
                        <span className="text-lg font-light">
                          {Math.abs(change).toFixed(2)}% {change > 0 ? 'up' : 'down'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Divider */}
          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-black px-6 text-white/40 text-sm uppercase tracking-wider">
                The Transition
              </span>
            </div>
          </div>

          {/* Past Energy */}
          <section>
            <h2 className="text-3xl font-light mb-8 text-gray-400">The Past</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastEnergy.map(({ type, price, change }) => {
                const config = ENERGY_CONFIG[type as keyof typeof ENERGY_CONFIG];
                const trend = change > 0 ? '📈' : '📉';
                
                return (
                  <div
                    key={type}
                    className="group relative bg-gradient-to-br from-gray-500/10 to-transparent backdrop-blur-xl rounded-3xl p-8 border border-gray-500/20 hover:border-gray-500/40 transition-all duration-500 hover:scale-[1.02] opacity-80"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-4xl grayscale">{config.icon}</span>
                          <h3 className="text-2xl font-light">{config.name}</h3>
                        </div>
                        <p className="text-sm text-white/50">{config.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-5xl font-extralight text-gray-300">
                        ${price.toFixed(2)}
                        <span className="text-lg text-white/50 ml-2">per MWh</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-red-400">
                        <span className="text-2xl">{trend}</span>
                        <span className="text-lg font-light">
                          {Math.abs(change).toFixed(2)}% {change > 0 ? 'up' : 'down'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Connection Status */}
        <div className="fixed bottom-8 left-8">
          <div className={`px-4 py-2 rounded-full backdrop-blur-lg transition-all duration-300 ${
            connected 
              ? 'bg-white/5 border border-white/10' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            <span className={`text-sm font-light ${
              connected ? 'text-white/60' : 'text-red-400'
            }`}>
              {connected ? 'Live data streaming' : 'Reconnecting...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}