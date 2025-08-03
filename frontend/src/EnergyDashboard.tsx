import React, { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface Price {
  type: string;
  price: number;
  change: number;
}

const ENERGY_CONFIG = {
  ELECTRICITY: { color: '#3B82F6', name: 'Electricity', icon: '⚡' },
  GAS: { color: '#F59E0B', name: 'Natural Gas', icon: '🔥' },
  SOLAR: { color: '#FCD34D', name: 'Solar', icon: '☀️' },
  WIND: { color: '#10B981', name: 'Wind', icon: '💨' }
};

export function EnergyDashboard() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [connected, setConnected] = useState(false);
  const previousPrices = useRef<Record<string, number>>({});

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        setConnected(true);
        client.subscribe('/topic/energy', message => {
          const data = JSON.parse(message.body);
          setPrices(data.prices);
        });
      },
      onDisconnect: () => setConnected(false),
      reconnectDelay: 5000,
    });

    client.activate();
    return () => client.deactivate();
  }, []);

  // Track price changes for animations
  useEffect(() => {
    prices.forEach(({ type, price }) => {
      previousPrices.current[type] = price;
    });
  }, [prices]);

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Subtle animated background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-green-900/20" />
      </div>

      <div className="relative z-10 p-8 md:p-12">
        {/* Header with connection status integrated */}
        <header className="mb-16">
          <h1 className="text-6xl md:text-7xl font-extralight tracking-tight text-white mb-4">
            Energy Market
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-white/60 to-transparent" />
        </header>

        {/* Price cards with proper animation and interaction */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl">
          {prices.map(({ type, price, change }) => {
            const config = ENERGY_CONFIG[type as keyof typeof ENERGY_CONFIG];
            const isRising = change > 0;
            const previousPrice = previousPrices.current[type] || price;
            const priceChanged = Math.abs(price - previousPrice) > 0.01;
            
            return (
              <div
                key={type}
                className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                {/* Glow effect on price change */}
                {priceChanged && (
                  <div 
                    className="absolute inset-0 rounded-3xl blur-xl animate-pulse"
                    style={{ 
                      background: config.color,
                      opacity: 0.3
                    }} 
                  />
                )}

                {/* Card */}
                <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                  {/* Energy type header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <h3 className="text-lg font-medium text-white/80">
                        {config.name}
                      </h3>
                    </div>
                    {/* Live indicator */}
                    {connected && (
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: config.color }}
                      />
                    )}
                  </div>

                  {/* Price display */}
                  <div className="space-y-2">
                    <div className="text-5xl font-extralight tracking-tight text-white">
                      ${price.toFixed(2)}
                    </div>
                    
                    {/* Change indicator */}
                    <div className={`flex items-center gap-2 text-sm font-medium ${
                      isRising ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <span className="text-lg">
                        {isRising ? '↗' : '↘'}
                      </span>
                      <span>{Math.abs(change).toFixed(2)}%</span>
                    </div>
                  </div>

                  {/* Subtle chart line */}
                  <div className="mt-6 h-16 relative overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full">
                      <polyline
                        fill="none"
                        stroke={config.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={`0,${isRising ? 60 : 10} 50,30 100,${isRising ? 10 : 60}`}
                        opacity="0.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Connection status - subtle, integrated */}
        <div className="fixed bottom-8 right-8">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-lg transition-all duration-300 ${
            connected 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className={`text-sm font-medium ${
              connected ? 'text-green-400' : 'text-red-400'
            }`}>
              {connected ? 'Live' : 'Reconnecting...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}