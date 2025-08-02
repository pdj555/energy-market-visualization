import React from 'react';
import { EnergyPrice, ENERGY_COLORS } from '../types/energy';

interface EnergyPriceCardProps {
  price: EnergyPrice;
}

export const EnergyPriceCard: React.FC<EnergyPriceCardProps> = ({ price }) => {
  const isPositive = price.changePercent > 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeIcon = isPositive ? '▲' : '▼';
  const energyColor = ENERGY_COLORS[price.energyType];

  const getEnergyDisplayName = (type: string): string => {
    return type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ');
  };

  return (
    <div className="card hover:scale-105 transition-transform duration-200">
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-3 h-3 rounded-full animate-pulse-slow"
          style={{ backgroundColor: energyColor }}
        />
        <span className="text-sm text-gray-500">{price.unit}</span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {getEnergyDisplayName(price.energyType)}
      </h3>
      
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-gray-900">
          ${price.price.toFixed(2)}
        </span>
        <span className={`flex items-center text-sm font-medium ${changeColor}`}>
          <span className="mr-1">{changeIcon}</span>
          {Math.abs(price.changePercent).toFixed(2)}%
        </span>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Last updated: {new Date(price.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};