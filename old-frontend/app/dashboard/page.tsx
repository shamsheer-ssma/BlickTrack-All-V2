'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default function DashboardRouter() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check server-side session
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          console.log('❌ Dashboard router: No valid session, redirecting to login');
          router.push('/auth/login');
          return;
        }

        const sessionData = await response.json();
        console.log('✅ Dashboard router: Valid session found:', sessionData);

        // Also check client-side user data
        const user = getCurrentUser();
        console.log('🔍 Dashboard router: User data:', user);
        
        if (!user) {
          console.log('❌ Dashboard router: No user found, redirecting to login');
          router.push('/auth/login');
          return;
        }

        console.log(`🎭 Dashboard router: User role: "${user.role}"`);
        console.log(`🎭 Dashboard router: User type: "${user.userType}"`);

        // Route based on user type and role
        if (user.userType === 'Trial User' || user.role === 'Viewer') {
          console.log('📱 Dashboard router: Redirecting to Trial User dashboard');
          router.push('/features/dashboard/trial-user');
        } else if (user.role === 'Tenant Administrator') {
          console.log('🏢 Dashboard router: Redirecting to Tenant Admin dashboard');
          router.push('/features/dashboard/tenant-admin');
        } else if (user.role === 'Platform Administrator') {
          console.log('🔵 Dashboard router: Redirecting to Platform Admin dashboard');
          router.push('/features/dashboard/platform-admin');
        } else if (user.role === 'Security Analyst') {
          console.log('🔶 Dashboard router: Redirecting to Trial User dashboard (Security Analyst)');
          router.push('/features/dashboard/trial-user'); // TODO: Create Security Analyst dashboard
        } else if (user.role === 'Software Developer') {
          console.log('🔷 Dashboard router: Redirecting to Trial User dashboard (Software Developer)');
          router.push('/features/dashboard/trial-user'); // TODO: Create Software Developer dashboard
        } else {
          console.log(`⚠️ Dashboard router: Unknown role "${user.role}", redirecting to Trial User dashboard`);
          // Default to trial user dashboard for unknown roles
          router.push('/features/dashboard/trial-user');
        }
      } catch (error) {
        console.error('❌ Dashboard router: Error checking authentication:', error);
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
