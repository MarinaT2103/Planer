import { useEffect } from 'react';
import { Layout } from '@/components/layout';
import { TaskList } from '@/components/tasks';
import { useTaskStore } from '@/store/taskStore';
import { TaskCategory } from '@/types';

export const Important = () => {
  const { loadTasks, getImportantTasks } = useTaskStore();

  useEffect(() => {
    loadTasks();
  }, []);

  const importantTasks = getImportantTasks();

  return (
    <Layout title="Важное">
      <TaskList
        tasks={importantTasks}
        category={TaskCategory.IMPORTANT}
        title="Приоритетные задачи"
        emptyMessage="Нет важных задач"
      />
    </Layout>
  );
};
