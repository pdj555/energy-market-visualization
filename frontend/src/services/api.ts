import { EnergyPrice, MarketStats, EnergyTypeInfo } from '../types/energy';

const API_BASE_URL = 'http://localhost:8080/api';

export class ApiService {
  private static async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getCurrentPrices(): Promise<EnergyPrice[]> {
    return this.fetchJson<EnergyPrice[]>(`${API_BASE_URL}/energy-market/prices`);
  }

  static async getPriceByType(energyType: string): Promise<EnergyPrice> {
    return this.fetchJson<EnergyPrice>(`${API_BASE_URL}/energy-market/prices/${energyType}`);
  }

  static async getMarketStats(): Promise<MarketStats> {
    return this.fetchJson<MarketStats>(`${API_BASE_URL}/energy-market/stats`);
  }

  static async getEnergyTypes(): Promise<EnergyTypeInfo[]> {
    return this.fetchJson<EnergyTypeInfo[]>(`${API_BASE_URL}/energy-market/energy-types`);
  }
}
