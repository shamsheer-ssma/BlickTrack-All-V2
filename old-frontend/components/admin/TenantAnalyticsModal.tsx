'use client';

import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading';
import { useToastActions } from '@/components/ui/toast';
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Shield,
  Database,
  Clock,
  AlertCircle
} from 'lucide-react';

interface TenantAnalytics {
  tenant: {
    id: string;
    name: string;
    plan: string;
    createdAt: string;
    isActive: boolean;
  };
  metrics: {
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    avgSessionDuration: number;
    lastActivity: string;
    storageUsed: number;
    storageLimit: number;
    apiCalls: number;
    errorRate: number;
  };
  trends: {
    userGrowth: Array<{ date: string; count: number }>;
    activityTrend: Array<{ date: string; sessions: number }>;
    storageUsage: Array<{ date: string; used: number }>;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
}

interface TenantAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: {
    id: string;
    name: string;
    plan: string;
    userCount: number;
  } | null;
}

export function TenantAnalyticsModal({ isOpen, onClose, tenant }: TenantAnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<TenantAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { error: showError } = useToastActions();

  useEffect(() => {
    if (isOpen && tenant) {
      fetchAnalytics();
    }
  }, [isOpen, tenant, timeRange]);

  const fetchAnalytics = async () => {
    if (!tenant) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/tenants/${tenant.id}/analytics?range=${timeRange}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      } else {
        setError(data.error || 'Failed to fetch analytics');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  if (!isOpen || !tenant) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Analytics - ${tenant.name}`}
      size="xl"
    >
      <ModalBody>
        {/* Time Range Selector */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm font-medium rounded ${
                  timeRange === range
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
          
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        <LoadingState
          loading={loading}
          error={error}
          empty={!analytics}
          emptyText="No analytics data available"
        >
          {analytics && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Users</p>
                      <p className="text-2xl font-bold text-blue-900">{analytics.metrics.totalUsers}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    {getTrendIcon(analytics.metrics.totalUsers, analytics.metrics.totalUsers - 5)}
                    <span className="ml-1 text-gray-600">+5 this month</span>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Active Users</p>
                      <p className="text-2xl font-bold text-green-900">{analytics.metrics.activeUsers}</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    {getTrendIcon(analytics.metrics.activeUsers, analytics.metrics.activeUsers - 2)}
                    <span className="ml-1 text-gray-600">+2 this week</span>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Avg Session</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {formatDuration(analytics.metrics.avgSessionDuration)}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    {getTrendIcon(analytics.metrics.avgSessionDuration, analytics.metrics.avgSessionDuration - 5)}
                    <span className="ml-1 text-gray-600">+5m this month</span>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Storage Used</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {formatBytes(analytics.metrics.storageUsed)}
                      </p>
                    </div>
                    <Database className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(analytics.metrics.storageUsed / analytics.metrics.storageLimit) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {formatBytes(analytics.metrics.storageLimit)} limit
                    </p>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* User Growth Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                      <p>Chart visualization would go here</p>
                      <p className="text-sm">Data points: {analytics.trends.userGrowth.length}</p>
                    </div>
                  </div>
                </div>

                {/* Activity Trend Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Trend</h3>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Activity className="w-12 h-12 mx-auto mb-2" />
                      <p>Chart visualization would go here</p>
                      <p className="text-sm">Data points: {analytics.trends.activityTrend.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {analytics.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        activity.type === 'error' ? 'bg-red-100 text-red-800' :
                        activity.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {activity.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </LoadingState>
      </ModalBody>
      
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={fetchAnalytics}>
          Refresh Data
        </Button>
      </ModalFooter>
    </Modal>
  );
}

