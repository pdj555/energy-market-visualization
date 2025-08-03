import { useEffect, useRef, useState } from 'react';
import { WebSocketService } from '../services/websocket';
import { EnergyPrice, MarketStats } from '../types/energy';

export function useWebSocket() {
  const [energyPrices, setEnergyPrices] = useState<EnergyPrice[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsServiceRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    // Create WebSocket service instance
    const wsService = new WebSocketService();
    wsServiceRef.current = wsService;

    // Connect to WebSocket
    wsService.connect();

    // Wait a bit for connection to establish
    const connectionCheckInterval = setInterval(() => {
      if (wsService.isConnected()) {
        setIsConnected(true);
        clearInterval(connectionCheckInterval);

        // Subscribe to energy prices
        wsService.subscribeToEnergyPrices(prices => {
          setEnergyPrices(prices);
        });

        // Subscribe to market stats
        wsService.subscribeToMarketStats(stats => {
          setMarketStats(stats);
        });
      }
    }, 100);

    // Cleanup on unmount
    return () => {
      clearInterval(connectionCheckInterval);
      if (wsServiceRef.current) {
        wsServiceRef.current.disconnect();
      }
    };
  }, []);

  return {
    energyPrices,
    marketStats,
    isConnected,
  };
}
