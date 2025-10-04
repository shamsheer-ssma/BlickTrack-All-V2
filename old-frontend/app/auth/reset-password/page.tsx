'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import ClickableLogo from '@/components/brand/ClickableLogo';
import { 
  validatePasswordComplexity, 
  validatePasswordConfirmation,
  getPasswordStrengthColor,
  getPasswordStrengthBgColor
} from '@/lib/validation';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string[]}>({});
  const [passwordComplexity, setPasswordComplexity] = useState<{
    score: number;
    strength: string;
    errors: string[];
  }>({ score: 0, strength: 'weak', errors: [] });
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Invalid or missing reset token');
    }
  }, [searchParams]);

  const validateAllFields = () => {
    const errors: {[key: string]: string[]} = {};
    
    // Validate password
    const passwordResult = validatePasswordComplexity(password);
    errors.password = passwordResult.errors;
    setPasswordComplexity({
      score: passwordResult.score,
      strength: passwordResult.strength,
      errors: passwordResult.errors
    });

    // Validate password confirmation
    errors.confirmPassword = validatePasswordConfirmation(password, confirmPassword).errors;

    setValidationErrors(errors);
    return Object.values(errors).every(fieldErrors => fieldErrors.length === 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate all fields
    if (!validateAllFields()) {
      setError('Please fix the validation errors below');
      setIsLoading(false);
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          password: password
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/login?message=Password reset successfully');
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to reset password');
      }
    } catch (_) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <BlickTrackLogo 
              size="lg" 
              showIcon={true} 
              showTagline={true}
              className="justify-center mb-4"
              textClassName="text-3xl"
              taglineClassName="text-slate-400"
            />
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Password Reset Successful</h2>
            <p className="text-slate-400 mb-6">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Redirecting you to the login page...
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <ClickableLogo />
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Set new password</h1>
            <p className="text-slate-400">Enter your new password below</p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    // Real-time validation
                    const passwordResult = validatePasswordComplexity(e.target.value);
                    setPasswordComplexity({
                      score: passwordResult.score,
                      strength: passwordResult.strength,
                      errors: passwordResult.errors
                    });
                    setValidationErrors(prev => ({
                      ...prev,
                      password: passwordResult.errors
                    }));
                  }}
                  className={`w-full pl-10 pr-12 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    validationErrors.password?.length ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Enter new password"
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Password Strength</span>
                    <span className={`text-xs font-medium ${getPasswordStrengthColor(passwordComplexity.strength)}`}>
                      {passwordComplexity.strength.charAt(0).toUpperCase() + passwordComplexity.strength.slice(1)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthBgColor(passwordComplexity.strength)}`}
                      style={{ width: `${passwordComplexity.score}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-slate-400">
                    Score: {passwordComplexity.score}/100
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              {password && (
                <div className="mt-3 space-y-1">
                  <div className="text-xs text-slate-400 mb-2">Password Requirements:</div>
                  {[
                    { text: 'At least 8 characters', valid: password.length >= 8 },
                    { text: 'One lowercase letter', valid: /[a-z]/.test(password) },
                    { text: 'One uppercase letter', valid: /[A-Z]/.test(password) },
                    { text: 'One number', valid: /\d/.test(password) },
                    { text: 'One special character', valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password) }
                  ].map((req, index) => (
                    <div key={index} className="flex items-center text-xs">
                      {req.valid ? (
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500 mr-2" />
                      )}
                      <span className={req.valid ? 'text-green-400' : 'text-red-400'}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Password Validation Errors */}
              {validationErrors.password?.map((error, index) => (
                <div key={index} className="mt-2 text-xs text-red-400 flex items-center">
                  <XCircle className="w-3 h-3 mr-1" />
                  {error}
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    // Real-time validation
                    const confirmResult = validatePasswordConfirmation(password, e.target.value);
                    setValidationErrors(prev => ({
                      ...prev,
                      confirmPassword: confirmResult.errors
                    }));
                  }}
                  className={`w-full pl-10 pr-12 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    validationErrors.confirmPassword?.length ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  )}
                </button>
              </div>
              
              {/* Confirm Password Validation Errors */}
              {validationErrors.confirmPassword?.map((error, index) => (
                <div key={index} className="mt-2 text-xs text-red-400 flex items-center">
                  <XCircle className="w-3 h-3 mr-1" />
                  {error}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Resetting password...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}