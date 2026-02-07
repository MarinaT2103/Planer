import { Bell, Moon, Sun, Menu } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/utils/cn';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export const Header = ({ title = 'Планировщик', onMenuClick, showMenu = false }: HeaderProps) => {
  const { theme, toggleTheme } = useSettingsStore();
  const { permission, requestPermission } = useNotifications();

  const handleNotificationClick = async () => {
    if (permission !== 'granted') {
      await requestPermission();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-pink-100 dark:border-pink-900">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showMenu && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          <button
            onClick={handleNotificationClick}
            className={cn(
              'p-2 rounded-xl transition-colors',
              permission === 'granted'
                ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-500'
                : 'hover:bg-pink-50 dark:hover:bg-pink-900/30 text-gray-600 dark:text-gray-300'
            )}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
