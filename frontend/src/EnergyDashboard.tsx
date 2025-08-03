import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface Price {
  type: string;
  price: number;
  change: number;
}

export function EnergyDashboard() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [connected, setConnected] = useState(false);

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
    });

    client.activate();
    return () => client.deactivate();
  }, []);

  const colors = {
    ELECTRICITY: '#3B82F6',
    GAS: '#F59E0B', 
    SOLAR: '#EAB308',
    WIND: '#10B981'
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="mb-12">
        <h1 className="text-5xl font-thin mb-2">Energy Market</h1>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm opacity-60">{connected ? 'Live' : 'Connecting'}</span>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl">
        {prices.map(({ type, price, change }) => (
          <div key={type} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r opacity-20 group-hover:opacity-30 transition-opacity rounded-2xl"
                 style={{ 
                   background: `linear-gradient(135deg, ${colors[type as keyof typeof colors]}20, ${colors[type as keyof typeof colors]}10)`
                 }} />
            
            <div className="relative p-8 rounded-2xl border border-white/10">
              <h3 className="text-sm font-medium opacity-60 mb-1">{type}</h3>
              <div className="text-4xl font-light mb-2">
                ${price.toFixed(2)}
              </div>
              <div className={`text-sm font-medium ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change > 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}