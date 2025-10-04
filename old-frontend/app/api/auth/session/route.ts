/**
 * session/route.ts
 *
 * Session Validation API Endpoint
 *
 * Endpoints:
 * - GET /api/auth/session - Check if user session is valid
 *
 * Features:
 * - Validate JWT token from cookies
 * - Return user information if session is valid
 * - Return 401 if session is invalid or expired
 * - Used by client-side to check authentication status
 *
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-01-30
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth-service';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('blick_token')?.value || 
                  extractTokenFromHeader(request.headers.get('authorization'));

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Return user information
    return NextResponse.json({
      success: true,
      user: {
        id: decoded.sub, // Use 'sub' field from JWT
        email: decoded.email,
        role: decoded.role,
        tenant: decoded.tenant
      },
      valid: true
    });

  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json(
      { error: 'Session check failed' },
      { status: 500 }
    );
  }
}

