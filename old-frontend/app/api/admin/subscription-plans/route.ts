/**
 * subscription-plans/route.ts
 * 
 * Subscription Plans API Endpoints - Mock Data Version
 * 
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-10-02
 */

import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/subscription-plans - Get all subscription plans
export async function GET() {
  try {
    console.log('🔍 [SUBSCRIPTION PLANS API] Fetching all plans (mock data)');
    
    const mockPlans = [
      {
        id: 'plan-1',
        name: 'free',
        displayName: 'Free',
        description: 'Free forever plan with basic features and unlimited usage',
        tier: 'free',
        price: 0,
        currency: 'USD',
        billingCycle: 'monthly',
        isActive: true,
        features: {
          'threat-modeling': true,
          'compliance': false,
          'analytics': true,
          'integrations': false
        },
        limits: {
          users: 5,
          projects: 3,
          storage: '1GB'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'plan-2',
        name: 'starter',
        displayName: 'Starter',
        description: 'Essential features for growing teams',
        tier: 'starter',
        price: 29,
        currency: 'USD',
        billingCycle: 'monthly',
        isActive: true,
        features: {
          'threat-modeling': true,
          'compliance': false,
          'analytics': true,
          'integrations': false
        },
        limits: {
          users: 10,
          projects: 5,
          storage: '10GB'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'plan-3',
        name: 'professional',
        displayName: 'Professional',
        description: 'Advanced features for professional teams',
        tier: 'professional',
        price: 99,
        currency: 'USD',
        billingCycle: 'monthly',
        isActive: true,
        features: {
          'threat-modeling': true,
          'compliance': true,
          'analytics': true,
          'integrations': true
        },
        limits: {
          users: 50,
          projects: 25,
          storage: '100GB'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'plan-4',
        name: 'enterprise',
        displayName: 'Enterprise',
        description: 'Full features for large organizations',
        tier: 'enterprise',
        price: 299,
        currency: 'USD',
        billingCycle: 'monthly',
        isActive: true,
        features: {
          'threat-modeling': true,
          'compliance': true,
          'analytics': true,
          'integrations': true
        },
        limits: {
          users: 1000,
          projects: 100,
          storage: '1TB'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    console.log('✅ [SUBSCRIPTION PLANS API] Returning mock data with', mockPlans.length, 'plans');
    
    return NextResponse.json({
      success: true,
      data: mockPlans,
      message: 'Subscription plans retrieved successfully (mock data)'
    });

  } catch (error) {
    console.error('❌ [SUBSCRIPTION PLANS API] Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch subscription plans',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}