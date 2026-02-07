import { NavLink } from 'react-router-dom';
import {
  Home,
  CalendarDays,
  CalendarRange,
  Calendar,
  CalendarClock,
  Star,
  StickyNote,
  Users,
  Target,
  CheckSquare,
  Settings,
  X
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/plans/day', icon: CalendarDays, label: 'На день' },
  { to: '/plans/week', icon: CalendarRange, label: 'На неделю' },
  { to: '/plans/month', icon: Calendar, label: 'На месяц' },
  { to: '/plans/year', icon: CalendarClock, label: 'На год' },
  { to: '/important', icon: Star, label: 'Важное' },
  { to: '/habits', icon: CheckSquare, label: 'Привычки' },
  { to: '/notes', icon: StickyNote, label: 'Заметки' },
  { to: '/meetings', icon: Users, label: 'Встречи' },
  { to: '/finance', icon: Target, label: 'Финансы' },
  { to: '/settings', icon: Settings, label: 'Настройки' }
];

export const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900',
          'border-r border-pink-100 dark:border-pink-900',
          'transform transition-transform duration-300 ease-in-out z-50',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-pink-100 dark:border-pink-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
              Планировщик
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/30 lg:hidden"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500'
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-pink-100 dark:border-pink-900">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Планировщик v1.0
          </p>
        </div>
      </aside>
    </>
  );
};
