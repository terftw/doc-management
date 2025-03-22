import { Request, Response } from 'express';

import { UserFactory } from 'tests/utils/factories/user/user.factory';

/**
 * AuthController Test Suite
 *
 * Tests the authentication controller functionality including:
 * - Firebase authentication processing
 * - User creation and retrieval flow
 * - Error handling for various authentication scenarios
 */
import { AuthController } from '@/features/auth/auth.controller';
import { UserService } from '@/features/user/user.service';
import { auth } from '@/shared/plugins/firebase';
import { HttpStatus } from '@/shared/types/http-status';
import logger from '@/shared/utils/logger';

describe('Auth API Routes and Controller', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let userServiceInstance: UserService;

  // Set up fresh mocks before each test to avoid test pollution
  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    userServiceInstance = new UserService();
    authController = new AuthController(userServiceInstance);
  });

  /**
   * Tests for the processFirebaseAuth method
   * This controller method handles authentication via Firebase tokens
   * and manages user creation/retrieval in our database
   */
  describe('processFirebaseAuth', () => {
    // Test case 1: Missing authentication token
    it('should return 400 if no idToken is provided', async () => {
      // Test with empty request body (no token)
      await authController.processFirebaseAuth(mockRequest as Request, mockResponse as Response);

      // Verify proper error response is returned
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Firebase ID token is required',
      });
    });

    // Test case 2: Firebase authentication failure
    it('should return 401 if Firebase authentication fails', async () => {
      // Setup request with invalid token
      mockRequest.body = { idToken: 'invalid-token' };

      // Mock Firebase verifyIdToken to simulate authentication failure
      (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(new Error('Invalid token'));

      await authController.processFirebaseAuth(mockRequest as Request, mockResponse as Response);

      // Verify Firebase verification was attempted with the provided token
      expect(auth.verifyIdToken).toHaveBeenCalledWith('invalid-token');
      // Verify error was logged
      expect(logger.error).toHaveBeenCalled();
      // Verify proper unauthorized response is returned
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Authentication failed',
      });
    });

    // Test case 3: Successful login for existing user
    it('should return 200 with user data for existing user', async () => {
      // Setup test data for an existing user
      const mockIdToken = 'valid-token';

      const mockUser = UserFactory.create();
      const { firebaseUid, email, name, id, createdAt } = mockUser;

      mockRequest.body = { idToken: mockIdToken };

      // Mock successful Firebase token verification
      (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
        uid: firebaseUid,
        email: email,
      });

      // Mock Firebase user profile retrieval
      (auth.getUser as jest.Mock).mockResolvedValueOnce({
        displayName: name,
      });

      // Mock successful user retrieval from database
      (userServiceInstance.getUserByFirebaseUid as jest.Mock).mockResolvedValueOnce(mockUser);

      await authController.processFirebaseAuth(mockRequest as Request, mockResponse as Response);

      // Verify Firebase interactions
      expect(auth.verifyIdToken).toHaveBeenCalledWith(mockIdToken);
      expect(auth.getUser).toHaveBeenCalledWith(firebaseUid);

      // Verify user service interactions
      expect(userServiceInstance.getUserByFirebaseUid).toHaveBeenCalledWith(firebaseUid);
      // Ensure we don't create a new user for an existing user
      expect(userServiceInstance.createUser).not.toHaveBeenCalled();

      // Verify successful response with user data
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: {
          id,
          email,
          name,
          createdAt,
        },
      });
    });

    // Test case 4: Successful signup for new user
    it('should create and return new user with 201 status for new user', async () => {
      // Setup test data for a new user
      const mockIdToken = 'new-user-token';

      const mockUser = UserFactory.create({ id: 2 });
      const { firebaseUid, email, name, id, createdAt } = mockUser;

      mockRequest.body = { idToken: mockIdToken };

      // Mock successful Firebase token verification
      (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
        uid: firebaseUid,
        email,
      });

      // Mock Firebase user profile retrieval
      (auth.getUser as jest.Mock).mockResolvedValueOnce({
        displayName: name,
      });

      // Mock user not found in database (null response)
      (userServiceInstance.getUserByFirebaseUid as jest.Mock).mockResolvedValueOnce(null);

      // Mock successful user creation
      (userServiceInstance.createUser as jest.Mock).mockResolvedValueOnce(mockUser);

      await authController.processFirebaseAuth(mockRequest as Request, mockResponse as Response);

      // Verify Firebase interactions
      expect(auth.verifyIdToken).toHaveBeenCalledWith(mockIdToken);
      expect(auth.getUser).toHaveBeenCalledWith(firebaseUid);

      // Verify user lookup followed by user creation
      expect(userServiceInstance.getUserByFirebaseUid).toHaveBeenCalledWith(firebaseUid);
      expect(userServiceInstance.createUser).toHaveBeenCalledWith(name, email, firebaseUid);

      // Verify created status with new user data
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: {
          id,
          email,
          name,
          createdAt,
        },
      });
    });

    // Test case 5: Edge case - missing email in decoded token
    it('should handle missing email in decoded token', async () => {
      // Setup test data for a user with missing email
      const mockIdToken = 'token-without-email';
      const mockUid = 'firebase-uid-789';
      const mockName = 'No Email User';

      mockRequest.body = { idToken: mockIdToken };

      // Mock Firebase token verification without email field
      (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
        uid: mockUid,
        // no email field intentionally
      });

      // Mock Firebase user profile retrieval
      (auth.getUser as jest.Mock).mockResolvedValueOnce({
        displayName: mockName,
      });

      // Setup mock for existing user with empty email
      const mockUser = UserFactory.create({ id: 3, email: '', name: mockName });
      const { email, name, id, createdAt } = mockUser;

      // Mock successful user retrieval
      (userServiceInstance.getUserByFirebaseUid as jest.Mock).mockResolvedValueOnce(mockUser);

      await authController.processFirebaseAuth(mockRequest as Request, mockResponse as Response);

      // Verify Firebase interactions
      expect(auth.verifyIdToken).toHaveBeenCalledWith(mockIdToken);
      expect(auth.getUser).toHaveBeenCalledWith(mockUid);

      // Verify user service interaction
      expect(userServiceInstance.getUserByFirebaseUid).toHaveBeenCalledWith(mockUid);

      // Verify successful response despite missing email
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: {
          id,
          email,
          name,
          createdAt,
        },
      });
    });

    // Test case 6: Edge case - missing display name in user record
    it('should handle missing display name in user record', async () => {
      // Setup test data for a user with missing name
      const mockIdToken = 'token-without-name';

      const mockUser = UserFactory.create({ id: 4, email: 'noname@example.com' });
      const { firebaseUid, email, id, createdAt } = mockUser;

      mockRequest.body = { idToken: mockIdToken };

      // Mock Firebase token verification
      (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
        uid: firebaseUid,
        email,
      });

      // Mock Firebase user profile retrieval without display name
      (auth.getUser as jest.Mock).mockResolvedValueOnce({
        // no displayName field intentionally
      });

      // Mock successful user retrieval
      (userServiceInstance.getUserByFirebaseUid as jest.Mock).mockResolvedValueOnce(mockUser);

      await authController.processFirebaseAuth(mockRequest as Request, mockResponse as Response);

      // Verify Firebase interactions
      expect(auth.verifyIdToken).toHaveBeenCalledWith(mockIdToken);
      expect(auth.getUser).toHaveBeenCalledWith(firebaseUid);

      // Verify user service interaction
      expect(userServiceInstance.getUserByFirebaseUid).toHaveBeenCalledWith(firebaseUid);

      // Verify successful response despite missing name
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: {
          id,
          email,
          name: '', // empty string from fallback
          createdAt,
        },
      });
    });
  });
});
