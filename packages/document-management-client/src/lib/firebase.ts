import { initializeApp } from 'firebase/app';
import { useEffect } from 'react';

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
  throw new Error('Firebase configuration is incomplete. Required fields are missing.');
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const initializeFirebase = () => {
  if (typeof window !== 'undefined') {
    try {
      initializeApp(firebaseConfig);
      console.log('Firebase initialized');
    } catch (error: unknown) {
      if (error instanceof Error && !/already exists/.test(error.message)) {
        console.error('Firebase initialization error', error);
      }
    }
  }
};

export function FirebaseInitializer() {
  useEffect(() => {
    initializeFirebase();
  }, []);

  return null;
}
