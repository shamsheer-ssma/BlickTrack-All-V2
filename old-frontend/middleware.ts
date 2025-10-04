import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge, extractTokenFromHeader } from './lib/auth-edge';

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/features',
  '/platform-settings',
  '/demo'
];

// Auth routes that should redirect if already logged in
const authRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('🔍 [MIDDLEWARE] Processing request:', pathname);
  
  // Skip middleware for API routes to avoid blocking authentication
  if (pathname.startsWith('/api/')) {
    console.log('🔍 [MIDDLEWARE] Skipping API route:', pathname);
    return NextResponse.next();
  }

  // Skip middleware for static files
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
    console.log('🔍 [MIDDLEWARE] Skipping static file:', pathname);
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  console.log('🔍 [MIDDLEWARE] Route analysis:', {
    pathname,
    isProtectedRoute,
    isAuthRoute
  });

  // Check for authentication token
  const token = request.cookies.get('blick_token')?.value || 
                extractTokenFromHeader(request.headers.get('authorization'));
  
  console.log('🔍 [MIDDLEWARE] Token check:', {
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
  });

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    console.log('🔒 [MIDDLEWARE] Redirecting to login - no token found for protected route:', pathname);
    const loginUrl = new URL('/auth/login', request.url);
    // Only set redirect if it's not already a login page to avoid loops
    if (!pathname.startsWith('/auth/login')) {
      loginUrl.searchParams.set('redirect', pathname);
    }
    console.log('🔒 [MIDDLEWARE] Redirect URL:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, verify it
  if (token) {
    console.log('🔍 [MIDDLEWARE] Verifying token...');
    const decoded = verifyTokenEdge(token);
    console.log('🔍 [MIDDLEWARE] Token verification result:', {
      isValid: !!decoded,
      decoded: decoded ? {
        sub: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        tenant: decoded.tenant,
        exp: decoded.exp
      } : null
    });
    
    if (!decoded) {
      console.log('🔒 [MIDDLEWARE] Invalid token detected');
      
      // If already on login page, don't redirect to avoid loop
      if (pathname.startsWith('/auth/login')) {
        console.log('🔒 [MIDDLEWARE] Already on login page, allowing to proceed');
        return NextResponse.next();
      }
      
      console.log('🔒 [MIDDLEWARE] Invalid token, redirecting to login');
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      console.log('🔒 [MIDDLEWARE] Redirect URL:', loginUrl.toString());
      return NextResponse.redirect(loginUrl);
    }
    
    // If accessing auth routes with valid token, redirect to dashboard
    if (isAuthRoute) {
      console.log('🔒 [MIDDLEWARE] Already logged in, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  console.log('✅ [MIDDLEWARE] Allowing request to proceed:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};