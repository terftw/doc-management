import * as argon2 from 'argon2';
import { Request, Response } from 'express';

import prisma from '../../shared/db/prisma';
import { HttpStatus } from '../../shared/types/httpStatus';

export class UserController {
  // Get user profile
  async getUserProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          _count: {
            select: {
              documents: true,
              folders: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
      }

      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      console.error('Error getting user profile:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to get user profile' });
    }
  }

  // Update user profile
  async updateUserProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const { name, email } = req.body;

      // Validate input
      if (!name && !email) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No data provided for update' });
      }

      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser && existingUser.id !== userId) {
          return res.status(HttpStatus.CONFLICT).json({ message: 'Email is already in use' });
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(email && { email }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to update user profile' });
    }
  }

  // Change password
  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const { currentPassword, newPassword } = req.body;

      // Validate input
      if (!currentPassword || !newPassword) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Current password and new password are required' });
      }

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
      }

      // Verify current password
      const isValidPassword = await argon2.verify(user.password, currentPassword);

      if (!isValidPassword) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await argon2.hash(newPassword);

      // Update user password
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });

      return res.status(HttpStatus.OK).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to change password' });
    }
  }
}
