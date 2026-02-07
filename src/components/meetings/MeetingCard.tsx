import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Users, Link, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Meeting } from '@/types';
import { useMeetingStore } from '@/store/meetingStore';
import { formatDate, formatTime } from '@/utils/date';
import { cn } from '@/utils/cn';

interface MeetingCardProps {
  meeting: Meeting;
  onEdit?: (meeting: Meeting) => void;
}

export const MeetingCard = ({ meeting, onEdit }: MeetingCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const { deleteMeeting } = useMeetingStore();

  const isPast = new Date(meeting.endTime) < new Date();
  const startTime = new Date(meeting.startTime);
  const endTime = new Date(meeting.endTime);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-soft',
        'border-l-4 border-pink-400',
        isPast && 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white">
            {meeting.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(startTime, 'd MMMM yyyy')}
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10 min-w-[120px]">
              <button
                onClick={() => {
                  onEdit?.(meeting);
                  setShowActions(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Edit2 className="w-4 h-4" />
                Изменить
              </button>
              <button
                onClick={() => {
                  deleteMeeting(meeting.id);
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

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 text-pink-400" />
          <span>
            {formatTime(startTime)} — {formatTime(endTime)}
          </span>
        </div>

        {meeting.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 text-pink-400" />
            <span>{meeting.location}</span>
          </div>
        )}

        {meeting.participants && meeting.participants.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 text-pink-400" />
            <span>{meeting.participants.join(', ')}</span>
          </div>
        )}

        {meeting.link && (
          <a
            href={meeting.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-pink-500 hover:text-pink-600"
          >
            <Link className="w-4 h-4" />
            <span>Ссылка на встречу</span>
          </a>
        )}

        {meeting.notes && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
            {meeting.notes}
          </p>
        )}
      </div>
    </motion.div>
  );
};
