import React from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminAside } from '@/pages/Admin/AdminAside'

export default function AdminLayout({children}:{ children: React.ReactNode }) {
    return (
        <div>
            <SidebarProvider>
                <AdminAside />
                <main>
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </div>
    )
}
