import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { EnergyPrice, ENERGY_COLORS } from '../types/energy';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EnergyPriceChartProps {
  prices: EnergyPrice[];
}

export const EnergyPriceChart: React.FC<EnergyPriceChartProps> = ({ prices }) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  const getEnergyDisplayName = (type: string): string => {
    return type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ');
  };

  const chartData: ChartData<'bar'> = {
    labels: prices.map(p => getEnergyDisplayName(p.energyType)),
    datasets: [
      {
        label: 'Current Price ($)',
        data: prices.map(p => p.price),
        backgroundColor: prices.map(p => ENERGY_COLORS[p.energyType] + '80'), // Add transparency
        borderColor: prices.map(p => ENERGY_COLORS[p.energyType]),
        borderWidth: 2,
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Energy Prices by Type',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const price = context.parsed.y;
            const index = context.dataIndex;
            const unit = prices[index]?.unit || 'MWh';
            return `$${price.toFixed(2)} per ${unit}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
    animation: {
      duration: 750,
    }
  };

  useEffect(() => {
    // Force chart update when prices change
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [prices]);

  return (
    <div className="card">
      <div className="h-96">
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};