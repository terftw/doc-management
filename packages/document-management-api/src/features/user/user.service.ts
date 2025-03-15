import extendedPrisma from '@/shared/db/prisma';
import { User } from '@prisma/client';

/**
 * User service responsible for user-related operations
 *
 * This service handles the user-related operations:
 * - Get a user by Firebase UID
 * - Create a user
 */
export class UserService {
  private prisma = extendedPrisma;

  /**
   * Get a user by Firebase UID
   *
   * @param firebaseUid - The Firebase UID of the user
   * @returns {Promise<User | null>} The user or null if the user is not found
   */
  async getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { firebaseUid },
    });
  }

  /**
   * Create a user
   *
   * @param nameFromFirebase - The name of the user from Firebase
   * @param email - The email of the user
   * @param firebaseUid - The Firebase UID of the user
   * @returns {Promise<User>} The created user
   */
  async createUser(nameFromFirebase: string, email: string, firebaseUid: string): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email,
        firebaseUid,
        name: nameFromFirebase,
      },
      select: {
        id: true,
        email: true,
        firebaseUid: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
