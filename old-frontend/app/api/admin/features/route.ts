/**
 * features/route.ts
 * 
 * Features API Endpoints - Real Database Version
 * 
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-10-02
 */

import { NextRequest, NextResponse } from 'next/server';
import { getConnection, testConnection } from '@/lib/database-direct';

// GET /api/admin/features - Get all features
export async function GET() {
  try {
    console.log('🔍 [FEATURES API] Fetching all features from database');
    
    // Test database connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [FEATURES API] Database connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to the database'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ [FEATURES API] Database connection successful');
    
    const client = await getConnection();
    
    try {
      const result = await client.query(`
        SELECT 
          f.*,
          parent.name as parent_name,
          parent."displayName" as parent_display_name,
          sp.id as subscription_plan_id,
          sp.name as subscription_plan_name,
          sp."displayName" as subscription_plan_display_name,
          sp.description as subscription_plan_description,
          sp.tier as subscription_plan_tier,
          sp.price as subscription_plan_price,
          sp.currency as subscription_plan_currency,
          sp."billingCycle" as subscription_plan_billing_cycle,
          sp."isActive" as subscription_plan_is_active,
          COALESCE(
            json_agg(
              json_build_object(
                'id', child.id,
                'name', child.name,
                'displayName', child."displayName",
                'description', child.description,
                'type', child.type,
                'level', child.level,
                'isActive', child."isActive",
                'isVisible', child."isVisible"
              )
            ) FILTER (WHERE child.id IS NOT NULL),
            '[]'
          ) as children,
          COALESCE(
            json_agg(
              json_build_object(
                'id', fcf.id,
                'order', fcf."order",
                'isPrimary', fcf."isPrimary",
                'category', json_build_object(
                  'id', fc.id,
                  'name', fc.name,
                  'displayName', fc."displayName",
                  'icon', fc.icon,
                  'color', fc.color
                )
              )
            ) FILTER (WHERE fc.id IS NOT NULL),
            '[]'
          ) as categories
        FROM features f
        LEFT JOIN features parent ON f."parentId" = parent.id
        LEFT JOIN features child ON f.id = child."parentId"
        LEFT JOIN feature_category_features fcf ON f.id = fcf."featureId"
        LEFT JOIN feature_categories fc ON fcf."categoryId" = fc.id
        LEFT JOIN subscription_plans sp ON f."subscriptionPlanId" = sp.id
        GROUP BY f.id, f.name, f."displayName", f.description, f."parentId", f.type, f.level, f."order", f."requiresLicense", f."isPremium", f."isAddOn", f."isActive", f."isVisible", f."isDeprecated", f.metadata, f.tags, f."createdAt", f."updatedAt", f."subscriptionPlanId", parent.name, parent."displayName", sp.id, sp.name, sp."displayName", sp.description, sp.tier, sp.price, sp.currency, sp."billingCycle", sp."isActive"
        ORDER BY f."order", f."displayName"
      `);

      console.log('✅ [FEATURES API] Query successful, found', result.rows.length, 'features from database');
      
      // Transform the data to match the expected format
      const features = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        displayName: row.displayName,
        description: row.description,
        parentId: row.parentId,
        parentName: row.parent_name,
        parentDisplayName: row.parent_display_name,
        type: row.type,
        level: row.level,
        order: row.order,
        requiresLicense: row.requiresLicense,
        isPremium: row.isPremium,
        isAddOn: row.isAddOn,
        isActive: row.isActive,
        isVisible: row.isVisible,
        isDeprecated: row.isDeprecated,
        metadata: row.metadata,
        tags: row.tags,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        subscriptionPlan: row.subscription_plan_id ? {
          id: row.subscription_plan_id,
          name: row.subscription_plan_name,
          displayName: row.subscription_plan_display_name,
          description: row.subscription_plan_description,
          tier: row.subscription_plan_tier,
          price: row.subscription_plan_price,
          currency: row.subscription_plan_currency,
          billingCycle: row.subscription_plan_billing_cycle,
          isActive: row.subscription_plan_is_active
        } : null,
        children: row.children || [],
        categories: row.categories || []
      }));

      return NextResponse.json({
        success: true,
        data: features,
        message: 'Features retrieved successfully from database'
      });

    } catch (queryError) {
      console.error('❌ [FEATURES API] Query failed:', queryError);
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
    console.error('❌ [FEATURES API] Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch features',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/features - Create new feature
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔍 [FEATURES API] Creating new feature in database:', body);
    
    // Test database connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [FEATURES API] Database connection failed');
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
      const result = await client.query(`
        INSERT INTO features (
          name, "displayName", description, "parentId", type, level, "order",
          "requiresLicense", "isPremium", "isAddOn", "isActive", "isVisible",
          "isDeprecated", metadata, tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `, [
        body.name,
        body.displayName,
        body.description,
        body.parentId || null,
        body.type || 'feature',
        body.level || 1,
        body.order || 0,
        body.requiresLicense || false,
        body.isPremium || false,
        body.isAddOn || false,
        body.isActive !== false,
        body.isVisible !== false,
        body.isDeprecated || false,
        JSON.stringify(body.metadata || {}),
        body.tags || []
      ]);

      const newFeature = result.rows[0];
      console.log('✅ [FEATURES API] Feature created successfully:', newFeature.id);
      
      return NextResponse.json({
        success: true,
        data: newFeature,
        message: 'Feature created successfully in database'
      });
      
    } catch (queryError) {
      console.error('❌ [FEATURES API] Query failed:', queryError);
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
    console.error('❌ [FEATURES API] Error creating feature:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create feature',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}