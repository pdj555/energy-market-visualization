import type { ForecastPoint } from '@/types/api';
import { formatPrice, formatTimeLabel } from '@/lib/format';

interface ForecastPanelProps {
  forecast: ForecastPoint[];
}

export function ForecastPanel({ forecast }: ForecastPanelProps) {
  return (
    <div className="h-full overflow-auto">
      <table className="min-w-full text-xs sm:text-sm">
        <thead className="sticky top-0 z-[1] bg-backdrop">
          <tr className="nous-divider-strong text-left">
            <th scope="col" className="label-caps px-3 py-2.5">
              Time
            </th>
            <th scope="col" className="label-caps px-3 py-2.5 text-right">
              Mid
            </th>
            <th scope="col" className="label-caps hidden px-3 py-2.5 text-right sm:table-cell">
              Low
            </th>
            <th scope="col" className="label-caps hidden px-3 py-2.5 text-right sm:table-cell">
              High
            </th>
          </tr>
        </thead>
        <tbody>
          {forecast.map((point, index) => (
            <tr key={point.timestamp} className={index % 2 === 0 ? 'nous-tint-3' : undefined}>
              <td className="px-3 py-2">{formatTimeLabel(point.timestamp)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{formatPrice(point.projectedPriceMwh)}</td>
              <td className="hidden px-3 py-2 text-right tabular-nums sm:table-cell">
                {formatPrice(point.lowerBound)}
              </td>
              <td className="hidden px-3 py-2 text-right tabular-nums sm:table-cell">
                {formatPrice(point.upperBound)}
              </td>
            </tr>
          ))}
          {forecast.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-3 py-10 text-center nous-muted">
                No forecast data.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
