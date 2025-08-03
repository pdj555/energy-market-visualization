import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiService } from './api';
import { EnergyType } from '../types/energy';

// Mock fetch globally
global.fetch = vi.fn();

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getCurrentPrices', () => {
    it('fetches current prices successfully', async () => {
      const mockPrices = [
        {
          energyType: EnergyType.ELECTRICITY,
          price: 45.5,
          unit: 'MWh',
          timestamp: '2024-01-15T10:30:00Z',
          changePercent: 2.5,
        },
        {
          energyType: EnergyType.GAS,
          price: 30.25,
          unit: 'MMBtu',
          timestamp: '2024-01-15T10:30:00Z',
          changePercent: -1.2,
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPrices,
      } as Response);

      const result = await ApiService.getCurrentPrices();

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/energy-market/prices');
      expect(result).toEqual(mockPrices);
    });

    it('throws error on failed request', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(ApiService.getCurrentPrices()).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('getPriceByType', () => {
    it('fetches price for specific energy type', async () => {
      const mockPrice = {
        energyType: EnergyType.ELECTRICITY,
        price: 45.5,
        unit: 'MWh',
        timestamp: '2024-01-15T10:30:00Z',
        changePercent: 2.5,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPrice,
      } as Response);

      const result = await ApiService.getPriceByType('ELECTRICITY');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/energy-market/prices/ELECTRICITY'
      );
      expect(result).toEqual(mockPrice);
    });
  });

  describe('getMarketStats', () => {
    it('fetches market statistics successfully', async () => {
      const mockStats = {
        totalVolume: 25000.5,
        averagePrice: 35.75,
        volumeByType: { ELECTRICITY: 8000 },
        priceByType: { ELECTRICITY: 45.5 },
        timestamp: '2024-01-15T10:30:00Z',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      } as Response);

      const result = await ApiService.getMarketStats();

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/energy-market/stats');
      expect(result).toEqual(mockStats);
    });
  });

  describe('getEnergyTypes', () => {
    it('fetches energy types successfully', async () => {
      const mockTypes = [
        { type: 'ELECTRICITY', displayName: 'Electricity', unit: 'MWh' },
        { type: 'GAS', displayName: 'Natural Gas', unit: 'MMBtu' },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTypes,
      } as Response);

      const result = await ApiService.getEnergyTypes();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/energy-market/energy-types'
      );
      expect(result).toEqual(mockTypes);
    });
  });

  describe('error handling', () => {
    it('handles network errors', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

      await expect(ApiService.getCurrentPrices()).rejects.toThrow('Network error');
    });

    it('handles JSON parsing errors', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as Response);

      await expect(ApiService.getCurrentPrices()).rejects.toThrow('Invalid JSON');
    });
  });
});
