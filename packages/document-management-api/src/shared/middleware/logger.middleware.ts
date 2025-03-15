import { NextFunction, Request, Response } from 'express';

import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request
  logger.info(`${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: req.user?.id || 'anonymous',
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';

    logger[logLevel](`${req.method} ${req.url} ${res.statusCode} ${duration}ms`, {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userId: req.user?.id || 'anonymous',
    });
  });

  next();
};

export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error processing ${req.method} ${req.url}`, {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    userId: req.user?.id || 'anonymous',
  });

  next(err);
};
