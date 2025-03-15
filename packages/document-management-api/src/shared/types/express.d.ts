// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        email: string;
        firebaseUid: string;
      };
    }
  }
}

export {};
