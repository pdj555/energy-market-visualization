import { cn } from '@/lib/cn';

interface SectionHeaderProps {
  id?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ id, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <h2 id={id} className="text-base font-semibold tracking-tight text-ink-primary">
        {title}
      </h2>
      {description ? <p className="text-sm text-ink-secondary">{description}</p> : null}
    </div>
  );
}
