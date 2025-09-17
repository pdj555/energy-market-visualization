import type { FC } from 'react';
import type { ForecastPoint } from '@/types/api';
import { formatPrice, formatTimeLabel } from '@/utils/format';

interface ForecastTableProps {
  forecast: ForecastPoint[];
}

const ForecastTable: FC<ForecastTableProps> = ({ forecast }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-100">Forward price envelope</h3>
        <p className="text-xs text-slate-400">
          Seasonal-aware projection with volatility-aware confidence bounds.
        </p>
      </div>
      <div className="flex-1 overflow-hidden rounded-xl border border-slate-800/80">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">
                Interval
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Projected Price
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Lower Bound
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Upper Bound
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-900/40 text-slate-200">
            {forecast.map((point) => (
              <tr key={point.timestamp}>
                <td className="px-4 py-2 text-left font-medium text-slate-300">
                  {formatTimeLabel(point.timestamp)}
                </td>
                <td className="px-4 py-2 text-right font-semibold text-sky-300">
                  {formatPrice(point.projectedPriceMwh)}
                </td>
                <td className="px-4 py-2 text-right text-slate-300">
                  {formatPrice(point.lowerBound)}
                </td>
                <td className="px-4 py-2 text-right text-slate-300">
                  {formatPrice(point.upperBound)}
                </td>
              </tr>
            ))}
            {forecast.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-center text-slate-400" colSpan={4}>
                  Forecast data not available for the selected configuration.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ForecastTable;
