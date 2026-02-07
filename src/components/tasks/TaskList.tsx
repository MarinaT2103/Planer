import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Task, TaskCategory, Priority } from '@/types';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { Button, Modal } from '@/components/ui';

interface TaskListProps {
  tasks: Task[];
  category?: TaskCategory;
  date?: Date;
  title?: string;
  emptyMessage?: string;
}

export const TaskList = ({
  tasks,
  category,
  date,
  title,
  emptyMessage = 'Нет задач'
}: TaskListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Completed tasks go to the bottom
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    // Sort by priority (high first)
    const priorityOrder = { [Priority.HIGH]: 0, [Priority.MEDIUM]: 1, [Priority.LOW]: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        {title && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {completedCount} из {tasks.length} выполнено
            </p>
          </div>
        )}
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Добавить
        </Button>
      </div>

      {/* Filters */}
      {tasks.length > 0 && (
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {f === 'all' ? 'Все' : f === 'active' ? 'Активные' : 'Выполненные'}
            </button>
          ))}
        </div>
      )}

      {/* Task list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => {
                  setEditingTask(t);
                  setShowForm(true);
                }}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 dark:text-gray-500">{emptyMessage}</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTask(undefined);
        }}
        title={editingTask ? 'Редактировать задачу' : 'Новая задача'}
      >
        <TaskForm
          task={editingTask}
          category={category}
          date={date}
          onClose={() => {
            setShowForm(false);
            setEditingTask(undefined);
          }}
        />
      </Modal>
    </div>
  );
};
