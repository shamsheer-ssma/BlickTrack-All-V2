/**
 * features/[featureId]/tenants/route.ts
 * 
 * Feature Tenant Access API Endpoints
 * 
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-10-02
 */

import { NextRequest, NextResponse } from 'next/server';
import { getConnection, testConnection } from '@/lib/database-direct';

// GET /api/admin/features/[featureId]/tenants - Get tenants that have access to a feature
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ featureId: string }> }
) {
  try {
    const { featureId } = await params;
    console.log('🔍 [FEATURE TENANTS API] Fetching tenants for feature:', featureId);
    
    // Test database connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [FEATURE TENANTS API] Database connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to the database'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ [FEATURE TENANTS API] Database connection successful');
    
    const client = await getConnection();
    
    try {
      // Get tenants that have access to this feature
      const result = await client.query(`
        SELECT 
          t.id,
          t.name,
          t.slug,
          t."isActive",
          t."createdAt",
          t."updatedAt",
          sp.name as subscription_plan_name,
          sp."displayName" as subscription_plan_display_name,
          sp.tier as subscription_plan_tier,
          sp.price as subscription_plan_price,
          sp.currency as subscription_plan_currency,
          sp."billingCycle" as subscription_plan_billing_cycle,
          sp."isActive" as subscription_plan_is_active,
          COUNT(DISTINCT u.id) as user_count,
          COUNT(DISTINCT CASE WHEN u."isActive" = true THEN u.id END) as active_user_count
        FROM tenants t
        LEFT JOIN subscription_plans sp ON t."subscriptionPlanId" = sp.id
        LEFT JOIN users u ON t.id = u."tenantId"
        WHERE EXISTS (
          SELECT 1 FROM feature_tenant_access fta 
          WHERE fta."tenantId" = t.id 
          AND fta."featureId" = $1
          AND fta."isActive" = true
        )
        GROUP BY t.id, t.name, t.slug, t."isActive", t."createdAt", t."updatedAt", sp.name, sp."displayName", sp.tier, sp.price, sp.currency, sp."billingCycle", sp."isActive"
        ORDER BY t."createdAt" DESC
      `, [featureId]);

      console.log('✅ [FEATURE TENANTS API] Query successful, found', result.rows.length, 'tenants for feature', featureId);
      
      // Transform the data to match the expected format
      const tenants = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        isActive: row.isActive,
        userCount: parseInt(row.user_count),
        activeUserCount: parseInt(row.active_user_count),
        subscriptionPlan: row.subscription_plan_name ? {
          name: row.subscription_plan_name,
          displayName: row.subscription_plan_display_name,
          tier: row.subscription_plan_tier,
          price: row.subscription_plan_price,
          currency: row.subscription_plan_currency,
          billingCycle: row.subscription_plan_billing_cycle,
          isActive: row.subscription_plan_is_active
        } : null,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      }));

      return NextResponse.json({
        success: true,
        data: tenants,
        message: `Tenants for feature ${featureId} retrieved successfully from database`
      });

    } catch (queryError) {
      console.error('❌ [FEATURE TENANTS API] Query failed:', queryError);
      
      // Return empty array as fallback
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No tenants found for this feature (fallback)'
      });
    } finally {
      await client.end();
    }

  } catch (error) {
    console.error('❌ [FEATURE TENANTS API] Error:', error);
    
    // Return empty array as fallback
    return NextResponse.json({
      success: true,
      data: [],
      message: 'No tenants found for this feature (error fallback)'
    });
  }
}

// POST /api/admin/features/[featureId]/tenants - Grant feature access to tenant
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ featureId: string }> }
) {
  try {
    const { featureId } = await params;
    const body = await request.json();
    const { tenantId, isActive = true } = body;
    
    console.log('🔍 [FEATURE TENANTS API] Granting feature access:', { featureId, tenantId, isActive });
    
    // Test database connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [FEATURE TENANTS API] Database connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to the database'
        },
        { status: 500 }
      );
    }
    
    const client = await getConnection();
    
    try {
      // Insert or update feature tenant access
      const result = await client.query(`
        INSERT INTO feature_tenant_access ("featureId", "tenantId", "isActive", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, NOW(), NOW())
        ON CONFLICT ("featureId", "tenantId")
        DO UPDATE SET 
          "isActive" = $3,
          "updatedAt" = NOW()
        RETURNING *
      `, [featureId, tenantId, isActive]);

      const access = result.rows[0];
      console.log('✅ [FEATURE TENANTS API] Feature access granted successfully:', access.id);
      
      return NextResponse.json({
        success: true,
        data: access,
        message: 'Feature access granted successfully'
      });
      
    } catch (queryError) {
      console.error('❌ [FEATURE TENANTS API] Query failed:', queryError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Database query failed',
          details: queryError instanceof Error ? queryError.message : 'Unknown query error'
        },
        { status: 500 }
      );
    } finally {
      await client.end();
    }
    
  } catch (error) {
    console.error('❌ [FEATURE TENANTS API] Error granting access:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to grant feature access',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
