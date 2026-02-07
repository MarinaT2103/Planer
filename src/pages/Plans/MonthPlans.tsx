import { useState, useEffect } from 'react';
import { format, startOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Layout } from '@/components/layout';
import { MonthView } from '@/components/calendar';
import { TaskList } from '@/components/tasks';
import { useTaskStore } from '@/store/taskStore';
import { TaskCategory } from '@/types';

export const MonthPlans = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { tasks, loadTasks, getMonthTasks } = useTaskStore();

  useEffect(() => {
    loadTasks();
  }, []);

  const monthTasks = getMonthTasks(selectedMonth);

  return (
    <Layout title="Планы на месяц">
      <div className="space-y-6">
        <MonthView
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          selectedDate={selectedMonth}
          onSelectMonth={setSelectedMonth}
          tasks={tasks}
        />

        <TaskList
          tasks={monthTasks}
          category={TaskCategory.MONTH}
          date={startOfMonth(selectedMonth)}
          title={format(selectedMonth, 'LLLL yyyy', { locale: ru })}
          emptyMessage="Нет задач на этот месяц"
        />
      </div>
    </Layout>
  );
};
