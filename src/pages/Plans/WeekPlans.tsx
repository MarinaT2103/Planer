import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { WeekView } from '@/components/calendar';
import { TaskList } from '@/components/tasks';
import { useTaskStore } from '@/store/taskStore';
import { TaskCategory } from '@/types';
import { formatRelativeDate } from '@/utils/date';

export const WeekPlans = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { tasks, loadTasks, getTasksByDate } = useTaskStore();

  useEffect(() => {
    loadTasks();
  }, []);

  const selectedDayTasks = getTasksByDate(selectedDate);

  return (
    <Layout title="Планы на неделю">
      <div className="space-y-6">
        <WeekView
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          tasks={tasks}
        />

        <TaskList
          tasks={selectedDayTasks}
          category={TaskCategory.WEEK}
          date={selectedDate}
          title={formatRelativeDate(selectedDate)}
          emptyMessage="Нет задач на этот день"
        />
      </div>
    </Layout>
  );
};
