import { ModeToggle } from '@/components/ModeToggle';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import React from 'react';

const App = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div>
      <ModeToggle />
      <h1 className="text-highlight">Hello Omar</h1>
      <SidebarProvider>
      {/* <AppSidebar /> */}
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
    </div>
  );
};

export default App;
