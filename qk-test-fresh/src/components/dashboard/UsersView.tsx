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
  const [columnFilters, setColumnFilters] = useState({
    user: '',
    role: '',
    status: '',
    tenant: '',
    lastLogin: '',
    created: ''
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rightPanelMode, setRightPanelMode] = useState<'view' | 'edit'>('view');
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    role: '',
    isVerified: false,
    mfaEnabled: false
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getUsers();
      console.log('Users loaded:', data);
      console.log('First user data:', data.users?.[0]);
      
      // Debug: Check if user data has the required fields
      if (data.users && data.users.length > 0) {
        const firstUser = data.users[0];
        console.log('First user detailed data:', {
          id: firstUser.id,
          email: firstUser.email,
          firstName: firstUser.firstName,
          lastName: firstUser.lastName,
          displayName: firstUser.displayName,
          name: firstUser.name,
          role: firstUser.role,
          isVerified: firstUser.isVerified,
          mfaEnabled: firstUser.mfaEnabled
        });
      }
      
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
    setRightPanelMode('view');
    setShowRightPanel(true);
  };

  const handleCloseRightPanel = () => {
    setShowRightPanel(false);
    setSelectedUser(null);
  };

  const handleEditUser = () => {
    if (selectedUser) {
      console.log('Editing user from right panel:', selectedUser);
      console.log('Selected user firstName:', selectedUser.firstName);
      console.log('Selected user lastName:', selectedUser.lastName);
      console.log('Selected user displayName:', selectedUser.displayName);
      console.log('Selected user name (fallback):', selectedUser.name);
      
      // Extract name from email if firstName/lastName are empty
      const emailName = selectedUser.email.split('@')[0];
      const emailParts = emailName.split('.');
      const extractedFirstName = emailParts[0] || '';
      const extractedLastName = emailParts.slice(1).join(' ') || '';
      
      const formData = {
        firstName: selectedUser.firstName || extractedFirstName || '',
        lastName: selectedUser.lastName || extractedLastName || '',
        displayName: selectedUser.displayName || selectedUser.name || `${extractedFirstName} ${extractedLastName}`.trim() || emailName,
        email: selectedUser.email || '',
        role: selectedUser.role || '',
        isVerified: selectedUser.isVerified || false,
        mfaEnabled: selectedUser.mfaEnabled || false
      };
      
      console.log('Edit form data set to:', formData);
      setEditFormData(formData);
      setRightPanelMode('edit');
    }
  };

  const handleEditUserFromTable = (user: User) => {
    console.log('Editing user data:', user);
    console.log('User firstName:', user.firstName);
    console.log('User lastName:', user.lastName);
    console.log('User displayName:', user.displayName);
    console.log('User name (fallback):', user.name);
    
    setSelectedUser(user);
    
    // Extract name from email if firstName/lastName are empty
    const emailName = user.email.split('@')[0];
    const emailParts = emailName.split('.');
    const extractedFirstName = emailParts[0] || '';
    const extractedLastName = emailParts.slice(1).join(' ') || '';
    
    const formData = {
      firstName: user.firstName || extractedFirstName || '',
      lastName: user.lastName || extractedLastName || '',
      displayName: user.displayName || user.name || `${extractedFirstName} ${extractedLastName}`.trim() || emailName,
      email: user.email || '',
      role: user.role || '',
      isVerified: user.isVerified || false,
      mfaEnabled: user.mfaEnabled || false
    };
    
    console.log('Edit form data set to:', formData);
    setEditFormData(formData);
    setRightPanelMode('edit');
    setShowRightPanel(true);
  };

  const handleDeleteUser = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteUserFromTable = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      await apiService.deleteUser(selectedUser.id);
      
      // Refresh users list
      await loadUsers();
      setShowDeleteModal(false);
      setShowRightPanel(false);
      setSelectedUser(null);
    } catch (err: unknown) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
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

  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      await apiService.updateUser(selectedUser.id, editFormData);
      
      // Refresh users list
      await loadUsers();
      setRightPanelMode('view');
      // Update selectedUser with new data
      setSelectedUser(prev => prev ? { ...prev, ...editFormData } : null);
    } catch (err: unknown) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setRightPanelMode('view');
    // Reset form data to original user data
    if (selectedUser) {
      setEditFormData({
        firstName: selectedUser.firstName || '',
        lastName: selectedUser.lastName || '',
        displayName: selectedUser.displayName || selectedUser.name || '',
        email: selectedUser.email || '',
        role: selectedUser.role || '',
        isVerified: selectedUser.isVerified || false,
        mfaEnabled: selectedUser.mfaEnabled || false
      });
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
    const matchesUser = !columnFilters.user || 
      user.displayName?.toLowerCase().includes(columnFilters.user.toLowerCase()) ||
      user.email.toLowerCase().includes(columnFilters.user.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(columnFilters.user.toLowerCase());
    
    const matchesRole = !columnFilters.role || user.role.toLowerCase().includes(columnFilters.role.toLowerCase());
    
    const matchesStatus = !columnFilters.status || 
      (columnFilters.status.toLowerCase() === 'verified' && user.isVerified) ||
      (columnFilters.status.toLowerCase() === 'unverified' && !user.isVerified);
    
    const matchesTenant = !columnFilters.tenant || 
      (user.tenant?.name?.toLowerCase().includes(columnFilters.tenant.toLowerCase()));
    
    const matchesLastLogin = !columnFilters.lastLogin || 
      (user.lastLoginAt && formatDate(user.lastLoginAt).toLowerCase().includes(columnFilters.lastLogin.toLowerCase()));
    
    const matchesCreated = !columnFilters.created || 
      (user.createdAt && formatDate(user.createdAt).toLowerCase().includes(columnFilters.created.toLowerCase()));

    return matchesUser && matchesRole && matchesStatus && matchesTenant && matchesLastLogin && matchesCreated;
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

          <div className="bg-white p-4 rounded-lg shadow-sm">
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
          <div className="bg-white p-4 rounded-lg shadow-sm">
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
          <div className="bg-white p-4 rounded-lg shadow-sm">
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
          <div className="bg-white p-4 rounded-lg shadow-sm">
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


        {/* Users Table - Azure style with fixed height and table-specific scrolling */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}>
          {/* Table Header - Fixed */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className={`grid gap-4 ${isPlatformAdmin() ? 'grid-cols-7' : 'grid-cols-6'}`}>
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">User</div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={columnFilters.user}
                  onChange={(e) => handleColumnFilterChange('user', e.target.value)}
                  className="w-full px-2 py-1 text-xs border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Role</div>
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={columnFilters.role}
                  onChange={(e) => handleColumnFilterChange('role', e.target.value)}
                  className="w-full px-2 py-1 text-xs border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>
              {isPlatformAdmin() && (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</div>
                  <input
                    type="text"
                    placeholder="Search tenants..."
                    value={columnFilters.tenant}
                    onChange={(e) => handleColumnFilterChange('tenant', e.target.value)}
                    className="w-full px-2 py-1 text-xs border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </div>
              )}
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</div>
                <input
                  type="text"
                  placeholder="verified/unverified"
                  value={columnFilters.status}
                  onChange={(e) => handleColumnFilterChange('status', e.target.value)}
                  className="w-full px-2 py-1 text-xs border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</div>
                <input
                  type="text"
                  placeholder="Search dates..."
                  value={columnFilters.lastLogin}
                  onChange={(e) => handleColumnFilterChange('lastLogin', e.target.value)}
                  className="w-full px-2 py-1 text-xs border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created</div>
                <input
                  type="text"
                  placeholder="Search dates..."
                  value={columnFilters.created}
                  onChange={(e) => handleColumnFilterChange('created', e.target.value)}
                  className="w-full px-2 py-1 text-xs border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</div>
                <div className="h-6"></div>
              </div>
            </div>
          </div>
          
          {/* Scrollable Table Body */}
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 border-t border-gray-200" style={{ height: 'calc(100% - 80px)' }}>
            <table className="min-w-full">
              <tbody className="bg-white">
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
                            {user.displayName || 
                             (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}`.trim() : '') ||
                             user.name || 
                             'No Name'}
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
                            handleEditUserFromTable(user);
                          }}
                          className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUserFromTable(user);
                          }}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-200"
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
        </div>
        
        {/* Pagination - Azure style */}
        <div className="bg-white rounded-lg shadow-sm mt-4">
          <div className="px-4 py-3 bg-gray-50">
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
        <div 
          className="absolute right-0 w-96 z-50 transition-all duration-300 rounded-l-xl flex flex-col"
          style={{ 
            top: '192px', // 28 lines down from header (80px + 112px)
            height: 'calc(100vh - 192px)', // Full viewport height minus header and offset
            backgroundColor: 'white',
            boxShadow: '-2px 0 4px rgba(0,0,0,0.1)'
          }}
        >
          <div className="flex flex-col h-full overflow-hidden">
            {/* Panel Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {rightPanelMode === 'edit' ? 'Edit User' : 'User Details'}
                </h3>
                <div className="flex items-center space-x-2">
                  {rightPanelMode === 'edit' && (
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-gray-600"
                      title="Cancel Edit"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleCloseRightPanel}
                    className="text-gray-400 hover:text-gray-600"
                    title="Close Panel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {rightPanelMode === 'edit' ? (
                /* Edit Mode */
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Personal Information</h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            value={editFormData.firstName}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            value={editFormData.lastName}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Display Name</label>
                        <input
                          type="text"
                          value={editFormData.displayName}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, displayName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Account Settings */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Account Settings</h4>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                        <select
                          value={editFormData.role}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="SUPER_ADMIN">Super Admin</option>
                          <option value="PLATFORM_ADMIN">Platform Admin</option>
                          <option value="TENANT_ADMIN">Tenant Admin</option>
                          <option value="END_USER">User</option>
                        </select>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isVerified"
                            checked={editFormData.isVerified}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, isVerified: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="isVerified" className="ml-2 text-sm text-gray-700">
                            Email Verified
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="mfaEnabled"
                            checked={editFormData.mfaEnabled}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, mfaEnabled: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="mfaEnabled" className="ml-2 text-sm text-gray-700">
                            Multi-Factor Authentication Enabled
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveUser}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
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
                          {selectedUser.displayName || 
                           (selectedUser.firstName && selectedUser.lastName ? `${selectedUser.firstName} ${selectedUser.lastName}`.trim() : '') ||
                           selectedUser.name || 
                           'No Name'}
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
                        className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-200 rounded-lg border border-transparent transition-all duration-200"
                      >
                        <Edit className="w-4 h-4 mr-3" />
                        Edit User
                      </button>
                      <button
                        onClick={handleDeleteUser}
                        className="w-full flex items-center px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg border border-transparent transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Delete User
                      </button>
                      <button className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-200 rounded-lg border border-transparent transition-all duration-200">
                        <Key className="w-4 h-4 mr-3" />
                        Reset Password
                      </button>
                      <button className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-200 rounded-lg border border-transparent transition-all duration-200">
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
                        className="w-full px-3 py-2.5 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-gray-50 transition-all duration-200"
                      >
                        {/* This is dummy data, need to fetch from DB */}
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="PLATFORM_ADMIN">Platform Admin</option>
                        <option value="TENANT_ADMIN">Tenant Admin</option>
                        <option value="END_USER">User</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Center Screen */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-200 animate-in zoom-in duration-300 pointer-events-auto">
            <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="px-6 py-6">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete <strong className="text-gray-900">{selectedUser.displayName || selectedUser.email}</strong>? 
                This action cannot be undone and will permanently remove the user from the system.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
              >
                {loading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
