import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addWeeks, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { getWeekDays, isSameDay, isToday } from '@/utils/date';
import { Task } from '@/types';
import { cn } from '@/utils/cn';

interface WeekViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  tasks?: Task[];
}

export const WeekView = ({
  currentDate,
  onDateChange,
  selectedDate,
  onSelectDate,
  tasks = []
}: WeekViewProps) => {
  const weekDays = getWeekDays(currentDate, 1);

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.date), date));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onDateChange(addWeeks(currentDate, -1))}
          className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {format(weekDays[0], 'd MMM', { locale: ru })} — {format(weekDays[6], 'd MMM yyyy', { locale: ru })}
        </h3>
        <button
          onClick={() => onDateChange(addWeeks(currentDate, 1))}
          className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dayTasks = getTasksForDate(day);
          const completedTasks = dayTasks.filter((t) => t.isCompleted).length;
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <button
              key={index}
              onClick={() => onSelectDate(day)}
              className={cn(
                'flex flex-col items-center p-3 rounded-xl transition-all',
                isSelected
                  ? 'bg-pink-400 text-white'
                  : 'hover:bg-pink-50 dark:hover:bg-pink-900/30',
                isTodayDate && !isSelected && 'ring-2 ring-pink-400'
              )}
            >
              <span className={cn(
                'text-xs font-medium mb-1',
                isSelected ? 'text-pink-100' : 'text-gray-500 dark:text-gray-400'
              )}>
                {format(day, 'EEE', { locale: ru })}
              </span>
              <span className={cn(
                'text-lg font-semibold',
                isSelected ? 'text-white' : 'text-gray-800 dark:text-white'
              )}>
                {format(day, 'd')}
              </span>
              {dayTasks.length > 0 && (
                <span className={cn(
                  'text-xs mt-1',
                  isSelected ? 'text-pink-100' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {completedTasks}/{dayTasks.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
