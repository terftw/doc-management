/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const fileTypes = [
    { extension: 'pdf', mimeType: 'application/pdf' },
    {
      extension: 'docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    {
      extension: 'pptx',
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    },
    {
      extension: 'xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    {
      extension: 'csv',
      mimeType: 'text/csv',
    },
  ];

  await prisma.fileType.createMany({
    data: fileTypes,
    skipDuplicates: true,
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
