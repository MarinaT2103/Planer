import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { FinancialGoal } from '@/types';
import { ProgressBar, Button, Input, Modal } from '@/components/ui';
import { useFinanceStore } from '@/store/financeStore';
import { formatDate } from '@/utils/date';

interface GoalCardProps {
  goal: FinancialGoal;
  onEdit?: (goal: FinancialGoal) => void;
}

export const GoalCard = ({ goal, onEdit }: GoalCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [amount, setAmount] = useState('');
  const { deleteGoal, addToGoal, getGoalProgress } = useFinanceStore();

  const progress = getGoalProgress(goal.id);
  const remaining = goal.targetAmount - goal.currentAmount;

  const handleAddFunds = () => {
    const value = parseFloat(amount);
    if (value > 0) {
      addToGoal(goal.id, value);
      setAmount('');
      setShowAddFunds(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: goal.color || '#FFB3BA' }}
            >
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {goal.title}
              </h3>
              {goal.deadline && (
                <p className="text-xs text-gray-500">
                  До {formatDate(new Date(goal.deadline), 'd MMM yyyy')}
                </p>
              )}
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
                    onEdit?.(goal);
                    setShowActions(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Изменить
                </button>
                <button
                  onClick={() => {
                    deleteGoal(goal.id);
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

        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-gray-400">
              {formatCurrency(goal.currentAmount)}
            </span>
            <span className="font-medium text-gray-800 dark:text-white">
              {formatCurrency(goal.targetAmount)}
            </span>
          </div>
          <ProgressBar value={progress} color={goal.color} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Осталось</p>
            <p className="font-medium text-gray-800 dark:text-white">
              {formatCurrency(remaining)}
            </p>
          </div>
          <Button size="sm" onClick={() => setShowAddFunds(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Пополнить
          </Button>
        </div>
      </motion.div>

      {/* Add funds modal */}
      <Modal
        isOpen={showAddFunds}
        onClose={() => setShowAddFunds(false)}
        title="Пополнить цель"
      >
        <div className="space-y-4">
          <Input
            type="number"
            label="Сумма"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowAddFunds(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button onClick={handleAddFunds} className="flex-1">
              Добавить
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
