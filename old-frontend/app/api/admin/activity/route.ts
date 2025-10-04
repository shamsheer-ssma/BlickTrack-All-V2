/**
 * activity/route.ts
 * 
 * Platform Activity API Endpoints - Mock Data Version
 * 
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-10-02
 */

import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/activity - Get recent platform activity
export async function GET() {
  try {
    console.log('🔍 [PLATFORM ACTIVITY API] Fetching recent activity (mock data)');
    
    const mockActivity = [
      {
        id: '1',
        type: 'user_login',
        message: 'User john.doe@acme.com logged in',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        severity: 'low',
        tenant: 'Acme Corp',
        user: 'john.doe@acme.com'
      },
      {
        id: '2',
        type: 'feature_enabled',
        message: 'Threat Modeling feature enabled for TechStart Inc',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        severity: 'low',
        tenant: 'TechStart Inc',
        user: 'admin@techstart.com'
      },
      {
        id: '3',
        type: 'security_alert',
        message: 'Multiple failed login attempts detected',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        severity: 'high',
        tenant: 'BlickTrack Demo',
        user: 'unknown'
      },
      {
        id: '4',
        type: 'tenant_created',
        message: 'New tenant "StartupXYZ" created',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        severity: 'low',
        tenant: 'StartupXYZ',
        user: 'admin@startupxyz.com'
      },
      {
        id: '5',
        type: 'subscription_upgraded',
        message: 'Acme Corp upgraded to Professional plan',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
        severity: 'low',
        tenant: 'Acme Corp',
        user: 'admin@acme.com'
      }
    ];

    console.log('✅ [PLATFORM ACTIVITY API] Returning mock activity with', mockActivity.length, 'events');
    
    return NextResponse.json({
      success: true,
      data: mockActivity,
      message: 'Recent activity retrieved successfully (mock data)'
    });

  } catch (error) {
    console.error('❌ [PLATFORM ACTIVITY API] Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch recent activity',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}