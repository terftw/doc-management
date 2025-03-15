/**
 * Main Express application setup and configuration
 *
 * This file initializes the Express server, configures middleware,
 * registers API routes, and sets up error handling.
 */
import authRoutes from '@/features/auth/auth.routes';
import documentRoutes from '@/features/document/document.routes';
import folderRoutes from '@/features/folder/folder.routes';
import fsentryRoutes from '@/features/fsentry/fsentry.routes';
import { errorHandler } from '@/shared/middleware/error.middleware';
import { errorLogger, requestLogger } from '@/shared/middleware/logger.middleware';
import { getOrigins } from '@/shared/utils/get-origins';
import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';

// Initialize Express application
const app = express();

// Security middleware
app.use(helmet()); // Helps secure Express apps with various HTTP headers
app.use(
  cors({
    origin: getOrigins, // Dynamic CORS configuration based on environment
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Request parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Logging middleware
app.use(requestLogger);

// API routes registration
app.use('/api/documents', documentRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/fsentries', fsentryRoutes);

/**
 * Health check endpoint
 * Used for monitoring and infrastructure checks (load balancers, etc.)
 */
app.get('/health', (_: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler for undefined routes
app.use((_: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorLogger);
app.use(errorHandler);

export default app;
