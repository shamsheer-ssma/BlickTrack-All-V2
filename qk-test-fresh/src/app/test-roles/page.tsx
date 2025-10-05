'use client';

import React, { useState } from 'react';
import { apiService } from '@/lib/api';

interface UserRole {
  email: string;
  password: string;
  role: string;
  description: string;
}

const TEST_USERS: UserRole[] = [
  {
    email: 'admin@blicktrack.com',
    password: 'Syed@123',
    role: 'SUPER_ADMIN',
    description: 'Full platform access - can manage everything'
  },
  {
    email: 'admin.huawei@huawei.com',
    password: 'Syed@123',
    role: 'TENANT_ADMIN',
    description: 'Tenant-level access - can manage their organization only'
  },
  {
    email: 'user.one@blicktrack.com',
    password: 'Syed@123',
    role: 'END_USER',
    description: 'Basic user access - can view and use assigned features'
  }
];


interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

interface Permissions {
  [key: string]: boolean | string | number | object;
}

export default function TestRolesPage() {
  const [currentUser, setCurrentUser] = useState<UserRole | null>(null);
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [permissions, setPermissions] = useState<Permissions>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginAsUser = async (user: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      // Login
  const response = await apiService.login({ email: user.email, password: user.password });
      // Store token
      localStorage.setItem('token', response.access_token);
      // Set current user
      setCurrentUser(user);
      // Fetch dashboard data
      const [navData, permData] = await Promise.all([
        apiService.getRoleBasedNavigation(),
        apiService.getUserPermissions()
      ]);
      setNavigation(navData as NavigationItem[]);
      // Convert UserPermission[] to Permissions object keyed by feature slug
      const permissionsObj: Permissions = {};
      (permData as import('@/hooks/usePermissions').UserPermission[]).forEach((perm) => {
        if (perm.feature && perm.feature.slug) {
          permissionsObj[perm.feature.slug] = perm;
        }
      });
      setPermissions(permissionsObj);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Login failed');
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setNavigation([]);
    setPermissions({});
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🎯 Role-Based Dashboard Testing
        </h1>
        
        {/* User Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select User Role to Test:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEST_USERS.map((user, index) => (
              <button
                key={index}
                onClick={() => loginAsUser(user)}
                disabled={loading}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  currentUser?.email === user.email
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="font-semibold text-lg">{user.role}</div>
                <div className="text-sm text-gray-600 mt-1">{user.email}</div>
                <div className="text-xs text-gray-500 mt-2">{user.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Current User Info */}
        {currentUser && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Currently logged in as: {currentUser.role}
              </h2>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
            <div className="text-sm text-gray-600">{currentUser.email}</div>
            <div className="text-sm text-gray-500 mt-1">{currentUser.description}</div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="text-red-800 font-semibold">Error:</div>
            <div className="text-red-600">{error}</div>
          </div>
        )}

        {/* Navigation Menu */}
        {navigation.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">📋 Navigation Menu</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {navigation.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.path}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Permissions */}
        {Object.keys(permissions).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">🔐 User Permissions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(permissions).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-3 rounded-lg border ${
                    value ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="font-medium text-sm">{key}</div>
                  <div className={`text-lg font-bold ${
                    value ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {value ? '✅' : '❌'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-800 font-semibold">Loading...</div>
            <div className="text-blue-600">Please wait while we fetch dashboard data...</div>
          </div>
        )}
      </div>
    </div>
  );
}
