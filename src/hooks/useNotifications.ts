import { useState, useEffect, useCallback } from 'react';
import { requestNotificationPermission, sendNotification } from '@/services/notifications';
import { useSettingsStore } from '@/store/settingsStore';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const notificationsEnabled = useSettingsStore(state => state.notificationsEnabled);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setPermission(granted ? 'granted' : 'denied');
    return granted;
  }, []);

  const notify = useCallback((title: string, options?: NotificationOptions) => {
    if (notificationsEnabled && permission === 'granted') {
      sendNotification(title, options);
    }
  }, [notificationsEnabled, permission]);

  return {
    permission,
    requestPermission,
    notify,
    isSupported: 'Notification' in window,
    isEnabled: notificationsEnabled && permission === 'granted'
  };
};
