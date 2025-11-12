import Navbar from "@/components/Navbar"
import { AppSidebar } from "@/components/sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { BookOpen, LayoutDashboard, Settings, Users } from "lucide-react"
import type { ReactNode } from "react"

type LayoutProps = {
  children: ReactNode
}

const dashboardItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Students", url: "/dashboard/Students", icon: BookOpen },
  { title: "Teachers", url: "/dashboard/Teachers", icon: Users },
  { title: "Courses", url: "/dashboard/Courses", icon: Settings },
]

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
     <Navbar />      
     <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <AppSidebar
            title="AI Classroom"
            footerText="© 2025 Quizzard"
            items={dashboardItems}
          />

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="md:hidden mb-4">
              <SidebarTrigger />
            </div>

            {children}
          </main>
        </SidebarProvider>
      </div>
    </div>
  )
}
