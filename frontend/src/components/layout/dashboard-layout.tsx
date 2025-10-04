'use client'

import { useState } from 'react'
import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <div className="h-screen flex flex-col">
      <AppHeader 
        onMenuClick={() => setSidebarOpen(true)} 
        isMobile={isMobile} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-64 flex-shrink-0">
            <AppSidebar className="h-full" />
          </div>
        )}

        {/* Mobile Sidebar */}
        {isMobile && (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-64 p-0">
              <AppSidebar className="h-full" />
            </SheetContent>
          </Sheet>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="container mx-auto p-6 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}