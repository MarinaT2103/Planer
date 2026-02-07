import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/layout';
import { HabitCard, HabitForm } from '@/components/habits';
import { Button, Modal, Card, CardContent, ProgressBar } from '@/components/ui';
import { useHabitStore } from '@/store/habitStore';
import { Habit } from '@/types';
import { formatDate, addDays } from '@/utils/date';

export const Habits = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const {
    loadHabits,
    getActiveHabits,
    isHabitCompletedForDate
  } = useHabitStore();

  useEffect(() => {
    loadHabits();
  }, []);

  const activeHabits = getActiveHabits();
  const today = new Date();
  const completedToday = activeHabits.filter((h) =>
    isHabitCompletedForDate(h.id, today)
  ).length;
  const progress = activeHabits.length > 0 ? (completedToday / activeHabits.length) * 100 : 0;

  // Last 7 days for the week view
  const last7Days = Array.from({ length: 7 }, (_, i) => addDays(today, -6 + i));

  return (
    <Layout title="Привычки">
      <div className="space-y-6">
        {/* Today's progress */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Сегодня
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(today, 'd MMMM')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {completedToday}/{activeHabits.length}
                </p>
                <p className="text-sm text-gray-500">выполнено</p>
              </div>
            </div>
            <ProgressBar value={progress} showLabel />
          </CardContent>
        </Card>

        {/* Week view */}
        <Card>
          <CardContent>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-400" />
              Последние 7 дней
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {last7Days.map((day, index) => {
                const dayCompleted = activeHabits.filter((h) =>
                  isHabitCompletedForDate(h.id, day)
                ).length;
                const dayProgress = activeHabits.length > 0
                  ? (dayCompleted / activeHabits.length) * 100
                  : 0;

                return (
                  <div key={index} className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {formatDate(day, 'EEE')}
                    </p>
                    <div
                      className="w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium"
                      style={{
                        backgroundColor: dayProgress > 0
                          ? `rgba(255, 107, 138, ${dayProgress / 100})`
                          : undefined
                      }}
                    >
                      {dayProgress > 0 && (
                        <span className={dayProgress > 50 ? 'text-white' : 'text-pink-600'}>
                          {Math.round(dayProgress)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Habits list */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Мои привычки
          </h2>
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Добавить
          </Button>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {activeHabits.length > 0 ? (
              activeHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompletedToday={isHabitCompletedForDate(habit.id, today)}
                  onEdit={(h) => {
                    setEditingHabit(h);
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
                  Добавьте первую привычку для отслеживания
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
            setEditingHabit(undefined);
          }}
          title={editingHabit ? 'Редактировать привычку' : 'Новая привычка'}
        >
          <HabitForm
            habit={editingHabit}
            onClose={() => {
              setShowForm(false);
              setEditingHabit(undefined);
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
};
