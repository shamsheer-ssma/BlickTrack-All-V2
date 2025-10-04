import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/api-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = params.id;
    console.log('🔍 [TENANT USERS API] Fetching users for tenant:', tenantId);
    
    // Test database connection first
    const { testConnection } = await import('@/lib/api-service');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [TENANT USERS API] Database connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to the database'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ [TENANT USERS API] Database connection successful');
    
    const client = await getConnection();
    
    // Check if tenant exists
    const checkQuery = 'SELECT id, name FROM tenants WHERE id = $1';
    const checkResult = await client.query(checkQuery, [tenantId]);
    
    if (checkResult.rows.length === 0) {
      console.error('❌ [TENANT USERS API] Tenant not found:', tenantId);
      return NextResponse.json(
        { 
          success: false,
          error: 'Tenant not found',
          details: 'The specified tenant does not exist'
        },
        { status: 404 }
      );
    }
    
    console.log('✅ [TENANT USERS API] Tenant found:', checkResult.rows[0].name);
    
    // Fetch users for the tenant
    const usersQuery = `
      SELECT 
        u.id,
        u.email,
        u."firstName",
        u."lastName",
        u."displayName",
        u."isActive",
        u."lastLoginAt",
        u."createdAt",
        COALESCE(r.name, 'user') as role
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur."userId"
      LEFT JOIN roles r ON ur."roleId" = r.id
      WHERE u."tenantId" = $1
      ORDER BY u."createdAt" DESC
    `;
    
    const result = await client.query(usersQuery, [tenantId]);
    
    console.log(`✅ [TENANT USERS API] Found ${result.rows.length} users for tenant`);
    
    const users = result.rows.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName || `${user.firstName} ${user.lastName}`,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt
    }));
    
    return NextResponse.json({
      success: true,
      data: users,
      message: 'Users retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ [TENANT USERS API] Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

