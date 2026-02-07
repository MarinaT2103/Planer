import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { getMonthCalendarDays, isSameDay, isSameMonth, isToday } from '@/utils/date';
import { Task } from '@/types';
import { cn } from '@/utils/cn';

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  tasks?: Task[];
}

export const CalendarView = ({ selectedDate, onSelectDate, tasks = [] }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const days = getMonthCalendarDays(currentMonth, 1);
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.date), date));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
          {format(currentMonth, 'LLLL yyyy', { locale: ru })}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayTasks = getTasksForDate(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);

          return (
            <button
              key={index}
              onClick={() => onSelectDate(day)}
              className={cn(
                'relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all',
                isSelected
                  ? 'bg-pink-400 text-white'
                  : isCurrentMonth
                  ? 'hover:bg-pink-50 dark:hover:bg-pink-900/30 text-gray-800 dark:text-white'
                  : 'text-gray-300 dark:text-gray-600',
                isTodayDate && !isSelected && 'ring-2 ring-pink-400'
              )}
            >
              <span className="text-sm font-medium">{format(day, 'd')}</span>
              {dayTasks.length > 0 && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {dayTasks.slice(0, 3).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-1 h-1 rounded-full',
                        isSelected ? 'bg-white' : 'bg-pink-400'
                      )}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
