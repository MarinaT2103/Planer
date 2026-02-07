import { useState } from 'react';
import { Note } from '@/types';
import { Button, Input, Textarea } from '@/components/ui';
import { useNoteStore } from '@/store/noteStore';
import { cn } from '@/utils/cn';

interface NoteFormProps {
  note?: Note;
  onClose: () => void;
}

const COLOR_OPTIONS = [
  '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9',
  '#BAE1FF', '#E0BBE4', '#FEC8D8', '#D4F0F0'
];

export const NoteForm = ({ note, onClose }: NoteFormProps) => {
  const { addNote, updateNote } = useNoteStore();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags?.join(', ') || '');
  const [selectedColor, setSelectedColor] = useState(note?.color || COLOR_OPTIONS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      if (note) {
        await updateNote(note.id, {
          title: title.trim(),
          content,
          tags: parsedTags,
          color: selectedColor
        });
      } else {
        await addNote({
          title: title.trim(),
          content,
          tags: parsedTags,
          color: selectedColor,
          isPinned: false
        });
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Заголовок"
        placeholder="Название заметки"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />

      <Textarea
        label="Содержание"
        placeholder="Напишите что-нибудь..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
      />

      <Input
        label="Теги (через запятую)"
        placeholder="работа, идеи, важное"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Цвет
        </label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={cn(
                'w-8 h-8 rounded-full transition-all',
                selectedColor === color && 'ring-2 ring-offset-2 ring-gray-400'
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Отмена
        </Button>
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {note ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};
