import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, StickyNote } from 'lucide-react';
import { Layout } from '@/components/layout';
import { NoteCard, NoteForm } from '@/components/notes';
import { Button, Modal } from '@/components/ui';
import { useNoteStore } from '@/store/noteStore';
import { Note } from '@/types';

export const Notes = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const {
    loadNotes,
    searchQuery,
    setSearchQuery,
    getFilteredNotes
  } = useNoteStore();

  useEffect(() => {
    loadNotes();
  }, []);

  const filteredNotes = getFilteredNotes();
  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.isPinned);

  return (
    <Layout title="Заметки">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск заметок..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        {/* Add button */}
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Новая заметка
          </Button>
        </div>

        {/* Pinned notes */}
        {pinnedNotes.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Закреплённые
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={(n) => {
                      setEditingNote(n);
                      setShowForm(true);
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Other notes */}
        <div>
          {pinnedNotes.length > 0 && (
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Другие
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {unpinnedNotes.length > 0 ? (
                unpinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={(n) => {
                      setEditingNote(n);
                      setShowForm(true);
                    }}
                  />
                ))
              ) : pinnedNotes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-12"
                >
                  <StickyNote className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 dark:text-gray-500">
                    {searchQuery ? 'Заметки не найдены' : 'Создайте первую заметку'}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingNote(undefined);
          }}
          title={editingNote ? 'Редактировать заметку' : 'Новая заметка'}
          className="max-w-lg"
        >
          <NoteForm
            note={editingNote}
            onClose={() => {
              setShowForm(false);
              setEditingNote(undefined);
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
};
