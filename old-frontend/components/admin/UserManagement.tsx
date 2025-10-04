'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Key, 
  Building2,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import DataTable, { Column } from '@/components/data-table/DataTable';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  jobTitle: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
  tenant: {
    id: string;
    name: string;
    plan: string;
  };
  organization: {
    id: string;
    name: string;
  } | null;
  fullName: string;
  status: string;
  lastLogin: string;
  joinedDate: string;
}

interface UserManagementProps {
  tenantId?: string;
  tenantName?: string;
}

export default function UserManagement({ tenantId, tenantName }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [USER MANAGEMENT] Fetching users from API...');
      const url = tenantId ? `/api/admin/users?tenantId=${tenantId}` : '/api/admin/users';
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ [USER MANAGEMENT] Loaded ${data.data.length} users`);
        setUsers(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('❌ [USER MANAGEMENT] Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [tenantId]);

  const columns: Column<User>[] = [
    {
      key: 'fullName',
      label: 'Name',
      sortable: true,
      searchable: true,
      width: '200px',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.fullName}</div>
            <div className="text-sm text-gray-500">{row.displayName}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      searchable: true,
      width: '250px',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-sm font-medium text-gray-900">{value}</div>
            {row.isEmailVerified ? (
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </div>
            ) : (
              <div className="flex items-center text-xs text-orange-600">
                <XCircle className="w-3 h-3 mr-1" />
                Unverified
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'tenant',
      label: 'Tenant',
      sortable: true,
      searchable: true,
      width: '180px',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-sm font-medium text-gray-900">{value.name}</div>
            <div className="text-xs text-gray-500 capitalize">{value.plan}</div>
          </div>
        </div>
      )
    },
    {
      key: 'jobTitle',
      label: 'Role',
      sortable: true,
      searchable: true,
      width: '150px',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{value || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      searchable: true,
      width: '100px',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      sortable: true,
      searchable: true,
      width: '120px',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{value}</span>
        </div>
      )
    },
    {
      key: 'joinedDate',
      label: 'Joined',
      sortable: true,
      searchable: true,
      width: '120px',
      render: (value) => (
        <span className="text-sm text-gray-500">{value}</span>
      )
    }
  ];

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    console.log('👤 [USER MANAGEMENT] Selected user:', user.email);
  };

  const handleUserAction = (action: string, user: User) => {
    console.log(`🔧 [USER MANAGEMENT] Action: ${action} on user: ${user.email}`);
    // TODO: Implement user actions (edit, delete, view details, etc.)
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-400 mr-2" />
            <h3 className="text-sm font-medium text-red-800">Error Loading Users</h3>
          </div>
          <p className="mt-1 text-sm text-red-700">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-3 text-blue-600" />
              {tenantName ? `${tenantName} - User Management` : 'User Management'}
            </h1>
            <p className="text-gray-600 mt-1">
              {tenantName 
                ? `Manage users, roles, and permissions for ${tenantName}`
                : 'Manage users, roles, and permissions across all tenants'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchUsers}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Refresh
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Mail className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.isEmailVerified).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tenants</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(users.map(u => u.tenant.name)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={users}
        columns={columns}
        loading={loading}
        onRefresh={fetchUsers}
        onRowClick={handleRowClick}
        className="shadow-sm"
      />

      {/* User Details Sidebar (when a user is selected) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
          <div className="bg-white w-96 h-full shadow-xl overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{selectedUser.fullName}</h3>
                <p className="text-gray-500">{selectedUser.email}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Job Title</label>
                  <p className="text-gray-900">{selectedUser.jobTitle || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Tenant</label>
                  <p className="text-gray-900">{selectedUser.tenant.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedUser.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Email Verified</label>
                  <div className="flex items-center">
                    {selectedUser.isEmailVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <span className={selectedUser.isEmailVerified ? 'text-green-600' : 'text-red-600'}>
                      {selectedUser.isEmailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Login</label>
                  <p className="text-gray-900">{selectedUser.lastLogin}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Joined Date</label>
                  <p className="text-gray-900">{selectedUser.joinedDate}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Edit className="w-4 h-4 mr-2 inline" />
                    Edit
                  </button>
                  <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                    <Trash2 className="w-4 h-4 mr-2 inline" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
