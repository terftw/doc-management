// src/features/auth/auth.routes.ts
import express from 'express';

import { AuthController } from './auth.controller';

const router = express.Router();
const authController = new AuthController();

// POST /api/auth/register
router.post('/register', (req, res) => authController.register(req, res));

// POST /api/auth/login
router.post('/login', (req, res) => authController.login(req, res));

// POST /api/auth/logout
router.post('/logout', (req, res) => authController.logout(req, res));

// GET /api/auth/me
router.get('/me', (req, res) => authController.getCurrentUser(req, res));

export default router;
