import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EnergyPriceChart } from './EnergyPriceChart';
import { EnergyType, EnergyPrice } from '../types/energy';

// Mock Chart.js and react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Bar: ({ data, options }: { data: unknown; options: unknown }) => {
    return (
      <div data-testid='bar-chart'>
        <div data-testid='chart-data'>{JSON.stringify(data)}</div>
        <div data-testid='chart-options'>{JSON.stringify(options)}</div>
      </div>
    );
  },
}));

vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  BarElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
}));

describe('EnergyPriceChart Component', () => {
  const mockPrices: EnergyPrice[] = [
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
    {
      energyType: EnergyType.SOLAR,
      price: 20.0,
      unit: 'MWh',
      timestamp: '2024-01-15T10:30:00Z',
      changePercent: 0.5,
    },
  ];

  it('renders the chart container', () => {
    const { container } = render(<EnergyPriceChart prices={mockPrices} />);

    const chartContainer = container.querySelector('.card');
    expect(chartContainer).toBeInTheDocument();

    const heightContainer = container.querySelector('.h-96');
    expect(heightContainer).toBeInTheDocument();
  });

  it('passes correct data to the chart', () => {
    const { getByTestId } = render(<EnergyPriceChart prices={mockPrices} />);

    const chartData = getByTestId('chart-data');
    const data = JSON.parse(chartData.textContent || '{}');

    expect(data.labels).toEqual(['Electricity', 'Gas', 'Solar']);
    expect(data.datasets[0].data).toEqual([45.5, 30.25, 20.0]);
    expect(data.datasets[0].label).toBe('Current Price ($)');
  });

  it('configures chart options correctly', () => {
    const { getByTestId } = render(<EnergyPriceChart prices={mockPrices} />);

    const chartOptions = getByTestId('chart-options');
    const options = JSON.parse(chartOptions.textContent || '{}');

    expect(options.responsive).toBe(true);
    expect(options.maintainAspectRatio).toBe(false);
    expect(options.plugins.title.text).toBe('Energy Prices by Type');
    expect(options.plugins.legend.display).toBe(false);
  });

  it('handles empty prices array', () => {
    const { container } = render(<EnergyPriceChart prices={[]} />);

    const chartContainer = container.querySelector('.card');
    expect(chartContainer).toBeInTheDocument();
  });

  it('formats energy type names correctly', () => {
    const { getByTestId } = render(<EnergyPriceChart prices={mockPrices} />);

    const chartData = getByTestId('chart-data');
    const data = JSON.parse(chartData.textContent || '{}');

    // Check that energy types are properly formatted
    expect(data.labels).toContain('Electricity');
    expect(data.labels).toContain('Gas');
    expect(data.labels).toContain('Solar');
  });
});
