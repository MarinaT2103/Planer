import { useState } from 'react';
import { FinancialGoal } from '@/types';
import { Button, Input } from '@/components/ui';
import { useFinanceStore } from '@/store/financeStore';
import { cn } from '@/utils/cn';

interface GoalFormProps {
  goal?: FinancialGoal;
  onClose: () => void;
}

const COLOR_OPTIONS = [
  '#FF6B8A', '#FFB3BA', '#FF9E7A', '#FFD166',
  '#06D6A0', '#118AB2', '#7B68EE', '#FF69B4'
];

export const GoalForm = ({ goal, onClose }: GoalFormProps) => {
  const { addGoal, updateGoal } = useFinanceStore();
  const [title, setTitle] = useState(goal?.title || '');
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount?.toString() || '');
  const [currentAmount, setCurrentAmount] = useState(goal?.currentAmount?.toString() || '0');
  const [deadline, setDeadline] = useState(
    goal?.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ''
  );
  const [selectedColor, setSelectedColor] = useState(goal?.color || COLOR_OPTIONS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount) return;

    setIsLoading(true);
    try {
      const data = {
        title: title.trim(),
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        deadline: deadline ? new Date(deadline) : undefined,
        color: selectedColor
      };

      if (goal) {
        await updateGoal(goal.id, data);
      } else {
        await addGoal(data);
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Название цели"
        placeholder="Например: Отпуск"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />

      <Input
        type="number"
        label="Целевая сумма"
        placeholder="100000"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
      />

      <Input
        type="number"
        label="Текущая сумма"
        placeholder="0"
        value={currentAmount}
        onChange={(e) => setCurrentAmount(e.target.value)}
      />

      <Input
        type="date"
        label="Дедлайн (опционально)"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

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
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!title.trim() || !targetAmount}
          className="flex-1"
        >
          {goal ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};
