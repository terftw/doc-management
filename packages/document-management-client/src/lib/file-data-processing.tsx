export const getFileExtension = (name: string): string => {
  return name.slice(((name.lastIndexOf('.') - 1) >>> 0) + 2).toUpperCase();
};

export const getPrettyFileSize = (size: number): string => {
  return (size / 1024).toFixed(2) + ' KB';
};

export const getFileSizeInKB = (size: number): number => {
  return size / 1024;
};

export const getPrettyFileSizeForTable = (size: number): string => {
  return size.toFixed(2) + ' KB';
};
