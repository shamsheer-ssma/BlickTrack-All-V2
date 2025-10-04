import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/api-service';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('id');
    
    if (!tenantId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing tenant ID',
          details: 'Tenant ID is required'
        },
        { status: 400 }
      );
    }
    
    console.log('🔍 [DELETE TENANT API] Deleting tenant:', tenantId);
    
    // Test database connection first
    const { testConnection } = await import('@/lib/api-service');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [DELETE TENANT API] Database connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to the database'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ [DELETE TENANT API] Database connection successful');
    
    const client = await getConnection();
    
    // Check if tenant exists and get basic info
    const checkQuery = 'SELECT id, name FROM tenants WHERE id = $1';
    const checkResult = await client.query(checkQuery, [tenantId]);
    
    if (checkResult.rows.length === 0) {
      console.error('❌ [DELETE TENANT API] Tenant not found:', tenantId);
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
    console.log('✅ [DELETE TENANT API] Tenant found:', tenant.name);
    
    // Check if tenant has users (optional safety check)
    const userCountQuery = 'SELECT COUNT(*) as count FROM users WHERE "tenantId" = $1';
    const userCountResult = await client.query(userCountQuery, [tenantId]);
    const userCount = parseInt(userCountResult.rows[0].count);
    
    if (userCount > 0) {
      console.warn('⚠️ [DELETE TENANT API] Tenant has users:', userCount);
      // In a production system, you might want to prevent deletion or cascade delete
      // For now, we'll proceed with deletion
    }
    
    // Start transaction for safe deletion
    await client.query('BEGIN');
    
    try {
      // Delete related data first (in order of dependencies)
      
      // 1. Delete user sessions
      await client.query('DELETE FROM user_sessions WHERE "userId" IN (SELECT id FROM users WHERE "tenantId" = $1)', [tenantId]);
      console.log('✅ [DELETE TENANT API] Deleted user sessions');
      
      // 2. Delete user permissions
      await client.query('DELETE FROM user_permissions WHERE "userId" IN (SELECT id FROM users WHERE "tenantId" = $1)', [tenantId]);
      console.log('✅ [DELETE TENANT API] Deleted user permissions');
      
      // 3. Delete user roles
      await client.query('DELETE FROM user_roles WHERE "userId" IN (SELECT id FROM users WHERE "tenantId" = $1)', [tenantId]);
      console.log('✅ [DELETE TENANT API] Deleted user roles');
      
      // 4. Delete users
      await client.query('DELETE FROM users WHERE "tenantId" = $1', [tenantId]);
      console.log('✅ [DELETE TENANT API] Deleted users');
      
      // 5. Delete organizations
      await client.query('DELETE FROM organizations WHERE "tenantId" = $1', [tenantId]);
      console.log('✅ [DELETE TENANT API] Deleted organizations');
      
      // 6. Delete audit logs
      await client.query('DELETE FROM audit_logs WHERE "tenantId" = $1', [tenantId]);
      console.log('✅ [DELETE TENANT API] Deleted audit logs');
      
      // 7. Finally, delete the tenant
      const deleteQuery = 'DELETE FROM tenants WHERE id = $1 RETURNING *';
      const deleteResult = await client.query(deleteQuery, [tenantId]);
      
      if (deleteResult.rows.length === 0) {
        throw new Error('Failed to delete tenant');
      }
      
      console.log('✅ [DELETE TENANT API] Tenant deleted successfully');
      
      // Commit transaction
      await client.query('COMMIT');
      
      return NextResponse.json({
        success: true,
        data: {
          id: tenant.id,
          name: tenant.name,
          deletedAt: new Date().toISOString()
        },
        message: 'Tenant and all associated data deleted successfully'
      });
      
    } catch (transactionError) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      console.error('❌ [DELETE TENANT API] Transaction failed, rolling back:', transactionError);
      throw transactionError;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ [DELETE TENANT API] Error:', error);
    console.error('❌ [DELETE TENANT API] Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete tenant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

