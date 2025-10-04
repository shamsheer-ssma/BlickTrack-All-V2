/**
 * TenantManagementModal.tsx
 * 
 * 3-Column Tenant Management Modal Component
 * 
 * Features:
 * - 3-column layout: Tenants → Users → Details
 * - Interactive tenant and user selection
 * - Edit/Delete actions with hover effects
 * - Professional UI/UX with status indicators
 * - Real-time data fetching from database
 * - Accessibility support with keyboard navigation
 * 
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-01-30
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  ChevronDown,
  ChevronRight,
  Settings,
  Eye,
  EyeOff,
  Users,
  Building,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

interface TenantManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTenantUpdate: () => void;
  onTenantSelect?: (tenant: any) => void;
  onUserSelect?: (user: any) => void;
  onEditTenant?: (tenant: any) => void;
  onEditUser?: (user: any) => void;
  onDeleteTenant?: (tenantId: string, tenantName: string) => void;
  onDeleteUser?: (userId: string, userName: string) => void;
  selectedTenant?: any;
  selectedUser?: any;
}

export const TenantManagementModal: React.FC<TenantManagementModalProps> = ({
  isOpen,
  onClose,
  onTenantUpdate,
  onTenantSelect,
  onUserSelect,
  onEditTenant,
  onEditUser,
  onDeleteTenant,
  onDeleteUser,
  selectedTenant,
  selectedUser
}) => {
  const [tenants, setTenants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showAddTenant, setShowAddTenant] = useState(false);

  const getTenantIcon = (tenantType: string) => {
    const iconMap: { [key: string]: any } = {
      'enterprise': '🏢',
      'startup': '🚀',
      'government': '🏛️',
      'nonprofit': '🤝',
      'education': '🎓',
      'healthcare': '🏥'
    };
    return iconMap[tenantType] || '🏢';
  };

  const getUserIcon = (userRole: string) => {
    const iconMap: { [key: string]: any } = {
      'admin': '👑',
      'manager': '👨‍💼',
      'user': '👤',
      'viewer': '👁️',
      'guest': '👋'
    };
    return iconMap[userRole] || '👤';
  };

  useEffect(() => {
    if (isOpen) {
      fetchTenants();
    }
  }, [isOpen]);

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/admin/tenants');
      const result = await response.json();
      
      if (result.success) {
        setTenants(result.data);
      } else {
        console.error('Failed to fetch tenants:', result.error);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const fetchUsers = async (tenantId: string) => {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/users`);
      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data);
      } else {
        console.error('Failed to fetch users:', result.error);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleTenantSelect = (tenant: any) => {
    onTenantSelect?.(tenant);
    fetchUsers(tenant.id);
    setUsers([]); // Clear users when selecting new tenant
  };

  const handleUserSelect = (user: any) => {
    onUserSelect?.(user);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Tenant Management
              </h2>
              <p className="text-sm text-gray-500">
                Manage tenants and their users
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - 3 Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Column 1: Tenants List */}
          <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Tenants ({tenants.length})
              </h3>
              <button
                onClick={() => setShowAddTenant(true)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>

            {tenants.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  No tenants yet
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Add tenants to get started
                </p>
                <button
                  onClick={() => setShowAddTenant(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Add First Tenant
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {tenants.map(tenant => (
                  <div
                    key={tenant.id}
                    className="group"
                  >
                    <div
                      onClick={() => handleTenantSelect(tenant)}
                      className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between rounded-md border cursor-pointer ${
                        selectedTenant?.id === tenant.id 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-5 h-5 rounded-md flex items-center justify-center text-xs bg-blue-100"
                        >
                          {getTenantIcon(tenant.type || 'enterprise')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {tenant.name}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            {tenant.subscriptionPlan || 'Free Plan'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {tenant.isActive ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTenant?.(tenant);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Edit Tenant"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                onEditTenant?.(tenant);
                              }
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTenant?.(tenant.id, tenant.name);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete Tenant"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                onDeleteTenant?.(tenant.id, tenant.name);
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Users List */}
          <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
            {selectedTenant ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Users ({users.length})
                  </h3>
                  <button
                    onClick={() => {/* TODO: Add user */}}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>

                {users.length > 0 ? (
                  <div className="space-y-1">
                    {users.map(user => (
                      <div
                        key={user.id}
                        className="group"
                      >
                        <div
                          onClick={() => handleUserSelect(user)}
                          className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between rounded-md border cursor-pointer ${
                            selectedUser?.id === user.id 
                              ? 'bg-green-50 border-green-200 shadow-sm' 
                              : 'border-transparent hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-5 h-5 rounded-md flex items-center justify-center text-xs bg-gray-100"
                            >
                              {getUserIcon(user.role)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {user.name}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {user.isActive ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-500" />
                            )}
                            
                            {/* Action Buttons */}
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditUser?.(user);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                title="Edit User"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEditUser?.(user);
                                  }
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </div>
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteUser?.(user.id, user.name);
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                title="Delete User"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDeleteUser?.(user.id, user.name);
                                  }
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      No users
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Add users to this tenant
                    </p>
                    <button
                      onClick={() => {/* TODO: Add user */}}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Add User
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <ChevronRight className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Tenant
                </h3>
                <p className="text-gray-500">
                  Choose a tenant from the left to view its users
                </p>
              </div>
            )}
          </div>

          {/* Column 3: Details & Actions */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            {selectedUser ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  User Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedUser.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="flex items-center space-x-2">
                      {selectedUser.isActive ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-gray-900">
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Login</label>
                    <p className="text-sm text-gray-900">{selectedUser.lastLogin || 'Never'}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <button
                      onClick={() => onEditUser?.(selectedUser)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit User
                    </button>
                    <button
                      onClick={() => onDeleteUser?.(selectedUser.id, selectedUser.name)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedTenant ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tenant Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedTenant.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedTenant.type || 'Enterprise'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Subscription Plan</label>
                    <p className="text-sm text-gray-900">{selectedTenant.subscriptionPlan || 'Free Plan'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="flex items-center space-x-2">
                      {selectedTenant.isActive ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-gray-900">
                        {selectedTenant.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact Email</label>
                    <p className="text-sm text-gray-900">{selectedTenant.contactEmail || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created</label>
                    <p className="text-sm text-gray-900">{selectedTenant.createdAt ? new Date(selectedTenant.createdAt).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <button
                      onClick={() => onEditTenant?.(selectedTenant)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Tenant
                    </button>
                    <button
                      onClick={() => onDeleteTenant?.(selectedTenant.id, selectedTenant.name)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Tenant
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Settings className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Tenant
                </h3>
                <p className="text-gray-500">
                  Choose a tenant from the left to view its details and manage it
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
