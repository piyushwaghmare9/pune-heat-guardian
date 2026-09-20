import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DEMO_USERS, DEMO_TOKENS } from '@/lib/demo/auth-data';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Look up user based on token
  const userId = DEMO_TOKENS[token];
  if (!userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const user = DEMO_USERS.find(u => u.id === userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 });
  }

  if (user.status === 'SUSPENDED') {
    return NextResponse.json({ error: 'Account suspended' }, { status: 403 });
  }

  return NextResponse.json({ user });
}
