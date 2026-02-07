import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings } from '@/types';

interface SettingsState extends Settings {
  updateSettings: (updates: Partial<Settings>) => void;
  toggleTheme: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      notificationsEnabled: true,
      language: 'ru',
      weekStartsOn: 1,

      updateSettings: (updates) => {
        set(updates);
      },

      toggleTheme: () => {
        const current = get().theme;
        const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
        set({ theme: next });
      }
    }),
    {
      name: 'planner-settings'
    }
  )
);
