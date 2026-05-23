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
    <span className="inline-flex items-center gap-2 text-xs sm:text-sm">
      <span
        className={cn(
          'h-2 w-2 rounded-full border border-primary',
          active ? 'bg-primary animate-pulse' : 'bg-backdrop'
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
      {hint ? <p className="nous-muted text-xs sm:text-sm">{hint}</p> : null}
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
        'rounded-sm border-2 border-primary px-3 py-1 text-xs transition sm:text-sm',
        variant === 'primary'
          ? 'bg-primary text-backdrop hover:opacity-90'
          : 'bg-backdrop text-primary hover:nous-tint-4',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
