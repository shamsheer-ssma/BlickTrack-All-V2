'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { BLICKTRACK_THEME } from '@/lib/theme';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onResend: () => void;
  isLoading?: boolean;
  error?: string;
  disabled?: boolean;
}

export default function OtpInput({
  length = 6,
  onComplete,
  onResend,
  isLoading = false,
  error,
  disabled = false
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (disabled || isLoading) return;

    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit !== '') && newOtp.length === length) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || isLoading) return;

    // Handle backspace
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled || isLoading) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      // Focus on the next empty input or the last input
      const nextIndex = Math.min(pastedData.length, length - 1);
      setActiveIndex(nextIndex);
      inputRefs.current[nextIndex]?.focus();

      // Check if OTP is complete
      if (newOtp.every(digit => digit !== '') && newOtp.length === length) {
        onComplete(newOtp.join(''));
      }
    }
  };

  const clearOtp = () => {
    if (disabled || isLoading) return;
    
    setOtp(new Array(length).fill(''));
    setActiveIndex(0);
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every(digit => digit !== '') && otp.length === length;

  return (
    <div className="w-full">
      <div className="flex justify-center space-x-3 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setActiveIndex(index)}
            className={`
              w-12 h-12 text-center text-xl font-bold border-2 rounded-lg
              transition-all duration-300 focus:outline-none
              ${activeIndex === index 
                ? 'ring-2 ring-opacity-20' 
                : digit 
                  ? 'bg-opacity-10' 
                  : 'hover:border-opacity-60'
              }
              ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
            `}
            style={{
              borderColor: activeIndex === index 
                ? BLICKTRACK_THEME.colors.primary.blue
                : digit 
                  ? BLICKTRACK_THEME.colors.primary.teal
                  : error
                    ? '#ef4444'
                    : BLICKTRACK_THEME.colors.borders.primary,
              backgroundColor: activeIndex === index 
                ? `${BLICKTRACK_THEME.colors.primary.blue}10`
                : digit 
                  ? `${BLICKTRACK_THEME.colors.primary.teal}10`
                  : error
                    ? '#fef2f2'
                    : 'transparent',
              color: digit 
                ? BLICKTRACK_THEME.colors.primary.teal
                : error
                  ? '#ef4444'
                  : BLICKTRACK_THEME.colors.text.primary,
              fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary,
            }}
            disabled={disabled || isLoading}
          />
        ))}
      </div>

      {/* Status indicators */}
      <div className="flex justify-center items-center space-x-2 mb-4">
        {isLoading && (
          <div 
            className="flex items-center"
            style={{ color: BLICKTRACK_THEME.colors.primary.blue }}
          >
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            <span className="text-sm" style={{ fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary }}>
              Verifying...
            </span>
          </div>
        )}
        {isComplete && !isLoading && !error && (
          <div 
            className="flex items-center"
            style={{ color: BLICKTRACK_THEME.colors.primary.teal }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="text-sm" style={{ fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary }}>
              Code complete
            </span>
          </div>
        )}
        {error && (
          <div className="flex items-center text-red-600">
            <XCircle className="w-4 h-4 mr-2" />
            <span className="text-sm" style={{ fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary }}>
              {error}
            </span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-center space-x-4">
        <button
          type="button"
          onClick={clearOtp}
          disabled={disabled || isLoading || otp.every(digit => digit === '')}
          className="text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{
            color: BLICKTRACK_THEME.colors.text.muted,
            fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary,
          }}
          onMouseEnter={(e) => {
            if (!disabled && !isLoading && !otp.every(digit => digit === '')) {
              e.currentTarget.style.color = BLICKTRACK_THEME.colors.text.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !isLoading && !otp.every(digit => digit === '')) {
              e.currentTarget.style.color = BLICKTRACK_THEME.colors.text.muted;
            }
          }}
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onResend}
          disabled={disabled || isLoading}
          className="text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{
            color: BLICKTRACK_THEME.colors.primary.blue,
            fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary,
          }}
          onMouseEnter={(e) => {
            if (!disabled && !isLoading) {
              e.currentTarget.style.color = BLICKTRACK_THEME.colors.primary.teal;
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !isLoading) {
              e.currentTarget.style.color = BLICKTRACK_THEME.colors.primary.blue;
            }
          }}
        >
          Resend Code
        </button>
      </div>
    </div>
  );
}
