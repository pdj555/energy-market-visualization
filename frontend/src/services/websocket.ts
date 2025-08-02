import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { EnergyPrice, MarketStats } from '../types/energy';

export type MessageHandler<T> = (data: T) => void;

export class WebSocketService {
  private client: Client;
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('WebSocket connected');
      this.connected = true;
      this.reconnectAttempts = 0;
    };

    this.client.onDisconnect = () => {
      console.log('WebSocket disconnected');
      this.connected = false;
    };

    this.client.onStompError = (frame) => {
      console.error('WebSocket error:', frame.headers['message']);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    };
  }

  connect(): void {
    if (!this.connected) {
      this.client.activate();
    }
  }

  disconnect(): void {
    if (this.connected) {
      this.client.deactivate();
    }
  }

  subscribeToEnergyPrices(handler: MessageHandler<EnergyPrice[]>): () => void {
    const subscription = this.client.subscribe('/topic/energy-prices', (message: IMessage) => {
      try {
        const data = JSON.parse(message.body) as EnergyPrice[];
        handler(data);
      } catch (error) {
        console.error('Error parsing energy prices:', error);
      }
    });

    return () => subscription.unsubscribe();
  }

  subscribeToMarketStats(handler: MessageHandler<MarketStats>): () => void {
    const subscription = this.client.subscribe('/topic/market-stats', (message: IMessage) => {
      try {
        const data = JSON.parse(message.body) as MarketStats;
        handler(data);
      } catch (error) {
        console.error('Error parsing market stats:', error);
      }
    });

    return () => subscription.unsubscribe();
  }

  isConnected(): boolean {
    return this.connected;
  }
}