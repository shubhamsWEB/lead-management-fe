import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect routes by checking for authentication token
 */
export function middleware(request: NextRequest) {
  // Get token from localStorage
  const token = request.cookies.get('token')?.value;
  
  // Get the pathname
  const { pathname } = request.nextUrl;
  
  // Auth routes that don't require token
  const authRoutes = ['/login', '/register'];
  
  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // If no token and accessing protected route, redirect to login
  if (!token && !isAuthRoute) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
  
  // If has token and accessing auth routes, redirect to dashboard
  if (token && isAuthRoute) {
    const url = new URL('/leads', request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

/**
 * Specify which routes this middleware should run on
 */
export const config = {
  matcher: [
    // Apply to all routes except API routes, static files, and _next
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};