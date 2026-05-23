import { cn } from '@/lib/cn';
import { formatPercent } from '@/lib/format';

interface PriceChangeProps {
  value: number;
  className?: string;
}

export function PriceChange({ value, className }: PriceChangeProps) {
  const isPositive = value >= 0;

  return (
    <p className={cn('tabular-nums', isPositive ? 'text-primary' : 'text-negative', className)}>
      {formatPercent(value, { showSign: true })}
    </p>
  );
}
