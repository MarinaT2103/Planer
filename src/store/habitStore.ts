import { create } from 'zustand';
import { db, generateId } from '@/services/db';
import { Habit, HabitLog } from '@/types';
import { startOfDay, isSameDay } from '@/utils/date';

interface HabitState {
  habits: Habit[];
  habitLogs: HabitLog[];
  isLoading: boolean;

  // Actions
  loadHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<Habit>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitLog: (habitId: string, date: Date) => Promise<void>;

  // Selectors
  getActiveHabits: () => Habit[];
  getHabitLogsForDate: (date: Date) => HabitLog[];
  isHabitCompletedForDate: (habitId: string, date: Date) => boolean;
  getHabitStreak: (habitId: string) => number;
  getHabitCompletionRate: (habitId: string, days: number) => number;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  habitLogs: [],
  isLoading: false,

  loadHabits: async () => {
    set({ isLoading: true });
    try {
      const [habits, habitLogs] = await Promise.all([
        db.habits.toArray(),
        db.habitLogs.toArray()
      ]);
      set({
        habits: habits.map(h => ({ ...h, createdAt: new Date(h.createdAt) })),
        habitLogs: habitLogs.map(l => ({ ...l, date: new Date(l.date) }))
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addHabit: async (habitData) => {
    const habit: Habit = {
      ...habitData,
      id: generateId(),
      createdAt: new Date()
    };

    await db.habits.add(habit);
    set(state => ({ habits: [...state.habits, habit] }));
    return habit;
  },

  updateHabit: async (id, updates) => {
    await db.habits.update(id, updates);
    set(state => ({
      habits: state.habits.map(h => h.id === id ? { ...h, ...updates } : h)
    }));
  },

  deleteHabit: async (id) => {
    await db.habits.delete(id);
    await db.habitLogs.where('habitId').equals(id).delete();
    set(state => ({
      habits: state.habits.filter(h => h.id !== id),
      habitLogs: state.habitLogs.filter(l => l.habitId !== id)
    }));
  },

  toggleHabitLog: async (habitId, date) => {
    const normalizedDate = startOfDay(date);
    const existingLog = get().habitLogs.find(
      l => l.habitId === habitId && isSameDay(new Date(l.date), normalizedDate)
    );

    if (existingLog) {
      if (existingLog.isCompleted) {
        await db.habitLogs.delete(existingLog.id);
        set(state => ({
          habitLogs: state.habitLogs.filter(l => l.id !== existingLog.id)
        }));
      } else {
        await db.habitLogs.update(existingLog.id, { isCompleted: true });
        set(state => ({
          habitLogs: state.habitLogs.map(l =>
            l.id === existingLog.id ? { ...l, isCompleted: true } : l
          )
        }));
      }
    } else {
      const newLog: HabitLog = {
        id: generateId(),
        habitId,
        date: normalizedDate,
        isCompleted: true
      };
      await db.habitLogs.add(newLog);
      set(state => ({ habitLogs: [...state.habitLogs, newLog] }));
    }
  },

  getActiveHabits: () => {
    return get().habits.filter(h => h.isActive);
  },

  getHabitLogsForDate: (date) => {
    return get().habitLogs.filter(l => isSameDay(new Date(l.date), date));
  },

  isHabitCompletedForDate: (habitId, date) => {
    return get().habitLogs.some(
      l => l.habitId === habitId && isSameDay(new Date(l.date), date) && l.isCompleted
    );
  },

  getHabitStreak: (habitId) => {
    const logs = get().habitLogs
      .filter(l => l.habitId === habitId && l.isCompleted)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (logs.length === 0) return 0;

    let streak = 0;
    let currentDate = startOfDay(new Date());

    for (const log of logs) {
      if (isSameDay(new Date(log.date), currentDate)) {
        streak++;
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },

  getHabitCompletionRate: (habitId, days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const completedDays = get().habitLogs.filter(
      l => l.habitId === habitId &&
        l.isCompleted &&
        new Date(l.date) >= startDate &&
        new Date(l.date) <= endDate
    ).length;

    return Math.round((completedDays / days) * 100);
  }
}));
