import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/api-service';

export async function PUT(request: NextRequest) {
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
    
    console.log('🔍 [UPDATE TENANT API] Updating tenant:', tenantId);
    
    const body = await request.json();
    const { 
      name, 
      contactEmail, 
      plan, 
      industry, 
      maxUsers, 
      description,
      isActive 
    } = body;
    
    // Validate required fields
    if (!name || !contactEmail) {
      console.error('❌ [UPDATE TENANT API] Missing required fields:', { name, contactEmail });
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields',
          details: 'Name and contact email are required'
        },
        { status: 400 }
      );
    }
    
    console.log('📝 [UPDATE TENANT API] Update data:', { name, plan, contactEmail, industry, maxUsers, isActive });
    
    // Test database connection first
    const { testConnection } = await import('@/lib/api-service');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [UPDATE TENANT API] Database connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to the database'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ [UPDATE TENANT API] Database connection successful');
    
    const client = await getConnection();
    
    // Check if tenant exists
    const checkQuery = 'SELECT id, name FROM tenants WHERE id = $1';
    const checkResult = await client.query(checkQuery, [tenantId]);
    
    if (checkResult.rows.length === 0) {
      console.error('❌ [UPDATE TENANT API] Tenant not found:', tenantId);
      return NextResponse.json(
        { 
          success: false,
          error: 'Tenant not found',
          details: 'The specified tenant does not exist'
        },
        { status: 404 }
      );
    }
    
    console.log('✅ [UPDATE TENANT API] Tenant found:', checkResult.rows[0].name);
    
    // Update tenant
    const updateQuery = `
      UPDATE tenants 
      SET 
        name = $1,
        "contactEmail" = $2,
        plan = $3,
        industry = $4,
        "maxUsers" = $5,
        "isActive" = $6,
        "updatedAt" = NOW()
      WHERE id = $7
      RETURNING *
    `;
    
    const result = await client.query(updateQuery, [
      name,
      contactEmail,
      plan,
      industry || null,
      maxUsers,
      isActive,
      tenantId
    ]);
    
    if (result.rows.length === 0) {
      console.error('❌ [UPDATE TENANT API] Failed to update tenant');
      return NextResponse.json(
        { 
          success: false,
          error: 'Update failed',
          details: 'Failed to update tenant in database'
        },
        { status: 500 }
      );
    }
    
    const updatedTenant = result.rows[0];
    console.log('✅ [UPDATE TENANT API] Tenant updated successfully:', updatedTenant);
    
    // Try to create audit log (optional)
    try {
      const auditId = 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const auditQuery = `
        INSERT INTO audit_logs (
          id, action, "resourceType", "resourceId", "userId", details, "createdAt"
        ) VALUES (
          $1, 'tenant_updated', 'tenant', $2, 'platform-admin', $3, NOW()
        )
      `;
      
      await client.query(auditQuery, [
        auditId,
        tenantId,
        `Tenant "${name}" updated by platform admin`
      ]);
      
      console.log('✅ [UPDATE TENANT API] Audit log created');
    } catch (auditError) {
      console.warn('⚠️ [UPDATE TENANT API] Failed to create audit log (non-critical):', auditError);
      // Continue without audit log - this is not critical
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: updatedTenant.id,
        name: updatedTenant.name,
        slug: updatedTenant.slug,
        plan: updatedTenant.plan,
        contactEmail: updatedTenant.contactEmail,
        industry: updatedTenant.industry,
        maxUsers: updatedTenant.maxUsers,
        isActive: updatedTenant.isActive,
        updatedAt: updatedTenant.updatedAt
      },
      message: 'Tenant updated successfully'
    });
    
  } catch (error) {
    console.error('❌ [UPDATE TENANT API] Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update tenant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

