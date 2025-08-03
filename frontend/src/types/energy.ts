export enum EnergyType {
  ELECTRICITY = 'ELECTRICITY',
  GAS = 'GAS',
  COAL = 'COAL',
  SOLAR = 'SOLAR',
  WIND = 'WIND',
  NUCLEAR = 'NUCLEAR',
  HYDRO = 'HYDRO',
}

export interface EnergyPrice {
  energyType: EnergyType;
  price: number;
  unit: string;
  timestamp: string;
  changePercent: number;
}

export interface MarketStats {
  totalVolume: number;
  averagePrice: number;
  volumeByType: Record<EnergyType, number>;
  priceByType: Record<EnergyType, number>;
  timestamp: string;
}

export interface EnergyTypeInfo {
  type: string;
  displayName: string;
  unit: string;
}

export const ENERGY_COLORS: Record<EnergyType, string> = {
  [EnergyType.ELECTRICITY]: '#3b82f6', // blue
  [EnergyType.GAS]: '#f59e0b', // yellow
  [EnergyType.COAL]: '#6b7280', // gray
  [EnergyType.SOLAR]: '#f59e0b', // yellow
  [EnergyType.WIND]: '#10b981', // green
  [EnergyType.NUCLEAR]: '#8b5cf6', // purple
  [EnergyType.HYDRO]: '#06b6d4', // cyan
};
