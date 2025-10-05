'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FastLoginPage from '@/components/auth/FastLoginPage';
import EnterpriseLandingPage from '@/components/landing/EnterpriseLandingPage';
import { useTenantFeatures } from '@/hooks/useTenantFeatures';
import { shouldShowLandingPage } from '@/config/features';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // Get tenant features (will fallback to environment variables if no tenant)
  const { features, loading, error } = useTenantFeatures();
  
  // Check if we should show landing page
  const showLandingPage = features?.enableLandingPage ?? shouldShowLandingPage();

  useEffect(() => {
    if (!loading && !error) {
      setIsLoading(false);
      
      // If landing page is disabled, redirect to login
      if (!showLandingPage) {
        router.push('/login');
      }
    }
  }, [loading, error, showLandingPage, router]);

  // Show loading state while checking configuration
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error state if configuration failed
  if (error) {
    console.error('Failed to load tenant configuration:', error);
    // Fallback to environment variable
    return shouldShowLandingPage() ? <EnterpriseLandingPage /> : <FastLoginPage />;
  }

  // Show appropriate page based on configuration
  return showLandingPage ? <EnterpriseLandingPage /> : <FastLoginPage />;
}
