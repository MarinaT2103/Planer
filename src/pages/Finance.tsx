import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, PiggyBank, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/layout';
import { GoalCard, GoalForm } from '@/components/finance';
import { Button, Modal, Card, CardContent, ProgressBar } from '@/components/ui';
import { useFinanceStore } from '@/store/financeStore';
import { FinancialGoal } from '@/types';

export const Finance = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | undefined>();
  const { goals, loadGoals, getTotalSaved, getTotalTarget } = useFinanceStore();

  useEffect(() => {
    loadGoals();
  }, []);

  const totalSaved = getTotalSaved();
  const totalTarget = getTotalTarget();
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <Layout title="Финансовые цели">
      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400 to-pink-500">
                <PiggyBank className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Всего накоплено</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {formatCurrency(totalSaved)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500 dark:text-gray-400">Прогресс</span>
              <span className="font-medium text-gray-800 dark:text-white">
                {formatCurrency(totalTarget)}
              </span>
            </div>
            <ProgressBar value={overallProgress} showLabel />
          </CardContent>
        </Card>

        {/* Goals header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Мои цели ({goals.length})
          </h2>
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Добавить
          </Button>
        </div>

        {/* Goals list */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={(g) => {
                    setEditingGoal(g);
                    setShowForm(true);
                  }}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <TrendingUp className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 dark:text-gray-500">
                  Добавьте первую финансовую цель
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingGoal(undefined);
          }}
          title={editingGoal ? 'Редактировать цель' : 'Новая цель'}
        >
          <GoalForm
            goal={editingGoal}
            onClose={() => {
              setShowForm(false);
              setEditingGoal(undefined);
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
};
