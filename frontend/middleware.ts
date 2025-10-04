import { NextRequest, NextResponse } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/security',
  '/assets',
  '/identity',
  '/monitoring',
  '/compliance',
  '/admin',
  '/platform-settings',
  '/features'
]

// Auth routes that should redirect if already logged in
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password'
]

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log('🔍 [MIDDLEWARE] Processing request:', pathname)
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    console.log('🔍 [MIDDLEWARE] Skipping:', pathname)
    return NextResponse.next()
  }

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  const isPublicRoute = publicRoutes.includes(pathname)
  
  console.log('🔍 [MIDDLEWARE] Route analysis:', {
    pathname,
    isProtectedRoute,
    isAuthRoute,
    isPublicRoute
  })

  // Check for authentication token
  const token = request.cookies.get('blick_token')?.value
  
  console.log('🔍 [MIDDLEWARE] Token check:', {
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
  })

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    console.log('❌ [MIDDLEWARE] Protected route without token, redirecting to login')
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('returnTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing auth routes with valid token, redirect to dashboard
  if (isAuthRoute && token) {
    // Basic token validation (check if it's not expired)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const isExpired = payload.exp * 1000 < Date.now()
      
      if (!isExpired) {
        console.log('✅ [MIDDLEWARE] Already authenticated, redirecting to dashboard')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        console.log('⚠️ [MIDDLEWARE] Token expired on auth route, clearing cookie')
        const response = NextResponse.next()
        response.cookies.delete('blick_token')
        return response
      }
    } catch (error) {
      console.log('⚠️ [MIDDLEWARE] Invalid token on auth route, clearing cookie')
      const response = NextResponse.next()
      response.cookies.delete('blick_token')
      return response
    }
  }

  // For protected routes with token, validate token structure
  if (isProtectedRoute && token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const isExpired = payload.exp * 1000 < Date.now()
      
      if (isExpired) {
        console.log('❌ [MIDDLEWARE] Token expired on protected route, redirecting to login')
        const response = NextResponse.redirect(new URL('/auth/login', request.url))
        response.cookies.delete('blick_token')
        return response
      }
      
      console.log('✅ [MIDDLEWARE] Valid token for protected route')
    } catch (error) {
      console.log('❌ [MIDDLEWARE] Invalid token format, redirecting to login')
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('blick_token')
      return response
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  console.log('✅ [MIDDLEWARE] Request processed successfully')
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}