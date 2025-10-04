import { NextRequest, NextResponse } from 'next/server';
import { toggleTenantFeature, getTenantFeatures } from '@/lib/api-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = params.id;
    console.log(`🔍 [TENANT FEATURES API] Fetching features for tenant ${tenantId}`);
    
    // Test backend API connection first
    const { testConnection } = await import('@/lib/api-service');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [TENANT FEATURES API] Backend API connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'API connection failed',
          details: 'Unable to connect to backend API'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ [TENANT FEATURES API] Backend API connection successful');
    
    // Get features for the tenant
    const features = await getTenantFeatures(tenantId);
    
    console.log(`📊 [TENANT FEATURES API] Retrieved ${features.length} features for tenant ${tenantId}`);
    
    return NextResponse.json({
      success: true,
      data: features,
      message: `Features for tenant ${tenantId} retrieved successfully`
    });
    
  } catch (error) {
    console.error('❌ [TENANT FEATURES API] Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch tenant features',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = params.id;
    const body = await request.json();
    const { featureId, enabled } = body;
    
    console.log(`🔧 [TENANT FEATURES API] Toggling feature ${featureId} for tenant ${tenantId} to ${enabled}`);
    
    if (!featureId || typeof enabled !== 'boolean') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request data',
          details: 'featureId and enabled (boolean) are required'
        },
        { status: 400 }
      );
    }
    
    // Test backend API connection first
    const { testConnection } = await import('@/lib/api-service');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ [TENANT FEATURES API] Backend API connection failed');
      return NextResponse.json(
        { 
          success: false,
          error: 'API connection failed',
          details: 'Unable to connect to backend API'
        },
        { status: 500 }
      );
    }
    
    console.log('✅ [TENANT FEATURES API] Backend API connection successful');
    
    // Toggle the feature
    const result = await toggleTenantFeature(tenantId, featureId, enabled);
    
    console.log(`✅ [TENANT FEATURES API] Feature ${featureId} ${enabled ? 'enabled' : 'disabled'} for tenant ${tenantId}`);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: `Feature ${enabled ? 'enabled' : 'disabled'} successfully`
    });
    
  } catch (error) {
    console.error('❌ [TENANT FEATURES API] Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to toggle feature',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
