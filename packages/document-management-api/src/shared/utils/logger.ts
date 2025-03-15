import winston from 'winston';

/**
 * Logger
 *
 * This is the default logger for the application.
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'service'] }),
    winston.format.printf(info => {
      const metadata =
        info.metadata && Object.keys(info.metadata).length > 0 ? JSON.stringify(info.metadata) : '';
      return `${info.timestamp} ['${info.service}'] ${info.level}: ${info.message} ${metadata}`;
    }),
  ),
  defaultMeta: { service: 'document-management-api' },
  transports: [new winston.transports.Console()],
});

export default logger;
