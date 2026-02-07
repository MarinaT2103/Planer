import { useState, useEffect } from 'react';
import { format, addYears } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout';
import { TaskList } from '@/components/tasks';
import { Card, CardContent, ProgressBar } from '@/components/ui';
import { useTaskStore } from '@/store/taskStore';
import { TaskCategory } from '@/types';
import { getYearMonths, isSameMonth } from '@/utils/date';

export const YearPlans = () => {
  const [currentYear, setCurrentYear] = useState(new Date());
  const { loadTasks, getYearTasks } = useTaskStore();

  useEffect(() => {
    loadTasks();
  }, []);

  const yearTasks = getYearTasks(currentYear);
  const months = getYearMonths(currentYear);

  const getMonthStats = (month: Date) => {
    const monthTasks = yearTasks.filter((t) => isSameMonth(new Date(t.date), month));
    const completed = monthTasks.filter((t) => t.isCompleted).length;
    return { total: monthTasks.length, completed };
  };

  return (
    <Layout title="Планы на год">
      <div className="space-y-6">
        {/* Year selector */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft">
          <button
            onClick={() => setCurrentYear(addYears(currentYear, -1))}
            className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {format(currentYear, 'yyyy')}
          </h2>
          <button
            onClick={() => setCurrentYear(addYears(currentYear, 1))}
            className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Year overview */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Прогресс за год
              </h3>
              <span className="text-sm text-gray-500">
                {yearTasks.filter((t) => t.isCompleted).length} / {yearTasks.length} задач
              </span>
            </div>
            <ProgressBar
              value={yearTasks.filter((t) => t.isCompleted).length}
              max={yearTasks.length || 1}
              showLabel
            />
          </CardContent>
        </Card>

        {/* Months grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {months.map((month, index) => {
            const stats = getMonthStats(month);
            const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

            return (
              <Card key={index} variant="outlined">
                <CardContent>
                  <h4 className="font-medium text-gray-800 dark:text-white capitalize mb-2">
                    {format(month, 'LLLL', { locale: ru })}
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {stats.completed} / {stats.total} задач
                  </p>
                  <ProgressBar value={progress} size="sm" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Year tasks */}
        <TaskList
          tasks={yearTasks}
          category={TaskCategory.YEAR}
          date={new Date(currentYear.getFullYear(), 0, 1)}
          title="Цели на год"
          emptyMessage="Добавьте цели на этот год"
        />
      </div>
    </Layout>
  );
};
