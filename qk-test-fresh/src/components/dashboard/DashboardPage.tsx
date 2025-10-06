'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Download,
  Plus,
  RefreshCw,
  Server,
  Users,
  BarChart3,
  Shield,
  Settings,
  Building
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiService, User } from '@/lib/api';
import { usePermissions } from '@/hooks/usePermissions';
import FeatureCard from '@/components/ui/FeatureCard';
// import { BLICKTRACK_THEME } from '@/lib/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  // trend?: number[]; // Removed unused prop
  color?: string;
}

interface DashboardData {
  stats: {
    totalProjects: number;
    activeProjects: number;
    securityAlerts: number;
    systemHealth: {
      status: 'healthy' | 'warning' | 'critical';
      uptime: number;
    };
    revenue: number;
    users: number;
  };
  recentActivity: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    type: 'security' | 'system' | 'user' | 'project';
  }>;
  projects: Array<{
    id: string;
    name: string;
    status: 'active' | 'planning' | 'completed' | 'on-hold';
    progress: number;
    teamSize: number;
    budget: number;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  performance: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  charts: {
    revenue: Array<{ month: string; revenue: number; growth: number }>;
    users: Array<{ month: string; users: number; newUsers: number }>;
    alerts: Array<{ category: string; count: number; color: string }>;
  };
}

