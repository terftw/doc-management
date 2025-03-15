import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

/**
 * Mocked PrismaClient instance for testing
 *
 * This mock provides a deep mock of the PrismaClient instance
 * with all methods mocked to return appropriate values
 *
 * Used to control database interactions in tests
 */
export const prismaMock = mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>;
