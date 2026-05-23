interface StatCellProps {
  label: string;
  value: string;
  className?: string;
}

export function StatCell({ label, value, className }: StatCellProps) {
  return (
    <div className={className ?? 'nous-stat-cell'}>
      <p className="label-caps">{label}</p>
      <p className="mt-1 tabular-nums">{value}</p>
    </div>
  );
}
