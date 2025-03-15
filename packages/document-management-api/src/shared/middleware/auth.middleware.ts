import prisma from '@/shared/db/prisma';
import { AuthError } from '@/shared/errors';
import { verifyToken } from '@/shared/plugins/firebase';
import logger from '@/shared/utils/logger';
import { NextFunction, Request, Response } from 'express';

/**
 * Authentication middleware
 *
 * This middleware is used to authenticate the user.
 * It verifies the token and attaches the user to the request.
 */
export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthError('Unauthorized - No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Firebase token verification
    const decodedToken = await verifyToken(token);

    if (!decodedToken.uid) {
      throw new AuthError('Unauthorized - Invalid token');
    }

    // Get user from database using Firebase UID
    let user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    // If user does not exist, create user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: decodedToken.email || '',
          firebaseUid: decodedToken.uid,
        },
      });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      name: decodedToken.name || '',
      email: user.email,
      firebaseUid: user.firebaseUid,
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    throw new AuthError('Unauthorized - Invalid token');
  }
};
