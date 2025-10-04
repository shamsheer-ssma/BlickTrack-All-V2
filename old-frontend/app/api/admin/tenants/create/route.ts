import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/api-service';

export async function POST(request: NextRequest) {
  try {
    console.log('🏢 [CREATE TENANT API] Creating new tenant...');
    
    const body = await request.json();
    const { 
      name, 
      plan = 'free', 
      contactEmail, 
      billingEmail,
      technicalContact,
      industry, 
      maxUsers = 10,
      description 
    } = body;
    
    // Validate required fields
    if (!name || !contactEmail) {
      console.error('❌ [CREATE TENANT API] Missing required fields:', { name, contactEmail });
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields',
          details: 'Name and contact email are required'
        },
        { status: 400 }
      );
    }
    
    console.log('📝 [CREATE TENANT API] Request data:', { name, plan, contactEmail, billingEmail, technicalContact, industry, maxUsers });
    
    // Test database connection first
    const { testConnection } = await import('@/lib/api-service');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [CREATE TENANT API] Database connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to the database'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ [CREATE TENANT API] Database connection successful');
    
    const client = await getConnection();
      
      // Generate slug from name
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // Check if slug already exists
      const existingSlug = await client.query(
        'SELECT id FROM tenants WHERE slug = $1',
        [slug]
      );
      
      let finalSlug = slug;
      if (existingSlug.rows.length > 0) {
        // Add timestamp to make it unique
        finalSlug = `${slug}-${Date.now()}`;
      }
      
      // Generate UUID for tenant
      const tenantId = 'tenant_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Create tenant - start with minimal required fields
      const tenantQuery = `
        INSERT INTO tenants (
          id, name, slug, plan, "isActive", "isTrial", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, true, true, NOW(), NOW()
        ) RETURNING *
      `;
      
      const result = await client.query(tenantQuery, [
        tenantId,
        name,
        finalSlug,
        plan
      ]);
      
      // Update with additional fields if provided
      if (contactEmail || billingEmail || technicalContact || industry || maxUsers) {
        const updateQuery = `
          UPDATE tenants 
          SET 
            "contactEmail" = COALESCE($1, "contactEmail"),
            "billingEmail" = COALESCE($2, "billingEmail"),
            "technicalContact" = COALESCE($3, "technicalContact"),
            industry = COALESCE($4, industry),
            "maxUsers" = COALESCE($5, "maxUsers"),
            "updatedAt" = NOW()
          WHERE id = $6
          RETURNING *
        `;
        
        const updateResult = await client.query(updateQuery, [
          contactEmail || null,
          billingEmail || null,
          technicalContact || null,
          industry || null,
          maxUsers || null,
          tenantId
        ]);
        
        console.log('✅ [CREATE TENANT API] Tenant updated with additional fields:', updateResult.rows[0]);
      }
      
      const newTenant = result.rows[0];
      
      console.log('✅ [CREATE TENANT API] Tenant created successfully:', newTenant);
      
      // Try to create default organization for the tenant (optional)
      try {
        const orgId = 'org_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const orgQuery = `
          INSERT INTO organizations (
            id, name, slug, "tenantId", "isActive", "createdAt", "updatedAt"
          ) VALUES (
            $1, $2, $3, $4, true, NOW(), NOW()
          ) RETURNING *
        `;
        
        const orgSlug = `${name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}-org`;
        
        const orgResult = await client.query(orgQuery, [
          orgId,
          `${name} Organization`,
          orgSlug,
          newTenant.id
        ]);
        
        console.log('✅ [CREATE TENANT API] Organization created:', orgResult.rows[0]);
      } catch (orgError) {
        console.warn('⚠️ [CREATE TENANT API] Failed to create organization (non-critical):', orgError);
        // Continue without organization - this is not critical
      }
      
      // Try to create audit log (optional)
      try {
        const auditId = 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const auditQuery = `
          INSERT INTO audit_logs (
            id, action, "resourceType", "resourceId", "userId", details, "createdAt"
          ) VALUES (
            $1, 'tenant_created', 'tenant', $2, 'platform-admin', $3, NOW()
          )
        `;
        
        await client.query(auditQuery, [
          auditId,
          newTenant.id,
          `New tenant "${name}" created with ${plan} plan`
        ]);
        
        console.log('✅ [CREATE TENANT API] Audit log created');
      } catch (auditError) {
        console.warn('⚠️ [CREATE TENANT API] Failed to create audit log (non-critical):', auditError);
        // Continue without audit log - this is not critical
      }
      
      console.log(`✅ [CREATE TENANT API] Tenant created successfully: ${newTenant.id}`);
      
      return NextResponse.json({
        success: true,
        data: {
          id: newTenant.id,
          name: newTenant.name,
          slug: newTenant.slug,
          plan: newTenant.plan,
          contactEmail: newTenant.contactEmail,
          industry: newTenant.industry,
          maxUsers: newTenant.maxUsers,
          isActive: newTenant.isActive,
          isTrial: newTenant.isTrial,
          createdAt: newTenant.createdAt
        },
        message: 'Tenant created successfully'
      });
    
  } catch (error) {
    console.error('❌ [CREATE TENANT API] Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create tenant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
