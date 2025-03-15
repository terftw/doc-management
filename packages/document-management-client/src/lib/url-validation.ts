export const getFolderIdFromPath = (path: string) => {
  if (!path || !path.startsWith('/folders/')) return undefined;

  const segments = path.split('/');
  if (segments.length < 3) return undefined;

  const id = parseInt(segments[2], 10);
  return !isNaN(id) ? id : undefined;
};
