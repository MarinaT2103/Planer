import { NavLink } from 'react-router-dom';
import {
  Home,
  CalendarDays,
  CheckSquare,
  StickyNote,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/plans/day', icon: CalendarDays, label: 'Планы' },
  { to: '/habits', icon: CheckSquare, label: 'Привычки' },
  { to: '/notes', icon: StickyNote, label: 'Заметки' },
  { to: '/more', icon: MoreHorizontal, label: 'Ещё' }
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-pink-100 dark:border-pink-900 z-40 safe-area-inset-bottom">
      <ul className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200',
                  isActive
                    ? 'text-pink-500'
                    : 'text-gray-400 dark:text-gray-500'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      'w-6 h-6 transition-transform duration-200',
                      isActive && 'scale-110'
                    )}
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
