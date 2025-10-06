/**
 * File: AuditLogsView.tsx
 * Purpose: Azure-like audit logs interface component for the BlickTrack frontend. Provides comprehensive audit trail functionality with filtering, search, and analytics for compliance and security monitoring.
 * 
 * Key Functions / Components / Classes:
 *   - AuditLogsView: Main audit logs component
 *   - loadAuditLogs: Fetches audit logs from API
 *   - loadAuditStats: Fetches audit statistics
 *   - handleFilterChange: Handles filter changes
 *   - handleSearch: Handles search functionality
 *   - formatDate: Formats dates for display
 *   - getStatusColor: Gets status color for UI
 *
 * Inputs:
 *   - User context and permissions
 *   - Filter parameters (date range, service, category, etc.)
 *   - Search queries
 *
 * Outputs:
 *   - Azure-like audit logs table
 *   - Statistics and analytics cards
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
 *   - Comprehensive filtering and search
 *   - Real-time statistics
 *   - Professional table layout
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
  User,
  Server,
  Eye
} from 'lucide-react';
import { apiService } from '@/lib/api';
import type { AuditLog } from '@/lib/api';

interface AuditStats {
  totalLogs: number;
  successCount: number;
  failureCount: number;
  warningCount: number;
  topServices: Array<{ service: string; count: number }>;
  topCategories: Array<{ category: string; count: number }>;
  dailyActivity: Array<{ date: string; count: number }>;
  hourlyActivity: Array<{ hour: number; count: number }>;
}

export default function AuditLogsView() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditStats, setAuditStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [pageSize] = useState(50);
  
  // Filters
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    featureCategory: '', // Feature categories from enum
    feature: '', // Specific features from features table
    status: '',
    targetType: '',
    search: '',
  });

  // Column filters
  const [columnFilters, setColumnFilters] = useState({
    date: '',
    action: '',
    resource: '',
    resourceId: '',
    severity: '',
    riskLevel: '',
    actor: '',
    details: '',
  });

  // Load audit logs
  const loadAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getAuditLogs({
        page: currentPage,
        limit: pageSize,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        service: filters.feature || undefined, // Map feature to service
        category: filters.featureCategory || undefined, // Map featureCategory to category
        status: filters.status || undefined,
        targetType: filters.targetType || undefined,
        search: filters.search || undefined,
      });
      
      setAuditLogs(response.logs);
      setTotalPages(response.totalPages);
      setTotalLogs(response.total);
    } catch (err: unknown) {
      console.error('Error loading audit logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  // Load audit statistics
  const loadAuditStats = useCallback(async () => {
    try {
      const stats = await apiService.getAuditStats(30);
      setAuditStats(stats);
    } catch (err: unknown) {
      console.error('Error loading audit stats:', err);
    }
  }, []);

  useEffect(() => {
    loadAuditLogs();
    loadAuditStats();
  }, [currentPage, pageSize, filters, loadAuditLogs, loadAuditStats]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  const handleColumnFilter = (column: string, value: string) => {
    setColumnFilters(prev => ({ ...prev, [column]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      featureCategory: '',
      feature: '',
      status: '',
      targetType: '',
      search: '',
    });
    setColumnFilters({
      date: '',
      action: '',
      resource: '',
      resourceId: '',
      severity: '',
      riskLevel: '',
      actor: '',
      details: '',
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

  const getSeverityColor = (severity: string | null) => {
    if (!severity) return 'text-gray-600 bg-gray-50';
    switch (severity.toUpperCase()) {
      case 'CRITICAL':
        return 'text-red-600 bg-red-50';
      case 'ERROR':
        return 'text-red-500 bg-red-50';
      case 'WARNING':
        return 'text-yellow-600 bg-yellow-50';
      case 'INFO':
        return 'text-blue-600 bg-blue-50';
      case 'DEBUG':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string | null) => {
    if (!severity) return <HelpCircle className="w-4 h-4" />;
    switch (severity.toUpperCase()) {
      case 'CRITICAL':
        return <AlertTriangle className="w-4 h-4" />;
      case 'ERROR':
        return <XCircle className="w-4 h-4" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4" />;
      case 'INFO':
        return <CheckCircle className="w-4 h-4" />;
      case 'DEBUG':
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getRiskLevelColor = (riskLevel: string | null) => {
    if (!riskLevel) return 'text-gray-600 bg-gray-50';
    switch (riskLevel.toUpperCase()) {
      case 'CRITICAL':
        return 'text-red-600 bg-red-50';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50';
      case 'LOW':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskLevelIcon = (riskLevel: string | null) => {
    if (!riskLevel) return <HelpCircle className="w-4 h-4" />;
    switch (riskLevel.toUpperCase()) {
      case 'CRITICAL':
        return <AlertTriangle className="w-4 h-4" />;
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-4 h-4" />;
      case 'LOW':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const showLogDetails = (log: AuditLog) => {
    // TODO: Implement log details modal
    console.log('Show details for log:', log);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-sm text-gray-600 mt-1">
              Security & Compliance
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadAuditLogs}
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
      {auditStats && (
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Logs</p>
                  <p className="text-2xl font-semibold text-gray-900">{auditStats.totalLogs.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Success</p>
                  <p className="text-2xl font-semibold text-gray-900">{auditStats.successCount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <XCircle className="w-8 h-8 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Failures</p>
                  <p className="text-2xl font-semibold text-gray-900">{auditStats.failureCount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Warnings</p>
                  <p className="text-2xl font-semibold text-gray-900">{auditStats.warningCount.toLocaleString()}</p>
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
            
            {/* First Row: All 4 filters in one line */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Feature Category Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                  Category
                </label>
                <select
                  value={filters.featureCategory}
                  onChange={(e) => handleFilterChange('featureCategory', e.target.value)}
                  className="w-full px-3 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-gray-50 transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  <option value="PRODUCT_SECURITY">Product Security</option>
                  <option value="IT_SECURITY">IT Security</option>
                  <option value="OT_SECURITY">OT Security</option>
                </select>
              </div>

              {/* Features Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                  Features
                </label>
                <select
                  value={filters.feature}
                  onChange={(e) => handleFilterChange('feature', e.target.value)}
                  className="w-full px-3 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-gray-50 transition-all duration-200"
                >
                  <option value="">All Features</option>
                  <option value="threat_modeling">Threat Modeling</option>
                  <option value="security_training">Security Training</option>
                  <option value="penetration_testing">Penetration Testing</option>
                  <option value="vulnerability_assessment">Vulnerability Assessment</option>
                  <option value="sbom_management">SBOM Management</option>
                  <option value="incident_response">Incident Response</option>
                  <option value="compliance_audit">Compliance Audit</option>
                  <option value="code_review">Code Review</option>
                  <option value="architecture_review">Architecture Review</option>
                  <option value="security_monitoring">Security Monitoring</option>
                </select>
              </div>

              {/* Start Date */}
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
              
              {/* End Date */}
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
            </div>

            {/* Second Row: Status, Target Type, and Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <option value="Warning">Warning</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              {/* Target Type Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                  Target Type
                </label>
                <select
                  value={filters.targetType}
                  onChange={(e) => handleFilterChange('targetType', e.target.value)}
                  className="w-full px-3 py-2 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-gray-50 transition-all duration-200"
                >
                  <option value="">All Types</option>
                  <option value="User">User</option>
                  <option value="Project">Project</option>
                  <option value="Product">Product</option>
                  <option value="Tenant">Tenant</option>
                  <option value="ThreatModel">Threat Model</option>
                  <option value="Vulnerability">Vulnerability</option>
                  <option value="SecurityProject">Security Project</option>
                  <option value="ComplianceFramework">Compliance Framework</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search activity, target, actor..."
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

      {/* Audit Logs Table */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">
                Audit Logs ({totalLogs.toLocaleString()})
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Page {currentPage} of {totalPages}</span>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-gray-500">Loading audit logs...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <span className="ml-2 text-sm text-red-600">{error}</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Column Filters */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="grid grid-cols-8 gap-4">
                  {/* Date Filter */}
                  <div>
                    <input
                      type="text"
                      placeholder="Filter by date..."
                      className="w-full px-2 py-1 text-xs border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-200 bg-white"
                      onChange={(e) => handleColumnFilter('date', e.target.value)}
                    />
                  </div>
                  
                  {/* Action Filter */}
                  <div>
                    <input
                      type="text"
                      placeholder="Filter by action..."
                      className="w-full px-2 py-1 text-xs border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-200 bg-white"
                      onChange={(e) => handleColumnFilter('action', e.target.value)}
                    />
                  </div>
                  
                  {/* Resource Filter */}
                  <div>
                    <input
                      type="text"
                      placeholder="Filter by resource..."
                      className="w-full px-2 py-1 text-xs border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-200 bg-white"
                      onChange={(e) => handleColumnFilter('resource', e.target.value)}
                    />
                  </div>
                  
                  {/* Resource ID Filter */}
                  <div>
                    <input
                      type="text"
                      placeholder="Filter by ID..."
                      className="w-full px-2 py-1 text-xs border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-200 bg-white"
                      onChange={(e) => handleColumnFilter('resourceId', e.target.value)}
                    />
                  </div>
                  
                  {/* Severity Filter */}
                  <div>
                    <select
                      className="w-full px-2 py-1 text-xs border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-200 bg-white"
                      onChange={(e) => handleColumnFilter('severity', e.target.value)}
                    >
                      <option value="">All Severity</option>
                      <option value="CRITICAL">Critical</option>
                      <option value="ERROR">Error</option>
                      <option value="WARNING">Warning</option>
                      <option value="INFO">Info</option>
                      <option value="DEBUG">Debug</option>
                    </select>
                  </div>
                  
                  {/* Risk Level Filter */}
                  <div>
                    <select
                      className="w-full px-2 py-1 text-xs border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-200 bg-white"
                      onChange={(e) => handleColumnFilter('riskLevel', e.target.value)}
                    >
                      <option value="">All Risk</option>
                      <option value="CRITICAL">Critical</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                  
                  {/* Actor Filter */}
                  <div>
                    <input
                      type="text"
                      placeholder="Filter by actor..."
                      className="w-full px-2 py-1 text-xs border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-200 bg-white"
                      onChange={(e) => handleColumnFilter('actor', e.target.value)}
                    />
                  </div>
                  
                  {/* Details Filter */}
                  <div>
                    <input
                      type="text"
                      placeholder="Filter by details..."
                      className="w-full px-2 py-1 text-xs border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-200 bg-white"
                      onChange={(e) => handleColumnFilter('details', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {auditLogs
                    .filter((log) => {
                      // Apply column filters
                      if (columnFilters.date && !formatDate(log.date).toLowerCase().includes(columnFilters.date.toLowerCase())) {
                        return false;
                      }
                      if (columnFilters.action && !log.activity?.toLowerCase().includes(columnFilters.action.toLowerCase())) {
                        return false;
                      }
                      if (columnFilters.resource && !log.targetType?.toLowerCase().includes(columnFilters.resource.toLowerCase())) {
                        return false;
                      }
                      if (columnFilters.resourceId && !log.targetId?.toLowerCase().includes(columnFilters.resourceId.toLowerCase())) {
                        return false;
                      }
                      if (columnFilters.severity && log.severity !== columnFilters.severity) {
                        return false;
                      }
                      if (columnFilters.riskLevel && log.riskLevel !== columnFilters.riskLevel) {
                        return false;
                      }
                      if (columnFilters.actor && !log.actorName?.toLowerCase().includes(columnFilters.actor.toLowerCase()) && 
                          !log.actorEmail?.toLowerCase().includes(columnFilters.actor.toLowerCase())) {
                        return false;
                      }
                      if (columnFilters.details && !JSON.stringify(log.metadata || {}).toLowerCase().includes(columnFilters.details.toLowerCase())) {
                        return false;
                      }
                      return true;
                    })
                    .map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(log.date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Activity className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium">{log.activity}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Server className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="capitalize">{log.targetType || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {log.targetId || 'N/A'}
                        </code>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity ?? null)}`}>
                          {getSeverityIcon(log.severity ?? null)}
                          <span className="ml-1">{log.severity || 'INFO'}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(log.riskLevel ?? null)}`}>
                          {getRiskLevelIcon(log.riskLevel ?? null)}
                          <span className="ml-1">{log.riskLevel || 'LOW'}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium">{log.actorName || log.actorEmail || 'System'}</div>
                            {log.actorEmail && log.actorName && (
                              <div className="text-xs text-gray-500">{log.actorEmail}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-all duration-200"
                            onClick={() => showLogDetails(log)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {log.changes && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Modified</span>
                          )}
                          {log.metadata && (
                            <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">Details</span>
                          )}
                        </div>
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
