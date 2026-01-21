import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string | boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            className={cn(
              'flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive'
                : 'border-input focus-visible:border-ring focus-visible:ring-ring',
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
        </div>
        {typeof error === 'string' && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
