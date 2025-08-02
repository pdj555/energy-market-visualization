import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EnergyPriceCard } from './EnergyPriceCard';
import { EnergyType, EnergyPrice } from '../types/energy';

describe('EnergyPriceCard Component', () => {
  const mockPrice: EnergyPrice = {
    energyType: EnergyType.ELECTRICITY,
    price: 45.50,
    unit: 'MWh',
    timestamp: '2024-01-15T10:30:00Z',
    changePercent: 2.5,
  };

  it('renders energy type name correctly', () => {
    render(<EnergyPriceCard price={mockPrice} />);
    
    const energyType = screen.getByText('Electricity');
    expect(energyType).toBeInTheDocument();
  });

  it('displays the price with correct formatting', () => {
    render(<EnergyPriceCard price={mockPrice} />);
    
    const price = screen.getByText('$45.50');
    expect(price).toBeInTheDocument();
  });

  it('shows the unit of measurement', () => {
    render(<EnergyPriceCard price={mockPrice} />);
    
    const unit = screen.getByText('MWh');
    expect(unit).toBeInTheDocument();
  });

  it('displays positive change with up arrow and green color', () => {
    render(<EnergyPriceCard price={mockPrice} />);
    
    const changeElement = screen.getByText(/2.50%/);
    expect(changeElement).toBeInTheDocument();
    expect(changeElement).toHaveClass('text-green-600');
    
    const arrow = screen.getByText('▲');
    expect(arrow).toBeInTheDocument();
  });

  it('displays negative change with down arrow and red color', () => {
    const negativePrice: EnergyPrice = {
      ...mockPrice,
      changePercent: -3.75,
    };
    
    render(<EnergyPriceCard price={negativePrice} />);
    
    const changeElement = screen.getByText(/3.75%/);
    expect(changeElement).toBeInTheDocument();
    expect(changeElement).toHaveClass('text-red-600');
    
    const arrow = screen.getByText('▼');
    expect(arrow).toBeInTheDocument();
  });

  it('formats timestamp correctly', () => {
    render(<EnergyPriceCard price={mockPrice} />);
    
    const timestamp = screen.getByText(/Last updated:/);
    expect(timestamp).toBeInTheDocument();
  });

  it('handles different energy types correctly', () => {
    const gasPrice: EnergyPrice = {
      ...mockPrice,
      energyType: EnergyType.GAS,
      unit: 'MMBtu',
    };
    
    render(<EnergyPriceCard price={gasPrice} />);
    
    const energyType = screen.getByText('Gas');
    expect(energyType).toBeInTheDocument();
    
    const unit = screen.getByText('MMBtu');
    expect(unit).toBeInTheDocument();
  });

  it('applies hover effect class', () => {
    const { container } = render(<EnergyPriceCard price={mockPrice} />);
    
    const card = container.querySelector('.card');
    expect(card).toHaveClass('hover:scale-105');
  });
});