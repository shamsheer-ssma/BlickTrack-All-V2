'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import ClickableLogo from '@/components/brand/ClickableLogo';
import { storeUser, setStoredToken } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  console.log('🔍 [LOGIN PAGE] Component rendered');
  console.log('🔍 [LOGIN PAGE] Redirect to:', redirectTo);
  console.log('🔍 [LOGIN PAGE] Current URL:', window.location.href);

  // Clear any invalid tokens when login page loads
  useEffect(() => {
    console.log('🔍 [LOGIN PAGE] useEffect triggered - clearing tokens');
    // Clear any stored tokens to ensure fresh login
    localStorage.removeItem('blick_token');
    localStorage.removeItem('blick_user');
    
    // Clear the invalid token cookie
    document.cookie = 'blick_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    console.log('🧹 [LOGIN PAGE] Cleared stored tokens and cookies for fresh login');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🔐 Login successful, API response data:', data);
        
        // Store user data and JWT token in auth system
        if (data.user && data.token) {
          console.log('💾 Storing user data:', data.user);
          // Store the actual user data from the API response
          storeUser(data.user, data.token);
          setStoredToken(data.token);
          console.log('✅ User data stored successfully');
        }
        
        console.log('🚀 Redirecting to:', redirectTo);
        router.push(redirectTo);
      } else {
        const data = await response.json();
        setError(data.error || 'Login failed');
      }
    } catch (_) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  console.log('🔍 [LOGIN PAGE] Rendering form...');

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <ClickableLogo />
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to your BlickTrack account</p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-slate-300">
                  Remember me
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

      </div>
      </div>
    </Layout>
  );
}