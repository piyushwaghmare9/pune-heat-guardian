import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Create user profile in Firestore
    const userRole = role || 'USER'; // Default role
    
    await adminDb.collection('users').doc(userRecord.uid).set({
      email,
      name,
      role: userRole,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      status: 'success', 
      uid: userRecord.uid 
    }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Signup error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
