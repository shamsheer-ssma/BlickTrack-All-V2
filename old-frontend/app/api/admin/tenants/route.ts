/**
 * tenants/route.ts
 * 
 * Tenants API Endpoints - Real Database Version
 * 
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-10-02
 */

import { NextRequest, NextResponse } from 'next/server';
import { getConnection, testConnection } from '@/lib/database-direct';

// GET /api/admin/tenants - Get all tenants
export async function GET() {
  try {
    console.log('🔍 [TENANTS API] Fetching all tenants from database');
    
    // Test database connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [TENANTS API] Database connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to the database'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ [TENANTS API] Database connection successful');
    
    const client = await getConnection();
    
    try {
      const result = await client.query(`
        SELECT 
          t.*,
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
        GROUP BY t.id, t.name, t.slug, t.description, t.domain, t."isActive", t."isTrial", t."trialExpiresAt", t."subscriptionPlanId", t."createdAt", t."updatedAt", sp.name, sp."displayName", sp.tier, sp.price, sp.currency, sp."billingCycle", sp."isActive"
        ORDER BY t."createdAt" DESC
      `);

      console.log('✅ [TENANTS API] Query successful, found', result.rows.length, 'tenants from database');
      
      // Transform the data to match the expected format
      const tenants = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        domain: row.domain,
        isActive: row.isActive,
        isTrial: row.isTrial,
        trialExpiresAt: row.trialExpiresAt,
        userCount: parseInt(row.user_count),
        activeUserCount: parseInt(row.active_user_count),
        subscriptionPlan: row.subscription_plan_id ? {
          id: row.subscription_plan_id,
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
        message: 'Tenants retrieved successfully from database'
      });

    } catch (queryError) {
      console.error('❌ [TENANTS API] Query failed:', queryError);
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
    console.error('❌ [TENANTS API] Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch tenants',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}