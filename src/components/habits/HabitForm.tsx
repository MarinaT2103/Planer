import { useState } from 'react';
import { Habit, Frequency } from '@/types';
import { Button, Input, Textarea } from '@/components/ui';
import { useHabitStore } from '@/store/habitStore';
import { cn } from '@/utils/cn';

interface HabitFormProps {
  habit?: Habit;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['💪', '📚', '🏃', '💧', '🧘', '✍️', '🎯', '💤', '🥗', '💊'];
const COLOR_OPTIONS = [
  '#FF6B8A', '#FFB3BA', '#FF9E7A', '#FFD166',
  '#06D6A0', '#118AB2', '#7B68EE', '#FF69B4'
];

export const HabitForm = ({ habit, onClose }: HabitFormProps) => {
  const { addHabit, updateHabit } = useHabitStore();
  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [frequency, setFrequency] = useState<Frequency>(habit?.frequency || Frequency.DAILY);
  const [selectedIcon, setSelectedIcon] = useState(habit?.icon || '');
  const [selectedColor, setSelectedColor] = useState(habit?.color || COLOR_OPTIONS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const frequencies = [
    { value: Frequency.DAILY, label: 'Ежедневно' },
    { value: Frequency.WEEKLY, label: 'Еженедельно' },
    { value: Frequency.MONTHLY, label: 'Ежемесячно' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      if (habit) {
        await updateHabit(habit.id, {
          name: name.trim(),
          description: description.trim(),
          frequency,
          icon: selectedIcon,
          color: selectedColor
        });
      } else {
        await addHabit({
          name: name.trim(),
          description: description.trim(),
          frequency,
          icon: selectedIcon,
          color: selectedColor,
          isActive: true
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
        label="Название привычки"
        placeholder="Например: Пить воду"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />

      <Textarea
        label="Описание"
        placeholder="Дополнительные детали..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Частота
        </label>
        <div className="flex gap-2">
          {frequencies.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFrequency(f.value)}
              className={cn(
                'flex-1 py-2 px-3 rounded-xl text-sm font-medium border-2 transition-all',
                frequency === f.value
                  ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 border-pink-300'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Иконка
        </label>
        <div className="flex flex-wrap gap-2">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setSelectedIcon(emoji)}
              className={cn(
                'w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all',
                selectedIcon === emoji
                  ? 'bg-pink-100 dark:bg-pink-900/30 ring-2 ring-pink-400'
                  : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Цвет
        </label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={cn(
                'w-8 h-8 rounded-full transition-all',
                selectedColor === color && 'ring-2 ring-offset-2 ring-gray-400'
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Отмена
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={!name.trim()} className="flex-1">
          {habit ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};
