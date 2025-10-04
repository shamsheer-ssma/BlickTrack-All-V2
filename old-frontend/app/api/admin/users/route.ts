import { NextRequest, NextResponse } from 'next/server';
import { getAllUsersWithContext, getUserRolesAndPermissions } from '@/lib/api-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    
    console.log('🔍 [ADMIN API] Fetching users for admin dashboard', tenantId ? `(filtered by tenant: ${tenantId})` : '(all tenants)');
    
    // Test database connection first
    const { testConnection } = await import('@/lib/api-service');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [ADMIN API] Database connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to the database'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ [ADMIN API] Database connection successful');
    
    // Get all users with their tenant and organization information
    const users = await getAllUsersWithContext(tenantId);
    
    console.log(`📊 [ADMIN API] Found ${users.length} users`);
    
    // Transform the data for the frontend
    const transformedUsers = users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      displayName: user.displayName,
      jobTitle: user.jobTitle,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        plan: user.tenant.plan
      },
      organization: user.organization ? {
        id: user.organization.id,
        name: user.organization.name
      } : null,
      // Additional computed fields
      fullName: `${user.firstName} ${user.lastName}`,
      status: user.isActive ? 'Active' : 'Inactive',
      lastLogin: user.lastLoginAt 
        ? new Date(user.lastLoginAt).toLocaleDateString()
        : 'Never',
      joinedDate: new Date(user.createdAt).toLocaleDateString()
    }));

    console.log(`✅ [ADMIN API] Successfully transformed ${transformedUsers.length} users`);

    return NextResponse.json({
      success: true,
      data: transformedUsers,
      total: transformedUsers.length
    });

  } catch (error) {
    console.error('❌ [ADMIN API] Error fetching users:', error);
    console.error('❌ [ADMIN API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}


