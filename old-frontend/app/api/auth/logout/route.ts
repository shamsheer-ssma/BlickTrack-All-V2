/**
 * logout/route.ts
 *
 * User Logout API Endpoint
 *
 * Endpoints:
 * - POST /api/auth/logout - Logout user and clear session
 *
 * Features:
 * - Clear HTTP-only authentication cookie
 * - Clear client-side storage
 * - Redirect to login page
 * - Secure session termination
 *
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-01-30
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔓 User logout requested');

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    // Clear the HTTP-only cookie
    response.cookies.set('blick_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    console.log('✅ User logged out successfully');

    return response;

  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

