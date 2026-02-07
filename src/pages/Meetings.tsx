import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Calendar } from 'lucide-react';
import { Layout } from '@/components/layout';
import { MeetingCard, MeetingForm } from '@/components/meetings';
import { Button, Modal, Card, CardContent } from '@/components/ui';
import { useMeetingStore } from '@/store/meetingStore';
import { Meeting } from '@/types';
// Date utils imported if needed

export const Meetings = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | undefined>();
  const {
    meetings,
    loadMeetings,
    getUpcomingMeetings,
    getTodayMeetings
  } = useMeetingStore();

  useEffect(() => {
    loadMeetings();
  }, []);

  const todayMeetings = getTodayMeetings();
  const upcomingMeetings = getUpcomingMeetings();
  const pastMeetings = meetings
    .filter((m) => new Date(m.endTime) < new Date())
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <Layout title="Встречи">
      <div className="space-y-6">
        {/* Today */}
        {todayMeetings.length > 0 && (
          <Card>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-pink-400" />
                <h2 className="font-semibold text-gray-800 dark:text-white">
                  Сегодня
                </h2>
              </div>
              <div className="space-y-3">
                {todayMeetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onEdit={(m) => {
                      setEditingMeeting(m);
                      setShowForm(true);
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header with add button */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Предстоящие встречи
          </h2>
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Добавить
          </Button>
        </div>

        {/* Upcoming meetings */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onEdit={(m) => {
                    setEditingMeeting(m);
                    setShowForm(true);
                  }}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 dark:text-gray-500">
                  Нет предстоящих встреч
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Past meetings */}
        {pastMeetings.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Прошедшие
            </h2>
            <div className="space-y-3">
              {pastMeetings.slice(0, 5).map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onEdit={(m) => {
                    setEditingMeeting(m);
                    setShowForm(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingMeeting(undefined);
          }}
          title={editingMeeting ? 'Редактировать встречу' : 'Новая встреча'}
          className="max-w-lg"
        >
          <MeetingForm
            meeting={editingMeeting}
            onClose={() => {
              setShowForm(false);
              setEditingMeeting(undefined);
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
};
