interface StatCellProps {
  label: string;
  value: string;
  className?: string;
  emphasize?: boolean;
}

export function StatCell({ label, value, className, emphasize = false }: StatCellProps) {
  return (
    <div className={className ?? 'nous-stat-cell'}>
      <p className="label-caps">{label}</p>
      <p className={emphasize ? 'metric-value-sm mt-2' : 'mt-1.5 tabular-nums leading-tight'}>{value}</p>
    </div>
  );
}
