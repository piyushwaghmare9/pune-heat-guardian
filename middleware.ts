import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Look for the Firebase session cookie
  const sessionToken = request.cookies.get('session')?.value

  // 1. Unauthenticated users cannot access /profile or /admin
  if (pathname.startsWith('/profile') || pathname.startsWith('/admin')) {
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url)
      // Pass the original URL to redirect back after login
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 2. Only ADMIN roles can access /admin
  if (pathname.startsWith('/admin')) {
    // Note: Since Firebase Admin SDK cannot run in Edge middleware,
    // robust role verification should happen in the API routes or Server Components.
    // For now, if they have a session, we let them try to render the page, 
    // where client-side or server-side checks will enforce the role.
    if (!sessionToken) {
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
