export const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  // Check if date is valid
  if (isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};
