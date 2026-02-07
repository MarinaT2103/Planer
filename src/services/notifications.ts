export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendNotification = (title: string, options?: NotificationOptions): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      ...options
    });
  }
};

export const scheduleNotification = (
  title: string,
  scheduledTime: Date,
  options?: NotificationOptions
): number => {
  const now = new Date();
  const delay = scheduledTime.getTime() - now.getTime();

  if (delay <= 0) return -1;

  return window.setTimeout(() => {
    sendNotification(title, options);
  }, delay);
};

export const cancelScheduledNotification = (timeoutId: number): void => {
  window.clearTimeout(timeoutId);
};
