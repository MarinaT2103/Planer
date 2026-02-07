import { useState } from 'react';
import { Meeting } from '@/types';
import { Button, Input, Textarea } from '@/components/ui';
import { useMeetingStore } from '@/store/meetingStore';

interface MeetingFormProps {
  meeting?: Meeting;
  onClose: () => void;
}

export const MeetingForm = ({ meeting, onClose }: MeetingFormProps) => {
  const { addMeeting, updateMeeting } = useMeetingStore();
  
  const getDateTimeValue = (date?: Date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  const [title, setTitle] = useState(meeting?.title || '');
  const [startTime, setStartTime] = useState(getDateTimeValue(meeting?.startTime));
  const [endTime, setEndTime] = useState(getDateTimeValue(meeting?.endTime));
  const [location, setLocation] = useState(meeting?.location || '');
  const [link, setLink] = useState(meeting?.link || '');
  const [participants, setParticipants] = useState(meeting?.participants?.join(', ') || '');
  const [notes, setNotes] = useState(meeting?.notes || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime || !endTime) return;

    setIsLoading(true);
    try {
      const parsedParticipants = participants
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);

      const data = {
        title: title.trim(),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location: location.trim(),
        link: link.trim(),
        participants: parsedParticipants,
        notes: notes.trim()
      };

      if (meeting) {
        await updateMeeting(meeting.id, data);
      } else {
        await addMeeting(data);
      }
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Название встречи"
        placeholder="Например: Созвон с командой"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="datetime-local"
          label="Начало"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Input
          type="datetime-local"
          label="Окончание"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <Input
        label="Место"
        placeholder="Офис / Zoom / Google Meet"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <Input
        label="Ссылка"
        placeholder="https://..."
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      <Input
        label="Участники (через запятую)"
        placeholder="Иван, Мария, Пётр"
        value={participants}
        onChange={(e) => setParticipants(e.target.value)}
      />

      <Textarea
        label="Заметки"
        placeholder="Дополнительная информация..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Отмена
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!title.trim() || !startTime || !endTime}
          className="flex-1"
        >
          {meeting ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};
