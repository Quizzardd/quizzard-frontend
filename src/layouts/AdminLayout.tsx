import Navbar from "@/components/Navbar"
import { AppSidebar } from "@/components/sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Book, BookOpen, Layout, LayoutDashboard, Users } from "lucide-react"
import { Outlet } from "react-router"



const sidebarItems = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Students", url: "/admin/students", icon: BookOpen },
  { title: "Teachers", url: "/admin/teachers", icon: Users },
  { title: "Courses", url: "/admin/courses", icon: Book },
  { title: "PLans", url: "/admin/plans", icon: Layout },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
     <Navbar />      
     <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <AppSidebar
            title="QUIZZARD"
            footerText="© 2025 Quizzard"
            items={sidebarItems}
          />

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="md:hidden mb-4">
              <SidebarTrigger />
            </div>
            <Outlet/>
          </main>
        </SidebarProvider>
      </div>
    </div>
  )
}
