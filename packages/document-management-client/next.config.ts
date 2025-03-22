import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    FIREBASE_CONFIG: JSON.stringify({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    }),
  },
};

export default nextConfig;
