import { cn } from '@/lib/cn';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

export function Panel({ children, className }: PanelProps) {
  return <div className={cn('nous-frame p-4', className)}>{children}</div>;
}

interface StatusPillProps {
  label: string;
  active?: boolean;
}

export function StatusPill({ label, active = false }: StatusPillProps) {
  return (
    <span className="label-caps inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-surface px-2 py-0.5">
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          active ? 'bg-primary animate-pulse' : 'border border-primary/40 bg-backdrop'
        )}
        aria-hidden
      />
      {label}
    </span>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  options: { value: number | string; label: string }[];
  hint?: string | undefined;
  className?: string;
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  hint,
  className,
}: SelectFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="label-caps">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={event => onChange(event.target.value)}
        className="select-field"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <p className="nous-muted line-clamp-2 text-xs sm:text-sm">{hint}</p> : null}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-sm border border-primary px-4 py-2 text-xs uppercase tracking-[0.1em] transition sm:text-sm',
        variant === 'primary'
          ? 'bg-primary text-backdrop hover:opacity-90 active:scale-[0.99]'
          : 'bg-surface text-primary hover:nous-tint-4',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
