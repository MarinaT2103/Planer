import { useState } from 'react';
import {
  Moon,
  Sun,
  Monitor,
  Bell,
  Download,
  Upload,
  Trash2,
  Info,
  LogOut
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Card, CardContent, Button } from '@/components/ui';
import { useSettingsStore } from '@/store/settingsStore';
import { useNotifications } from '@/hooks/useNotifications';
import { exportData, importData } from '@/utils/export';
import { db } from '@/services/db';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { theme, notificationsEnabled, updateSettings } = useSettingsStore();
  const { permission, requestPermission } = useNotifications();
  const [importing, setImporting] = useState(false);

  const themeOptions = [
    { value: 'light', label: 'Светлая', icon: Sun },
    { value: 'dark', label: 'Тёмная', icon: Moon },
    { value: 'system', label: 'Системная', icon: Monitor }
  ] as const;

  const handleExport = async () => {
    try {
      await exportData();
      toast.success('Данные экспортированы');
    } catch (error) {
      toast.error('Ошибка экспорта');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      await importData(file);
      toast.success('Данные импортированы');
      window.location.reload();
    } catch (error) {
      toast.error('Ошибка импорта');
    } finally {
      setImporting(false);
    }
  };

  const handleClearData = async () => {
    if (confirm('Вы уверены? Все данные будут удалены без возможности восстановления.')) {
      try {
        await db.delete();
        toast.success('Данные удалены');
        window.location.reload();
      } catch (error) {
        toast.error('Ошибка удаления');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('planner_authenticated');
    localStorage.removeItem('planner_auth_expiry');
    window.location.reload();
  };

  const handleNotificationsToggle = async () => {
    if (!notificationsEnabled) {
      const granted = await requestPermission();
      if (granted) {
        updateSettings({ notificationsEnabled: true });
        toast.success('Уведомления включены');
      } else {
        toast.error('Разрешение отклонено');
      }
    } else {
      updateSettings({ notificationsEnabled: false });
      toast.success('Уведомления отключены');
    }
  };

  return (
    <Layout title="Настройки">
      <div className="space-y-6 max-w-2xl">
        {/* Theme */}
        <Card>
          <CardContent>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              Тема оформления
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSettings({ theme: option.value })}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl transition-all',
                    theme === option.value
                      ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 ring-2 ring-pink-400'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <option.icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-900/30">
                  <Bell className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Уведомления
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {permission === 'granted' ? 'Разрешены' : 'Требуется разрешение'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleNotificationsToggle}
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  notificationsEnabled ? 'bg-pink-400' : 'bg-gray-300 dark:bg-gray-600'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                    notificationsEnabled ? 'left-6' : 'left-0.5'
                  )}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Data management */}
        <Card>
          <CardContent>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              Управление данными
            </h3>
            <div className="space-y-3">
              <Button
                variant="secondary"
                onClick={handleExport}
                className="w-full justify-start"
              >
                <Download className="w-5 h-5 mr-3" />
                Экспортировать данные
              </Button>

              <label className="block">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  disabled={importing}
                >
                  <Upload className="w-5 h-5 mr-3" />
                  {importing ? 'Импортирование...' : 'Импортировать данные'}
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              <Button
                variant="danger"
                onClick={handleClearData}
                className="w-full justify-start"
              >
                <Trash2 className="w-5 h-5 mr-3" />
                Удалить все данные
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent>
            <Button
              variant="secondary"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Выйти из аккаунта
            </Button>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              При выходе потребуется ввести PIN-код снова
            </p>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-900/30">
                <Info className="w-5 h-5 text-pink-500" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                О приложении
              </h3>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p><strong>Планировщик</strong> — минималистичное PWA для организации задач</p>
              <p>Версия: 1.0.0</p>
              <p className="text-xs text-gray-400 mt-3">
                Данные хранятся локально на вашем устройстве
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
