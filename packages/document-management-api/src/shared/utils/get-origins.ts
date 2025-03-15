/**
 * Get origins
 *
 * This function gets the origins from the environment variable.
 *
 * @param {string | undefined} origin - The origin
 */
export const getOrigins = (
  origin: string | undefined,
  callback: (_: Error | null, __?: boolean) => void,
) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];
  if (!origin) return callback(null, true);

  if (allowedOrigins.indexOf(origin) !== -1) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};
