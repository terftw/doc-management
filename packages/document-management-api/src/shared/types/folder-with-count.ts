import { Folder } from '@prisma/client';

export type FolderWithChildCount = Folder & {
  _count: {
    children: number;
  };
};
