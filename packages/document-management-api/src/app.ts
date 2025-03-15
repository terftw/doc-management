import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

import authRoutes from './features/auth/auth.routes';
import documentRoutes from './features/documents/documents.routes';
import folderRoutes from './features/folders/folders.routes';
import userRoutes from './features/users/users.routes';
import { errorLogger, requestLogger } from './shared/middleware/logger.middleware';

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// API Routes
app.use('/api/documents', documentRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (_: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((_: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error logger middleware
app.use(errorLogger);

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { error: err.message } : {}),
  });
});

export default app;
