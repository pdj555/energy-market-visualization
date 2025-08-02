import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MarketStatsCard } from './MarketStatsCard';
import { MarketStats, EnergyType } from '../types/energy';

describe('MarketStatsCard Component', () => {
  const mockStats: MarketStats = {
    totalVolume: 25000.50,
    averagePrice: 35.75,
    volumeByType: {
      [EnergyType.ELECTRICITY]: 8000,
      [EnergyType.GAS]: 6000,
      [EnergyType.SOLAR]: 4000,
      [EnergyType.WIND]: 3500,
      [EnergyType.COAL]: 2000,
      [EnergyType.NUCLEAR]: 1000,
      [EnergyType.HYDRO]: 500,
    },
    priceByType: {
      [EnergyType.ELECTRICITY]: 45.50,
      [EnergyType.GAS]: 30.25,
      [EnergyType.SOLAR]: 20.00,
      [EnergyType.WIND]: 25.00,
      [EnergyType.COAL]: 40.00,
      [EnergyType.NUCLEAR]: 35.00,
      [EnergyType.HYDRO]: 22.00,
    },
    timestamp: '2024-01-15T10:30:00Z',
  };

  it('renders the market overview heading', () => {
    render(<MarketStatsCard stats={mockStats} />);
    
    const heading = screen.getByText('Market Overview');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('displays total volume with correct formatting', () => {
    render(<MarketStatsCard stats={mockStats} />);
    
    const volumeLabel = screen.getByText('Total Volume');
    expect(volumeLabel).toBeInTheDocument();
    
    const volumeValue = screen.getByText('25,000.5');
    expect(volumeValue).toBeInTheDocument();
    
    const volumeUnit = screen.getByText('MWh');
    expect(volumeUnit).toBeInTheDocument();
  });

  it('displays average price with correct formatting', () => {
    render(<MarketStatsCard stats={mockStats} />);
    
    const priceLabel = screen.getByText('Average Price');
    expect(priceLabel).toBeInTheDocument();
    
    const priceValue = screen.getByText('$35.75');
    expect(priceValue).toBeInTheDocument();
    
    const priceUnit = screen.getByText('per MWh');
    expect(priceUnit).toBeInTheDocument();
  });

  it('shows volume distribution section', () => {
    render(<MarketStatsCard stats={mockStats} />);
    
    const distributionLabel = screen.getByText('Volume Distribution');
    expect(distributionLabel).toBeInTheDocument();
  });

  it('displays top 3 energy types by volume', () => {
    render(<MarketStatsCard stats={mockStats} />);
    
    // Should show Electricity, Gas, and Solar (top 3 by volume)
    const electricity = screen.getByText('Electricity');
    expect(electricity).toBeInTheDocument();
    
    const electricityVolume = screen.getByText('8,000 MWh');
    expect(electricityVolume).toBeInTheDocument();
  });

  it('formats timestamp correctly', () => {
    render(<MarketStatsCard stats={mockStats} />);
    
    const timestamp = screen.getByText(/Updated:/);
    expect(timestamp).toBeInTheDocument();
  });

  it('applies gradient background classes', () => {
    const { container } = render(<MarketStatsCard stats={mockStats} />);
    
    const card = container.querySelector('.card');
    expect(card).toHaveClass('bg-gradient-to-br');
    expect(card).toHaveClass('from-energy-blue');
    expect(card).toHaveClass('to-blue-600');
    expect(card).toHaveClass('text-white');
  });

  it('renders grid layout for stats', () => {
    const { container } = render(<MarketStatsCard stats={mockStats} />);
    
    const grid = container.querySelector('.grid-cols-2');
    expect(grid).toBeInTheDocument();
  });
});