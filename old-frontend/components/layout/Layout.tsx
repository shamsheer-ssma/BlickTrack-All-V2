'use client';

import { ReactNode, useEffect, useState } from 'react';
import GradientHeader from './GradientHeader';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';
import { getUserInfoForHeader } from '@/lib/auth';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = false }: LayoutProps) {
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    role: string;
    tenant?: string;
    company?: string;
  } | null>(null);
  
  // Don't show sidebar on auth pages
  const isAuthPage = pathname.startsWith('/auth');
  const isLandingPage = pathname === '/';
  
  // Get user info from auth system
  useEffect(() => {
    const user = getUserInfoForHeader();
    setUserInfo(user);
  }, []);

  if (isLandingPage || isAuthPage) {
    return (
      <div className="min-h-screen">
        <GradientHeader />
        <main>{children}</main>
      </div>
    );
  }

  // Use actual user info if available, otherwise fallback to default
  const headerUserInfo = userInfo || {
    name: 'Guest User',
    email: 'guest@blicktrack.com',
    role: 'Guest',
    tenant: 'BlickTrack Platform',
    company: 'BlickTrack Inc.'
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <GradientHeader 
        showSidebar={showSidebar} 
        showSearch={showSidebar}
        showNotifications={showSidebar}
        showProfile={showSidebar}
        userInfo={headerUserInfo}
      />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? 'ml-64' : ''} transition-all duration-300`}>
          {children}
        </main>
      </div>
    </div>
  );
}
