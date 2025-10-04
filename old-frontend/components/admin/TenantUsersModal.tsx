'use client';

import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading';
import { useToastActions } from '@/components/ui/toast';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Shield,
  Calendar
} from 'lucide-react';

interface TenantUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface TenantUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: {
    id: string;
    name: string;
    plan: string;
    userCount: number;
  } | null;
}

export function TenantUsersModal({ isOpen, onClose, tenant }: TenantUsersModalProps) {
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { success, error: showError } = useToastActions();

  useEffect(() => {
    if (isOpen && tenant) {
      fetchUsers();
    }
  }, [isOpen, tenant]);

  const fetchUsers = async () => {
    if (!tenant) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/tenants/${tenant.id}/users`);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, isActive: !isActive } : user
        ));
        success(`User ${!isActive ? 'activated' : 'deactivated'} successfully`);
      } else {
        showError(data.error || 'Failed to update user status');
      }
    } catch (err) {
      showError('Network error occurred');
      console.error('Error updating user status:', err);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        success('User deleted successfully');
      } else {
        showError(data.error || 'Failed to delete user');
      }
    } catch (err) {
      showError('Network error occurred');
      console.error('Error deleting user:', err);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen || !tenant) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Users in ${tenant.name}`}
      size="xl"
    >
      <ModalBody>
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Active Users</p>
                <p className="text-2xl font-bold text-green-900">
                  {users.filter(u => u.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Plan Limit</p>
                <p className="text-2xl font-bold text-purple-900">{tenant.plan}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Users List */}
        <LoadingState
          loading={loading}
          error={error}
          empty={filteredUsers.length === 0}
          emptyText="No users found"
        >
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">{user.displayName}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {user.lastLoginAt ? 
                        `Last login: ${new Date(user.lastLoginAt).toLocaleDateString()}` :
                        'Never logged in'
                      }
                    </span>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                        className={`px-3 py-1 text-xs font-medium rounded ${
                          user.isActive 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteUser(user.id, user.displayName)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </LoadingState>
      </ModalBody>
      
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={fetchUsers}>
          Refresh
        </Button>
      </ModalFooter>
    </Modal>
  );
}

