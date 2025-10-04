import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/api-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = params.id;
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    
    console.log('🔍 [TENANT ANALYTICS API] Fetching analytics for tenant:', tenantId, 'range:', range);
    
    // Test database connection first
    const { testConnection } = await import('@/lib/api-service');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [TENANT ANALYTICS API] Database connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to the database'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ [TENANT ANALYTICS API] Database connection successful');
    
    const client = await getConnection();
    
    // Check if tenant exists
    const checkQuery = 'SELECT id, name, plan, "createdAt", "isActive" FROM tenants WHERE id = $1';
    const checkResult = await client.query(checkQuery, [tenantId]);
    
    if (checkResult.rows.length === 0) {
      console.error('❌ [TENANT ANALYTICS API] Tenant not found:', tenantId);
      return NextResponse.json(
        { 
          success: false,
          error: 'Tenant not found',
          details: 'The specified tenant does not exist'
        },
        { status: 404 }
      );
    }
    
    const tenant = checkResult.rows[0];
    console.log('✅ [TENANT ANALYTICS API] Tenant found:', tenant.name);
    
    // Calculate date range
    const now = new Date();
    const daysBack = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    // Get basic metrics
    const metricsQuery = `
      SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT CASE WHEN u."isActive" = true THEN u.id END) as active_users,
        COUNT(DISTINCT us.id) as total_sessions,
        AVG(EXTRACT(EPOCH FROM (us."expiresAt" - us."createdAt")) / 60) as avg_session_duration,
        MAX(u."lastLoginAt") as last_activity
      FROM users u
      LEFT JOIN user_sessions us ON u.id = us."userId"
      WHERE u."tenantId" = $1
    `;
    
    const metricsResult = await client.query(metricsQuery, [tenantId]);
    const metrics = metricsResult.rows[0];
    
    // Get storage usage (mock data for now)
    const storageUsed = Math.floor(Math.random() * 1000000000); // Random storage in bytes
    const storageLimit = 10737418240; // 10GB limit
    
    // Get API calls count (mock data)
    const apiCalls = Math.floor(Math.random() * 10000);
    
    // Get error rate (mock data)
    const errorRate = Math.random() * 5; // 0-5% error rate
    
    // Generate mock trend data
    const generateTrendData = (days: number, baseValue: number, variance: number = 0.2) => {
      const data = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
        const value = baseValue + Math.floor(Math.random() * variance * baseValue);
        data.push({
          date: date.toISOString().split('T')[0],
          count: Math.max(0, value)
        });
      }
      return data;
    };
    
    // Generate mock recent activity
    const activityTypes = ['login', 'logout', 'create', 'update', 'delete', 'error'];
    const recentActivity = Array.from({ length: 10 }, (_, i) => ({
      id: `activity_${i}`,
      type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      description: `User performed ${activityTypes[Math.floor(Math.random() * activityTypes.length)]} action`,
      timestamp: new Date(now.getTime() - (i * 60 * 60 * 1000)).toISOString(),
      user: `User ${i + 1}`
    }));
    
    const analytics = {
      tenant: {
        id: tenant.id,
        name: tenant.name,
        plan: tenant.plan,
        createdAt: tenant.createdAt,
        isActive: tenant.isActive
      },
      metrics: {
        totalUsers: parseInt(metrics.total_users) || 0,
        activeUsers: parseInt(metrics.active_users) || 0,
        totalSessions: parseInt(metrics.total_sessions) || 0,
        avgSessionDuration: parseFloat(metrics.avg_session_duration) || 0,
        lastActivity: metrics.last_activity || null,
        storageUsed,
        storageLimit,
        apiCalls,
        errorRate: Math.round(errorRate * 100) / 100
      },
      trends: {
        userGrowth: generateTrendData(daysBack, parseInt(metrics.total_users) || 0, 0.1),
        activityTrend: generateTrendData(daysBack, parseInt(metrics.total_sessions) || 0, 0.3),
        storageUsage: generateTrendData(daysBack, storageUsed, 0.1)
      },
      recentActivity
    };
    
    console.log('✅ [TENANT ANALYTICS API] Analytics data generated successfully');
    
    return NextResponse.json({
      success: true,
      data: analytics,
      message: 'Analytics retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ [TENANT ANALYTICS API] Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

