import { InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn('flex items-center gap-3 cursor-pointer group', className)}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            checked={checked}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-6 h-6 rounded-lg border-2 transition-all duration-200',
              'flex items-center justify-center',
              checked
                ? 'bg-pink-400 border-pink-400'
                : 'border-pink-300 bg-white dark:bg-gray-800 group-hover:border-pink-400'
            )}
          >
            {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
          </div>
        </div>
        {label && (
          <span
            className={cn(
              'text-gray-700 dark:text-gray-300 transition-all duration-200',
              checked && 'line-through text-gray-400 dark:text-gray-500'
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
