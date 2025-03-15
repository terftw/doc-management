// src/middleware/auth.middleware.ts
import { NextFunction, Request, Response } from 'express';
import * as jose from 'jose';

import { PrismaClient } from '@prisma/client';

import { HttpStatus } from '../../shared/types/httpStatus';

// Initialize Prisma client
const prisma = new PrismaClient();

// JWT Secret Key (move to environment variables in production)
const JWT_SECRET = new TextEncoder().encode('your-secret-key');

// Type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);

    if (!payload.sub) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized - Invalid token' });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
    });

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized - User not found' });
    }

    // Attach user to request
    req.user = {
      id: user.id,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized - Invalid token' });
  }
};
