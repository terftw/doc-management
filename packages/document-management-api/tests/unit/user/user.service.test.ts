import { UserService } from '@/features/user/user.service';
import { prismaMock } from 'tests/utils/mocks/prisma-mock';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService();
  });

  describe('getUserByFirebaseUid', () => {
    it('should return a user when found', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        firebaseUid: 'firebase123',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserByFirebaseUid('firebase123');

      // Assert
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { firebaseUid: 'firebase123' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      // Arrange
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await userService.getUserByFirebaseUid('nonexistent');

      // Assert
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { firebaseUid: 'nonexistent' },
      });
      expect(result).toBeNull();
    });

    it('should throw an error when database query fails', async () => {
      // Arrange
      const dbError = new Error('Database connection error');
      prismaMock.user.findUnique.mockRejectedValue(dbError);

      // Act & Assert
      await expect(userService.getUserByFirebaseUid('firebase123')).rejects.toThrow(
        'Database connection error',
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { firebaseUid: 'firebase123' },
      });
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      // Arrange
      const newUser = {
        id: 1,
        name: 'New User',
        firebaseUid: 'firebase456',
        email: 'new@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.create.mockResolvedValue(newUser);

      // Act
      const result = await userService.createUser('New User', 'new@example.com', 'firebase456');

      // Assert
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: 'new@example.com',
          firebaseUid: 'firebase456',
          name: 'New User',
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
      expect(result).toEqual(newUser);
    });

    it('should throw an error when user creation fails', async () => {
      // Arrange
      const createError = new Error('Email already exists');
      prismaMock.user.create.mockRejectedValue(createError);

      // Act & Assert
      await expect(
        userService.createUser('Test User', 'existing@example.com', 'firebase789'),
      ).rejects.toThrow('Email already exists');

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: 'existing@example.com',
          firebaseUid: 'firebase789',
          name: 'Test User',
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
    });
  });
});
