'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import Logo from '../ui/Logo';
import OtpInput from './OtpInput';
import { apiService } from '@/lib/api';

export default function OtpVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Get email from URL params or localStorage
    const emailParam = searchParams.get('email');
    const storedEmail = localStorage.getItem('pendingVerificationEmail');
    
    if (emailParam) {
      setEmail(emailParam);
      localStorage.setItem('pendingVerificationEmail', emailParam);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // No email found, redirect to signup
      router.push('/signup');
    }
  }, [searchParams, router]);

  useEffect(() => {
    // Start resend cooldown timer
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpComplete = async (otpCode: string) => {
    if (!email) return;

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      await apiService.request('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          otp: otpCode
        }),
      });

      setMessage('Email verified successfully! You can now log in.');
      
      // Clear stored email
      localStorage.removeItem('pendingVerificationEmail');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: unknown) {
      console.error('OTP verification error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Invalid verification code. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || resendCooldown > 0) return;

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      await apiService.request('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      setMessage('New verification code sent to your email.');
      setResendCooldown(60); // 60 second cooldown

    } catch (err: unknown) {
      console.error('Resend OTP error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification code. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignup = () => {
    localStorage.removeItem('pendingVerificationEmail');
    router.push('/signup');
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div 
            className="cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => router.push('/')}
          >
            <Logo size="lg" showTagline={true} />
          </div>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            
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
              Verify Your Email
            </h1>
            
            <p className="text-gray-600 text-sm">
              We&apos;ve sent a 6-digit verification code to
            </p>
            <p className="text-gray-900 font-medium">{email}</p>
          </div>

          {/* OTP Input */}
          <OtpInput
            length={6}
            onComplete={handleOtpComplete}
            onResend={handleResendOtp}
            isLoading={isLoading}
            error={error || undefined}
            disabled={isLoading}
          />

          {/* Messages */}
          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm text-center">{message}</p>
            </div>
          )}

          {/* Resend cooldown */}
          {resendCooldown > 0 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Resend code in {resendCooldown} seconds
              </p>
            </div>
          )}

          {/* Back to signup */}
          <div className="mt-6 text-center">
            <button
              onClick={handleBackToSignup}
              className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
