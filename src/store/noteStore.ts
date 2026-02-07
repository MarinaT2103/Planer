import { create } from 'zustand';
import { db, generateId } from '@/services/db';
import { Note } from '@/types';

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  searchQuery: string;

  // Actions
  loadNotes: () => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;

  // Selectors
  getPinnedNotes: () => Note[];
  getFilteredNotes: () => Note[];
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  isLoading: false,
  searchQuery: '',

  loadNotes: async () => {
    set({ isLoading: true });
    try {
      const notes = await db.notes.toArray();
      set({
        notes: notes.map(n => ({
          ...n,
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt)
        }))
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addNote: async (noteData) => {
    const now = new Date();
    const note: Note = {
      ...noteData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };

    await db.notes.add(note);
    set(state => ({ notes: [...state.notes, note] }));
    return note;
  },

  updateNote: async (id, updates) => {
    const updatedData = { ...updates, updatedAt: new Date() };
    await db.notes.update(id, updatedData);
    set(state => ({
      notes: state.notes.map(n => n.id === id ? { ...n, ...updatedData } : n)
    }));
  },

  deleteNote: async (id) => {
    await db.notes.delete(id);
    set(state => ({ notes: state.notes.filter(n => n.id !== id) }));
  },

  togglePin: async (id) => {
    const note = get().notes.find(n => n.id === id);
    if (note) {
      await get().updateNote(id, { isPinned: !note.isPinned });
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  getPinnedNotes: () => {
    return get().notes.filter(n => n.isPinned);
  },

  getFilteredNotes: () => {
    const { notes, searchQuery } = get();
    if (!searchQuery) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.content.toLowerCase().includes(query) ||
      n.tags?.some(t => t.toLowerCase().includes(query))
    );
  }
}));
