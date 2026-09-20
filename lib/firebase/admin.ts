import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    // Only initialize if we have credentials and they aren't the template '...'
    if (
      process.env.FIREBASE_PROJECT_ID && 
      process.env.FIREBASE_CLIENT_EMAIL && 
      privateKey && 
      !privateKey.includes('...')
    ) {
      return initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
    } else {
      console.warn('Firebase Admin credentials missing or invalid. Initializing dummy app for build.');
      return initializeApp({ projectId: 'demo-project' });
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Firebase admin initialization error', err.stack);
    return initializeApp({ projectId: 'demo-project' });
  }
}

const app = getFirebaseAdminApp();
export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
