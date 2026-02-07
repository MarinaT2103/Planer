import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pin, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Note } from '@/types';
import { useNoteStore } from '@/store/noteStore';
import { formatDate } from '@/utils/date';
import { cn } from '@/utils/cn';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
}

export const NoteCard = ({ note, onEdit }: NoteCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const { deleteNote, togglePin } = useNoteStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft cursor-pointer',
        'hover:shadow-medium transition-all duration-200',
        'border-l-4',
        note.isPinned && 'ring-2 ring-pink-300'
      )}
      style={{ borderLeftColor: note.color || '#FFB3BA' }}
      onClick={() => onEdit?.(note)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-1">
          {note.title || 'Без названия'}
        </h3>
        
        <div className="flex items-center gap-1">
          {note.isPinned && (
            <Pin className="w-4 h-4 text-pink-500 fill-pink-500" />
          )}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>

            {showActions && (
              <div
                className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10 min-w-[140px]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    togglePin(note.id);
                    setShowActions(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Pin className="w-4 h-4" />
                  {note.isPinned ? 'Открепить' : 'Закрепить'}
                </button>
                <button
                  onClick={() => {
                    onEdit?.(note);
                    setShowActions(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Изменить
                </button>
                <button
                  onClick={() => {
                    deleteNote(note.id);
                    setShowActions(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Удалить
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
        {note.content || 'Пустая заметка'}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {formatDate(new Date(note.updatedAt), 'd MMM, HH:mm')}
        </span>
        {note.tags && note.tags.length > 0 && (
          <div className="flex gap-1">
            {note.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
