import { create } from 'zustand';
import { db, generateId } from '@/services/db';
import { FinancialGoal } from '@/types';

interface FinanceState {
  goals: FinancialGoal[];
  isLoading: boolean;

  // Actions
  loadGoals: () => Promise<void>;
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => Promise<FinancialGoal>;
  updateGoal: (id: string, updates: Partial<FinancialGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addToGoal: (id: string, amount: number) => Promise<void>;

  // Selectors
  getGoalProgress: (id: string) => number;
  getTotalSaved: () => number;
  getTotalTarget: () => number;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  goals: [],
  isLoading: false,

  loadGoals: async () => {
    set({ isLoading: true });
    try {
      const goals = await db.financialGoals.toArray();
      set({
        goals: goals.map(g => ({
          ...g,
          createdAt: new Date(g.createdAt),
          deadline: g.deadline ? new Date(g.deadline) : undefined
        }))
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addGoal: async (goalData) => {
    const goal: FinancialGoal = {
      ...goalData,
      id: generateId(),
      createdAt: new Date()
    };

    await db.financialGoals.add(goal);
    set(state => ({ goals: [...state.goals, goal] }));
    return goal;
  },

  updateGoal: async (id, updates) => {
    await db.financialGoals.update(id, updates);
    set(state => ({
      goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
    }));
  },

  deleteGoal: async (id) => {
    await db.financialGoals.delete(id);
    set(state => ({ goals: state.goals.filter(g => g.id !== id) }));
  },

  addToGoal: async (id, amount) => {
    const goal = get().goals.find(g => g.id === id);
    if (goal) {
      const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
      await get().updateGoal(id, { currentAmount: newAmount });
    }
  },

  getGoalProgress: (id) => {
    const goal = get().goals.find(g => g.id === id);
    if (!goal || goal.targetAmount === 0) return 0;
    return Math.round((goal.currentAmount / goal.targetAmount) * 100);
  },

  getTotalSaved: () => {
    return get().goals.reduce((sum, g) => sum + g.currentAmount, 0);
  },

  getTotalTarget: () => {
    return get().goals.reduce((sum, g) => sum + g.targetAmount, 0);
  }
}));
