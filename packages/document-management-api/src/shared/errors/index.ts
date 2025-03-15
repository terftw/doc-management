import { HttpStatus, HttpStatusCode } from '@/shared/types/http-status';

/**
 * AuthError
 *
 * This error is thrown when the user is not authenticated.
 */
export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: HttpStatusCode = HttpStatus.UNAUTHORIZED) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * NotFoundError
 *
 * This error is thrown when the resource is not found.
 */
export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: HttpStatusCode = HttpStatus.NOT_FOUND) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = statusCode;
  }
}

/**
 * FileTypeInvalidError
 *
 * This error is thrown when the file type is invalid.
 */
export class FileTypeInvalidError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: HttpStatusCode = HttpStatus.BAD_REQUEST) {
    super(message);
    this.name = 'FileTypeInvalidError';
    this.statusCode = statusCode;
  }
}

/**
 * FolderDepthLimitError
 *
 * This error is thrown when the folder depth limit is exceeded.
 */
export class FolderDepthLimitError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: HttpStatusCode = HttpStatus.BAD_REQUEST) {
    super(message);
    this.name = 'FolderDepthLimitError';
    this.statusCode = statusCode;
  }
}

/**
 * FolderMaxChildrenError
 *
 * This error is thrown when the folder max children limit is exceeded.
 */
export class FolderMaxChildrenError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: HttpStatusCode = HttpStatus.BAD_REQUEST) {
    super(message);
    this.name = 'FolderMaxChildrenError';
    this.statusCode = statusCode;
  }
}
