/**
 * File: SignInLogsView.tsx
 * Purpose: Azure-like sign-in logs interface component for the BlickTrack frontend. Provides comprehensive sign-in monitoring with filtering, search, and security analytics for authentication tracking.
 * 
 * Key Functions / Components / Classes:
 *   - SignInLogsView: Main sign-in logs component
 *   - loadSignInLogs: Fetches sign-in logs from API
 *   - loadSignInStats: Fetches sign-in statistics
 *   - handleFilterChange: Handles filter changes
 *   - handleSearch: Handles search functionality
 *   - formatDate: Formats dates for display
 *   - getStatusColor: Gets status color for UI
 *   - getDeviceIcon: Gets device type icon
 *
 * Inputs:
 *   - User context and permissions
 *   - Filter parameters (date range, status, user, IP, etc.)
 *   - Search queries
 *
 * Outputs:
 *   - Azure-like sign-in logs table
 *   - Security statistics and analytics
 *   - Filter and search controls
 *   - Pagination controls
 *
 * Dependencies:
 *   - apiService for API calls
 *   - React hooks for state management
 *   - Tailwind CSS for styling
 *
 * Notes:
 *   - Azure portal inspired design
 *   - Security-focused analytics
 *   - Suspicious activity highlighting
 *   - MFA usage tracking
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Download, 
  RefreshCw, 
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Clock,
  User,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Lock,
  Eye,
  AlertCircle
} from 'lucide-react';
import { apiService } from '@/lib/api';
import type { SignInLog } from '@/lib/api';

interface SignInStats {
  totalSignIns: number;
  successCount: number;
  failureCount: number;
  blockedCount: number;
  mfaUsage: number;
  topUsers: Array<{ userEmail: string; count: number }>;
  topIPs: Array<{ ipAddress: string; count: number }>;
  dailySignIns: Array<{ date: string; count: number }>;
  hourlySignIns: Array<{ hour: number; count: number }>;
  suspiciousActivity: number;
}

export default function SignInLogsView() {
  const [signInLogs, setSignInLogs] = useState<SignInLog[]>([]);
  const [signInStats, setSignInStats] = useState<SignInStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const pageSize = 50;
  
  // Filters
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    userId: '',
    userEmail: '',
    ipAddress: '',
    isSuspicious: '',
    search: '',
  });

  // Load sign-in logs
  const loadSignInLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getSignInLogs({
        page: currentPage,
        limit: pageSize,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        status: filters.status || undefined,
        userId: filters.userId || undefined,
        userEmail: filters.userEmail || undefined,
        ipAddress: filters.ipAddress || undefined,
        isSuspicious: filters.isSuspicious ? filters.isSuspicious === 'true' : undefined,
        search: filters.search || undefined,
      });
      
      setSignInLogs(response.logs);
      setTotalPages(response.totalPages);
      setTotalLogs(response.total);
    } catch (err: unknown) {
      console.error('Error loading sign-in logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load sign-in logs');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  // Load sign-in statistics
  const loadSignInStats = async () => {
    try {
      const stats = await apiService.getSignInStats(30);
      setSignInStats(stats);
    } catch (err: unknown) {
      console.error('Error loading sign-in stats:', err);
    }
  };

  useEffect(() => {
    loadSignInLogs();
    loadSignInStats();
  }, [loadSignInLogs]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: '',
      userId: '',
      userEmail: '',
      ipAddress: '',
      isSuspicious: '',
      search: '',
    });
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'failure':
        return 'text-red-600 bg-red-50';
      case 'blocked':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string | null) => {
    if (!status) return <HelpCircle className="w-4 h-4" />;
    switch (status.toLowerCase()) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'failure':
        return <XCircle className="w-4 h-4" />;
      case 'blocked':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'critical':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sign-in Logs</h1>
            <p className="text-sm text-gray-600 mt-1">
              Authentication & Security
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadSignInLogs}
              disabled={loading}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {signInStats && (
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Sign-ins</p>
                  <p className="text-2xl font-semibold text-gray-900">{signInStats.totalSignIns.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Successful</p>
                  <p className="text-2xl font-semibold text-gray-900">{signInStats.successCount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <XCircle className="w-8 h-8 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Failed</p>
                  <p className="text-2xl font-semibold text-gray-900">{signInStats.failureCount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Lock className="w-8 h-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">MFA Used</p>
                  <p className="text-2xl font-semibold text-gray-900">{signInStats.mfaUsage.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Suspicious</p>
                  <p className="text-2xl font-semibold text-gray-900">{signInStats.suspiciousActivity.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-gray-50 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-gray-50 transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-gray-50 transition-all duration-200"
                >
                  <option value="">All Status</option>
                  <option value="Success">Success</option>
                  <option value="Failure">Failure</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              {/* Suspicious Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                  Suspicious Activity
                </label>
                <select
                  value={filters.isSuspicious}
                  onChange={(e) => handleFilterChange('isSuspicious', e.target.value)}
                  className="w-full px-3 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-gray-50 transition-all duration-200"
                >
                  <option value="">All Activity</option>
                  <option value="true">Suspicious Only</option>
                  <option value="false">Normal Only</option>
                </select>
              </div>

              {/* User Email Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                  User Email
                </label>
                <input
                  type="text"
                  placeholder="Filter by email"
                  value={filters.userEmail}
                  onChange={(e) => handleFilterChange('userEmail', e.target.value)}
                  className="w-full px-3 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-gray-50 transition-all duration-200"
                />
              </div>

              {/* IP Address Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                  IP Address
                </label>
                <input
                  type="text"
                  placeholder="Filter by IP"
                  value={filters.ipAddress}
                  onChange={(e) => handleFilterChange('ipAddress', e.target.value)}
                  className="w-full px-3 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-gray-50 transition-all duration-200"
                />
              </div>

              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search user, location, device..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-gray-50 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign-in Logs Table */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">
                Sign-in Logs ({totalLogs.toLocaleString()})
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Page {currentPage} of {totalPages}</span>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-gray-500">Loading sign-in logs...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <span className="ml-2 text-sm text-red-600">{error}</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MFA
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {signInLogs.map((log) => (
                    <tr key={log.id} className={`hover:bg-gray-50 ${log.isSuspicious ? 'bg-red-50' : ''}`}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(log.date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium">{log.userName || log.userEmail}</div>
                            <div className="text-xs text-gray-500">{log.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                          {getStatusIcon(log.status)}
                          <span className="ml-1">{log.status}</span>
                        </span>
                        {log.statusReason && (
                          <div className="text-xs text-gray-500 mt-1">
                            {log.statusReason}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          {getDeviceIcon(log.deviceType)}
                          <div className="ml-2">
                            <div className="font-medium">{log.deviceType || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{log.browser} • {log.os}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          {log.location || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {log.ipAddress || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {log.mfaUsed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-600 bg-green-50">
                            <Lock className="w-3 h-3 mr-1" />
                            {log.mfaMethod || 'MFA'}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.riskLevel && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(log.riskLevel)}`}>
                            {log.riskLevel}
                          </span>
                        )}
                        {log.isSuspicious && (
                          <div className="text-xs text-red-600 mt-1 font-medium">
                            Suspicious
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-all duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalLogs)} of {totalLogs} results
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
