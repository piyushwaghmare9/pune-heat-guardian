import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In a real production app, this middleware would verify a JWT signature
// or make a lightweight call to an edge-compatible session store.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get('auth_token')?.value

  // 1. Unauthenticated users cannot access /profile or /admin
  if (pathname.startsWith('/profile') || pathname.startsWith('/admin')) {
    if (!authToken) {
      const loginUrl = new URL('/login', request.url)
      // Pass the original URL to redirect back after login
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 2. Only ADMIN roles can access /admin
  if (pathname.startsWith('/admin')) {
    // Demo implementation: check if the mock token string includes 'admin'
    // In production, you would decode the JWT payload here to check the role.
    if (!authToken?.includes('admin')) {
      // Return 403 Forbidden via rewriting to a custom error or just redirecting to home
      // We will redirect to dashboard with an error param
      const forbiddenUrl = new URL('/dashboard', request.url)
      forbiddenUrl.searchParams.set('error', 'forbidden')
      return NextResponse.redirect(forbiddenUrl)
    }
  }

  return NextResponse.next()
}

// Configure the middleware to only run on specific paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
  ],
}
