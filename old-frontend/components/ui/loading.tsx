'use client';

import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <Loader2 className={cn(
      'animate-spin text-blue-600',
      sizeClasses[size],
      className
    )} />
  );
}

// Loading Button Component
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {loading ? loadingText || 'Loading...' : children}
    </button>
  );
}

// Loading Overlay Component
interface LoadingOverlayProps {
  loading?: boolean;
  text?: string;
  className?: string;
}

export function LoadingOverlay({ loading = false, text = 'Loading...', className }: LoadingOverlayProps) {
  if (!loading) return null;

  return (
    <div className={cn(
      'absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10',
      className
    )}>
      <div className="flex flex-col items-center space-y-2">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  );
}

// Loading Card Component
interface LoadingCardProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  skeletonLines?: number;
}

export function LoadingCard({ loading = false, children, className, skeletonLines = 3 }: LoadingCardProps) {
  if (!loading) return <>{children}</>;

  return (
    <div className={cn('animate-pulse', className)}>
      <div className="space-y-4">
        {Array.from({ length: skeletonLines }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading Table Component
interface LoadingTableProps {
  loading?: boolean;
  rows?: number;
  columns?: number;
  children: React.ReactNode;
  className?: string;
}

export function LoadingTable({ 
  loading = false, 
  rows = 5, 
  columns = 4, 
  children, 
  className 
}: LoadingTableProps) {
  if (!loading) return <>{children}</>;

  return (
    <div className={cn('animate-pulse', className)}>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: columns }).map((_, j) => (
                  <td key={j} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Loading State Component
interface LoadingStateProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyText?: string;
  children: React.ReactNode;
  className?: string;
}

export function LoadingState({
  loading = false,
  error = null,
  empty = false,
  emptyText = 'No data available',
  children,
  className
}: LoadingStateProps) {
  if (loading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-red-600 font-medium">Error loading data</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500">{emptyText}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

