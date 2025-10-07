'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      
      if (requireAuth && !authenticated) {
        // User needs to be authenticated but isn't
        router.push(redirectTo);
      } else if (!requireAuth && authenticated) {
        // User is authenticated but shouldn't be (e.g., on login page)
        router.push('/dashboard');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [requireAuth, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuth) {
    return null; // Will redirect to login
  }

  if (!requireAuth && isAuth) {
    return null; // Will redirect to dashboard
  }

  return <>{children}</>;
}
