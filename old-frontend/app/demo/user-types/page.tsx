'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { mockUsers } from '@/lib/mockUserData';
import { User, Building2, Shield, Code, Eye, Users as UsersIcon } from 'lucide-react';

const userTypeIcons = {
  platformAdmin: Shield,
  tenantAdmin: Building2,
  securityManager: Shield,
  securityAnalyst: Eye,
  developer: Code,
  consultant: UsersIcon,
  guest: User
};

export default function UserTypesDemo() {
  const [selectedUserType, setSelectedUserType] = useState<keyof typeof mockUsers>('platformAdmin');

  return (
    <Layout showSidebar={true}>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">User Types Demo</h1>
          <p className="text-slate-600">See how different user types appear in the header</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Object.entries(mockUsers).map(([key, user]) => {
            const IconComponent = userTypeIcons[key as keyof typeof userTypeIcons];
            const isSelected = selectedUserType === key;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedUserType(key as keyof typeof mockUsers)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-blue-100' : 'bg-slate-100'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${
                      isSelected ? 'text-blue-600' : 'text-slate-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{user.role}</h3>
                    <p className="text-sm text-slate-600">{user.name}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">Company:</span> {user.company}
                  </p>
                  {user.tenant && (
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Tenant:</span> {user.tenant}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Current User Info in Header</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-slate-700 mb-2">User Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {mockUsers[selectedUserType].name}</p>
                <p><span className="font-medium">Email:</span> {mockUsers[selectedUserType].email}</p>
                <p><span className="font-medium">Role:</span> {mockUsers[selectedUserType].role}</p>
                <p><span className="font-medium">Company:</span> {mockUsers[selectedUserType].company}</p>
                {mockUsers[selectedUserType].tenant && (
                  <p><span className="font-medium">Tenant:</span> {mockUsers[selectedUserType].tenant}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-slate-700 mb-2">Header Display</h3>
              <div className="text-sm text-slate-600">
                <p>The header now shows:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>User name and email in the profile button</li>
                  <li>Company/tenant name below the email</li>
                  <li>Full details in the dropdown menu</li>
                  <li>Role-based information display</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
