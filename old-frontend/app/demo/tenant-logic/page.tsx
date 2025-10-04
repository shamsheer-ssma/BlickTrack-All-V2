'use client';

import { useState } from 'react';
import { 
  getUserSignupContext, 
  licensedTenants, 
  trialTenant,
  getAllTenantDomains,
  isDomainLicensed 
} from '@/lib/tenantLogic';
import { Building2, Shield, Users, CheckCircle, XCircle, Info } from 'lucide-react';

export default function TenantLogicDemo() {
  const [testEmail, setTestEmail] = useState('');
  const [testCompany, setTestCompany] = useState('');

  const testEmails = [
    'john@utc.com',
    'sarah@huawei.com', 
    'mike@blicktrack.com',
    'alex@startup.io',
    'lisa@techcorp.com',
    'guest@gmail.com'
  ];

  const signupContext = testEmail ? getUserSignupContext(testEmail, testCompany) : null;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tenant Logic Demo</h1>
          <p className="text-slate-600">See how email domains determine tenant assignment</p>
        </div>

        {/* Licensed Tenants */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Licensed Tenants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {licensedTenants.map((tenant) => (
              <div key={tenant.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-blue-900">{tenant.name}</h3>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Domain:</span> @{tenant.domain}
                </p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Plan:</span> {tenant.plan}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trial Tenant */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-yellow-600" />
            Trial Tenant
          </h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-yellow-900">{trialTenant.name}</h3>
              <XCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Domain:</span> Any unlicensed domain
            </p>
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Plan:</span> {trialTenant.plan}
            </p>
          </div>
        </div>

        {/* Test Interface */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-slate-600" />
            Test Tenant Assignment
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <div className="mt-3">
                <p className="text-sm font-medium text-slate-700 mb-2">Quick Test Emails:</p>
                <div className="flex flex-wrap gap-2">
                  {testEmails.map((email) => (
                    <button
                      key={email}
                      onClick={() => setTestEmail(email)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        testEmail === email
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {email}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={testCompany}
                onChange={(e) => setTestCompany(e.target.value)}
                placeholder="Enter company name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {signupContext && (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Assignment Result</h2>
            
            <div className={`rounded-lg p-6 border-2 ${
              signupContext.tenant.isLicensed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${
                  signupContext.tenant.isLicensed 
                    ? 'text-green-900' 
                    : 'text-yellow-900'
                }`}>
                  {signupContext.tenant.name}
                </h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  signupContext.tenant.isLicensed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {signupContext.tenant.isLicensed ? 'Licensed' : 'Trial'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">User Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Email:</span> {testEmail}</p>
                    <p><span className="font-medium">Organization:</span> {signupContext.organization || 'Not specified'}</p>
                    <p><span className="font-medium">User Type:</span> {signupContext.userType}</p>
                    <p><span className="font-medium">Signup Type:</span> {signupContext.signupType}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Tenant Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Tenant ID:</span> {signupContext.tenant.id}</p>
                    <p><span className="font-medium">Tenant Name:</span> {signupContext.tenant.name}</p>
                    <p><span className="font-medium">Domain:</span> @{signupContext.tenant.domain}</p>
                    <p><span className="font-medium">Plan:</span> {signupContext.tenant.plan}</p>
                    <p><span className="font-medium">Licensed:</span> {signupContext.tenant.isLicensed ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-slate-100 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Logic Explanation</h4>
                <p className="text-sm text-slate-700">
                  {signupContext.tenant.isLicensed 
                    ? `Email domain "@${signupContext.tenant.domain}" is recognized as a licensed tenant. User will be assigned to "${signupContext.tenant.name}" with full access.`
                    : `Email domain is not in the licensed tenant list. User will be assigned to "Trial Users" tenant with limited access.`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


