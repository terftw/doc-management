import logger from '@/shared/utils/logger';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK only once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// We only allow auth service to use Firebase Auth
// We do not allow other services from Firebase
export const auth = getAuth();

/**
 * Verify token from Firebase Auth
 *
 * This function verifies a token from Firebase Auth.
 */
export const verifyToken = async (token: string) => {
  try {
    return await auth.verifyIdToken(token);
  } catch (error) {
    logger.error('Error verifying Firebase token:', error);
    throw error;
  }
};
