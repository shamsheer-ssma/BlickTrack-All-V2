'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import ClickableLogo from '@/components/brand/ClickableLogo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/email/send-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          userName: email.split('@')[0] // Extract name from email
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send password reset email');
      }
    } catch (_) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <ClickableLogo />
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {!success ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Reset your password</h1>
                <p className="text-slate-400">Enter your email address and we&apos;ll send you a link to reset your password.</p>
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
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Check your email</h2>
              <p className="text-slate-400 mb-6">
                We&apos;ve sent a password reset link to <strong>{email}</strong>. 
                Please check your inbox and follow the instructions to reset your password.
              </p>
              <p className="text-sm text-slate-500 mb-6">
                If you don&apos;t see the email, check your spam folder or try again.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Send another email
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-slate-400 hover:text-slate-300 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}