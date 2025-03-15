import { PrismaClient } from '@prisma/client';

import logger from '../utils/logger';

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }, 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

prisma.$use(async (params: any, next: any) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();

  logger.debug(`Prisma Query: ${params.model}.${params.action} (${after - before}ms)`);
  return result;
});

export default prisma;
