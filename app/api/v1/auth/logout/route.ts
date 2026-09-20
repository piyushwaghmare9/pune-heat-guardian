import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (sessionCookie) {
      // Clear the session in Firebase Admin
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
      await adminAuth.revokeRefreshTokens(decodedClaims.sub);
    }

    cookieStore.delete('session');

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    // Still delete the cookie even if Firebase revocation fails
    const cookieStore = await cookies();
    cookieStore.delete('session');
    
    return NextResponse.json({ status: 'success' }, { status: 200 });
  }
}
