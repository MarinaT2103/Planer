import { create } from 'zustand';
import { db, generateId } from '@/services/db';
import { Task, TaskCategory, Priority } from '@/types';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from '@/utils/date';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  
  // Actions
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  
  // Selectors
  getTasksByDate: (date: Date) => Task[];
  getTasksByCategory: (category: TaskCategory) => Task[];
  getTasksByDateRange: (start: Date, end: Date) => Task[];
  getTodayTasks: () => Task[];
  getWeekTasks: (date: Date) => Task[];
  getMonthTasks: (date: Date) => Task[];
  getYearTasks: (date: Date) => Task[];
  getImportantTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,

  loadTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await db.tasks.toArray();
      set({ tasks: tasks.map(t => ({ ...t, date: new Date(t.date), createdAt: new Date(t.createdAt), updatedAt: new Date(t.updatedAt) })) });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (taskData) => {
    const now = new Date();
    const task: Task = {
      ...taskData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    
    await db.tasks.add(task);
    set(state => ({ tasks: [...state.tasks, task] }));
    return task;
  },

  updateTask: async (id, updates) => {
    const updatedData = { ...updates, updatedAt: new Date() };
    await db.tasks.update(id, updatedData);
    set(state => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, ...updatedData } : t)
    }));
  },

  deleteTask: async (id) => {
    await db.tasks.delete(id);
    set(state => ({ tasks: state.tasks.filter(t => t.id !== id) }));
  },

  toggleTask: async (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (task) {
      await get().updateTask(id, { isCompleted: !task.isCompleted });
    }
  },

  getTasksByDate: (date) => {
    const start = startOfDay(date);
    const end = endOfDay(date);
    return get().tasks.filter(t => {
      const taskDate = new Date(t.date);
      return taskDate >= start && taskDate <= end;
    });
  },

  getTasksByCategory: (category) => {
    return get().tasks.filter(t => t.category === category);
  },

  getTasksByDateRange: (start, end) => {
    return get().tasks.filter(t => {
      const taskDate = new Date(t.date);
      return taskDate >= start && taskDate <= end;
    });
  },

  getTodayTasks: () => {
    return get().getTasksByDate(new Date());
  },

  getWeekTasks: (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return get().getTasksByDateRange(start, end);
  },

  getMonthTasks: (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return get().getTasksByDateRange(start, end);
  },

  getYearTasks: (date) => {
    const start = startOfYear(date);
    const end = endOfYear(date);
    return get().getTasksByDateRange(start, end);
  },

  getImportantTasks: () => {
    return get().tasks.filter(t => t.category === TaskCategory.IMPORTANT || t.priority === Priority.HIGH);
  }
}));
