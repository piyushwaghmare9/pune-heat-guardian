import { NextResponse } from 'next/server';
import { DEMO_USERS, DEMO_TOKENS } from '@/lib/demo/auth-data';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Simulate backend lookup
    const user = DEMO_USERS.find(u => u.email === email);

    // Hardcoded demo password logic: let's say 'password123' works for everyone in demo
    if (!user || password !== 'password123') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (user.status === 'SUSPENDED') {
      return NextResponse.json(
        { error: 'Your account is suspended. Please contact support.' },
        { status: 403 }
      );
    }

    // Find the associated demo token
    const tokenEntry = Object.entries(DEMO_TOKENS).find(([_, uid]) => uid === user.id);
    const token = tokenEntry ? tokenEntry[0] : `demo-token-${user.id}`;

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({
      user,
      message: 'Login successful'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
