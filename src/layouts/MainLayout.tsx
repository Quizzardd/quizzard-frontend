import Navbar from '@/components/Navbar';
import { AppSidebar } from '@/components/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CreditCard, LayoutDashboard, Settings } from 'lucide-react';
import React from 'react';
import { Outlet } from 'react-router';

interface IMainLayout {
  children?: React.ReactNode;
}
const sidebarItems = [
  { title: 'Overview', url: '/', icon: LayoutDashboard },
  { title: 'Subscription Plan', url: '/subscription', icon: CreditCard },
  { title: 'Setting', url: '/profile', icon: Settings },
];

const MainLayout: React.FC<IMainLayout> = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <AppSidebar title="QUIZZARD" footerText="© 2025 Quizzard" items={sidebarItems} />

          <main className="flex-1">
            <div className="md:hidden mb-4">
              <SidebarTrigger />
            </div>
            <Outlet />
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default MainLayout;
