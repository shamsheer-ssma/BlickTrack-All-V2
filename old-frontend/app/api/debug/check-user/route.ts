import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, testConnection } from '@/lib/api-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 [DEBUG] Checking user: ${email}`);
    
    // Test database connection first
    console.log('🔍 [DEBUG] Testing database connection...');
    const connectionTest = await testConnection();
    console.log(`📊 [DEBUG] Connection test result:`, connectionTest);

    // Check if user exists
    console.log(`🔍 [DEBUG] Searching for user: ${email}`);
    const user = await findUserByEmail(email);
    
    if (user) {
      console.log(`✅ [DEBUG] User found:`, {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        jobTitle: user.jobTitle,
        tenant: user.tenant.name, // UserWithContext has tenant.name
        organization: user.organization?.name, // UserWithContext has organization.name
        isActive: user.isActive,
        createdAt: user.createdAt
      });
      
      return NextResponse.json({
        found: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          jobTitle: user.jobTitle,
          tenant: user.tenant.name, // UserWithContext has tenant.name
          organization: user.organization?.name, // UserWithContext has organization.name
          isActive: user.isActive,
          createdAt: user.createdAt,
          hasPasswordHash: !!user.passwordHash
        },
        databaseConnection: connectionTest
      });
    } else {
      console.log(`❌ [DEBUG] User not found: ${email}`);
      return NextResponse.json({
        found: false,
        email: email,
        databaseConnection: connectionTest,
        message: 'User not found in database'
      });
    }

  } catch (error) {
    console.error('❌ [DEBUG] Error checking user:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check user',
        details: error instanceof Error ? error.message : 'Unknown error',
        databaseConnection: false
      },
      { status: 500 }
    );
  }
}