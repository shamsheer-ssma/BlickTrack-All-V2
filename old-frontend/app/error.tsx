/**
 * error.tsx
 *
 * Global Error Boundary Component
 *
 * Features:
 * - Catches JavaScript errors anywhere in the component tree
 * - Displays fallback UI instead of crashing the app
 * - Logs errors for debugging
 * - Provides user-friendly error messages
 * - Includes retry functionality
 *
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-01-30
 */

'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h1>

        {/* Error Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          We encountered an unexpected error. This has been logged and our team will investigate.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
            <p className="text-sm font-medium text-gray-700 mb-2">Error Details:</p>
            <p className="text-xs text-gray-600 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </div>

        {/* Support Information */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If this problem persists, please{' '}
            <a href="mailto:support@blicktrack.com" className="text-blue-600 hover:text-blue-700 font-medium">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

