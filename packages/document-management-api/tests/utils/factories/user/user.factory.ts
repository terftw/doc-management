import { User } from '@prisma/client';

type PartialUser = Partial<User>;

/**
 * Factory for creating User test data
 */
export class UserFactory {
  /**
   * Create a mock user with default values
   * @param overrides - Properties to override default values
   */
  static create(overrides: PartialUser = {}): User {
    const id = overrides.id ?? 1;

    return {
      id,
      name: overrides.name ?? `Test User ${id}`,
      firebaseUid: overrides.firebaseUid ?? `firebase_${id}_${Date.now()}`,
      email: overrides.email ?? `user${id}@example.com`,
      createdAt: overrides.createdAt ?? new Date('2023-01-01T00:00:00Z'),
      updatedAt: overrides.updatedAt ?? new Date('2023-01-01T00:00:00Z'),
      ...overrides,
    };
  }

  /**
   * Create multiple users
   * @param count - Number of users to create
   * @param baseOverrides - Base properties to apply to all users
   */
  static createMany(count: number, baseOverrides: PartialUser = {}): User[] {
    return Array.from({ length: count }, (_, index) => {
      const id = baseOverrides.id ? baseOverrides.id + index : index + 1;
      return UserFactory.create({
        ...baseOverrides,
        id,
        firebaseUid: `firebase_${id}_${Date.now()}`,
        email: `user${id}@example.com`,
      });
    });
  }
}
