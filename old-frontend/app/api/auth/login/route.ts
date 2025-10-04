import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log(`🔐 Attempting login for: ${email}`);
    console.log(`📝 Password provided: ${password ? '[PROVIDED]' : '[MISSING]'}`);

    // Get CSRF token first
    console.log(`🔐 Getting CSRF token...`);
    const csrfResponse = await fetch(`${API_BASE_URL}/csrf-token`);
    if (!csrfResponse.ok) {
      throw new Error(`Failed to get CSRF token: ${csrfResponse.status}`);
    }
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;
    console.log(`✅ CSRF token obtained`);

    // Call backend login endpoint directly
    console.log(`🔐 Calling backend login endpoint...`);
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.error(`❌ Backend login failed: ${loginResponse.status} - ${errorText}`);
      return NextResponse.json(
        { error: 'Login failed' },
        { status: loginResponse.status }
      );
    }

    const loginData = await loginResponse.json();
    console.log(`✅ Backend login successful`);

    // Create response with user data from backend
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: loginData.data.user,
      token: loginData.data.accessToken
    });

    // Set HTTP-only cookie for secure token storage
    response.cookies.set('blick_token', loginData.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
