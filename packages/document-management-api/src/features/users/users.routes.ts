// src/features/users/user.routes.ts
import express from 'express';

import { authMiddleware } from '../auth/auth.middleware';
import { UserController } from './users.controller';

const router = express.Router();
const userController = new UserController();

// Apply auth middleware to all user routes
router.use(authMiddleware);

// GET /api/users/profile
router.get('/profile', (req, res) => userController.getUserProfile(req, res));

// PUT /api/users/profile
router.put('/profile', (req, res) => userController.updateUserProfile(req, res));

// PUT /api/users/change-password
router.put('/change-password', (req, res) => userController.changePassword(req, res));

export default router;
