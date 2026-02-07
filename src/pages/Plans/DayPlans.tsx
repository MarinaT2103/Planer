import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { CalendarView } from '@/components/calendar';
import { TaskList } from '@/components/tasks';
import { useTaskStore } from '@/store/taskStore';
import { TaskCategory } from '@/types';
import { formatRelativeDate } from '@/utils/date';

export const DayPlans = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { tasks, loadTasks, getTasksByDate } = useTaskStore();

  useEffect(() => {
    loadTasks();
  }, []);

  const dayTasks = getTasksByDate(selectedDate);

  return (
    <Layout title="Планы на день">
      <div className="space-y-6">
        <CalendarView
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          tasks={tasks}
        />

        <TaskList
          tasks={dayTasks}
          category={TaskCategory.DAY}
          date={selectedDate}
          title={formatRelativeDate(selectedDate)}
          emptyMessage="Нет задач на этот день"
        />
      </div>
    </Layout>
  );
};
