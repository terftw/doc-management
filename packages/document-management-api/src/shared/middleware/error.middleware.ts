import {
  AuthError,
  FileTypeInvalidError,
  FolderDepthLimitError,
  FolderMaxChildrenError,
  NotFoundError,
} from '@/shared/errors';
import { HttpStatus } from '@/shared/types/http-status';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

/**
 * Error handler middleware
 *
 * This middleware is used to handle errors.
 * It handles the AuthError and returns the appropriate error response.
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (
    err instanceof AuthError ||
    err instanceof NotFoundError ||
    err instanceof FileTypeInvalidError ||
    err instanceof FolderDepthLimitError ||
    err instanceof FolderMaxChildrenError
  ) {
    res.status(err.statusCode).json({
      message: err.message,
    });
    return;
  }

  // Handle unexpected errors
  const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  const message = 'Internal Server Error';

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' ? { error: err.message, stack: err.stack } : {}),
  });
};