function StatCard({ title, value, change, changeType, icon, color = 'blue' }: StatCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600 bg-green-50';
      case 'decrease': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl bg-${color}-50`}>
              <div className={`w-6 h-6 text-${color}-600`}>
                {icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">{title}</p>
              <p className="text-2xl font-bold text-blue-900">{value}</p>
              {change && (
                <p className={`text-sm font-medium ${getChangeColor()}`}>
                  {changeType === 'increase' && '↗'}
                  {changeType === 'decrease' && '↘'}
                  {changeType === 'neutral' && '→'}
                  {change}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Multi-tenant feature control
  const {
    // user: permissionUser,
    availableFeatures,
    // canAccessFeature,
    canEditFeature,
    canDeleteFeature,
    isPlatformAdmin,
    isTenantAdmin,
    // isUser: isRegularUser,
    // isLoading: permissionsLoading,
    // error: permissionsError
  } = usePermissions();

  useEffect(() => {
    // Check authentication using API service
    if (!apiService.isAuthenticated()) {
      window.location.href = '/';
      return;
    }

    // Get user data from API service
    const userData = apiService.getCurrentUser();
    if (userData) {
      setUser(userData);
    }

    // Load dashboard data
    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      window.location.href = '/';
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call with realistic data
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockData: DashboardData = {
        stats: {
          totalProjects: 47,
          activeProjects: 32,
          securityAlerts: 8,
          systemHealth: {
            status: 'healthy',
            uptime: 99.8
          },
          revenue: 2847500,
          users: 1247
        },
        recentActivity: [
          {
            id: '1',
            title: 'Security Alert Detected',
            description: 'Unusual login attempt from unknown IP address',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            severity: 'high',
            type: 'security'
          },
          {
            id: '2',
            title: 'New Project Created',
            description: 'E-commerce Platform Security Audit initiated',
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            severity: 'low',
            type: 'project'
          },
          {
            id: '3',
            title: 'System Update Completed',
            description: 'Database optimization completed successfully',
            timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
            severity: 'low',
            type: 'system'
          },
          {
            id: '4',
            title: 'User Access Granted',
            description: 'New team member added to development project',
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            severity: 'medium',
            type: 'user'
          }
        ],
        projects: [
          {
            id: '1',
            name: 'E-commerce Security Audit',
            status: 'active',
            progress: 78,
            teamSize: 5,
            budget: 250000,
            dueDate: '2024-12-15',
            priority: 'high'
          },
          {
            id: '2',
            name: 'Healthcare Data Protection',
            status: 'planning',
            progress: 25,
            teamSize: 8,
            budget: 500000,
            dueDate: '2024-12-30',
            priority: 'high'
          },
          {
            id: '3',
            name: 'Financial Services Compliance',
            status: 'active',
            progress: 45,
            teamSize: 6,
            budget: 350000,
            dueDate: '2024-12-20',
            priority: 'medium'
          },
          {
            id: '4',
            name: 'Retail Chain Network Security',
            status: 'completed',
            progress: 100,
            teamSize: 4,
            budget: 180000,
            dueDate: '2024-11-30',
            priority: 'low'
          }
        ],
        performance: {
          cpu: 45,
          memory: 67,
          disk: 32,
          network: 23
        },
        charts: {
          revenue: [
            { month: 'Jan', revenue: 250000, growth: 12 },
            { month: 'Feb', revenue: 280000, growth: 8 },
            { month: 'Mar', revenue: 320000, growth: 15 },
            { month: 'Apr', revenue: 290000, growth: -5 },
            { month: 'May', revenue: 350000, growth: 18 },
            { month: 'Jun', revenue: 380000, growth: 22 }
          ],
          users: [
            { month: 'Jan', users: 1200, newUsers: 45 },
            { month: 'Feb', users: 1220, newUsers: 20 },
            { month: 'Mar', users: 1240, newUsers: 35 },
            { month: 'Apr', users: 1235, newUsers: 15 },
            { month: 'May', users: 1245, newUsers: 28 },
            { month: 'Jun', users: 1247, newUsers: 12 }
          ],
          alerts: [
            { category: 'Critical', count: 3, color: '#ef4444' },
            { category: 'High', count: 5, color: '#f97316' },
            { category: 'Medium', count: 12, color: '#eab308' },
            { category: 'Low', count: 8, color: '#22c55e' }
          ]
        }
      };

      setDashboardData(mockData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Loading enterprise dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Failed to load dashboard data'}</p>
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Retry Loading
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Enterprise Dashboard</h1>
            <p className="text-blue-700 mt-1">
              Welcome back, {user?.displayName || user?.firstName || 'User'}! Here&apos;s your enterprise overview.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Export dashboard data as JSON
                const dataStr = JSON.stringify(dashboardData, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = `enterprise-dashboard-${new Date().toISOString().split('T')[0]}.json`;

                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadDashboardData}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
            >
              Logout
            </motion.button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard
            title="Total Projects"
            value={dashboardData.stats.totalProjects}
            change="+12% from last month"
            changeType="increase"
            icon={<BarChart3 className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Active Projects"
            value={dashboardData.stats.activeProjects}
            change={`${Math.round((dashboardData.stats.activeProjects / dashboardData.stats.totalProjects) * 100)}% of total`}
            changeType="neutral"
            icon={<Activity className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Security Alerts"
            value={dashboardData.stats.securityAlerts}
            change={`${dashboardData.stats.securityAlerts} require attention`}
            changeType={dashboardData.stats.securityAlerts > 5 ? "increase" : "decrease"}
            icon={<AlertTriangle className="w-6 h-6" />}
            color="red"
          />
          <StatCard
            title="System Health"
            value={`${dashboardData.stats.systemHealth.uptime}%`}
            change={dashboardData.stats.systemHealth.status === 'healthy' ? 'Excellent' : 'Good'}
            changeType="increase"
            icon={<Server className="w-6 h-6" />}
            color="emerald"
          />
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Revenue Growth</h3>
                <p className="text-sm text-blue-700">Monthly revenue performance</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Revenue</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.charts.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Users Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">User Growth</h3>
                <p className="text-sm text-blue-700">Monthly user acquisition</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Total Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">New Users</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.charts.users}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  formatter={(value: number, name: string) => [formatNumber(value), name === 'users' ? 'Total Users' : 'New Users']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-blue-900">Recent Activity</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    activity.severity === 'critical' ? 'bg-red-500' :
                    activity.severity === 'high' ? 'bg-orange-500' :
                    activity.severity === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Projects Overview */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Manage Projects
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.projects.slice(0, 3).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {project.name}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' :
                      project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ delay: 0.3 + (0.1 * index), duration: 0.8 }}
                        className={`h-2 rounded-full ${
                          project.progress > 75 ? 'bg-green-500' :
                          project.progress > 50 ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {project.teamSize} members
                    </span>
                    <span>{formatCurrency(project.budget)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* System Performance */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">System Performance</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Healthy</span>
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(dashboardData.performance).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      key === 'cpu' ? 'bg-blue-500' :
                      key === 'memory' ? 'bg-green-500' :
                      key === 'disk' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key} Usage
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ delay: 0.3 + (0.1 * index), duration: 0.8 }}
                        className={`h-2 rounded-full ${
                          value > 80 ? 'bg-red-500' :
                          value > 60 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-8">
                      {value}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Multi-Tenant Feature Cards */}
          {availableFeatures && availableFeatures.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Available Features</h3>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    {availableFeatures.length} feature{availableFeatures.length !== 1 ? 's' : ''} available
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <FeatureCard
                      feature={feature}
                      canEdit={canEditFeature(feature.slug)}
                      canDelete={canDeleteFeature(feature.slug)}
                      onEdit={(feature) => {
                        console.log('Edit feature:', feature);
                        // Handle feature edit
                      }}
                      onDelete={(feature) => {
                        console.log('Delete feature:', feature);
                        // Handle feature delete
                      }}
                      onClick={(feature) => {
                        console.log('Navigate to feature:', feature);
                        // Navigate to feature page
                        window.location.href = `/${feature.slug}`;
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Role-based Admin Section */}
          {(isPlatformAdmin() || isTenantAdmin()) && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Administration</h3>
                <div className="flex items-center space-x-2">
                  {isPlatformAdmin() ? (
                    <Building className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Settings className="w-5 h-5 text-blue-600" />
                  )}
                  <span className="text-sm text-gray-600">
                    {isPlatformAdmin() ? 'Platform Features' : 'Tenant Admin'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isPlatformAdmin() && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer"
                      onClick={() => window.location.href = '/platform-admin'}
                    >
                      <div className="flex items-center space-x-3">
                        <Building className="w-6 h-6 text-purple-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Manage Tenants</h4>
                          <p className="text-sm text-gray-600">View and manage all tenants</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer"
                      onClick={() => window.location.href = '/system-health'}
                    >
                      <div className="flex items-center space-x-3">
                        <Server className="w-6 h-6 text-purple-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">System Health</h4>
                          <p className="text-sm text-gray-600">Monitor system performance</p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
                
                {(isPlatformAdmin() || isTenantAdmin()) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => window.location.href = '/tenant-admin'}
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Manage Users</h4>
                        <p className="text-sm text-gray-600">View and manage tenant users</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
