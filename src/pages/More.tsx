import { Link } from 'react-router-dom';
import {
  Calendar,
  CalendarClock,
  Star,
  Users,
  Target,
  Settings
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui';
import { cn } from '@/utils/cn';

const menuItems = [
  { to: '/plans/month', icon: Calendar, label: 'Планы на месяц', color: 'bg-blue-100 text-blue-500' },
  { to: '/plans/year', icon: CalendarClock, label: 'Планы на год', color: 'bg-purple-100 text-purple-500' },
  { to: '/important', icon: Star, label: 'Важное', color: 'bg-red-100 text-red-500' },
  { to: '/meetings', icon: Users, label: 'Встречи', color: 'bg-green-100 text-green-500' },
  { to: '/finance', icon: Target, label: 'Финансовые цели', color: 'bg-yellow-100 text-yellow-500' },
  { to: '/settings', icon: Settings, label: 'Настройки', color: 'bg-gray-100 text-gray-500' }
];

export const More = () => {
  return (
    <Layout title="Ещё">
      <div className="space-y-4">
        {menuItems.map((item) => (
          <Link key={item.to} to={item.to}>
            <Card variant="elevated" className="hover:scale-[1.02] transition-transform">
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className={cn('p-3 rounded-xl', item.color)}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {item.label}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Layout>
  );
};
