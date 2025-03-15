import { clearQueryClient } from '@/lib/react-query';
import { AuthResponse } from '@/models/auth';
import { getAuth } from 'firebase/auth';
import {
  AuthError,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import { apiPost } from './api-client';

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: name,
    });

    const token = await userCredential.user.getIdToken();

    await apiPost('auth/firebase', {
      json: {
        idToken: token,
      },
    });

    return {
      success: true,
      message: 'Registration successful',
    };
  } catch (error) {
    const authError = error as AuthError;
    const message = 'Registration failed. Please try again.';

    return {
      success: false,
      message,
      errorCode: authError.code,
    };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);

    return {
      success: true,
      message: 'Login successful',
    };
  } catch (error) {
    const authError = error as AuthError;
    let message = 'Login failed. Please try again.';

    // Handle specific Firebase auth error codes
    switch (authError.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        message = 'Invalid email or password. Please try again.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many unsuccessful login attempts. Please try again later.';
        break;
    }

    return {
      success: false,
      message,
      errorCode: authError.code,
    };
  }
};

export const logoutUser = async (): Promise<AuthResponse> => {
  try {
    clearQueryClient();

    const auth = getAuth();
    await auth.signOut();

    return {
      success: true,
      message: 'Logout successful',
    };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getFirebaseToken = async (): Promise<string | null> => {
  try {
    const auth = getAuth();

    if (auth.currentUser) {
      return await auth.currentUser.getIdToken(true);
    }

    return new Promise(resolve => {
      // Set a timeout to avoid waiting indefinitely
      const timeoutId = setTimeout(() => resolve(null), 5000);

      const unsubscribe = onAuthStateChanged(auth, async user => {
        clearTimeout(timeoutId);
        unsubscribe();

        if (user) {
          try {
            const token = await user.getIdToken(true);
            resolve(token);
          } catch (error) {
            console.error('Error getting token after auth state change:', error);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    return null;
  }
};

export const setupAuthListener = () => {
  const auth = getAuth();
  return onAuthStateChanged(auth, () => {});
};
