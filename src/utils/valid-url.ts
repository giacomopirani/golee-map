export const isValidUrl = (link?: string): boolean => {
  if (!link) return false;

  return /^(https?:\/\/|www\.)/.test(link);
};
