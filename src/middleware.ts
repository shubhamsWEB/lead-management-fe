import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect routes by checking for authentication token
 */
export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  console.log("🚀 ~ middleware ~ token:", token);
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
  
  // Check if token is expired
  if (token && !isAuthRoute) {
    try {
      // Parse the token (JWT format: header.payload.signature)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      
      // If token is expired, redirect to logout
      if (expTime < currentTime) {
        console.log("Token expired, redirecting to logout");
        const response = NextResponse.redirect(new URL('/login', request.url));
        // Clear the expired token
        response.cookies.delete('token');
        return response;
      }
    } catch (error) {
      console.error("Error parsing token:", error);
      // If token is invalid, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
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