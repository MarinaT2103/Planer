import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  CheckSquare,
  Target,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Card, CardContent, ProgressBar } from '@/components/ui';
import { useTaskStore } from '@/store/taskStore';
import { useHabitStore } from '@/store/habitStore';
import { useFinanceStore } from '@/store/financeStore';
import { formatDate } from '@/utils/date';

export const Home = () => {
  const { tasks, loadTasks, getTodayTasks } = useTaskStore();
  const { loadHabits, getActiveHabits, isHabitCompletedForDate } = useHabitStore();
  const { loadGoals, getTotalSaved, getTotalTarget } = useFinanceStore();

  useEffect(() => {
    loadTasks();
    loadHabits();
    loadGoals();
  }, []);

  const todayTasks = getTodayTasks();
  const completedToday = todayTasks.filter((t) => t.isCompleted).length;
  const activeHabits = getActiveHabits();
  const completedHabitsToday = activeHabits.filter((h) =>
    isHabitCompletedForDate(h.id, new Date())
  ).length;
  const totalSaved = getTotalSaved();
  const totalTarget = getTotalTarget();
  const savingsProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout title="Главная">
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Добрый день!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(new Date(), 'EEEE, d MMMM')}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <Link to="/plans/day">
            <Card variant="elevated" className="hover:scale-[1.02] transition-transform">
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-900/30">
                    <CalendarDays className="w-5 h-5 text-pink-500" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Сегодня</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {completedToday}/{todayTasks.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">задач выполнено</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/habits">
            <Card variant="elevated" className="hover:scale-[1.02] transition-transform">
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
                    <CheckSquare className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Привычки</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {completedHabitsToday}/{activeHabits.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">выполнено сегодня</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/finance">
            <Card variant="elevated" className="hover:scale-[1.02] transition-transform">
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                    <Target className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Накопления</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {Math.round(savingsProgress)}%
                </p>
                <ProgressBar value={savingsProgress} size="sm" className="mt-2" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/important">
            <Card variant="elevated" className="hover:scale-[1.02] transition-transform">
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
                    <Star className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Важное</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {tasks.filter((t) => t.priority === 'high' && !t.isCompleted).length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">срочных задач</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Today's Tasks Preview */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">Задачи на сегодня</h3>
                <Link
                  to="/plans/day"
                  className="text-sm text-pink-500 hover:text-pink-600"
                >
                  Все задачи
                </Link>
              </div>
              {todayTasks.length > 0 ? (
                <ul className="space-y-3">
                  {todayTasks.slice(0, 5).map((task) => (
                    <li key={task.id} className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          task.isCompleted
                            ? 'bg-green-400'
                            : task.priority === 'high'
                            ? 'bg-red-400'
                            : 'bg-pink-300'
                        }`}
                      />
                      <span
                        className={`flex-1 ${
                          task.isCompleted
                            ? 'line-through text-gray-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.time && (
                        <span className="text-sm text-gray-400">{task.time}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400 py-4">
                  Нет задач на сегодня
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants} className="grid grid-cols-4 gap-3">
          {[
            { to: '/plans/day', icon: CalendarDays, label: 'День' },
            { to: '/plans/week', icon: Clock, label: 'Неделя' },
            { to: '/habits', icon: CheckSquare, label: 'Привычки' },
            { to: '/notes', icon: TrendingUp, label: 'Заметки' }
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-soft hover:shadow-medium transition-shadow"
            >
              <item.icon className="w-6 h-6 text-pink-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </Layout>
  );
};
