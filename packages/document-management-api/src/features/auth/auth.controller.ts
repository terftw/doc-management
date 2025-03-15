import * as argon2 from 'argon2';
import { Request, Response } from 'express';

import prisma from '../../shared/db/prisma';
import { AuthenticatedRequest } from '../../shared/types';

// JWT Secret Key (move to environment variables in production)
const JWT_SECRET = new TextEncoder().encode('your-secret-key');

export class AuthController {
  // Register new user
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await argon2.hash(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      // Generate JWT token
      const token = await this.generateToken(user.id);

      return res.status(201).json({
        user,
        token,
      });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Failed to register user' });
    }
  }

  // Login user
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await argon2.verify(user.password, password);

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = await this.generateToken(user.id);

      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      console.error('Error logging in user:', error);
      return res.status(500).json({ message: 'Failed to login' });
    }
  }

  // Logout user
  async logout(req: Request, res: Response) {
    // In a real implementation, you might invalidate the token
    // For a simple implementation, client-side token removal is sufficient
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  // Get current user
  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Error getting current user:', error);
      return res.status(500).json({ message: 'Failed to get user' });
    }
  }

  // Helper method to generate JWT token
  private async generateToken(userId: string) {
    const jose = await import('jose');
    const token = await new jose.SignJWT({ sub: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(JWT_SECRET);
    return token;
  }
}
