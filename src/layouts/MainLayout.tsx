import Navbar from '@/components/Navbar';
import { AppSidebar } from '@/components/sidebar';
import { ChatSidebar } from '@/components/ChatSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { CreditCard, LayoutDashboard, Settings, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
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
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          {/* Left sidebar - hidden when chat is open */}
          {!isChatOpen && (
            <AppSidebar title="QUIZZARD" footerText="© 2025 Quizzard" items={sidebarItems} />
          )}

          <main
            className={`flex-1 relative transition-all duration-300 ${isChatOpen ? 'md:mr-80' : ''}`}
          >
            {!isChatOpen && (
              <div className="md:hidden mb-4">
                <SidebarTrigger />
              </div>
            )}

            {/* Chat Toggle Button - Shows when chat is closed */}
            {!isChatOpen && (
              <Button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
                size="icon"
                title="Open AI Chat"
              >
                <MessageSquare className="h-6 w-6" />
              </Button>
            )}

            <Outlet />
          </main>

          {/* Right Chat Sidebar - embedded */}
          {isChatOpen && <ChatSidebar onClose={() => setIsChatOpen(false)} />}
        </SidebarProvider>
      </div>
    </div>
  );
};

export default MainLayout;
