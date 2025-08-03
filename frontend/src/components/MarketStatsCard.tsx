import React from 'react';
import { MarketStats } from '../types/energy';

interface MarketStatsCardProps {
  stats: MarketStats;
}

export const MarketStatsCard: React.FC<MarketStatsCardProps> = ({ stats }) => {
  return (
    <div className='card bg-gradient-to-br from-energy-blue to-blue-600 text-white'>
      <h2 className='text-2xl font-bold mb-6'>Market Overview</h2>

      <div className='grid grid-cols-2 gap-6'>
        <div>
          <p className='text-blue-100 text-sm mb-1'>Total Volume</p>
          <p className='text-3xl font-bold'>{stats.totalVolume.toLocaleString()}</p>
          <p className='text-blue-100 text-xs mt-1'>MWh</p>
        </div>

        <div>
          <p className='text-blue-100 text-sm mb-1'>Average Price</p>
          <p className='text-3xl font-bold'>${stats.averagePrice.toFixed(2)}</p>
          <p className='text-blue-100 text-xs mt-1'>per MWh</p>
        </div>
      </div>

      <div className='mt-6 pt-6 border-t border-blue-400/30'>
        <p className='text-blue-100 text-sm mb-3'>Volume Distribution</p>
        <div className='space-y-2'>
          {Object.entries(stats.volumeByType)
            .slice(0, 3)
            .map(([type, volume]) => (
              <div key={type} className='flex justify-between items-center'>
                <span className='text-sm'>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                <span className='text-sm font-medium'>{volume.toLocaleString()} MWh</span>
              </div>
            ))}
        </div>
      </div>

      <div className='mt-4 text-xs text-blue-200'>
        Updated: {new Date(stats.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};
