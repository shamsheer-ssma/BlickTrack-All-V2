import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/api-service';
import { getUserFromServer } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists in database
    console.log(`🔍 Checking email existence: ${email}`);
    try {
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        console.log(`❌ Email already exists: ${email}`);
        return NextResponse.json(
          { 
            exists: true,
            message: 'An account with this email already exists. Please use a different email or try signing in.'
          },
          { status: 409 }
        );
      }
    } catch (dbError) {
      console.log(`⚠️ Database check failed, falling back to memory store: ${dbError}`);
      // Fallback to memory store check
      const existingUser = getUserFromServer(email);
      if (existingUser) {
        console.log(`❌ Email already exists in memory store: ${email}`);
        return NextResponse.json(
          { 
            exists: true,
            message: 'An account with this email already exists. Please use a different email or try signing in.'
          },
          { status: 409 }
        );
      }
    }

    console.log(`✅ Email is available: ${email}`);
    return NextResponse.json({
      exists: false,
      message: 'Email is available'
    });

  } catch (error) {
    console.error('Error checking email existence:', error);
    return NextResponse.json(
      { error: 'Failed to check email existence' },
      { status: 500 }
    );
  }
}


