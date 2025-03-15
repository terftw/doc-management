import express from 'express';

import { AuthController } from './auth.controller';

const router = express.Router();
const authController = new AuthController();

/**
 * POST /api/auth/firebase
 * This route is used to verify the Firebase token and process the user
 * @param {Request} req - Express request object containing idToken in the body
 * @param {Response} res - Express response object
 */
router.post('/firebase', async (req, res) => {
  await authController.processFirebaseAuth(req, res);
});

export default router;
