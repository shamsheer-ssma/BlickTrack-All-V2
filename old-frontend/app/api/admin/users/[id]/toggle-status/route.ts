import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/api-service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    console.log('🔍 [TOGGLE USER STATUS] Toggling status for user:', userId);
    
    const body = await request.json();
    const { isActive } = body;
    
    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid status value',
          details: 'isActive must be a boolean value'
        },
        { status: 400 }
      );
    }
    
    // Test database connection first
    const { testConnection } = await import('@/lib/api-service');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [TOGGLE USER STATUS] Database connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to the database'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ [TOGGLE USER STATUS] Database connection successful');
    
    const client = await getConnection();
    
    // Check if user exists
    const checkQuery = 'SELECT id, email, "firstName", "lastName", "isActive" FROM users WHERE id = $1';
    const checkResult = await client.query(checkQuery, [userId]);
    
    if (checkResult.rows.length === 0) {
      console.error('❌ [TOGGLE USER STATUS] User not found:', userId);
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found',
          details: 'The specified user does not exist'
        },
        { status: 404 }
      );
    }
    
    const user = checkResult.rows[0];
    console.log('✅ [TOGGLE USER STATUS] User found:', user.email, 'Current status:', user.isActive);
    
    // Update user status
    const updateQuery = `
      UPDATE users 
      SET 
        "isActive" = $1,
        "updatedAt" = NOW()
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await client.query(updateQuery, [isActive, userId]);
    
    if (result.rows.length === 0) {
      console.error('❌ [TOGGLE USER STATUS] Failed to update user status');
      return NextResponse.json(
        { 
          success: false,
          error: 'Update failed',
          details: 'Failed to update user status in database'
        },
        { status: 500 }
      );
    }
    
    const updatedUser = result.rows[0];
    console.log('✅ [TOGGLE USER STATUS] User status updated successfully:', updatedUser.isActive);
    
    // Create audit log
    try {
      const auditId = 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const auditQuery = `
        INSERT INTO audit_logs (
          id, action, "resourceType", "resourceId", "userId", details, "createdAt"
        ) VALUES (
          $1, 'user_status_changed', 'user', $2, 'platform-admin', $3, NOW()
        )
      `;
      
      await client.query(auditQuery, [
        auditId,
        userId,
        `User "${user.email}" ${isActive ? 'activated' : 'deactivated'} by platform admin`
      ]);
      
      console.log('✅ [TOGGLE USER STATUS] Audit log created');
    } catch (auditError) {
      console.warn('⚠️ [TOGGLE USER STATUS] Failed to create audit log (non-critical):', auditError);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        isActive: updatedUser.isActive,
        updatedAt: updatedUser.updatedAt
      },
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
    
  } catch (error) {
    console.error('❌ [TOGGLE USER STATUS] Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to toggle user status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

