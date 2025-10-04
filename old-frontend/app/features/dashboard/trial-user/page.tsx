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
  Clock,
  Star,
  ArrowUpRight
} from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  tenant: string;
  isActive: boolean;
  lastLogin: string;
}

export default function TrialUserDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const trialMetrics = [
    {
      label: 'Trial Days Remaining',
      value: 12,
      change: -1,
      trend: 'down',
      icon: <Clock className="w-6 h-6" />,
      color: 'text-orange-600'
    },
    {
      label: 'Features Used',
      value: 3,
      change: 1,
      trend: 'up',
      icon: <Star className="w-6 h-6" />,
      color: 'text-blue-600'
    },
    {
      label: 'Security Scans',
      value: 8,
      change: 5,
      trend: 'up',
      icon: <Shield className="w-6 h-6" />,
      color: 'text-green-600'
    },
    {
      label: 'Team Members',
      value: 2,
      change: 0,
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'text-purple-600'
    }
  ];

  const trialFeatures = [
    {
      name: 'Threat Modeling',
      description: 'AI-powered threat analysis and risk assessment',
      used: true,
      limit: '5 projects',
      current: 2
    },
    {
      name: 'Vulnerability Scanning',
      description: 'Automated security scanning and reporting',
      used: true,
      limit: '10 scans/month',
      current: 8
    },
    {
      name: 'Compliance Reports',
      description: 'Generate compliance and audit reports',
      used: false,
      limit: '3 reports',
      current: 0
    },
    {
      name: 'Team Collaboration',
      description: 'Multi-user access and role management',
      used: true,
      limit: '3 users',
      current: 2
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUsers([
          {
            id: '1',
            firstName: 'Syed',
            lastName: 'Shamsheer',
            email: 'syed.shamsheer.ma@gmail.com',
            role: 'Trial User',
            tenant: 'Trial Users',
            isActive: true,
            lastLogin: '2025-01-27T10:30:00Z'
          },
          {
            id: '2',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: 'Trial User',
            tenant: 'Trial Users',
            isActive: true,
            lastLogin: '2025-01-27T09:15:00Z'
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
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        {/* Trial Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Trial Dashboard</h1>
              <p className="text-slate-600 mt-1">Welcome to your BlickTrack trial! You have <span className="font-semibold text-orange-600">12 days</span> remaining.</p>
            </div>
            <div className="text-right">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center">
                Upgrade to Pro
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Trial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {trialMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{metric.value.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className={metric.color}>{metric.icon}</div>
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
                <span className="text-sm text-slate-500 ml-1">vs last week</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Members */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Team Members</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite User
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
            <div className="divide-y divide-slate-200">
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
                        <p className="text-xs text-slate-500">{user.role} • {user.tenant}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Last login</p>
                        <p className="text-xs text-slate-500">{formatDate(user.lastLogin)}</p>
                      </div>
                      <div className="px-2 py-1 rounded-full text-xs font-medium">
                        {user.isActive ? 'Active' : 'Inactive'}
                      </div>
                      <button className="p-1 text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trial Features */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Trial Features</h2>
              <p className="text-sm text-slate-600 mt-1">Track your usage and explore available features</p>
            </div>
            <div className="divide-y divide-slate-200">
              {trialFeatures.map((feature, index) => (
                <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-slate-900">{feature.name}</h3>
                        {feature.used && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Usage</span>
                          <span>{feature.current}/{feature.limit}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(feature.current / parseInt(feature.limit)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <button className="ml-4 p-1 text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade Prompt */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to unlock the full potential?</h2>
              <p className="text-blue-100 mb-4">Upgrade to Pro and get unlimited access to all BlickTrack features, advanced analytics, and priority support.</p>
              <div className="flex space-x-4">
                <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors">
                  Upgrade to Pro
                </button>
                <button className="border border-blue-300 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="text-6xl opacity-20">🚀</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


