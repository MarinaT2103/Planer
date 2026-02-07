import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { useBreakpoints } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export const Layout = ({ children, title }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile } = useBreakpoints();

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-gray-950">
      <Sidebar
        isOpen={sidebarOpen || !isMobile}
        onClose={isMobile ? () => setSidebarOpen(false) : undefined}
      />

      <div className={cn('transition-all duration-300', !isMobile && 'lg:ml-64')}>
        <Header
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          showMenu={isMobile}
        />

        <main className={cn('p-4 pb-24 lg:pb-4 min-h-[calc(100vh-64px)]')}>
          {children}
        </main>

        {isMobile && <BottomNav />}
      </div>
    </div>
  );
};
