export type FolderFirstPaginationResult = {
  folderSkip: number;
  folderLimit: number;
  documentSkip: number;
  documentLimit: number;
};

/**
 * Folder first pagination
 *
 * This function calculates the pagination for a folder first pagination.
 * It is used to get the folders and documents for a given skip and page size.
 *
 * @param {number} skip - The skip value
 * @param {number} folderCount - The total number of folders
 * @param {number} documentCount - The total number of documents
 * @param {number} pageSize - The page size
 * @returns {FolderFirstPaginationResult} The pagination object
 */
export const folderFirstPagination = (
  skip: number,
  folderCount: number,
  documentCount: number,
  pageSize: number,
): FolderFirstPaginationResult => {
  let folderLimit = 0;
  let documentLimit = 0;
  let folderSkip = 0;
  let documentSkip = 0;

  if (skip < folderCount) {
    // Get folders first
    folderSkip = skip;
    folderLimit = Math.min(pageSize, folderCount - folderSkip);
    documentLimit = Math.min(pageSize - folderLimit, documentCount);
  } else {
    // No more folders left, get documents
    folderLimit = 0;
    documentSkip = skip - folderCount;
    documentLimit = Math.min(pageSize, documentCount - documentSkip);
  }

  return { folderSkip, folderLimit, documentSkip, documentLimit };
};
