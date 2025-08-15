import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get session token from cookies
  const sessionToken = request.cookies.get('td-session')?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/api/auth/login',
    '/api/auth/session',
    '/_next',
    '/favicon.ico',
    '/api/test',
    '/pricing',
    '/invite'
  ]

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route) || pathname === '/'
  )

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // For protected routes (like /dashboard/*), check authentication
  if (pathname.startsWith('/dashboard')) {
    if (!sessionToken) {
      // Redirect to login if no session token
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // TODO: Add session validation here if needed
    // For now, just check if token exists
  }

  // Allow the request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js internals)
     * - favicon.ico (favicon file)
     * - static files
     */
    '/((?!api/|_next/|favicon.ico).*)',
  ],
}