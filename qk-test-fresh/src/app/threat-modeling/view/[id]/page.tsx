'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Shield, ArrowLeft, Edit, Download, Share2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { BLICKTRACK_THEME } from '@/lib/theme';


interface Threat {
  id: number;
  name: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Mitigated' | 'Resolved';
  description: string;
}

interface ThreatModel {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Mitigated' | 'Resolved' | 'Active';
  tags: string[];
  createdAt: string;
  lastUpdated: string;
  threats: Threat[];
}

export default function ViewThreatModelPage() {
  const router = useRouter();
  const params = useParams();
  const [threatModel, setThreatModel] = useState<ThreatModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading threat model data
    setTimeout(() => {
      setThreatModel({
        id: params.id as string,
        name: 'Web Application Security Model',
        description: 'Comprehensive security threat model for our main web application covering authentication, authorization, data protection, and API security.',
        category: 'Web Application',
        priority: 'High',
        status: 'Active',
        tags: ['web', 'security', 'authentication', 'api'],
        createdAt: '2024-01-15',
        lastUpdated: '2024-01-20',
        threats: [
          {
            id: 1,
            name: 'SQL Injection',
            severity: 'High',
            status: 'Open',
            description: 'Potential SQL injection vulnerabilities in user input handling'
          },
          {
            id: 2,
            name: 'Cross-Site Scripting (XSS)',
            severity: 'Medium',
            status: 'Mitigated',
            description: 'XSS vulnerabilities in user-generated content display'
          },
          {
            id: 3,
            name: 'Authentication Bypass',
            severity: 'Critical',
            status: 'Open',
            description: 'Potential authentication bypass through session manipulation'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-red-600 bg-red-50';
      case 'Mitigated': return 'text-yellow-600 bg-yellow-50';
      case 'Resolved': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading threat model...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Breadcrumb - This will be handled by DashboardLayout */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/threat-modeling')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Threat Modeling
              </button>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push(`/threat-modeling/edit/${params.id}`)}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 
                  className="text-3xl font-bold text-gray-900"
                  style={{ fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary }}
                >
                  {threatModel?.name}
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(threatModel?.priority ?? 'Low')}`}>
                    {threatModel?.priority} Priority
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(threatModel?.status ?? 'Open')}`}>
                    {threatModel?.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Last updated: {threatModel?.lastUpdated}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 text-lg mb-4">
              {threatModel?.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {threatModel?.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Threats</p>
                  <p className="text-2xl font-bold text-gray-900">{threatModel?.threats.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {threatModel?.threats.filter((t) => t.status === 'Open').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mitigated</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {threatModel?.threats.filter((t) => t.status === 'Mitigated').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {threatModel?.threats.filter((t) => t.status === 'Resolved').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Threats Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Identified Threats</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Threat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {threatModel?.threats.map((threat) => (
                    <tr key={threat.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <AlertTriangle className="w-5 h-5 text-gray-400 mr-3" />
                          <div className="text-sm font-medium text-gray-900">
                            {threat.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(threat.severity)}`}>
                          {threat.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(threat.status)}`}>
                          {threat.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {threat.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
