import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addYears, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { getYearMonths, isSameMonth } from '@/utils/date';
import { Task } from '@/types';
import { cn } from '@/utils/cn';

interface MonthViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedDate: Date;
  onSelectMonth: (date: Date) => void;
  tasks?: Task[];
}

export const MonthView = ({
  currentDate,
  onDateChange,
  selectedDate,
  onSelectMonth,
  tasks = []
}: MonthViewProps) => {
  const months = getYearMonths(currentDate);

  const getTasksForMonth = (date: Date) => {
    return tasks.filter((task) => isSameMonth(new Date(task.date), date));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onDateChange(addYears(currentDate, -1))}
          className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {format(currentDate, 'yyyy')}
        </h3>
        <button
          onClick={() => onDateChange(addYears(currentDate, 1))}
          className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Months grid */}
      <div className="grid grid-cols-3 gap-3">
        {months.map((month, index) => {
          const monthTasks = getTasksForMonth(month);
          const completedTasks = monthTasks.filter((t) => t.isCompleted).length;
          const isSelected = isSameMonth(month, selectedDate);
          const isCurrent = isSameMonth(month, new Date());

          return (
            <button
              key={index}
              onClick={() => onSelectMonth(month)}
              className={cn(
                'flex flex-col items-center p-4 rounded-xl transition-all',
                isSelected
                  ? 'bg-pink-400 text-white'
                  : 'hover:bg-pink-50 dark:hover:bg-pink-900/30',
                isCurrent && !isSelected && 'ring-2 ring-pink-400'
              )}
            >
              <span className={cn(
                'text-sm font-medium capitalize',
                isSelected ? 'text-white' : 'text-gray-800 dark:text-white'
              )}>
                {format(month, 'LLL', { locale: ru })}
              </span>
              {monthTasks.length > 0 && (
                <span className={cn(
                  'text-xs mt-1',
                  isSelected ? 'text-pink-100' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {completedTasks}/{monthTasks.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
