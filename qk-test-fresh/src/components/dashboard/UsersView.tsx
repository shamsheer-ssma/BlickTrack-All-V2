'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  CheckCircle, 
  XCircle, 
  Building,
  Mail,
  Shield,
  Edit,
  Trash2,
  MoreVertical,
  User as UserIcon,
  Settings,
  Key,
  Lock,
  Unlock,
  X
} from 'lucide-react';
import { apiService, User } from '@/lib/api';
import { usePermissions } from '@/hooks/usePermissions';

interface UsersData {
  users: User[];
  total: number;
  role: string;
  description: string;
}

export default function UsersView() {
  const { isPlatformAdmin, isTenantAdmin } = usePermissions();
  const [usersData, setUsersData] = useState<UsersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getUsers();
      setUsersData(data);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowRightPanel(true);
  };

  const handleCloseRightPanel = () => {
    setShowRightPanel(false);
    setSelectedUser(null);
  };

  const handleEditUser = () => {
    setShowEditModal(true);
  };

  const handleDeleteUser = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      // TODO: Implement delete user API call - This is dummy data, need to fetch from DB
      console.log('Deleting user:', selectedUser.id);
      // await apiService.deleteUser(selectedUser.id);
      
      // Refresh users list
      await loadUsers();
      setShowDeleteModal(false);
      setShowRightPanel(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  const handleRoleChange = async (newRole: string) => {
    if (!selectedUser) return;
    
    try {
      // TODO: Implement update user role API call - This is dummy data, need to fetch from DB
      console.log('Updating user role:', selectedUser.id, newRole);
      // await apiService.updateUserRole(selectedUser.id, newRole);
      
      // Refresh users list
      await loadUsers();
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role. Please try again.');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'text-red-600 bg-red-50';
      case 'PLATFORM_ADMIN': return 'text-purple-600 bg-purple-50';
      case 'TENANT_ADMIN': return 'text-blue-600 bg-blue-50';
      case 'END_USER': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'PLATFORM_ADMIN': return 'Platform Admin';
      case 'TENANT_ADMIN': return 'Tenant Admin';
      case 'END_USER': return 'User';
      default: return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsers = usersData?.users.filter(user => {
    const matchesSearch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full-width header */}
      <div className="bg-white border-b border-gray-200 relative z-40">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {isPlatformAdmin() ? 'All Users' : 'Users'}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isPlatformAdmin() ? 'All tenants' : 'Your tenant'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`px-6 py-6 transition-all duration-300 ${showRightPanel ? 'mr-96' : 'mr-0'}`}>
        {/* Stats Cards - Full width */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-xl font-bold text-gray-900">{usersData?.total || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-xl font-bold text-gray-900">
                  {usersData?.users.filter(u => u.isVerified).length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">MFA Enabled</p>
                <p className="text-xl font-bold text-gray-900">
                  {usersData?.users.filter(u => u.mfaEnabled).length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Building className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Tenants</p>
                <p className="text-xl font-bold text-gray-900">
                  {isPlatformAdmin() ? 
                    new Set(usersData?.users.map(u => u.tenant?.id).filter(Boolean)).size || 0 :
                    '1'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter - Azure style */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Filters</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Clear all
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="lg:w-48">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="PLATFORM_ADMIN">Platform Admin</option>
                  <option value="TENANT_ADMIN">Tenant Admin</option>
                  <option value="END_USER">User</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table - Azure style */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-900">
                Users ({filteredUsers.length})
              </h2>
              <div className="flex items-center space-x-2">
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Refresh
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Columns
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  {isPlatformAdmin() && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${selectedUser?.id === user.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {user.displayName?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.displayName || `${user.firstName} ${user.lastName}`.trim() || 'No Name'}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </td>
                    {isPlatformAdmin() && (
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.tenant?.name || 'No Tenant'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.tenant?.slug || ''}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {user.isVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm text-gray-900">
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                      {user.mfaEnabled && (
                        <div className="flex items-center mt-1">
                          <Shield className="w-3 h-3 text-blue-500 mr-1" />
                          <span className="text-xs text-blue-600">MFA</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserSelect(user);
                            handleEditUser();
                          }}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserSelect(user);
                            handleDeleteUser();
                          }}
                          className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination - Azure style */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{usersData?.total || 0}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                  1
                </button>
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                  2
                </button>
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                  3
                </button>
                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - User Details */}
      {showRightPanel && selectedUser && (
        <div className="fixed right-0 w-96 bg-white shadow-xl border-l border-gray-200 z-50" style={{ top: '80px', height: 'calc(100vh - 80px)' }}>
          <div className="flex flex-col h-full">
            {/* Panel Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={handleCloseRightPanel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto">
              {/* User Info */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xl font-medium text-blue-600">
                      {selectedUser.displayName?.charAt(0)?.toUpperCase() || selectedUser.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {selectedUser.displayName || `${selectedUser.firstName} ${selectedUser.lastName}`.trim() || 'No Name'}
                    </h4>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getRoleColor(selectedUser.role)}`}>
                      {getRoleDisplayName(selectedUser.role)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 border-b border-gray-200">
                <h5 className="text-sm font-medium text-gray-900 mb-4">Quick Actions</h5>
                <div className="space-y-2">
                  <button
                    onClick={handleEditUser}
                    className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <Edit className="w-4 h-4 mr-3" />
                    Edit User
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="w-4 h-4 mr-3" />
                    Delete User
                  </button>
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                    <Key className="w-4 h-4 mr-3" />
                    Reset Password
                  </button>
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                    {selectedUser.isVerified ? (
                      <Lock className="w-4 h-4 mr-3" />
                    ) : (
                      <Unlock className="w-4 h-4 mr-3" />
                    )}
                    {selectedUser.isVerified ? 'Suspend User' : 'Activate User'}
                  </button>
                </div>
              </div>

              {/* User Details */}
              <div className="p-6">
                <h5 className="text-sm font-medium text-gray-900 mb-4">User Information</h5>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase">Status</dt>
                    <dd className="mt-1 flex items-center">
                      {selectedUser.isVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-900">
                        {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase">MFA</dt>
                    <dd className="mt-1 flex items-center">
                      {selectedUser.mfaEnabled ? (
                        <Shield className="w-4 h-4 text-blue-500 mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400 mr-2" />
                      )}
                      <span className="text-sm text-gray-900">
                        {selectedUser.mfaEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase">Last Login</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedUser.lastLoginAt ? formatDate(selectedUser.lastLoginAt) : 'Never'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedUser.createdAt ? formatDate(selectedUser.createdAt) : 'N/A'}
                    </dd>
                  </div>
                  {isPlatformAdmin() && selectedUser.tenant && (
                    <div>
                      <dt className="text-xs font-medium text-gray-500 uppercase">Tenant</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedUser.tenant.name}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Role Management */}
              <div className="p-6 border-t border-gray-200">
                <h5 className="text-sm font-medium text-gray-900 mb-4">Role Management</h5>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                    Current Role
                  </label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {/* This is dummy data, need to fetch from DB */}
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="PLATFORM_ADMIN">Platform Admin</option>
                    <option value="TENANT_ADMIN">Tenant Admin</option>
                    <option value="END_USER">User</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete <strong>{selectedUser.displayName || selectedUser.email}</strong>? 
                This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">
                Edit user details for <strong>{selectedUser.displayName || selectedUser.email}</strong>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    defaultValue={selectedUser.displayName || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={selectedUser.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    defaultValue={selectedUser.role}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {/* This is dummy data, need to fetch from DB */}
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="PLATFORM_ADMIN">Platform Admin</option>
                    <option value="TENANT_ADMIN">Tenant Admin</option>
                    <option value="END_USER">User</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement save user changes - This is dummy data, need to fetch from DB
                  setShowEditModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
