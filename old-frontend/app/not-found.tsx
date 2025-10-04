/**
 * not-found.tsx
 *
 * 404 Not Found Page Component
 *
 * Features:
 * - Displays when a route is not found
 * - Professional 404 page design
 * - Navigation options to return to main areas
 * - Search functionality for finding content
 * - Responsive design with proper accessibility
 *
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-01-30
 */

import Link from 'next/link';
import { Search, Home, ArrowLeft, Shield } from 'lucide-react';
import BlickTrackLogo from '@/components/brand/BlickTrackLogo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <BlickTrackLogo 
            size="lg" 
            showIcon={true} 
            showTagline={false}
            className="justify-center"
          />
        </div>

        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-white/20 select-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-blue-100 mb-6 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for features, documentation..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
            <Link
              href="/dashboard"
              className="flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <Shield className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
            <Link
              href="/features/threat-modeling"
              className="flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <Shield className="w-4 h-4 mr-2" />
              Features
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-sm text-blue-200">
            Need help? Check our{' '}
            <Link href="/docs" className="text-white hover:text-blue-300 font-medium underline">
              documentation
            </Link>
            {' '}or{' '}
            <a href="mailto:support@blicktrack.com" className="text-white hover:text-blue-300 font-medium underline">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

