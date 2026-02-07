import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Соединение восстановлено', {
        icon: '🌐',
        duration: 3000
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Нет подключения к интернету', {
        icon: '📡',
        duration: 5000
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
