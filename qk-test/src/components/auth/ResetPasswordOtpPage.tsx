'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Mail, Loader2, RefreshCw, Lock } from 'lucide-react';
import Logo from '../ui/Logo';
import OtpInput from './OtpInput';
import { apiService } from '@/lib/api';

export default function ResetPasswordOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [step, setStep] = useState<'otp' | 'password'>('otp');

  useEffect(() => {
    const emailFromParams = searchParams.get('email');
    if (emailFromParams) {
      setEmail(decodeURIComponent(emailFromParams));
    } else {
      // If no email in params, try localStorage (e.g., after forgot password redirect)
      const storedEmail = localStorage.getItem('pendingPasswordResetEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        // If no email found, redirect to forgot password
        router.replace('/forgot-password');
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleVerifyOtp = useCallback(async (otpCode: string) => {
    if (!email) {
      setError('Email is missing. Please go back to forgot password.');
      return;
    }
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      // Store OTP for password reset
      localStorage.setItem('pendingPasswordResetOtp', otpCode);
      
      setMessage('OTP verified successfully! Please set your new password.');
      setStep('password');
    } catch (err: unknown) {
      console.error('OTP verification error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Invalid verification code. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const handleResendOtp = useCallback(async () => {
    if (!email || resendCooldown > 0) return;

    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      await apiService.request('/auth/forgot-password', {
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
  }, [email, resendCooldown]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get the OTP from localStorage or state
      const storedOtp = localStorage.getItem('pendingPasswordResetOtp');
      if (!storedOtp) {
        setError('OTP verification required. Please go back and verify your code.');
        return;
      }

      await apiService.resetPassword(storedOtp, newPassword);

      setMessage('Password reset successfully! Redirecting to login...');
      localStorage.removeItem('pendingPasswordResetEmail');
      localStorage.removeItem('pendingPasswordResetOtp');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: unknown) {
      console.error('Password reset error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading email...</p>
        </div>
      </div>
    );
  }

  if (step === 'password') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={handleLogoClick}
            >
              <Logo size="lg" showTagline={true} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1
              className="text-xl font-bold mb-2 text-center"
              style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: '#2563eb',
                display: 'inline-block'
              }}
            >
              Set New Password
            </h1>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Please enter your new password below.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {message && <p className="text-green-600 text-sm">{message}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resetting Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setStep('otp')}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Back to OTP Verification
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
            onClick={handleLogoClick}
          >
            <Logo size="lg" showTagline={true} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <Lock className="w-8 h-8 text-blue-600" />
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
            Reset Your Password
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            We've sent a 6-digit code to <strong>{email}</strong>. Please enter it below to reset your password.
          </p>

          <OtpInput
            onComplete={handleVerifyOtp}
            onChange={() => setError(null)} // Clear error on change
            isError={!!error}
            isLoading={isLoading}
            disabled={isLoading}
            onResend={handleResendOtp} // Pass the resend handler
          />

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {message && <p className="text-green-600 text-sm mt-4">{message}</p>}

          <div className="mt-6 text-center">
            <button
              onClick={handleResendOtp}
              disabled={resendCooldown > 0 || isLoading}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300
                         text-blue-600 hover:text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: resendCooldown > 0 || isLoading ? 'none' : 'linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)',
                WebkitBackgroundClip: resendCooldown > 0 || isLoading ? 'initial' : 'text',
                WebkitTextFillColor: resendCooldown > 0 || isLoading ? 'initial' : 'transparent',
                backgroundClip: resendCooldown > 0 || isLoading ? 'initial' : 'text',
                color: resendCooldown > 0 || isLoading ? '#2563eb' : 'transparent',
                border: resendCooldown > 0 || isLoading ? '1px solid #2563eb' : 'none',
              }}
              onMouseEnter={(e) => {
                if (resendCooldown === 0 && !isLoading) {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)';
                  e.currentTarget.style.WebkitTextFillColor = 'white';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (resendCooldown === 0 && !isLoading) {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.WebkitTextFillColor = 'transparent';
                  e.currentTarget.style.color = '#2563eb';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
