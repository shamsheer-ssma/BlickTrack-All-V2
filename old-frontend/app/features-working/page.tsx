'use client';

import { useState, useEffect } from 'react';

export default function FeaturesWorkingPage() {
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, featuresRes, tenantsRes, subscriptionPlansRes] = await Promise.all([
          fetch('/api/admin/feature-categories'),
          fetch('/api/admin/features'),
          fetch('/api/admin/tenants'),
          fetch('/api/admin/subscription-plans')
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          if (categoriesData.success) {
            setCategories(categoriesData.data);
          }
        }

        if (featuresRes.ok) {
          const featuresData = await featuresRes.json();
          if (featuresData.success) {
            setFeatures(featuresData.data);
          }
        }

        if (tenantsRes.ok) {
          const tenantsData = await tenantsRes.json();
          if (tenantsData.success) {
            setTenants(tenantsData.data);
          }
        }

        if (subscriptionPlansRes.ok) {
          const subscriptionPlansData = await subscriptionPlansRes.json();
          if (subscriptionPlansData.success) {
            setSubscriptionPlans(subscriptionPlansData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ 
          width: '3rem', 
          height: '3rem', 
          border: '2px solid #3b82f6', 
          borderTop: '2px solid transparent', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p>Loading data...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1f2937' }}>
        Complete Features Data
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        All data from your database - categories, features, tenants, and plans
      </p>
      
      {/* Categories */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
          Categories ({categories.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {categories.map((category) => {
            const categoryFeatures = features.filter(f => f.categoryId === category.id);
            
            return (
              <div key={category.id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.5rem', 
                padding: '1.5rem',
                backgroundColor: '#ffffff'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                  {category.displayName}
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{category.description}</p>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
                  ID: {category.id} • Active: {category.isActive ? 'Yes' : 'No'}
                </div>
                <div style={{ color: '#374151', fontWeight: '500' }}>
                  {categoryFeatures.length} features
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
          Features ({features.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {features.map((feature) => {
            const category = categories.find(c => c.id === feature.categoryId);
            
            return (
              <div key={feature.id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.5rem', 
                padding: '1.5rem',
                backgroundColor: '#ffffff'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                  {feature.displayName}
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{feature.description}</p>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
                  ID: {feature.id} • Category: {category?.displayName} • Active: {feature.isActive ? 'Yes' : 'No'}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    backgroundColor: '#dbeafe', 
                    color: '#1e40af', 
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem'
                  }}>
                    View
                  </span>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    backgroundColor: '#dcfce7', 
                    color: '#166534', 
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem'
                  }}>
                    Edit
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tenants */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
          Tenants ({tenants.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {tenants.map((tenant) => (
            <div key={tenant.id} style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.5rem', 
              padding: '1.5rem',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                {tenant.name}
              </h3>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
                ID: {tenant.id} • Active: {tenant.isActive ? 'Yes' : 'No'}
              </div>
              <div style={{ color: '#374151' }}>
                Users: {tenant.userCount || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Plans */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
          Subscription Plans ({subscriptionPlans.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {subscriptionPlans.map((plan) => (
            <div key={plan.id} style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.5rem', 
              padding: '1.5rem',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                {plan.displayName}
              </h3>
              <div style={{ color: '#6b7280', marginBottom: '1rem' }}>{plan.description}</div>
              <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
                ID: {plan.id} • Tier: {plan.tier} • Price: ${plan.price}/{plan.billingCycle}
              </div>
              <div style={{ color: '#374151' }}>
                Active: {plan.isActive ? 'Yes' : 'No'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{ 
        backgroundColor: '#eff6ff', 
        border: '1px solid #bfdbfe', 
        borderRadius: '0.5rem', 
        padding: '1.5rem' 
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1e40af' }}>
          Database Summary
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{categories.length}</div>
            <div style={{ color: '#1e40af' }}>Categories</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{features.length}</div>
            <div style={{ color: '#1e40af' }}>Features</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{tenants.length}</div>
            <div style={{ color: '#1e40af' }}>Tenants</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{subscriptionPlans.length}</div>
            <div style={{ color: '#1e40af' }}>Plans</div>
          </div>
        </div>
      </div>
    </div>
  );
}