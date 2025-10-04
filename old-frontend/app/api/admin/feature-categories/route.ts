/**
 * feature-categories/route.ts
 * 
 * Feature Categories API Endpoints - Real Database Version
 * 
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-10-02
 */

import { NextRequest, NextResponse } from 'next/server';
import { getConnection, testConnection } from '@/lib/database-direct';

// GET /api/admin/feature-categories - Get all feature categories
export async function GET() {
  try {
    console.log('🔍 [FEATURE CATEGORIES API] Fetching all categories from database');
    
    // Test database connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [FEATURE CATEGORIES API] Database connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database connection failed',
          details: 'Unable to connect to the database'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ [FEATURE CATEGORIES API] Database connection successful');
    
    const client = await getConnection();
    
    try {
      const result = await client.query(`
        SELECT 
          fc.*,
          COUNT(fcf."featureId") as feature_count
        FROM feature_categories fc
        LEFT JOIN feature_category_features fcf ON fc.id = fcf."categoryId"
        GROUP BY fc.id, fc.name, fc."displayName", fc.description, fc.icon, fc.color, fc."order", fc."isActive", fc."isVisible", fc."createdAt", fc."updatedAt"
        ORDER BY fc."order", fc."displayName"
      `);

      console.log('✅ [FEATURE CATEGORIES API] Query successful, found', result.rows.length, 'categories from database');
      
      // Transform the data to match the expected format
      const categories = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        displayName: row.displayName,
        description: row.description,
        icon: row.icon,
        color: row.color,
        order: row.order,
        isActive: row.isActive,
        isVisible: row.isVisible,
        featureCount: parseInt(row.feature_count),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      }));

      return NextResponse.json({
        success: true,
        data: categories,
        message: 'Feature categories retrieved successfully from database'
      });

    } catch (queryError) {
      console.error('❌ [FEATURE CATEGORIES API] Query failed:', queryError);
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
    console.error('❌ [FEATURE CATEGORIES API] Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch feature categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/feature-categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔍 [FEATURE CATEGORIES API] Creating new category in database:', body);
    
    // Test database connection first
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [FEATURE CATEGORIES API] Database connection failed');
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
        INSERT INTO feature_categories (
          name, "displayName", description, icon, color, "order", "isActive", "isVisible"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        body.name,
        body.displayName,
        body.description,
        body.icon || 'shield',
        body.color || '#3B82F6',
        body.order || 0,
        body.isActive !== false,
        body.isVisible !== false
      ]);

      const newCategory = result.rows[0];
      console.log('✅ [FEATURE CATEGORIES API] Category created successfully:', newCategory.id);
      
      return NextResponse.json({
        success: true,
        data: newCategory,
        message: 'Feature category created successfully in database'
      });
      
    } catch (queryError) {
      console.error('❌ [FEATURE CATEGORIES API] Query failed:', queryError);
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
    console.error('❌ [FEATURE CATEGORIES API] Error creating category:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create feature category',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}