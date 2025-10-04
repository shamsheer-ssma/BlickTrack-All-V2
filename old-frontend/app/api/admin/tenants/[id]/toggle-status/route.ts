import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/api-service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = params.id;
    console.log('🔍 [TOGGLE TENANT STATUS] Toggling status for tenant:', tenantId);
    
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
      console.error('❌ [TOGGLE TENANT STATUS] Database connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to the database'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ [TOGGLE TENANT STATUS] Database connection successful');
    
    const client = await getConnection();
    
    // Check if tenant exists
    const checkQuery = 'SELECT id, name, "isActive" FROM tenants WHERE id = $1';
    const checkResult = await client.query(checkQuery, [tenantId]);
    
    if (checkResult.rows.length === 0) {
      console.error('❌ [TOGGLE TENANT STATUS] Tenant not found:', tenantId);
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
    console.log('✅ [TOGGLE TENANT STATUS] Tenant found:', tenant.name, 'Current status:', tenant.isActive);
    
    // Update tenant status
    const updateQuery = `
      UPDATE tenants 
      SET 
        "isActive" = $1,
        "updatedAt" = NOW()
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await client.query(updateQuery, [isActive, tenantId]);
    
    if (result.rows.length === 0) {
      console.error('❌ [TOGGLE TENANT STATUS] Failed to update tenant status');
      return NextResponse.json(
        { 
          success: false,
          error: 'Update failed',
          details: 'Failed to update tenant status in database'
        },
        { status: 500 }
      );
    }
    
    const updatedTenant = result.rows[0];
    console.log('✅ [TOGGLE TENANT STATUS] Tenant status updated successfully:', updatedTenant.isActive);
    
    // Create audit log
    try {
      const auditId = 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const auditQuery = `
        INSERT INTO audit_logs (
          id, action, "resourceType", "resourceId", "userId", details, "createdAt"
        ) VALUES (
          $1, 'tenant_status_changed', 'tenant', $2, 'platform-admin', $3, NOW()
        )
      `;
      
      await client.query(auditQuery, [
        auditId,
        tenantId,
        `Tenant "${tenant.name}" ${isActive ? 'activated' : 'deactivated'} by platform admin`
      ]);
      
      console.log('✅ [TOGGLE TENANT STATUS] Audit log created');
    } catch (auditError) {
      console.warn('⚠️ [TOGGLE TENANT STATUS] Failed to create audit log (non-critical):', auditError);
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: updatedTenant.id,
        name: updatedTenant.name,
        isActive: updatedTenant.isActive,
        updatedAt: updatedTenant.updatedAt
      },
      message: `Tenant ${isActive ? 'activated' : 'deactivated'} successfully`
    });
    
  } catch (error) {
    console.error('❌ [TOGGLE TENANT STATUS] Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to toggle tenant status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

