import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useWebSocket } from './useWebSocket';
import { WebSocketService } from '../services/websocket';

// Mock the WebSocket service
vi.mock('../services/websocket', () => {
  const mockConnect = vi.fn();
  const mockDisconnect = vi.fn();
  const mockSubscribeToEnergyPrices = vi.fn();
  const mockSubscribeToMarketStats = vi.fn();
  const mockIsConnected = vi.fn();

  return {
    WebSocketService: vi.fn().mockImplementation(() => ({
      connect: mockConnect,
      disconnect: mockDisconnect,
      subscribeToEnergyPrices: mockSubscribeToEnergyPrices,
      subscribeToMarketStats: mockSubscribeToMarketStats,
      isConnected: mockIsConnected,
    })),
  };
});

describe('useWebSocket Hook', () => {
  let mockWebSocketInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWebSocketInstance = new WebSocketService();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('initializes with empty data and disconnected state', () => {
    mockWebSocketInstance.isConnected.mockReturnValue(false);
    
    const { result } = renderHook(() => useWebSocket());

    expect(result.current.energyPrices).toEqual([]);
    expect(result.current.marketStats).toBeNull();
    expect(result.current.isConnected).toBe(false);
  });

  it('connects to WebSocket on mount', () => {
    mockWebSocketInstance.isConnected.mockReturnValue(false);
    
    renderHook(() => useWebSocket());

    expect(mockWebSocketInstance.connect).toHaveBeenCalledTimes(1);
  });

  it('subscribes to data streams when connected', async () => {
    mockWebSocketInstance.isConnected
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    
    const unsubscribePrices = vi.fn();
    const unsubscribeStats = vi.fn();
    
    mockWebSocketInstance.subscribeToEnergyPrices.mockReturnValue(unsubscribePrices);
    mockWebSocketInstance.subscribeToMarketStats.mockReturnValue(unsubscribeStats);

    const { result } = renderHook(() => useWebSocket());

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    expect(mockWebSocketInstance.subscribeToEnergyPrices).toHaveBeenCalled();
    expect(mockWebSocketInstance.subscribeToMarketStats).toHaveBeenCalled();
  });

  it('updates energy prices when data is received', async () => {
    mockWebSocketInstance.isConnected.mockReturnValue(true);
    
    let priceHandler: any;
    mockWebSocketInstance.subscribeToEnergyPrices.mockImplementation((handler) => {
      priceHandler = handler;
      return vi.fn();
    });
    mockWebSocketInstance.subscribeToMarketStats.mockReturnValue(vi.fn());

    const { result } = renderHook(() => useWebSocket());

    const mockPrices = [
      { energyType: 'ELECTRICITY', price: 45.50, unit: 'MWh', timestamp: '2024-01-15T10:30:00Z', changePercent: 2.5 },
    ];

    await waitFor(() => {
      expect(priceHandler).toBeDefined();
    });

    priceHandler(mockPrices);

    await waitFor(() => {
      expect(result.current.energyPrices).toEqual(mockPrices);
    });
  });

  it('disconnects on unmount', () => {
    mockWebSocketInstance.isConnected.mockReturnValue(true);
    
    const { unmount } = renderHook(() => useWebSocket());

    unmount();

    expect(mockWebSocketInstance.disconnect).toHaveBeenCalled();
  });
});