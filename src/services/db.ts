import Dexie, { Table } from 'dexie';
import { Task, Habit, HabitLog, FinancialGoal, Note, Meeting } from '@/types';

export class PlannerDB extends Dexie {
  tasks!: Table<Task>;
  habits!: Table<Habit>;
  habitLogs!: Table<HabitLog>;
  financialGoals!: Table<FinancialGoal>;
  notes!: Table<Note>;
  meetings!: Table<Meeting>;

  constructor() {
    super('PlannerDB');
    
    this.version(1).stores({
      tasks: 'id, title, date, category, isCompleted, priority, createdAt',
      habits: 'id, name, frequency, isActive, createdAt',
      habitLogs: 'id, habitId, date, isCompleted',
      financialGoals: 'id, title, deadline, createdAt',
      notes: 'id, title, createdAt, updatedAt, isPinned',
      meetings: 'id, title, startTime, endTime'
    });
  }
}

export const db = new PlannerDB();

// Helper functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
