import { cn } from '@/lib/cn';

interface NousSectionProps {
  id?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  flush?: boolean;
}

export function NousSection({
  id,
  title,
  children,
  className,
  contentClassName,
  flush = false,
}: NousSectionProps) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={cn('relative scroll-mt-32 py-3 sm:py-4', className)}>
      <div className="absolute left-0 top-3 z-10 w-full -translate-y-1/2 px-1 sm:px-4">
        <h2 id={id ? `${id}-title` : undefined} className="nous-legend w-fit">
          {title}
        </h2>
      </div>
      <div
        className={cn(
          'nous-frame',
          flush ? 'overflow-hidden' : 'p-5 sm:p-6',
          contentClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
