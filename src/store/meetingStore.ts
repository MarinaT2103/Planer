import { create } from 'zustand';
import { db, generateId } from '@/services/db';
import { Meeting } from '@/types';
import { isSameDay } from '@/utils/date';

interface MeetingState {
  meetings: Meeting[];
  isLoading: boolean;

  // Actions
  loadMeetings: () => Promise<void>;
  addMeeting: (meeting: Omit<Meeting, 'id'>) => Promise<Meeting>;
  updateMeeting: (id: string, updates: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;

  // Selectors
  getMeetingsForDate: (date: Date) => Meeting[];
  getUpcomingMeetings: () => Meeting[];
  getTodayMeetings: () => Meeting[];
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  meetings: [],
  isLoading: false,

  loadMeetings: async () => {
    set({ isLoading: true });
    try {
      const meetings = await db.meetings.toArray();
      set({
        meetings: meetings.map(m => ({
          ...m,
          startTime: new Date(m.startTime),
          endTime: new Date(m.endTime),
          reminderTime: m.reminderTime ? new Date(m.reminderTime) : undefined
        }))
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addMeeting: async (meetingData) => {
    const meeting: Meeting = {
      ...meetingData,
      id: generateId()
    };

    await db.meetings.add(meeting);
    set(state => ({ meetings: [...state.meetings, meeting] }));
    return meeting;
  },

  updateMeeting: async (id, updates) => {
    await db.meetings.update(id, updates);
    set(state => ({
      meetings: state.meetings.map(m => m.id === id ? { ...m, ...updates } : m)
    }));
  },

  deleteMeeting: async (id) => {
    await db.meetings.delete(id);
    set(state => ({ meetings: state.meetings.filter(m => m.id !== id) }));
  },

  getMeetingsForDate: (date) => {
    return get().meetings.filter(m => isSameDay(new Date(m.startTime), date));
  },

  getUpcomingMeetings: () => {
    const now = new Date();
    return get().meetings
      .filter(m => new Date(m.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 5);
  },

  getTodayMeetings: () => {
    return get().getMeetingsForDate(new Date());
  }
}));
