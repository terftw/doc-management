import { UserService } from '@/features/user/user.service';
import { auth } from '@/shared/plugins/firebase';
import { HttpStatus } from '@/shared/types/http-status';
import logger from '@/shared/utils/logger';
import { Request, Response } from 'express';

/**
 * Authentication controller responsible for Firebase token validation and user management
 *
 * This controller handles the authentication flow using Firebase tokens:
 * - Verifies Firebase ID tokens for validity
 * - Creates new users in the system database when they don't exist
 * - Retrieves existing user information when they're already registered
 */
export class AuthController {
  /**
   * Creates a new instance of the AuthController
   * @param {UserService} _userService - Service to handle user-related operations
   */
  constructor(private _userService = new UserService()) {}

  /**
   * Validates a Firebase ID token and creates or retrieves a user
   *
   * This method verifies the provided Firebase token, creates a new user
   * if they don't exist in our database, or returns the existing user record
   *
   * @param {Request} req - Express request object containing idToken in the body
   * @param {Response} res - Express response object
   *
   * @returns {Promise<Response>} JSON response with user data or error message
   *
   * @throws Will return 400 if idToken is missing
   * @throws Will return 401 if authentication fails
   */
  async processFirebaseAuth(req: Request, res: Response): Promise<Response> {
    try {
      let status = HttpStatus.OK;

      const { idToken } = req.body;
      if (!idToken) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Firebase ID token is required' });
      }

      // Verify the Firebase token
      const decodedToken = await auth.verifyIdToken(idToken);

      const uid = decodedToken.uid;
      const email = decodedToken.email || '';

      const userRecord = await auth.getUser(uid);
      const nameFromFirebase = userRecord.displayName || '';

      let user = await this._userService.getUserByFirebaseUid(uid);

      if (!user) {
        user = await this._userService.createUser(nameFromFirebase, email, uid);
        status = HttpStatus.CREATED;
      }

      return res.status(status).json({
        user: {
          id: user.id,
          email: user.email,
          name: nameFromFirebase,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      logger.error('Firebase authentication error:', error);
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Authentication failed' });
    }
  }
}
