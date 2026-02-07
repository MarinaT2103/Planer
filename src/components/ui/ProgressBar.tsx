import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar = ({
  value,
  max = 100,
  className,
  showLabel = false,
  color,
  size = 'md'
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-pink-100 dark:bg-pink-900/30 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            color || 'bg-gradient-to-r from-pink-400 to-pink-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 block text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};
