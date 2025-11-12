import type { ForwardRefExoticComponent, RefAttributes } from "react"
import { type LucideProps } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type SidebarItem = {
  title: string
  url: string
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}

type AppSidebarProps = {
  items: SidebarItem[]
  title?: string
  footerText?: string
}

export function AppSidebar({
  items,
  title = "App Sidebar",
  footerText = "© 2025 Quizzard",
}: AppSidebarProps) {
  return (
    <Sidebar
     className="fixed top-[4rem] left-0 h-[calc(100vh-4rem)] w-64 bg-[var(--color-sidebar)] border-r ..."

    >
      <SidebarContent className="p-4">
        {/* Logo / Title */}
        <div className="mb-6 flex items-center justify-center">
          <h2 className="text-2xl font-bold tracking-wide">
            {title.split(" ")[0]}
            <span style={{ color: "var(--color-sidebar-primary)" }}>
              {title.split(" ")[1] ?? ""}
            </span>
          </h2>
        </div>

        {/* Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm uppercase mb-2 tracking-wider text-[var(--color-muted-foreground)]">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="
                        flex items-center gap-3 px-3 py-2 rounded-lg
                        transition-all duration-200
                        hover:bg-[var(--color-sidebar-accent)]
                        hover:text-[var(--color-sidebar-accent-foreground)]
                        group
                      "
                    >
                      <item.icon className="h-5 w-5 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-sidebar-primary)] transition-colors" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        <div className="mt-8 border-t border-[var(--color-sidebar-border)] pt-4 text-center text-sm text-[var(--color-muted-foreground)]">
          {footerText}
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
