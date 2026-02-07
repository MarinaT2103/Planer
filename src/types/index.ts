// Task types
export enum TaskCategory {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  IMPORTANT = 'important'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time?: string;
  isCompleted: boolean;
  priority: Priority;
  category: TaskCategory;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  reminderTime?: Date;
}

// Habit types
export enum Frequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: Frequency;
  createdAt: Date;
  isActive: boolean;
  color?: string;
  icon?: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: Date;
  isCompleted: boolean;
}

// Financial goal types
export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  createdAt: Date;
  category?: string;
  color?: string;
}

// Note types
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  color?: string;
  isPinned: boolean;
}

// Meeting types
export interface Meeting {
  id: string;
  title: string;
  location?: string;
  participants?: string[];
  startTime: Date;
  endTime: Date;
  reminderTime?: Date;
  notes?: string;
  link?: string;
}

// Settings types
export interface Settings {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  language: 'ru' | 'en';
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
}
