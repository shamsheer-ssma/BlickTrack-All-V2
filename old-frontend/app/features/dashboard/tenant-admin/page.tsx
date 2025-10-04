'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Users, 
  Building2, 
  Shield, 
  Activity, 
  Search,
  Plus,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Settings,
  Eye,
  Edit
} from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
  lastLogin: string;
}

interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  status: string;
  lastScan: string;
}

export default function TenantAdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const tenantMetrics = [
    {
      label: 'Organization Users',
      value: 45,
      change: 8.2,
      trend: 'up',
      icon: <Users className="w-6 h-6" />
    },
    {
      label: 'Security Scans',
      value: 127,
      change: 15.3,
      trend: 'up',
      icon: <Shield className="w-6 h-6" />
    },
    {
      label: 'Active Projects',
      value: 12,
      change: 2.1,
      trend: 'up',
      icon: <Building2 className="w-6 h-6" />
    },
    {
      label: 'Compliance Score',
      value: 94.2,
      change: 1.8,
      trend: 'up',
      icon: <Activity className="w-6 h-6" />
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUsers([
          {
            id: '1',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@utc.com',
            role: 'Security Manager',
            department: 'Security',
            isActive: true,
            lastLogin: '2025-01-27T10:30:00Z'
          },
          {
            id: '2',
            firstName: 'Mike',
            lastName: 'Chen',
            email: 'mike.chen@utc.com',
            role: 'Security Analyst',
            department: 'Security',
            isActive: true,
            lastLogin: '2025-01-27T09:15:00Z'
          },
          {
            id: '3',
            firstName: 'Emily',
            lastName: 'Davis',
            email: 'emily.davis@utc.com',
            role: 'Developer',
            department: 'Engineering',
            isActive: false,
            lastLogin: '2025-01-26T16:45:00Z'
          },
          {
            id: '4',
            firstName: 'Alex',
            lastName: 'Rodriguez',
            email: 'alex.rodriguez@utc.com',
            role: 'QA Engineer',
            department: 'Quality Assurance',
            isActive: true,
            lastLogin: '2025-01-27T08:20:00Z'
          }
        ]);

        setSecurityMetrics([
          {
            id: '1',
            name: 'Web Application Scan',
            value: 23,
            status: 'completed',
            lastScan: '2025-01-27T08:00:00Z'
          },
          {
            id: '2',
            name: 'Infrastructure Scan',
            value: 7,
            status: 'completed',
            lastScan: '2025-01-26T20:00:00Z'
          },
          {
            id: '3',
            name: 'Code Analysis',
            value: 15,
            status: 'running',
            lastScan: '2025-01-27T09:00:00Z'
          },
          {
            id: '4',
            name: 'Compliance Check',
            value: 2,
            status: 'completed',
            lastScan: '2025-01-25T14:00:00Z'
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Tenant Administration</h1>
          <p className="text-slate-600">Manage your organization&apos;s security operations and team members</p>
        </div>

        {/* Tenant Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {tenantMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{metric.value.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600">{metric.icon}</div>
                </div>
              </div>
              <div className="flex items-center mt-4">
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(metric.change)}%
                </span>
                <span className="text-sm text-slate-500 ml-1">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Management */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Team Management</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </button>
              </div>
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-600">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-slate-600">{user.email}</p>
                        <p className="text-xs text-slate-500">{user.role} • {user.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Last login</p>
                        <p className="text-xs text-slate-500">{formatDate(user.lastLogin)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </div>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Operations */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Security Operations</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  New Scan
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-200">
              {securityMetrics.map((metric) => (
                <div key={metric.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-slate-900">{metric.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                          {metric.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        {metric.value} issues found
                      </p>
                      <p className="text-xs text-slate-500">
                        Last scan: {formatDate(metric.lastScan)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Security scan completed for Production environment</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">New team member Alex Rodriguez added to Quality Assurance</p>
                  <p className="text-xs text-slate-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Compliance report generated for Q4 2024 audit</p>
                  <p className="text-xs text-slate-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
