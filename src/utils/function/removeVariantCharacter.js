export const extractQuantityPrefix = variant => {
  const match = variant.match(/^\d+[a-zA-Z]+/);
  return match ? match[0] : '';
};
