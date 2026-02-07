import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl p-4 transition-all duration-200';
    
    const variants = {
      default: 'bg-white dark:bg-gray-800 shadow-soft',
      elevated: 'bg-white dark:bg-gray-800 shadow-medium hover:shadow-lg',
      outlined: 'bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-800'
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold text-gray-800 dark:text-white', className)} {...props}>
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';
