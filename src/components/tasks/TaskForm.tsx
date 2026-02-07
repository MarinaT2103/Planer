import { useState } from 'react';
import { Task, TaskCategory, Priority } from '@/types';
import { Button, Input, Textarea } from '@/components/ui';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/utils/cn';

interface TaskFormProps {
  task?: Task;
  category?: TaskCategory;
  date?: Date;
  onClose: () => void;
}

export const TaskForm = ({ task, category = TaskCategory.DAY, date = new Date(), onClose }: TaskFormProps) => {
  const { addTask, updateTask } = useTaskStore();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [time, setTime] = useState(task?.time || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || Priority.MEDIUM);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>(task?.category || category);
  const [isLoading, setIsLoading] = useState(false);

  const priorities = [
    { value: Priority.LOW, label: 'Низкий', color: 'bg-green-100 text-green-600 border-green-200' },
    { value: Priority.MEDIUM, label: 'Средний', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    { value: Priority.HIGH, label: 'Высокий', color: 'bg-red-100 text-red-600 border-red-200' }
  ];

  const categories = [
    { value: TaskCategory.DAY, label: 'На день' },
    { value: TaskCategory.WEEK, label: 'На неделю' },
    { value: TaskCategory.MONTH, label: 'На месяц' },
    { value: TaskCategory.YEAR, label: 'На год' },
    { value: TaskCategory.IMPORTANT, label: 'Важное' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      if (task) {
        await updateTask(task.id, {
          title: title.trim(),
          description: description.trim(),
          time,
          priority,
          category: selectedCategory
        });
      } else {
        await addTask({
          title: title.trim(),
          description: description.trim(),
          date,
          time,
          priority,
          category: selectedCategory,
          isCompleted: false
        });
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Название задачи"
        placeholder="Что нужно сделать?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />

      <Textarea
        label="Описание"
        placeholder="Добавьте детали..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <Input
        label="Время"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Приоритет
        </label>
        <div className="flex gap-2">
          {priorities.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={cn(
                'flex-1 py-2 px-3 rounded-xl text-sm font-medium border-2 transition-all',
                priority === p.value
                  ? p.color
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Категория
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setSelectedCategory(c.value)}
              className={cn(
                'py-2 px-3 rounded-xl text-sm font-medium border-2 transition-all',
                selectedCategory === c.value
                  ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 border-pink-300'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Отмена
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={!title.trim()} className="flex-1">
          {task ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};
