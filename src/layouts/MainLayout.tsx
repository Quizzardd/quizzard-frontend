import Navbar from '@/components/Navbar';
import { AppSidebar } from '@/components/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CreditCard, LayoutDashboard, Settings, Shield } from 'lucide-react';
import React from 'react';
import { Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';

interface IMainLayout {
  children?: React.ReactNode;
}

const MainLayout: React.FC<IMainLayout> = () => {
  const { user } = useAuth();

  const sidebarItems = [
    { title: 'Overview', url: ROUTES.HOME, icon: LayoutDashboard },
    { title: 'Subscription Plan', url: ROUTES.SUBSCRIPTION, icon: CreditCard },
    { title: 'Setting', url: ROUTES.PROFILE, icon: Settings },
  ];

  // Add Admin Dashboard link if user is admin
  if (user?.role === 'admin') {
    sidebarItems.unshift({
      title: 'Admin Dashboard',
      url: ROUTES.ADMIN,
      icon: Shield,
    });
  }
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <AppSidebar title="QUIZZARD" footerText="© 2025 Quizzard" items={sidebarItems} />

          <main className="flex-1 relative transition-all duration-300">
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
