import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth-service';
import { getUserFromServer } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'));
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user data from server store
    const user = getUserFromServer(payload.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        organization: user.organization, // This is a string in AuthUser
        tenant: user.tenant, // This is a string in AuthUser
        role: user.role,
        userType: user.userType,
        isLicensed: user.isLicensed,
        emailVerified: user.emailVerified
      },
      payload
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Token verification failed' },
      { status: 500 }
    );
  }
}


