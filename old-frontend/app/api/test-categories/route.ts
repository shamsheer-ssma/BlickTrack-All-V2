import { NextResponse } from 'next/server';
import { query } from '@/lib/api-service';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Simple test query
    const result = await query('SELECT id, name, "displayName" FROM feature_categories LIMIT 1');
    
    console.log('Query result:', result);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { success: false, error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
