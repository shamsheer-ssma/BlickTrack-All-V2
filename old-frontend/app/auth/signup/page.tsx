'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User, Mail, Building, Info, CheckCircle, XCircle } from 'lucide-react';
import ClickableLogo from '@/components/brand/ClickableLogo';
import { getUserSignupContext, isLicensedUser } from '@/lib/tenantLogic';
import { loginUser, setStoredToken } from '@/lib/auth';
import { 
  validateEmail, 
  validateName, 
  validateCompany, 
  validatePasswordComplexity, 
  validatePasswordConfirmation,
  validateOTP,
  getPasswordStrengthColor,
  getPasswordStrengthBgColor
} from '@/lib/validation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [otp, setOtp] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string[]}>({});
  const [passwordComplexity, setPasswordComplexity] = useState<{
    score: number;
    strength: string;
    errors: string[];
  }>({ score: 0, strength: 'weak', errors: [] });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Real-time validation
    validateField(name, type === 'checkbox' ? checked : value);
  };

  const validateField = (fieldName: string, value: any) => {
    let fieldErrors: string[] = [];
    
    switch (fieldName) {
      case 'firstName':
        fieldErrors = validateName(value, 'First name').errors;
        break;
      case 'lastName':
        fieldErrors = validateName(value, 'Last name').errors;
        break;
      case 'email':
        fieldErrors = validateEmail(value).errors;
        break;
      case 'company':
        fieldErrors = validateCompany(value).errors;
        break;
      case 'password':
        const passwordResult = validatePasswordComplexity(value);
        fieldErrors = passwordResult.errors;
        setPasswordComplexity({
          score: passwordResult.score,
          strength: passwordResult.strength,
          errors: passwordResult.errors
        });
        break;
      case 'confirmPassword':
        fieldErrors = validatePasswordConfirmation(formData.password, value).errors;
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors
    }));
  };

  // Get tenant information based on email
  const getTenantInfo = () => {
    if (!formData.email) return null;
    
    const signupContext = getUserSignupContext(formData.email, formData.company || '');
    return signupContext;
  };

  const tenantInfo = getTenantInfo();

  const validateAllFields = () => {
    const errors: {[key: string]: string[]} = {};
    
    // Validate all fields
    errors.firstName = validateName(formData.firstName, 'First name').errors;
    errors.lastName = validateName(formData.lastName, 'Last name').errors;
    errors.email = validateEmail(formData.email).errors;
    errors.company = validateCompany(formData.company).errors;
    errors.password = validatePasswordComplexity(formData.password).errors;
    errors.confirmPassword = validatePasswordConfirmation(formData.password, formData.confirmPassword).errors;

    setValidationErrors(errors);
    return Object.values(errors).every(fieldErrors => fieldErrors.length === 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate all fields
    if (!validateAllFields()) {
      setError('Please fix the validation errors below');
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      setIsLoading(false);
      return;
    }

    try {
      // Send OTP email
      const response = await fetch('/api/email/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName
        }),
      });

      if (response.ok) {
        setSuccess('Verification code sent to your email. Please check your inbox.');
        setStep('otp');
      } else {
        const data = await response.json();
        if (response.status === 409 && data.code === 'EMAIL_EXISTS') {
          setError('An account with this email already exists. Please use a different email or try signing in.');
        } else {
          setError(data.error || 'Failed to send verification email');
        }
      }
    } catch (_) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate OTP
    const otpValidation = validateOTP(otp);
    if (!otpValidation.isValid) {
      setError(otpValidation.errors.join(', '));
      setIsLoading(false);
      return;
    }

    try {
      // Verify OTP and complete signup
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          company: formData.company,
          password: formData.password,
          otp: otp
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store user data and JWT token in auth system
        if (data.user && data.token) {
          loginUser(data.user.email);
          setStoredToken(data.token);
        }
        
        setSuccess('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        const data = await response.json();
        if (response.status === 409 && data.code === 'EMAIL_EXISTS') {
          setError('An account with this email already exists. Please use a different email or try signing in.');
        } else {
          setError(data.message || 'Signup failed');
        }
      }
    } catch (_) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/email/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName
        }),
      });

      if (response.ok) {
        setSuccess('Verification code resent to your email.');
      } else {
        const data = await response.json();
        if (response.status === 409 && data.code === 'EMAIL_EXISTS') {
          setError('An account with this email already exists. Please use a different email or try signing in.');
        } else {
          setError(data.error || 'Failed to resend verification email');
        }
      }
    } catch (_) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <ClickableLogo />
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-slate-400">Join BlickTrack and secure your organization</p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/20 border border-green-700 text-green-400 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {step === 'signup' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.firstName?.length ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="John"
                    required
                  />
                  {validationErrors.firstName?.map((error, index) => (
                    <div key={index} className="mt-1 text-xs text-red-400 flex items-center">
                      <XCircle className="w-3 h-3 mr-1" />
                      {error}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.lastName?.length ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Doe"
                  required
                />
                {validationErrors.lastName?.map((error, index) => (
                  <div key={index} className="mt-1 text-xs text-red-400 flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    {error}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.email?.length ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="john@company.com"
                  required
                />
                {validationErrors.email?.map((error, index) => (
                  <div key={index} className="mt-1 text-xs text-red-400 flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    {error}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.company?.length ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Acme Corporation"
                  required
                />
                {validationErrors.company?.map((error, index) => (
                  <div key={index} className="mt-1 text-xs text-red-400 flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    {error}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.password?.length ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
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
              {formData.password && (
                <div className="mt-3 space-y-1">
                  <div className="text-xs text-slate-400 mb-2">Password Requirements:</div>
                  {[
                    { text: 'At least 8 characters', valid: formData.password.length >= 8 },
                    { text: 'One lowercase letter', valid: /[a-z]/.test(formData.password) },
                    { text: 'One uppercase letter', valid: /[A-Z]/.test(formData.password) },
                    { text: 'One number', valid: /\d/.test(formData.password) },
                    { text: 'One special character', valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(formData.password) }
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
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.confirmPassword?.length ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                {validationErrors.confirmPassword?.map((error, index) => (
                  <div key={index} className="mt-1 text-xs text-red-400 flex items-center">
                    <XCircle className="w-3 h-3 mr-1" />
                    {error}
                  </div>
                ))}
              </div>
            </div>

            {/* Tenant Information Display */}
            {tenantInfo && formData.email && (
              <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white mb-2">Account Assignment</h4>
                    <div className="space-y-1 text-xs">
                      <p className="text-slate-300">
                        <span className="font-medium">Organization:</span> {tenantInfo.organization || 'Not specified'}
                      </p>
                      <p className="text-slate-300">
                        <span className="font-medium">Tenant:</span> {tenantInfo.tenant.name}
                      </p>
                      <p className="text-slate-300">
                        <span className="font-medium">Plan:</span> {tenantInfo.tenant.plan}
                      </p>
                      <p className={`font-medium ${
                        tenantInfo.tenant.isLicensed 
                          ? 'text-green-400' 
                          : 'text-yellow-400'
                      }`}>
                        {tenantInfo.userType} - {tenantInfo.signupType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700 mt-1"
              />
              <label htmlFor="acceptTerms" className="ml-3 text-sm text-slate-300">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.acceptTerms}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-2">Verify Your Email</h2>
                <p className="text-slate-400">
                  We sent a 6-digit verification code to <strong>{formData.email}</strong>
                </p>
              </div>

              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Create Account'}
                </button>

                <div className="text-center">
                  <p className="text-slate-400 text-sm">
                    Didn&apos;t receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-blue-400 hover:text-blue-300 font-medium disabled:text-slate-500"
                    >
                      Resend
                    </button>
                  </p>
                </div>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('signup')}
                  className="text-slate-400 hover:text-slate-300 text-sm"
                >
                  ← Back to signup
                </button>
              </div>
            </div>
          )}

          {step === 'signup' && (
            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
