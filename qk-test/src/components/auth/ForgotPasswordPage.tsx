'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import Logo from '../ui/Logo';
import { apiService } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call backend forgot password API
      await apiService.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      // Store email for OTP verification
      localStorage.setItem('pendingPasswordResetEmail', email);

      // Redirect to OTP verification page
      router.push(`/reset-password-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Forgot password error:', error);
      
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to send reset code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div 
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => router.push('/')}
            >
              <Logo size="lg" showTagline={true} />
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 
              className="text-xl font-bold mb-4"
              style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: '#2563eb',
                display: 'inline-block'
              }}
            >
              Check Your Email
            </h1>
            
            <p className="text-gray-600 mb-6">
              We&apos;ve sent a password reset link to <strong>{email}</strong>. 
              Please check your email and follow the instructions to reset your password.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleBackToLogin}
                className="w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                }}
              >
                Back to Login
              </button>
              
              <button
                onClick={() => {
                  setEmail('');
                  setIsSubmitted(false);
                }}
                className="w-full py-2 px-4 rounded-xl font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Try Different Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div 
            className="cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => router.push('/')}
          >
            <Logo size="lg" showTagline={true} />
          </div>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 
              className="text-xl font-bold mb-2"
              style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: '#2563eb',
                display: 'inline-block'
              }}
            >
              Forgot Password?
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your email address and we&apos;ll send you a verification code to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
              }}
            >
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={handleBackToLogin}
              className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
