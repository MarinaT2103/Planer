import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, MoreVertical, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { Habit } from '@/types';
import { useHabitStore } from '@/store/habitStore';
import { cn } from '@/utils/cn';

interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  onEdit?: (habit: Habit) => void;
}

export const HabitCard = ({ habit, isCompletedToday, onEdit }: HabitCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const { toggleHabitLog, deleteHabit, getHabitStreak, getHabitCompletionRate } = useHabitStore();

  const streak = getHabitStreak(habit.id);
  const completionRate = getHabitCompletionRate(habit.id, 30);

  const handleToggle = () => {
    toggleHabitLog(habit.id, new Date());
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft',
        'border-2 transition-all duration-200',
        isCompletedToday
          ? 'border-green-400 dark:border-green-500'
          : 'border-transparent'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Toggle button */}
        <button
          onClick={handleToggle}
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
            isCompletedToday
              ? 'bg-green-400 text-white'
              : 'bg-pink-100 dark:bg-pink-900/30 text-pink-500 hover:bg-pink-200 dark:hover:bg-pink-900/50'
          )}
          style={{ backgroundColor: isCompletedToday ? habit.color || undefined : undefined }}
        >
          {habit.icon ? (
            <span className="text-2xl">{habit.icon}</span>
          ) : (
            <span className="text-lg font-bold">{habit.name.charAt(0).toUpperCase()}</span>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 dark:text-white">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
              {habit.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-2">
            {streak > 0 && (
              <div className="flex items-center gap-1 text-orange-500">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-medium">{streak} дней</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-pink-500">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{completionRate}%</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10 min-w-[120px]">
              <button
                onClick={() => {
                  onEdit?.(habit);
                  setShowActions(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Edit2 className="w-4 h-4" />
                Изменить
              </button>
              <button
                onClick={() => {
                  deleteHabit(habit.id);
                  setShowActions(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
