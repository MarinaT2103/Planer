import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { Task, Priority } from '@/types';
import { Checkbox } from '@/components/ui/Checkbox';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/utils/cn';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const { toggleTask, deleteTask } = useTaskStore();

  const priorityColors = {
    [Priority.LOW]: 'border-l-green-400',
    [Priority.MEDIUM]: 'border-l-yellow-400',
    [Priority.HIGH]: 'border-l-red-400'
  };

  const priorityBadgeColors = {
    [Priority.LOW]: 'bg-green-100 text-green-600',
    [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-600',
    [Priority.HIGH]: 'bg-red-100 text-red-600'
  };

  const priorityLabels = {
    [Priority.LOW]: 'Низкий',
    [Priority.MEDIUM]: 'Средний',
    [Priority.HIGH]: 'Высокий'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl p-4 shadow-soft',
        'border-l-4 transition-all duration-200',
        priorityColors[task.priority],
        task.isCompleted && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.isCompleted}
          onChange={() => toggleTask(task.id)}
        />

        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'text-gray-800 dark:text-white font-medium',
              task.isCompleted && 'line-through text-gray-400 dark:text-gray-500'
            )}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {task.time && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                {task.time}
              </span>
            )}

            <span className={cn('text-xs px-2 py-0.5 rounded-full', priorityBadgeColors[task.priority])}>
              {priorityLabels[task.priority]}
            </span>

            {task.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

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
                  onEdit?.(task);
                  setShowActions(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Edit2 className="w-4 h-4" />
                Изменить
              </button>
              <button
                onClick={() => {
                  deleteTask(task.id);
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
